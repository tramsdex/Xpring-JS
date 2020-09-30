import { Wallet, XrplNetwork } from 'xpring-common-js'
import XrpUtils from './xrp-utils'
import { BigInteger } from 'big-integer'
import XrpClientDecorator from './xrp-client-decorator'
import RawTransactionStatus from './raw-transaction-status'
import TransactionStatus from './transaction-status'
import XrpTransaction from './model/xrp-transaction'
import XrpError, { XrpErrorType } from './xrp-error'

import SendXrpDetails from './model/send-xrp-details'
import TransactionResult from './model/transaction-result'

async function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

/**
 * An XrpClient which blocks on `send` calls until the transaction has reached a deterministic state.
 */
export default class ReliableSubmissionXrpClient implements XrpClientDecorator {
  public constructor(
    private readonly decoratedClient: XrpClientDecorator,
    readonly network: XrplNetwork,
  ) {}

  public async getBalance(address: string): Promise<BigInteger> {
    return this.decoratedClient.getBalance(address)
  }

  public async getPaymentStatus(
    transactionHash: string,
  ): Promise<TransactionStatus> {
    return this.decoratedClient.getPaymentStatus(transactionHash)
  }

  public async send(
    amount: string | number | BigInteger,
    destination: string,
    sender: Wallet,
  ): Promise<string> {
    return this.sendWithDetails({
      amount,
      destination,
      sender,
    })
  }

  public async sendWithDetails(
    sendXrpDetails: SendXrpDetails,
  ): Promise<string> {
    const { sender } = sendXrpDetails

    const transactionHash = await this.decoratedClient.sendWithDetails(
      sendXrpDetails,
    )
    await this.awaitFinalTransactionStatus(transactionHash, sender)

    return transactionHash
  }

  public async getLatestValidatedLedgerSequence(
    address: string,
  ): Promise<number> {
    return this.decoratedClient.getLatestValidatedLedgerSequence(address)
  }

  public async getRawTransactionStatus(
    transactionHash: string,
  ): Promise<RawTransactionStatus> {
    return this.decoratedClient.getRawTransactionStatus(transactionHash)
  }

  public async accountExists(address: string): Promise<boolean> {
    return this.decoratedClient.accountExists(address)
  }

  public async paymentHistory(address: string): Promise<Array<XrpTransaction>> {
    return this.decoratedClient.paymentHistory(address)
  }

  public async getPayment(
    transactionHash: string,
  ): Promise<XrpTransaction | undefined> {
    return this.decoratedClient.getPayment(transactionHash)
  }

  public async enableDepositAuth(wallet: Wallet): Promise<TransactionResult> {
    const result = await this.decoratedClient.enableDepositAuth(wallet)
    return await this.awaitFinalTransactionResult(result.hash, wallet)
  }

  public async authorizeSendingAccount(
    xAddressToAuthorize: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    const result = await this.decoratedClient.authorizeSendingAccount(
      xAddressToAuthorize,
      wallet,
    )
    return await this.awaitFinalTransactionResult(result.hash, wallet)
  }

  /**
   * Waits for a transaction to complete and returns a TransactionResult.
   *
   * @param transactionHash The transaction to wait for.
   * @param wallet The wallet sending the transaction.
   *
   * @returns A Promise resolving to a TransactionResult containing the results of the transaction associated with
   * the given transaction hash.
   */
  private async awaitFinalTransactionResult(
    transactionHash: string,
    wallet: Wallet,
  ): Promise<TransactionResult> {
    const rawTransactionStatus = await this.awaitFinalTransactionStatus(
      transactionHash,
      wallet,
    )
    const finalStatus = this.determineFinalResult(rawTransactionStatus)
    return new TransactionResult(
      transactionHash,
      finalStatus,
      rawTransactionStatus.isValidated,
    )
  }

  private isMalformedTransactionStatus(transactionStatusCode: string): boolean {
    return transactionStatusCode.startsWith('tem')
  }

