export class AssetDetailsModel {
  activeAddressesLastMonth: number;
  averageTransactedValue: number;
  decimals: number;
  hash: string;
  medianTransactedValue: number;
  name: string;
  newAddressesLastMonth: number;
  symbol: string;
  totalSupply: number;
  transactionsCount: number;
  transactionsCount1: number;
  transactionsCount2: number;
  transactionsCount3: number;
}

export class AssetListModel {

}

export class TransactedAssetModel {
    amount: number;
    assetType: AssetTypeEnum;
    fromAddress: string;
    toAddress: string;
    name: string;
}

export enum AssetTypeEnum {
    NEO = 0,
    GAS = 1,
    NEP5 = 2,
    OTHER
}
