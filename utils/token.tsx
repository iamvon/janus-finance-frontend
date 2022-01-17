import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { clusterApiUrl, Connection } from "@solana/web3.js"
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import {SOLANA_CHAIN_ID} from '../utils/const'

export const getTokenMap = async () => {
    return new TokenListProvider().resolve().then(tokens => {
        const tokenList = tokens.filterByChainId(SOLANA_CHAIN_ID).getList();
        const tokenMaps = tokenList.reduce((map, item) => {
            map.set(item.address, item);
            return map;
        },new Map());
        return tokenMaps
    });
}


export const scanTokenByPK = async (connection: Connection, walletAddress: string) => {
    const tokenMap = await getTokenMap()
    const accounts = await connection.getParsedProgramAccounts(
        TOKEN_PROGRAM_ID,
        {
            filters: [
                {
                dataSize: 165, // number of bytes
                },
                {
                    memcmp: {
                        offset: 32, // number of bytes
                        bytes: walletAddress, // base58 encoded string
                    },
                },
            ],
        }
    );
    const tokens = accounts.map(({account}) => {
        const {parsed, program} = account.data
        const {info, type} = parsed
        const {tokenAmount, isNative, mint, owner, state} = info
        const {amount, decimals, uiAmount, uiAmountString} = tokenAmount
        const token = tokenMap.get(mint);
        return {
            type,
            isNative, 
            mint, 
            owner, 
            state,
            amount, 
            decimals, 
            uiAmount, 
            uiAmountString,
            token
        }
    })
    return tokens
}