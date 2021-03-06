import { assert } from 'chai'

import { XrplNetwork } from 'xpring-common-js'
import { XrpError, XrpUtils } from '../../src'
import XrpTrustSet from '../../src/XRP/protobuf-wrappers/xrp-trust-set'
import XRPSignerEntry from '../../src/XRP/protobuf-wrappers/xrp-signer-entry'
import XrpSignerListSet from '../../src/XRP/protobuf-wrappers/xrp-signer-list-set'
import XrpSetRegularKey from '../../src/XRP/protobuf-wrappers/xrp-set-regular-key'
import XrpPaymentChannelFund from '../../src/XRP/protobuf-wrappers/xrp-payment-channel-fund'
import XrpPaymentChannelCreate from '../../src/XRP/protobuf-wrappers/xrp-payment-channel-create'
import XrpPaymentChannelClaim from '../../src/XRP/protobuf-wrappers/xrp-payment-channel-claim'
import XrpOfferCreate from '../../src/XRP/protobuf-wrappers/xrp-offer-create'
import XrpOfferCancel from '../../src/XRP/protobuf-wrappers/xrp-offer-cancel'
import XrpEscrowFinish from '../../src/XRP/protobuf-wrappers/xrp-escrow-finish'
import XrpEscrowCreate from '../../src/XRP/protobuf-wrappers/xrp-escrow-create'
import XrpEscrowCancel from '../../src/XRP/protobuf-wrappers/xrp-escrow-cancel'
import XrpDepositPreauth from '../../src/XRP/protobuf-wrappers/xrp-deposit-preauth'
import XrpCheckCreate from '../../src/XRP/protobuf-wrappers/xrp-check-create'
import XrpCheckCash from '../../src/XRP/protobuf-wrappers/xrp-check-cash'
import XrpAccountSet from '../../src/XRP/protobuf-wrappers/xrp-account-set'
import XrpCurrencyAmount from '../../src/XRP/protobuf-wrappers/xrp-currency-amount'
import XrpCheckCancel from '../../src/XRP/protobuf-wrappers/xrp-check-cancel'
import XrpAccountDelete from '../../src/XRP/protobuf-wrappers/xrp-account-delete'
import {
  testAccountSetProtoAllFields,
  testAccountSetProtoOneFieldSet,
  testAccountDeleteProto,
  testAccountDeleteProtoNoTag,
  testCheckCancelProto,
  testCheckCashProtoWithAmount,
  testCheckCashProtoWithDeliverMin,
  testCheckCreateProtoAllFields,
  testCheckCreateProtoMandatoryFields,
  testDepositPreauthProtoSetAuthorize,
  testDepositPreauthProtoSetUnauthorize,
  testEscrowCancelProto,
  testEscrowCreateProtoAllFields,
  testEscrowCreateProtoMandatoryOnly,
  testEscrowFinishProtoAllFields,
  testEscrowFinishProtoMandatoryOnly,
  testOfferCancelProto,
  testOfferCreateProtoAllFields,
  testOfferCreateProtoMandatoryOnly,
  testPaymentChannelCreateProtoAllFields,
  testPaymentChannelCreateProtoMandatoryOnly,
  testPaymentChannelFundProtoAllFields,
  testPaymentChannelFundProtoMandatoryOnly,
  testSetRegularKeyProtoWithKey,
  testSetRegularKeyProtoNoKey,
  testSignerListSetProto,
  testSignerListSetProtoDelete,
  testTrustSetProtoAllFields,
  testTrustSetProtoMandatoryOnly,
  testInvalidAccountSetProtoBadDomain,
  testInvalidAccountSetProtoBadLowTransferRate,
  testInvalidAccountSetProtoBadHighTransferRate,
  testInvalidAccountSetProtoBadTickSize,
  testInvalidAccountSetProtoSameSetClearFlag,
  testInvalidAccountDeleteProto,
  testInvalidCheckCancelProto,
  testInvalidCheckCashProtoNoCheckId,
  testInvalidCheckCashProtoNoAmountDeliverMin,
  testInvalidDepositPreauthProtoNoAuthUnauth,
  testInvalidDepositPreauthProtoSetBadAuthorize,
  testInvalidDepositPreauthProtoSetBadUnauthorize,
  testInvalidCheckCreateProto,
  testInvalidCheckCreateProtoBadDestination,
  testInvalidCheckCreateProtoNoSendMax,
  testInvalidEscrowCancelProtoNoOwner,
  testInvalidEscrowCancelProtoBadOwner,
  testInvalidEscrowCancelProtoNoOfferSequence,
  testInvalidEscrowCreateProtoNoDestination,
  testInvalidEscrowCreateProtoBadDestination,
  testInvalidEscrowCreateProtoNoAmount,
  testInvalidEscrowCreateProtoBadCancelFinish,
  testInvalidEscrowCreateProtoNoCancelFinish,
  testInvalidEscrowCreateProtoNoFinishCondition,
  testInvalidEscrowCreateProtoNoXRP,
  testInvalidEscrowFinishProtoNoOwner,
  testInvalidEscrowFinishProtoBadOwner,
  testInvalidEscrowFinishProtoNoOfferSequence,
  testInvalidOfferCancelProto,
  testInvalidOfferCreateProtoNoTakerGets,
  testInvalidOfferCreateProtoNoTakerPays,
  testPaymentChannelClaimProtoAllFields,
  testPaymentChannelClaimProtoMandatoryOnly,
  testInvalidPaymentChannelClaimProtoNoChannel,
  testInvalidPaymentChannelClaimProtoSignatureNoPublicKey,
  testInvalidPaymentChannelCreateProtoNoAmount,
  testInvalidPaymentChannelCreateProtoNoDestination,
  testInvalidPaymentChannelCreateProtoBadDestination,
  testInvalidPaymentChannelCreateProtoNoSettleDelay,
  testInvalidPaymentChannelCreateProtoNoPublicKey,
  testInvalidPaymentChannelFundProtoNoAmount,
  testInvalidPaymentChannelFundProtoNoChannel,
  testInvalidSignerListSetProtoNoSignerQuorum,
  testInvalidSignerListSetProtoNoSignerEntries,
  testInvalidSignerListSetProtoTooManySignerEntries,
  testInvalidSignerListSetProtoRepeatAddresses,
  testInvalidTrustSetProto,
  testInvalidTrustSetProtoXRP,
  testSignerEntry1,
  testSignerEntry2,
} from './fakes/fake-xrp-transaction-type-protobufs'

