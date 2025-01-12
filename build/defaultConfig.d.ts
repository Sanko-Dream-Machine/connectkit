import { Connector, PublicClient, WebSocketPublicClient } from 'wagmi';
import { Chain } from 'wagmi/chains';
export declare const getAppName: () => string;
export declare const getAppIcon: () => string;
type DefaultConfigProps = {
    appName: string;
    appIcon?: string;
    appDescription?: string;
    appUrl?: string;
    autoConnect?: boolean;
    alchemyId?: string;
    infuraId?: string;
    chains?: Chain[];
    connectors?: any;
    publicClient?: any;
    webSocketPublicClient?: any;
    enableWebSocketPublicClient?: boolean;
    stallTimeout?: number;
    walletConnectProjectId: string;
};
declare const defaultConfig: ({ autoConnect, appName, appIcon, appDescription, appUrl, chains, alchemyId, infuraId, connectors, publicClient, stallTimeout, webSocketPublicClient, enableWebSocketPublicClient, walletConnectProjectId, }: DefaultConfigProps) => {
    autoConnect?: boolean | undefined;
    connectors?: Connector<any, any>[] | undefined;
    publicClient: PublicClient;
    webSocketPublicClient?: WebSocketPublicClient<import("viem").Transport<string, Record<string, any>, {
        (args: {
            method: "web3_clientVersion";
            params?: undefined;
        }): Promise<string>;
        (args: {
            method: "web3_sha3";
            params: [data: `0x${string}`];
        }): Promise<string>;
        (args: {
            method: "net_listening";
            params?: undefined;
        }): Promise<boolean>;
        (args: {
            method: "net_peerCount";
            params?: undefined;
        }): Promise<`0x${string}`>;
        (args: {
            method: "net_version";
            params?: undefined;
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_blockNumber";
            params?: undefined;
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_call";
            params: [request: Partial<import("viem").RpcTransactionRequest>, block?: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier | undefined];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_chainId";
            params?: undefined;
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_coinbase";
            params?: undefined;
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_estimateGas";
            params: [parameters: import("viem").RpcTransactionRequest, block?: `0x${string}` | import("viem").BlockTag | undefined];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_feeHistory";
            params: [blockCount: `0x${string}`, newestBlock: `0x${string}` | import("viem").BlockTag, rewardPercentiles: number[] | undefined];
        }): Promise<import("viem").RpcFeeHistory>;
        (args: {
            method: "eth_gasPrice";
            params?: undefined;
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_getBalance";
            params: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_getBlockByHash";
            params: [hash: `0x${string}`, includeTransactionObjects: boolean];
        }): Promise<import("viem").RpcBlock | null>;
        (args: {
            method: "eth_getBlockByNumber";
            params: [block: `0x${string}` | import("viem").BlockTag, includeTransactionObjects: boolean];
        }): Promise<import("viem").RpcBlock | null>;
        (args: {
            method: "eth_getBlockTransactionCountByHash";
            params: [hash: `0x${string}`];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_getBlockTransactionCountByNumber";
            params: [block: `0x${string}` | import("viem").BlockTag];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_getCode";
            params: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_getFilterChanges";
            params: [filterId: `0x${string}`];
        }): Promise<`0x${string}`[] | import("viem").RpcLog[]>;
        (args: {
            method: "eth_getFilterLogs";
            params: [filterId: `0x${string}`];
        }): Promise<import("viem").RpcLog[]>;
        (args: {
            method: "eth_getLogs";
            params: [parameters: {
                address?: `0x${string}` | `0x${string}`[] | undefined;
                topics?: import("viem/dist/types/types/misc").LogTopic[] | undefined;
            } & ({
                fromBlock?: `0x${string}` | import("viem").BlockTag | undefined;
                toBlock?: `0x${string}` | import("viem").BlockTag | undefined;
                blockHash?: undefined;
            } | {
                fromBlock?: undefined;
                toBlock?: undefined;
                blockHash?: `0x${string}` | undefined;
            })];
        }): Promise<import("viem").RpcLog[]>;
        (args: {
            method: "eth_getStorageAt";
            params: [address: `0x${string}`, index: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_getTransactionByBlockHashAndIndex";
            params: [hash: `0x${string}`, index: `0x${string}`];
        }): Promise<import("viem").RpcTransaction | null>;
        (args: {
            method: "eth_getTransactionByBlockNumberAndIndex";
            params: [block: `0x${string}` | import("viem").BlockTag, index: `0x${string}`];
        }): Promise<import("viem").RpcTransaction | null>;
        (args: {
            method: "eth_getTransactionByHash";
            params: [hash: `0x${string}`];
        }): Promise<import("viem").RpcTransaction | null>;
        (args: {
            method: "eth_getTransactionCount";
            params: [address: `0x${string}`, block: `0x${string}` | import("viem").BlockTag | import("viem").RpcBlockIdentifier];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_getTransactionReceipt";
            params: [hash: `0x${string}`];
        }): Promise<import("viem").RpcTransactionReceipt | null>;
        (args: {
            method: "eth_getUncleByBlockHashAndIndex";
            params: [hash: `0x${string}`, index: `0x${string}`];
        }): Promise<import("viem").RpcUncle | null>;
        (args: {
            method: "eth_getUncleByBlockNumberAndIndex";
            params: [block: `0x${string}` | import("viem").BlockTag, index: `0x${string}`];
        }): Promise<import("viem").RpcUncle | null>;
        (args: {
            method: "eth_getUncleCountByBlockHash";
            params: [hash: `0x${string}`];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_getUncleCountByBlockNumber";
            params: [block: `0x${string}` | import("viem").BlockTag];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_newBlockFilter";
            params?: undefined;
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_newFilter";
            params: [filter: {
                fromBlock?: `0x${string}` | import("viem").BlockTag | undefined;
                toBlock?: `0x${string}` | import("viem").BlockTag | undefined;
                address?: `0x${string}` | `0x${string}`[] | undefined;
                topics?: import("viem/dist/types/types/misc").LogTopic[] | undefined;
            }];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_newPendingTransactionFilter";
            params?: undefined;
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_protocolVersion";
            params?: undefined;
        }): Promise<string>;
        (args: {
            method: "eth_sendRawTransaction";
            params: [signedTransaction: `0x${string}`];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_uninstallFilter";
            params: [filterId: `0x${string}`];
        }): Promise<boolean>;
    } & {
        (args: {
            method: "eth_sendTransaction";
            params: [request: import("viem").RpcTransactionRequest];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_sign";
            params: [address: `0x${string}`, data: `0x${string}`];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_signTransaction";
            params: [request: import("viem").RpcTransactionRequest];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_signTypedData_v4";
            params: [address: `0x${string}`, message: string];
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_syncing";
            params?: undefined;
        }): Promise<false | import("viem/dist/types/types/eip1193").NetworkSync>;
        (args: {
            method: "personal_sign";
            params: [data: `0x${string}`, address: `0x${string}`];
        }): Promise<`0x${string}`>;
    } & {
        (args: {
            method: "eth_accounts";
            params?: undefined;
        }): Promise<`0x${string}`[]>;
        (args: {
            method: "eth_chainId";
            params?: undefined;
        }): Promise<`0x${string}`>;
        (args: {
            method: "eth_requestAccounts";
            params?: undefined;
        }): Promise<`0x${string}`[]>;
        (args: {
            method: "wallet_requestPermissions";
            params: [permissions: {
                eth_accounts: Record<string, any>;
            }];
        }): Promise<import("viem/dist/types/types/eip1193").WalletPermission[]>;
        (args: {
            method: "wallet_getPermissions";
            params?: undefined;
        }): Promise<import("viem/dist/types/types/eip1193").WalletPermission[]>;
        (args: {
            method: "wallet_addEthereumChain";
            params: [chain: import("viem/dist/types/types/eip1193").Chain];
        }): Promise<null>;
        (args: {
            method: "wallet_switchEthereumChain";
            params: [chain: {
                chainId: string;
            }];
        }): Promise<null>;
        (args: {
            method: "wallet_watchAsset";
            params: import("viem/dist/types/types/eip1193").WatchAssetParams;
        }): Promise<boolean>;
    }>, Chain> | undefined;
};
export default defaultConfig;
