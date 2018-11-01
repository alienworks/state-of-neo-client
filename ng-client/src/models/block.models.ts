export class BaseBlockModel {
    hash: string;
    height: number;
    size: number;
    timestamp: number;
}

export class BlockListModel extends BaseBlockModel {
    transactionsCount: number;
    finalizedAt: Date;
}

export class BlockDetailsModel extends BaseBlockModel {
    consensusData: number;
    nextConsensusNodeAddress: string;
    validator: string;
    invocationScript: string;
    verificationScript: string;
    previousBlockHash: string;
    secondsFromPreviousBlock: number;
}
