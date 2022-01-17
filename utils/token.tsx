import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { clusterApiUrl, Connection } from "@solana/web3.js"
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const scanTokenByPK = async (connection: Connection, walletAddress: string) => {
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
        return {
            type,
            isNative, 
            mint, 
            owner, 
            state,
            amount, 
            decimals, 
            uiAmount, 
            uiAmountString
        }
    })
    return tokens
}