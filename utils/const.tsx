
import { clusterApiUrl } from "@solana/web3.js";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export type Cluster = "devnet" | "testnet" | "mainnet";
export const CLUSTER: Cluster = process.env.NEXT_PUBLIC_APP_CLUSTER === "mainnet"
    ? "mainnet"
    : process.env.NEXT_PUBLIC_APP_CLUSTER === "testnet"
    ? "testnet"
    : "devnet";

export const WALLET_ADAPTER_NETWORK = CLUSTER === "mainnet"
    ? WalletAdapterNetwork.Mainnet
    : CLUSTER === "testnet"
    ? WalletAdapterNetwork.Testnet
    : WalletAdapterNetwork.Devnet;

export interface SolScanner {
    network: string;
    url: string;
}

export const SolScan: SolScanner =
CLUSTER === "mainnet"
    ? {
        network: "mainnet-beta",
        url: 'https://api.solscan.io'
    }
    : CLUSTER === "testnet"
    ? {
        network: "testnet",
        url: 'https://api-testnet.solscan.io'
    }
    : {
        network: "devnet",
        url: 'https://api-devnet.solscan.io'
    };

export enum ENV {
    MainnetBeta = 101,
    Testnet = 102,
    Devnet = 103,
}

export const SOLANA_CHAIN_ID = CLUSTER === "mainnet"
    ? ENV.MainnetBeta
    : CLUSTER === "testnet"
    ? ENV.Testnet
    : ENV.Devnet;

export const SonarWatchEnpoint = "https://api.sonar.watch"