  private determineFinalResult(
    rawTransactionStatus: RawTransactionStatus,
  ): TransactionStatus {
    const transactionStatusCode = rawTransactionStatus.transactionStatusCode

    if (!transactionStatusCode) {
      // Is this legit? What does this even mean? Is this just for testing purposes?
      throw new Error('no')
    }

    // Return pending if the transaction is not validated.
    if (!rawTransactionStatus.isValidated) {
      return this.isMalformedTransactionStatus(transactionStatusCode)
        ? TransactionStatus.MalformedTransaction
        : TransactionStatus.Pending
    }

    const transactionStatus = transactionStatusCode?.startsWith('tes')
      ? TransactionStatus.Succeeded
      : TransactionStatus.Failed
    return transactionStatus
  }

  private async awaitFinalTransactionStatus(
    transactionHash: string,
    sender: Wallet,
  ): Promise<RawTransactionStatus> {
    const ledgerCloseTimeMs = 4 * 1000
    await sleep(ledgerCloseTimeMs)

    // Get transaction status.
    let rawTransactionStatus = await this.getRawTransactionStatus(
      transactionHash,
    )
    const { lastLedgerSequence } = rawTransactionStatus
    if (!lastLedgerSequence) {
      return Promise.reject(
        new Error(
          'The transaction did not have a lastLedgerSequence field so transaction status cannot be reliably determined.',
        ),
      )
    }

    // Decode the sending address to a classic address for use in determining the last ledger sequence.
    // An invariant of `getLatestValidatedLedgerSequence` is that the given input address (1) exists when the method
    // is called and (2) is in a classic address form.
    //
    // The sending address should always exist, except in the case where it is deleted. A deletion would supersede the
    // transaction in flight, either by:
    // 1) Consuming the nonce sequence number of the transaction, which would effectively cancel the transaction
    // 2) Occur after the transaction has settled which is an unlikely enough case that we ignore it.
    //
    // This logic is brittle and should be replaced when we have an RPC that can give us this data.
    const classicAddress = XrpUtils.decodeXAddress(sender.getAddress())
    if (!classicAddress) {
      throw new XrpError(
        XrpErrorType.Unknown,
        'The source wallet reported an address which could not be decoded to a classic address',
      )
    }
    const sourceClassicAddress = classicAddress.address

    // Retrieve the latest ledger index.
    let latestLedgerSequence = await this.getLatestValidatedLedgerSequence(
      sourceClassicAddress,
    )

    // Poll until the transaction is validated, or until the lastLedgerSequence has been passed.
    /*
     * In general, performing an await as part of each operation is an indication that the program is not taking full advantage of the parallelization benefits of async/await.
     * Usually, the code should be refactored to create all the promises at once, then get access to the results using Promise.all(). Otherwise, each successive operation will not start until the previous one has completed.
     * But here specifically, it is reasonable to await in a loop, because we need to wait for the ledger, and there is no good way to refactor this.
     * https://eslint.org/docs/rules/no-await-in-loop
     */
    /* eslint-disable no-await-in-loop */
    while (
      latestLedgerSequence <= lastLedgerSequence &&
      !rawTransactionStatus.isValidated
    ) {
      await sleep(ledgerCloseTimeMs)

      // Update latestLedgerSequence and rawTransactionStatus
      latestLedgerSequence = await this.getLatestValidatedLedgerSequence(
        sourceClassicAddress,
      )
      rawTransactionStatus = await this.getRawTransactionStatus(transactionHash)

      const transactionStatusCode = rawTransactionStatus.transactionStatusCode

      if (!transactionStatusCode) {
        // Is this legit? What does this even mean? Is this just for testing purposes?
        throw new Error('no')
      }

      if (this.isMalformedTransactionStatus(transactionStatusCode)) {
        // Return early; malformed transactions will not change just by waiting, man
        console.log('returning early')
        return rawTransactionStatus
      }
    }
    /* eslint-enable no-await-in-loop */

    return rawTransactionStatus
  }
}
