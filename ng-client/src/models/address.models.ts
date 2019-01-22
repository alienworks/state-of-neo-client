export class AddressAssetModel {
    name: string;
    balance: number;
    assetType: string;
}

export class AddressDetailsModel {
    address: string;
    created: string;
    lastTransactionTime: string;
    balances: AddressAssetModel[];
}

export class AddressListModel {
    address: string;
    created: string;
    transactions: number;
    lastTransactionTime: string;
    balances: AddressAssetModel[];
}
