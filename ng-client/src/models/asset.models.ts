export class AssetDetailsModel {
}

export class AssetListModel {

}

export class TransactedAssetModel {
    amount: number;
    assetType: AssetTypeEnum;
    fromAddress: string;
    toAddress: string;
}

export enum AssetTypeEnum {
    NEO = 0,
    GAS = 1,
    NEP5 = 2,
    OTHER
}
