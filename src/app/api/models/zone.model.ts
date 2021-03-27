export interface IZonesResult {
  zones: IZone[];
}

export interface IZone {
  name: string;
}

export interface IEdge {
  zone1: string;
  zone2: string;
}

export interface IDependenciesResult {
  edge: IEdge[];
}

export interface IBestPathsDetails {
  pathByFee: IDetailedPathInformation;
  pathByTransfers: IDetailedPathInformation;
}

export interface IDetailedPathInformation {
  fee: number;
  transfers: number;
  channelCombinations: number;
  graph: IPath[]
}

export interface IPath {
  fromZone: string;
  toZone: string;
  fee: number;
  channels: string[];
}

export interface IChannelInfo {
  zone: string;
  channel_id: string;
  connection_id: string;
  ibc_connection: {
    ibc_client: {
      chain_id: string;
    }
  }
}

