export class ConsensusNodeModel {
    PublicKey: string;
    Votes: number;
    Info: ConsensusNodeInfoModel;
    Active: boolean;
    ShowInfo = false;
}

export class ConsensusNodeInfoModel {
    Organization: string;
    Logo: string;
    Email: string;
    Website: string;
    SocialAccount: string;
    Summary: string;
}
