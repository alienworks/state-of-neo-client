import { TransactedAssetModel } from './asset.models';

export class BaseTxModel {
    hash: string;
    size: number;
    type: TxTypeEnum;
    timestamp: number;
    finalizedAt: Date | string;
}

export class TxAssetsModel extends BaseTxModel {
    assets: TransactedAssetModel[];
    globalIncomingAssets: TransactedAssetModel[];
    globalOutgoingAssets: TransactedAssetModel[];
    sentAssets: TransactedAssetModel[];
    receivedAssets: TransactedAssetModel[];
}

export class TxDetailsModel extends TxAssetsModel {
    networkFee: number;
    systemFee: number;
    version: number;
    blockHash: string;
    blockHeight: number;
    contractName: string;
    contractHash: string;
    witnesses: ITxWitness[];
    attributes: ITxAttribute[];
}

export interface ITxWitness {
  address: string;
  invocationScriptAsHexString: string;
  verificationScriptAsHexString: string;
}

export interface ITxAttribute {
  usage: number;
  type: string;
  dataAsHexString: string;
}

export class TxUnconfirmedDetailsViewModel {
    txid: string;
    size: number;
    type: string;
    version: string;
    attributes: TxAttribute[];
    vin: TxVin[];
    vout: TxVout[];
    sys_fee: number;
    net_fee: number;
    scripts: TxScript[];
    script: string;
    gas: string;

    blockhash: string;
    blockHeight: number;
    confirmations: string;
    blocktime: number;
}

export class TxVout {
    n: number;
    value: number;
    asset: string;
    address: string;
}

export class TxVin {
    txid: string;
    vout: number;
}

export class TxAttribute {
    usage: string;
    data: string;
}

export class TxScript {
    invocation: string;
    verification: string;
}

export enum TxTypeEnum {
    MinerTransaction = 0,
    IssueTransaction = 1,
    ClaimTransaction = 2,
    EnrollmentTransaction = 32,
    RegisterTransaction = 64,
    ContractTransaction = 128,
    StateTransaction = 144,
    PublishTransaction = 208,
    InvocationTransaction = 209
}
