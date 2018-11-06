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
}

export class TransactedAssetModel {
    amount: number;
    assetType: AssetTypeEnum;
    fromAddress: string;
    toAddress: string;
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

export enum AssetTypeEnum {
    NEO = 0,
    GAS = 1,
    NEP5 = 2
}