import {
  AccountSet,
  AccountDelete,
} from '../../src/XRP/Generated/web/org/xrpl/rpc/v1/transaction_pb'

describe('Protobuf Conversions - Transaction Types', function (): void {
  // AccountSet

  it('Convert AccountSet protobuf with all fields to XrpAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountSet = XrpAccountSet.from(testAccountSetProtoAllFields)

    // THEN the AccountSet converted as expected.
    assert.deepEqual(
      accountSet?.clearFlag,
      testAccountSetProtoAllFields.getClearFlag()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.domain,
      testAccountSetProtoAllFields.getDomain()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.emailHash,
      testAccountSetProtoAllFields.getEmailHash()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.messageKey,
      testAccountSetProtoAllFields.getMessageKey()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.setFlag,
      testAccountSetProtoAllFields.getSetFlag()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.transferRate,
      testAccountSetProtoAllFields.getTransferRate()?.getValue(),
    )
    assert.deepEqual(
      accountSet?.tickSize,
      testAccountSetProtoAllFields.getTickSize()?.getValue(),
    )
  })

  it('Convert AccountSet protobuf with one field to XrpAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with only one field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountSet = XrpAccountSet.from(testAccountSetProtoOneFieldSet)

    // THEN the AccountSet converted as expected.
    assert.deepEqual(
      accountSet?.clearFlag,
      testAccountSetProtoAllFields.getClearFlag()?.getValue(),
    )
    assert.isUndefined(accountSet?.domain)
    assert.isUndefined(accountSet?.emailHash)
    assert.isUndefined(accountSet?.messageKey)
    assert.isUndefined(accountSet?.setFlag)
    assert.isUndefined(accountSet?.transferRate)
    assert.isUndefined(accountSet?.tickSize)
  })

  it('Convert empty AccountSet protobuf to XrpAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with only one field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountSet = XrpAccountSet.from(new AccountSet())

    // THEN the AccountSet converted as expected.
    assert.isUndefined(accountSet.clearFlag)
    assert.isUndefined(accountSet.domain)
    assert.isUndefined(accountSet.emailHash)
    assert.isUndefined(accountSet.messageKey)
    assert.isUndefined(accountSet.setFlag)
    assert.isUndefined(accountSet.transferRate)
    assert.isUndefined(accountSet.tickSize)
  })

  it('Convert AccountSet protobuf with invalid domain field to XrpAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with invalid domain field set.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpAccountSet.from(testInvalidAccountSetProtoBadDomain)
    }, XrpError)
  })

  it('Convert AccountSet protobuf with invalid low transferRate field to XrpAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with invalid transferRate field set.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpAccountSet.from(testInvalidAccountSetProtoBadLowTransferRate)
    }, XrpError)
  })

  it('Convert AccountSet protobuf with invalid high transferRate field to XrpAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with invalid transferRate field set.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpAccountSet.from(testInvalidAccountSetProtoBadHighTransferRate)
    }, XrpError)
  })

  it('Convert AccountSet protobuf with invalid tickSize field to XrpAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with invalid tickSize field set.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpAccountSet.from(testInvalidAccountSetProtoBadTickSize)
    }, XrpError)
  })

  it('Convert AccountSet protobuf with same setFlag and clearFlag to XrpAccountSet object', function (): void {
    // GIVEN an AccountSet protocol buffer with setFlag == clearFlag.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpAccountSet.from(testInvalidAccountSetProtoSameSetClearFlag)
    }, XrpError)
  })

  // AccountDelete

  it('Convert AccountDelete protobuf with all fields to XrpAccountDelete object', function (): void {
    // GIVEN an AccountDelete protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountDelete = XrpAccountDelete.from(
      testAccountDeleteProto,
      XrplNetwork.Test,
    )

    // THEN the AccountDelete converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testAccountDeleteProto.getDestination()!.getValue()!.getAddress()!,
      testAccountDeleteProto.getDestinationTag()?.getValue(),
      true,
    )
    assert.deepEqual(accountDelete?.destinationXAddress, expectedXAddress)
  })

  it('Convert AccountDelete protobuf with no tag to XrpAccountDelete object', function (): void {
    // GIVEN an AccountDelete protocol buffer with only destination field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const accountDelete = XrpAccountDelete.from(
      testAccountDeleteProtoNoTag,
      XrplNetwork.Test,
    )

    // THEN the AccountDelete converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testAccountDeleteProtoNoTag.getDestination()!.getValue()!.getAddress()!,
      testAccountDeleteProtoNoTag.getDestinationTag()?.getValue(),
      true,
    )
    assert.deepEqual(accountDelete?.destinationXAddress, expectedXAddress)
  })

  it('Convert AccountDelete protobuf to XrpAccountDelete object - missing destination field', function (): void {
    // GIVEN an AccountDelete protocol buffer missing the destination field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpAccountDelete.from(new AccountDelete(), XrplNetwork.Test)
    }, XrpError)
  })

  it('Convert AccountDelete protobuf to XrpAccountDelete object - bad destination field', function (): void {
    // GIVEN an AccountDelete protocol buffer with a destination field that can't convert to an XAddress.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpAccountDelete.from(testInvalidAccountDeleteProto, XrplNetwork.Test)
    }, XrpError)
  })

  it('Convert CheckCancel protobuf to XrpCheckCancel object', function (): void {
    // GIVEN a CheckCancel protocol buffer.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCancel = XrpCheckCancel.from(testCheckCancelProto)

    // THEN the CheckCancel converted as expected.
    assert.equal(
      checkCancel?.checkId,
      testCheckCancelProto.getCheckId()?.getValue_asB64(),
    )
  })

  it('Convert CheckCancel protobuf with missing checkId', function (): void {
    // GIVEN a CheckCancel protocol buffer without a checkId.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpCheckCancel.from(testInvalidCheckCancelProto)
    }, XrpError)
  })

  // CheckCash

  it('Convert CheckCash protobuf to XrpCheckCash object - amount field set', function (): void {
    // GIVEN a valid CheckCash protocol buffer with amount field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCash = XrpCheckCash.from(testCheckCashProtoWithAmount)

    // THEN the CheckCash converted as expected.
    assert.equal(
      checkCash?.checkId,
      testCheckCashProtoWithAmount.getCheckId()?.getValue_asB64(),
    )
    assert.deepEqual(
      checkCash?.amount,
      XrpCurrencyAmount.from(
        testCheckCashProtoWithAmount.getAmount()!.getValue()!,
      ),
    )
    assert.isUndefined(checkCash?.deliverMin)
  })

  it('Convert CheckCash protobuf to XrpCheckCash object - deliverMin field set', function (): void {
    // GIVEN a valid CheckCash protocol buffer with deliverMin field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCash = XrpCheckCash.from(testCheckCashProtoWithDeliverMin)

    // THEN the CheckCash converted as expected.
    assert.equal(
      checkCash?.checkId,
      testCheckCashProtoWithDeliverMin.getCheckId()?.getValue_asB64(),
    )
    assert.isUndefined(checkCash?.amount)
    assert.deepEqual(
      checkCash?.deliverMin,
      XrpCurrencyAmount.from(
        testCheckCashProtoWithDeliverMin.getDeliverMin()!.getValue()!,
      ),
    )
  })

  it('Convert invalid CheckCash protobuf to XrpCheckCash object - missing checkId', function (): void {
    // GIVEN an invalid CheckCash protocol buffer missing the checkId field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpCheckCash.from(testInvalidCheckCashProtoNoCheckId)
    }, XrpError)
  })

  it('Convert invalid CheckCash protobuf to XrpCheckCash object - missing amount and deliverMin', function (): void {
    // GIVEN an invalid CheckCash protocol buffer missing both the amount and deliverMin fields.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpCheckCash.from(testInvalidCheckCashProtoNoAmountDeliverMin)
    }, XrpError)
  })

  // CheckCreate

  it('Convert CheckCreate protobuf to XrpCheckCreate object - all fields', function (): void {
    // GIVEN a CheckCreate protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCreate = XrpCheckCreate.from(
      testCheckCreateProtoAllFields,
      XrplNetwork.Test,
    )

    // THEN the CheckCreate converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testCheckCreateProtoAllFields.getDestination()!.getValue()!.getAddress()!,
      testCheckCreateProtoAllFields.getDestinationTag()?.getValue(),
      true,
    )
    assert.equal(checkCreate?.destinationXAddress, expectedXAddress)
    assert.deepEqual(
      checkCreate?.sendMax,
      XrpCurrencyAmount.from(
        testCheckCreateProtoAllFields.getSendMax()!.getValue()!,
      ),
    )
    assert.equal(
      checkCreate?.expiration,
      testCheckCreateProtoAllFields.getExpiration()?.getValue(),
    )
    assert.equal(
      checkCreate?.invoiceId,
      testCheckCreateProtoAllFields.getInvoiceId()?.getValue_asB64(),
    )
  })

  it('Convert CheckCreate protobuf to XrpCheckCreate object - mandatory fields', function (): void {
    // GIVEN a CheckCreate protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const checkCreate = XrpCheckCreate.from(
      testCheckCreateProtoMandatoryFields,
      XrplNetwork.Test,
    )

    // THEN the CheckCreate converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testCheckCreateProtoMandatoryFields
        .getDestination()!
        .getValue()!
        .getAddress()!,
      testCheckCreateProtoMandatoryFields.getDestinationTag()?.getValue(),
      true,
    )
    assert.equal(checkCreate?.destinationXAddress, expectedXAddress)
    assert.deepEqual(
      checkCreate?.sendMax,
      XrpCurrencyAmount.from(
        testCheckCreateProtoMandatoryFields.getSendMax()!.getValue()!,
      ),
    )
    assert.isUndefined(checkCreate?.expiration)
    assert.isUndefined(checkCreate?.invoiceId)
  })

  it('Convert invalid CheckCreate protobuf to XrpCheckCreate object - missing destination', function (): void {
    // GIVEN an invalid CheckCreate protocol buffer missing the destination field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpCheckCreate.from(testInvalidCheckCreateProto, XrplNetwork.Test)
    }, XrpError)
  })

  it('Convert invalid CheckCreate protobuf to XrpCheckCreate object - bad destination', function (): void {
    // GIVEN an invalid CheckCreate protocol buffer with a bad destination field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpCheckCreate.from(
        testInvalidCheckCreateProtoBadDestination,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert invalid CheckCreate protobuf to XrpCheckCreate object - no SendMax', function (): void {
    // GIVEN an invalid CheckCreate protocol buffer missing the SendMax field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpCheckCreate.from(
        testInvalidCheckCreateProtoNoSendMax,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  // DepositPreauth

  it('Convert DepositPreauth protobuf to XrpDepositPreauth object - authorize set', function (): void {
    // GIVEN a DepositPreauth protocol buffer with authorize field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const depositPreauth = XrpDepositPreauth.from(
      testDepositPreauthProtoSetAuthorize,
      XrplNetwork.Test,
    )

    // THEN the DepositPreauth converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testDepositPreauthProtoSetAuthorize
        .getAuthorize()!
        .getValue()!
        .getAddress()!,
      undefined,
      true,
    )
    assert.equal(depositPreauth.authorizeXAddress, expectedXAddress)
  })

  it('Convert DepositPreauth protobuf to XrpDepositPreauth object - unauthorize set', function (): void {
    // GIVEN a DepositPreauth protocol buffer with unauthorize field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const depositPreauth = XrpDepositPreauth.from(
      testDepositPreauthProtoSetUnauthorize,
      XrplNetwork.Test,
    )

    // THEN the DepositPreauth converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testDepositPreauthProtoSetUnauthorize
        .getUnauthorize()!
        .getValue()!
        .getAddress()!,
      undefined,
      true,
    )
    assert.equal(depositPreauth.unauthorizeXAddress, expectedXAddress)
  })

  it('Convert DepositPreauth protobuf to XrpDepositPreauth object - neither authorize nor unauthorize', function (): void {
    // GIVEN a DepositPreauth protocol buffer neither authorize nor unauthorize field set.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpDepositPreauth.from(
        testInvalidDepositPreauthProtoNoAuthUnauth,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert DepositPreauth protobuf to XrpDepositPreauth object - bad authorize', function (): void {
    // GIVEN a DepositPreauth protocol buffer with a bad authorize address field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpDepositPreauth.from(
        testInvalidDepositPreauthProtoSetBadAuthorize,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert DepositPreauth protobuf to XrpDepositPreauth object - bad unauthorize', function (): void {
    // GIVEN a DepositPreauth protocol buffer with a bad unauthorize address field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpDepositPreauth.from(
        testInvalidDepositPreauthProtoSetBadUnauthorize,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  // Escrow Cancel

  it('Convert EscrowCancel protobuf to XrpEscrowCancel object - valid fields', function (): void {
    // GIVEN an EscrowCancel protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCancel = XrpEscrowCancel.from(
      testEscrowCancelProto,
      XrplNetwork.Test,
    )

    // THEN the EscrowCancel converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testEscrowCancelProto.getOwner()!.getValue()!.getAddress()!,
      undefined,
      true,
    )
    assert.equal(escrowCancel?.ownerXAddress, expectedXAddress)
    assert.equal(
      escrowCancel?.offerSequence,
      testEscrowCancelProto.getOfferSequence()?.getValue(),
    )
  })

  it('Convert EscrowCancel protobuf to XrpEscrowCancel object - missing owner field', function (): void {
    // GIVEN an EscrowCancel protocol buffer missing required owner field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowCancel.from(
        testInvalidEscrowCancelProtoNoOwner,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert EscrowCancel protobuf to XrpEscrowCancel object - bad owner field', function (): void {
    // GIVEN an EscrowCancel protocol buffer with a bad owner field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowCancel.from(
        testInvalidEscrowCancelProtoBadOwner,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert EscrowCancel protobuf to XrpEscrowCancel object - no OfferSequence field', function (): void {
    // GIVEN an EscrowCancel protocol buffer missing required offerSequence field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowCancel.from(
        testInvalidEscrowCancelProtoNoOfferSequence,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  // EscrowCreate

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - all fields', function (): void {
    // GIVEN an EscrowCreate protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCreate = XrpEscrowCreate.from(
      testEscrowCreateProtoAllFields,
      XrplNetwork.Test,
    )

    // THEN the EscrowCreate converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testEscrowCreateProtoAllFields
        .getDestination()!
        .getValue()!
        .getAddress()!,
      testEscrowCreateProtoAllFields.getDestinationTag()?.getValue(),
      true,
    )
    assert.deepEqual(
      escrowCreate?.amount,
      XrpCurrencyAmount.from(
        testEscrowCreateProtoAllFields.getAmount()!.getValue()!,
      ),
    )
    assert.equal(escrowCreate?.destinationXAddress, expectedXAddress)
    assert.equal(
      escrowCreate?.cancelAfter,
      testEscrowCreateProtoAllFields.getCancelAfter()?.getValue(),
    )
    assert.equal(
      escrowCreate?.finishAfter,
      testEscrowCreateProtoAllFields.getFinishAfter()?.getValue(),
    )
    assert.equal(
      escrowCreate?.condition,
      testEscrowCreateProtoAllFields.getCondition()?.getValue_asB64(),
    )
  })

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - mandatory fields only', function (): void {
    // GIVEN an EscrowCreate protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowCreate = XrpEscrowCreate.from(
      testEscrowCreateProtoMandatoryOnly,
      XrplNetwork.Test,
    )

    // THEN the EscrowCreate converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testEscrowCreateProtoMandatoryOnly
        .getDestination()!
        .getValue()!
        .getAddress()!,
      testEscrowCreateProtoMandatoryOnly.getDestinationTag()?.getValue(),
      true,
    )
    assert.deepEqual(
      escrowCreate?.amount,
      XrpCurrencyAmount.from(
        testEscrowCreateProtoMandatoryOnly.getAmount()!.getValue()!,
      ),
    )
    assert.equal(escrowCreate?.destinationXAddress, expectedXAddress)
    assert.isUndefined(escrowCreate?.cancelAfter)
    assert.equal(
      escrowCreate?.finishAfter,
      testEscrowCreateProtoMandatoryOnly.getFinishAfter()?.getValue(),
    )
    assert.isUndefined(escrowCreate?.condition)
  })

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - missing destination field', function (): void {
    // GIVEN an EscrowCreate protocol buffer that's missing the destination field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowCreate.from(
        testInvalidEscrowCreateProtoNoDestination,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - bad destination field', function (): void {
    // GIVEN an EscrowCreate protocol buffer with a bad destination field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowCreate.from(
        testInvalidEscrowCreateProtoBadDestination,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - missing amount field', function (): void {
    // GIVEN an EscrowCreate protocol buffer that's missing the amount field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowCreate.from(
        testInvalidEscrowCreateProtoNoAmount,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - amount not XRP', function (): void {
    // GIVEN an EscrowCreate protocol buffer with a non-XRP amount.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowCreate.from(testInvalidEscrowCreateProtoNoXRP, XrplNetwork.Test)
    }, XrpError)
  })

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - missing cancelAfter and finishAfter fields', function (): void {
    // GIVEN an EscrowCreate protocol buffer that's missing both the cancelAfter and finishAfter fields.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowCreate.from(
        testInvalidEscrowCreateProtoNoCancelFinish,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - bad cancelAfter and finishAfter fields', function (): void {
    // GIVEN an EscrowCreate protocol buffer with a finishAfter field that is not before the cancelAfter field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowCreate.from(
        testInvalidEscrowCreateProtoBadCancelFinish,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert EscrowCreate protobuf to XrpEscrowCreate object - no finishAfter and condition fields', function (): void {
    // GIVEN an EscrowCreate protocol buffer that's missing both the finishAfter and condition fields.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowCreate.from(
        testInvalidEscrowCreateProtoNoFinishCondition,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  // EscrowFinish

  it('Convert EscrowFinish protobuf to XrpEscrowFinish object - all fields', function (): void {
    // GIVEN an EscrowFinish protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowFinish = XrpEscrowFinish.from(
      testEscrowFinishProtoAllFields,
      XrplNetwork.Test,
    )

    // THEN the EscrowFinish converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testEscrowFinishProtoAllFields.getOwner()!.getValue()!.getAddress()!,
      undefined,
      true,
    )
    assert.deepEqual(escrowFinish?.ownerXAddress, expectedXAddress)
    assert.equal(
      escrowFinish?.offerSequence,
      testEscrowFinishProtoAllFields.getOfferSequence()?.getValue(),
    )
    assert.equal(
      escrowFinish?.condition,
      testEscrowFinishProtoAllFields.getCondition()?.getValue(),
    )
    assert.equal(
      escrowFinish?.fulfillment,
      testEscrowFinishProtoAllFields.getFulfillment()?.getValue(),
    )
  })

  it('Convert EscrowFinish protobuf to XrpEscrowFinish object - mandatory fields only', function (): void {
    // GIVEN an EscrowFinish protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const escrowFinish = XrpEscrowFinish.from(
      testEscrowFinishProtoMandatoryOnly,
      XrplNetwork.Test,
    )

    // THEN the EscrowFinish converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testEscrowFinishProtoMandatoryOnly.getOwner()!.getValue()!.getAddress()!,
      undefined,
      true,
    )
    assert.deepEqual(escrowFinish?.ownerXAddress, expectedXAddress)
    assert.equal(
      escrowFinish?.offerSequence,
      testEscrowFinishProtoMandatoryOnly.getOfferSequence()?.getValue(),
    )
    assert.isUndefined(escrowFinish?.condition)
    assert.isUndefined(escrowFinish?.fulfillment)
  })

  it('Convert EscrowFinish protobuf to XrpEscrowFinish object - missing owner', function (): void {
    // GIVEN an EscrowFinish protocol buffer missing the owner field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowFinish.from(
        testInvalidEscrowFinishProtoNoOwner,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert EscrowFinish protobuf to XrpEscrowFinish object - bad owner', function (): void {
    // GIVEN an EscrowFinish protocol buffer with a bad owner field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowFinish.from(
        testInvalidEscrowFinishProtoBadOwner,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert EscrowFinish protobuf to XrpEscrowFinish object - missing offerSequence', function (): void {
    // GIVEN an EscrowFinish protocol buffer missing the offerSequence field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpEscrowFinish.from(
        testInvalidEscrowFinishProtoNoOfferSequence,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  // OfferCancel

  it('Convert OfferCancel protobuf to XrpOfferCancel object', function (): void {
    // GIVEN an OfferCancel protocol buffer with offerSequence field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const offerCancel = XrpOfferCancel.from(testOfferCancelProto)

    // THEN the OfferCancel converted as expected.
    assert.deepEqual(
      offerCancel?.offerSequence,
      testOfferCancelProto.getOfferSequence()?.getValue(),
    )
  })

  it('Convert OfferCancel protobuf to XrpOfferCancel object - missing required field', function (): void {
    // GIVEN an OfferCancel protocol buffer missing the offerSequence field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpOfferCancel.from(testInvalidOfferCancelProto)
    }, XrpError)
  })

  // OfferCreate

  it('Convert OfferCreate protobuf to XrpOfferCreate object', function (): void {
    // GIVEN an OfferCreate protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const offerCreate = XrpOfferCreate.from(testOfferCreateProtoAllFields)

    // THEN the OfferCreate converted as expected.
    assert.equal(
      offerCreate?.expiration,
      testOfferCreateProtoAllFields.getExpiration()?.getValue(),
    )
    assert.equal(
      offerCreate?.offerSequence,
      testOfferCreateProtoAllFields.getOfferSequence()?.getValue(),
    )
    assert.deepEqual(
      offerCreate?.takerGets,
      XrpCurrencyAmount.from(
        testOfferCreateProtoAllFields.getTakerGets()!.getValue()!,
      ),
    )
    assert.deepEqual(
      offerCreate?.takerPays,
      XrpCurrencyAmount.from(
        testOfferCreateProtoAllFields.getTakerPays()!.getValue()!,
      ),
    )
  })

  it('Convert OfferCreate protobuf to XrpOfferCreate object - mandatory fields', function (): void {
    // GIVEN an OfferCreate protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const offerCreate = XrpOfferCreate.from(testOfferCreateProtoMandatoryOnly)

    // THEN the OfferCreate converted as expected.
    assert.isUndefined(offerCreate?.expiration)
    assert.isUndefined(offerCreate?.offerSequence)
    assert.deepEqual(
      offerCreate?.takerGets,
      XrpCurrencyAmount.from(
        testOfferCreateProtoMandatoryOnly.getTakerGets()!.getValue()!,
      ),
    )
    assert.deepEqual(
      offerCreate?.takerPays,
      XrpCurrencyAmount.from(
        testOfferCreateProtoMandatoryOnly.getTakerPays()!.getValue()!,
      ),
    )
  })

  it('Convert OfferCreate protobuf to XrpOfferCreate object - missing required TakerGets field', function (): void {
    // GIVEN an OfferCreate protocol buffer missing the TakerGets field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpOfferCreate.from(testInvalidOfferCreateProtoNoTakerGets)
    }, XrpError)
  })

  it('Convert OfferCreate protobuf to XrpOfferCreate object - missing required TakerPays field', function (): void {
    // GIVEN an OfferCreate protocol buffer missing the TakerPays field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpOfferCreate.from(testInvalidOfferCreateProtoNoTakerPays)
    }, XrpError)
  })

  // PaymentChannelClaim

  it('Convert PaymentChannelClaim protobuf to XrpPaymentChannelClaim object - all fields', function (): void {
    // GIVEN a PaymentChannelClaim protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelClaim = XrpPaymentChannelClaim.from(
      testPaymentChannelClaimProtoAllFields,
    )

    // THEN the PaymentChannelClaim converted as expected.
    assert.equal(
      paymentChannelClaim?.channel,
      testPaymentChannelClaimProtoAllFields.getChannel()?.getValue_asB64(),
    )
    assert.deepEqual(
      paymentChannelClaim?.balance,
      XrpCurrencyAmount.from(
        testPaymentChannelClaimProtoAllFields.getBalance()!.getValue()!,
      ),
    )
    assert.deepEqual(
      paymentChannelClaim?.amount,
      XrpCurrencyAmount.from(
        testPaymentChannelClaimProtoAllFields.getAmount()!.getValue()!,
      ),
    )
    assert.equal(
      paymentChannelClaim?.signature,
      testPaymentChannelClaimProtoAllFields
        .getPaymentChannelSignature()
        ?.getValue_asB64(),
    )
    assert.equal(
      paymentChannelClaim?.publicKey,
      testPaymentChannelClaimProtoAllFields.getPublicKey()?.getValue_asB64(),
    )
  })

  it('Convert PaymentChannelClaim protobuf to XrpPaymentChannelClaim object - mandatory field', function (): void {
    // GIVEN a PaymentChannelClaim protocol buffer with only mandatory field set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelClaim = XrpPaymentChannelClaim.from(
      testPaymentChannelClaimProtoMandatoryOnly,
    )

    // THEN the PaymentChannelClaim converted as expected.
    assert.equal(
      paymentChannelClaim?.channel,
      testPaymentChannelClaimProtoMandatoryOnly.getChannel()?.getValue_asB64(),
    )
    assert.isUndefined(paymentChannelClaim?.balance)
    assert.isUndefined(paymentChannelClaim?.amount)
    assert.isUndefined(paymentChannelClaim?.signature)
    assert.isUndefined(paymentChannelClaim?.publicKey)
  })

  it('Convert PaymentChannelClaim protobuf to XrpPaymentChannelClaim object - missing mandatory field', function (): void {
    // GIVEN a PaymentChannelClaim protocol buffer missing the mandatory field.
    // WHEN the protocol buffer is converted to a native Typescript type.
    assert.throws(() => {
      XrpPaymentChannelClaim.from(testInvalidPaymentChannelClaimProtoNoChannel)
    }, XrpError)
  })

  it('Convert PaymentChannelClaim protobuf to XrpPaymentChannelClaim object - missing signature with public key', function (): void {
    // GIVEN a PaymentChannelClaim protocol buffer missing a signature when there is a public key.
    // WHEN the protocol buffer is converted to a native Typescript type.
    assert.throws(() => {
      XrpPaymentChannelClaim.from(
        testInvalidPaymentChannelClaimProtoSignatureNoPublicKey,
      )
    }, XrpError)
  })

  // PaymentChannelCreate

  it('Convert PaymentChannelCreate protobuf to XrpPaymentChannelCreate object - all fields', function (): void {
    // GIVEN a PaymentChannelCreate protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelCreate = XrpPaymentChannelCreate.from(
      testPaymentChannelCreateProtoAllFields,
      XrplNetwork.Test,
    )

    // THEN the PaymentChannelCreate converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testPaymentChannelCreateProtoAllFields
        .getDestination()!
        .getValue()!
        .getAddress()!,
      testPaymentChannelCreateProtoAllFields.getDestinationTag()?.getValue(),
      true,
    )
    assert.deepEqual(
      paymentChannelCreate?.amount,
      XrpCurrencyAmount.from(
        testPaymentChannelCreateProtoAllFields.getAmount()!.getValue()!,
      ),
    )
    assert.equal(paymentChannelCreate?.destinationXAddress, expectedXAddress)
    assert.equal(
      paymentChannelCreate?.settleDelay,
      testPaymentChannelCreateProtoAllFields.getSettleDelay()?.getValue(),
    )
    assert.equal(
      paymentChannelCreate?.publicKey,
      testPaymentChannelCreateProtoAllFields.getPublicKey()?.getValue_asB64(),
    )
    assert.equal(
      paymentChannelCreate?.cancelAfter,
      testPaymentChannelCreateProtoAllFields.getCancelAfter()?.getValue(),
    )
  })

  it('Convert PaymentChannelCreate protobuf to XrpPaymentChannelCreate object - mandatory fields', function (): void {
    // GIVEN a PaymentChannelCreate protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelCreate = XrpPaymentChannelCreate.from(
      testPaymentChannelCreateProtoMandatoryOnly,
      XrplNetwork.Test,
    )

    // THEN the PaymentChannelCreate converted as expected.
    const expectedXAddress = XrpUtils.encodeXAddress(
      testPaymentChannelCreateProtoMandatoryOnly
        .getDestination()!
        .getValue()!
        .getAddress()!,
      testPaymentChannelCreateProtoMandatoryOnly
        .getDestinationTag()
        ?.getValue(),
      true,
    )
    assert.deepEqual(
      paymentChannelCreate?.amount,
      XrpCurrencyAmount.from(
        testPaymentChannelCreateProtoMandatoryOnly.getAmount()!.getValue()!,
      ),
    )
    assert.equal(paymentChannelCreate?.destinationXAddress, expectedXAddress)
    assert.equal(
      paymentChannelCreate?.settleDelay,
      testPaymentChannelCreateProtoMandatoryOnly.getSettleDelay()?.getValue(),
    )
    assert.equal(
      paymentChannelCreate?.publicKey,
      testPaymentChannelCreateProtoMandatoryOnly
        .getPublicKey()
        ?.getValue_asB64(),
    )
    assert.isUndefined(paymentChannelCreate?.cancelAfter)
  })

  it('Convert PaymentChannelCreate protobuf to XrpPaymentChannelCreate object - missing amount', function (): void {
    // GIVEN a PaymentChannelCreate protocol buffer missing the amount field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpPaymentChannelCreate.from(
        testInvalidPaymentChannelCreateProtoNoAmount,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PaymentChannelCreate protobuf to XrpPaymentChannelCreate object - missing destination', function (): void {
    // GIVEN a PaymentChannelCreate protocol buffer missing the destination field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpPaymentChannelCreate.from(
        testInvalidPaymentChannelCreateProtoNoDestination,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PaymentChannelCreate protobuf to XrpPaymentChannelCreate object - bad destination', function (): void {
    // GIVEN a PaymentChannelCreate protocol buffer with a bad destination field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpPaymentChannelCreate.from(
        testInvalidPaymentChannelCreateProtoBadDestination,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PaymentChannelCreate protobuf to XrpPaymentChannelCreate object - missing PublicKey', function (): void {
    // GIVEN a PaymentChannelCreate protocol buffer missing the publicKey field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpPaymentChannelCreate.from(
        testInvalidPaymentChannelCreateProtoNoPublicKey,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert PaymentChannelCreate protobuf to XrpPaymentChannelCreate object - missing SettleDelay', function (): void {
    // GIVEN a PaymentChannelCreate protocol buffer missing the settleDelay field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpPaymentChannelCreate.from(
        testInvalidPaymentChannelCreateProtoNoSettleDelay,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  // PaymentChannelFund

  it('Convert PaymentChannelFund protobuf to XrpPaymentChannelFund object - all fields', function (): void {
    // GIVEN a PaymentChannelFund protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelFund = XrpPaymentChannelFund.from(
      testPaymentChannelFundProtoAllFields,
    )

    // THEN the PaymentChannelFund converted as expected.
    assert.equal(
      paymentChannelFund?.channel,
      testPaymentChannelFundProtoAllFields.getChannel()?.getValue(),
    )
    assert.deepEqual(
      paymentChannelFund?.amount,
      XrpCurrencyAmount.from(
        testPaymentChannelFundProtoAllFields.getAmount()!.getValue()!,
      ),
    )
    assert.equal(
      paymentChannelFund?.expiration,
      testPaymentChannelFundProtoAllFields.getExpiration()?.getValue(),
    )
  })

  it('Convert PaymentChannelFund protobuf to XrpPaymentChannelFund object - mandatory fields', function (): void {
    // GIVEN a PaymentChannelFund protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const paymentChannelFund = XrpPaymentChannelFund.from(
      testPaymentChannelFundProtoMandatoryOnly,
    )

    // THEN the PaymentChannelFund converted as expected.
    assert.equal(
      paymentChannelFund?.channel,
      testPaymentChannelFundProtoMandatoryOnly.getChannel()?.getValue(),
    )
    assert.deepEqual(
      paymentChannelFund?.amount,
      XrpCurrencyAmount.from(
        testPaymentChannelFundProtoMandatoryOnly.getAmount()!.getValue()!,
      ),
    )
    assert.isUndefined(paymentChannelFund?.expiration)
  })

  it('Convert PaymentChannelFund protobuf to XrpPaymentChannelFund object - missing amount', function (): void {
    // GIVEN a PaymentChannelFund protocol buffer missing the required amount field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpPaymentChannelFund.from(testInvalidPaymentChannelFundProtoNoAmount)
    }, XrpError)
  })

  it('Convert PaymentChannelFund protobuf to XrpPaymentChannelFund object - missing channel', function (): void {
    // GIVEN a PaymentChannelFund protocol buffer missing the required channel field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpPaymentChannelFund.from(testInvalidPaymentChannelFundProtoNoChannel)
    }, XrpError)
  })

  // SetRegularKey

  it('Convert SetRegularKey protobuf to XrpSetRegularKey object - key set', function (): void {
    // GIVEN a SetRegularKey protocol buffer with regularKey set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const setRegularKey = XrpSetRegularKey.from(testSetRegularKeyProtoWithKey)

    // THEN the SetRegularKey converted as expected.
    assert.equal(
      setRegularKey?.regularKey,
      testSetRegularKeyProtoWithKey.getRegularKey()?.getValue()?.getAddress(),
    )
  })

  it('Convert SetRegularKey protobuf to XrpSetRegularKey object - no key', function (): void {
    // GIVEN a SetRegularKey protocol buffer without regularKey set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const setRegularKey = XrpSetRegularKey.from(testSetRegularKeyProtoNoKey)

    // THEN the result is undefined.
    assert.isUndefined(setRegularKey?.regularKey)
  })

  // SignerListSet

  it('Convert SignerListSet protobuf to XrpSignerListSet object - all fields set', function (): void {
    // GIVEN a SetRegularKey protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const signerListSet = XrpSignerListSet.from(
      testSignerListSetProto,
      XrplNetwork.Test,
    )

    // THEN the SignerListSet converted as expected.
    const expectedSignerEntries: Array<XRPSignerEntry> = [
      XRPSignerEntry.from(testSignerEntry1, XrplNetwork.Test),
      XRPSignerEntry.from(testSignerEntry2, XrplNetwork.Test),
    ]

    assert.equal(
      signerListSet?.signerQuorum,
      testSignerListSetProto.getSignerQuorum()?.getValue(),
    )
    assert.deepEqual(signerListSet?.signerEntries, expectedSignerEntries)
  })

  it('Convert SignerListSet protobuf to XrpSignerListSet object - delete', function (): void {
    // GIVEN a SetRegularKey protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const signerListSet = XrpSignerListSet.from(
      testSignerListSetProtoDelete,
      XrplNetwork.Test,
    )

    assert.equal(
      signerListSet.signerQuorum,
      testSignerListSetProtoDelete.getSignerQuorum()?.getValue(),
    )
    assert.deepEqual(signerListSet.signerEntries, [])
  })

  it('Convert SignerListSet protobuf to XrpSignerListSet object - missing signerQuorum', function (): void {
    // GIVEN a SignerListSet protocol buffer without signerQuorum set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    assert.throws(() => {
      XrpSignerListSet.from(
        testInvalidSignerListSetProtoNoSignerQuorum,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert SignerListSet protobuf to XrpSignerListSet object - missing signerEntries', function (): void {
    // GIVEN a SignerListSet protocol buffer without signerEntries set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    assert.throws(() => {
      XrpSignerListSet.from(
        testInvalidSignerListSetProtoNoSignerEntries,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert SignerListSet protobuf to XrpSignerListSet object - signerEntries too large', function (): void {
    // GIVEN a SignerListSet protocol buffer with too many elements in signerEntries.
    // WHEN the protocol buffer is converted to a native Typescript type.
    assert.throws(() => {
      XrpSignerListSet.from(
        testInvalidSignerListSetProtoTooManySignerEntries,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  it('Convert SignerListSet protobuf to XrpSignerListSet object - repeat addresses in signerEntries', function (): void {
    // GIVEN a SignerListSet protocol buffer with repeat addresses in signerEntries.
    // WHEN the protocol buffer is converted to a native Typescript type.
    assert.throws(() => {
      XrpSignerListSet.from(
        testInvalidSignerListSetProtoRepeatAddresses,
        XrplNetwork.Test,
      )
    }, XrpError)
  })

  // TrustSet

  it('Convert TrustSet protobuf to XrpTrustSet object - all fields set', function (): void {
    // GIVEN a TrustSet protocol buffer with all fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const trustSet = XrpTrustSet.from(testTrustSetProtoAllFields)

    // THEN the TrustSet converted as expected.
    assert.deepEqual(
      trustSet?.limitAmount,
      XrpCurrencyAmount.from(
        testTrustSetProtoAllFields.getLimitAmount()!.getValue()!,
      ),
    )
    assert.equal(
      trustSet?.qualityIn,
      testTrustSetProtoAllFields.getQualityIn()?.getValue(),
    )
    assert.equal(
      trustSet?.qualityOut,
      testTrustSetProtoAllFields.getQualityOut()?.getValue(),
    )
  })

  it('Convert TrustSet protobuf to XrpTrustSet object - mandatory fields set', function (): void {
    // GIVEN a TrustSet protocol buffer with only mandatory fields set.
    // WHEN the protocol buffer is converted to a native Typescript type.
    const trustSet = XrpTrustSet.from(testTrustSetProtoMandatoryOnly)

    // THEN the TrustSet converted as expected.
    assert.deepEqual(
      trustSet?.limitAmount,
      XrpCurrencyAmount.from(
        testTrustSetProtoMandatoryOnly.getLimitAmount()!.getValue()!,
      ),
    )
    assert.isUndefined(trustSet?.qualityIn)
    assert.isUndefined(trustSet?.qualityOut)
  })

  it('Convert TrustSet protobuf to XrpTrustSet object - missing mandatory field', function (): void {
    // GIVEN a TrustSet protocol buffer missing mandatory limitAmount field.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpTrustSet.from(testInvalidTrustSetProto)
    }, XrpError)
  })

  it('Convert TrustSet protobuf to XrpTrustSet object - uses XRP', function (): void {
    // GIVEN a TrustSet protocol buffer using XRP.
    // WHEN the protocol buffer is converted to a native Typescript type THEN an error is thrown.
    assert.throws(() => {
      XrpTrustSet.from(testInvalidTrustSetProtoXRP)
    }, XrpError)
  })
})
