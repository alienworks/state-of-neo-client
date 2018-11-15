import { TransactedAssetModel } from './asset.models';

export class BaseTxModel {
    hash: string;
    size: number;
    type: TxTypeEnum;
    timestamp: number;
    finalizedAt: Date;
}

export class TxDetailsModel extends BaseTxModel {
    networkFee: number;
    systemFee: number;
    version: number;
    blockHash: string;
    blockHeight: number;
    assets: TransactedAssetModel[];
    globalIncomingAssets: TransactedAssetModel[];
    globalOutgoingAssets: TransactedAssetModel[];
}

export class TxUnconfirmedDetailsViewModel {
    txid: string;
    size: number;
    type: TxTypeEnum;
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
