import { assert } from 'chai'

import { Utils, WalletFactory, XrplNetwork } from 'xpring-common-js'
import IssuedCurrencyClient from '../../src/XRP/issued-currency-client'
import {
  FakeXRPNetworkClient,
  FakeXRPNetworkClientResponses,
} from './fakes/fake-xrp-network-client'
import {
  FakeJsonNetworkClient,
  FakeJsonNetworkClientResponses,
} from './fakes/fake-json-network-client'
import 'mocha'
import TrustLine from '../../src/XRP/shared/trustline'
import { XrpError } from '../../src/XRP'
import { AccountLinesResponse } from '../../src/XRP/shared/rippled-json-rpc-schema'

const fakeSucceedingGrpcClient = new FakeXRPNetworkClient()

const fakeSucceedingJsonClient = new FakeJsonNetworkClient()

const testAddress = 'X76YZJgkFzdSLZQTa7UzVSs34tFgyV2P16S3bvC8AWpmwdH'

const walletFactory = new WalletFactory(XrplNetwork.Test)

describe('Issued Currency Client', function (): void {
  before(async function () {
    this.wallet = (await walletFactory.generateRandomWallet())!.wallet
  })

  it('getTrustLines - successful response', async function (): Promise<void> {
    // GIVEN an IssuedCurrencyClient.
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingJsonClient,
      XrplNetwork.Test,
    )

    // WHEN getTrustLines is called
    const trustLines = await issuedCurrencyClient.getTrustLines(testAddress)
    const expectedTrustLines: Array<TrustLine> = []
    const trustlinesJson: AccountLinesResponse = await fakeSucceedingJsonClient.getAccountLines(
      testAddress,
    )
    if (trustlinesJson.result.lines === undefined) {
      throw XrpError.malformedResponse
    }
    for (const trustLineJson of trustlinesJson.result.lines) {
      const trustLine = new TrustLine(trustLineJson)
      expectedTrustLines.push(trustLine)
    }

    // THEN the result is as expected
    assert.deepEqual(trustLines, expectedTrustLines)
  })

  it('getTrustLines - invalid account', function (done): void {
    // GIVEN an IssuedCurrencyClient
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingJsonClient,
      XrplNetwork.Test,
    )

    // WHEN getTrustLines is called with an invalid address THEN an error is propagated.
    const address = 'malformedAddress'
    issuedCurrencyClient.getTrustLines(address).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.xAddressRequired)
      done()
    })
  })

  it('getTrustLines - account not found error response', function (done): void {
    // GIVEN an IssuedCurrencyClient with faked networking that will return an error response for getAccountLines
    const accountNotFoundResponse: AccountLinesResponse = {
      result: {
        error: 'actNotFound',
        status: 'error',
      },
    }
    const fakeErroringJsonClientResponses = new FakeJsonNetworkClientResponses(
      accountNotFoundResponse,
    )
    const fakeErroringJsonClient = new FakeJsonNetworkClient(
      fakeErroringJsonClientResponses,
    )
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeErroringJsonClient,
      XrplNetwork.Test,
    )
    // WHEN getTrustLines is called THEN an error is propagated.
    issuedCurrencyClient.getTrustLines(testAddress).catch((error) => {
      assert.typeOf(error, 'Error')
      assert.equal(error, XrpError.accountNotFound)
      done()
    })
  })

  it('requireAuthorizedTrustlines - successful response', async function (): Promise<
    void
  > {
    // GIVEN an IssuedCurrencyClient with mocked networking that will return a successful hash for submitTransaction
    const issuedCurrencyClient = new IssuedCurrencyClient(
      fakeSucceedingGrpcClient,
      fakeSucceedingJsonClient,
      XrplNetwork.Test,
    )

    // WHEN requireAuthorizedTrustlines is called
    const result = await issuedCurrencyClient.requireAuthorizedTrustlines(
      this.wallet,
    )
    const transactionHash = result.hash

    // THEN a transaction hash exists and is the expected hash
    const expectedTransactionHash = Utils.toHex(
      FakeXRPNetworkClientResponses.defaultSubmitTransactionResponse().getHash_asU8(),
    )

    assert.exists(transactionHash)
    assert.strictEqual(transactionHash, expectedTransactionHash)
  })

  it('requireAuthorizedTrustlines - submission failure', function (): void {
    // GIVEN an IssuedCurrencyClient which will fail to submit a transaction.
    const failureResponses = new FakeXRPNetworkClientResponses(
      FakeXRPNetworkClientResponses.defaultAccountInfoResponse(),
      FakeXRPNetworkClientResponses.defaultFeeResponse(),
      FakeXRPNetworkClientResponses.defaultError,
    )
    const failingNetworkClient = new FakeXRPNetworkClient(failureResponses)
    const issuedCurrencyClient = new IssuedCurrencyClient(
      failingNetworkClient,
      fakeSucceedingJsonClient,
      XrplNetwork.Test,
    )

    // WHEN requireAuthorizedTrustlines is attempted THEN an error is propagated.
    issuedCurrencyClient
      .requireAuthorizedTrustlines(this.wallet)
      .catch((error) => {
        assert.deepEqual(error, FakeXRPNetworkClientResponses.defaultError)
      })
  })
})
