export class BaseNodeModel {
    id: number;
    ip: string;
    url: string;
    successUrl: string;
    port?: number;
    protocol: string;
    version: string;
    type: string;
    height?: number;
    peers?: number;
    memoryPool?: number;
    locale: string;
    location: string;
    longitude?: number;
    latitude?: number;
    blockCount: number;
}

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

export class GetPeersModel {
    bad: Set<Peer>;
    connected: Peer[];
    unconnected: Set<Peer>;
    all: Set<Peer>;
}

export class Peer {
    address: string;
    port: number;
}
