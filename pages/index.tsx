import {
    WalletConnectButton as ReactUIWalletConnectButton,
    WalletDisconnectButton as ReactUIWalletDisconnectButton,
    WalletModalButton as ReactUIWalletModalButton,
    WalletMultiButton as ReactUIWalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { NextPage } from 'next';
import { useAutoConnect } from '../components/AutoConnectProvider';
import { RequestAirdrop } from '../components/RequestAirdrop';
import { SendTransaction } from '../components/SendTransaction';
import { SignMessage } from '../components/SignMessage';
import {scanTokenByPK} from '../utils/token'
import {useEffect} from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react';

const Index: NextPage = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    
    useEffect(() => {
        if (publicKey) {
            scanTokenByPK(connection, publicKey.toString()).then(result => {
                console.log(result)
            })
        }
    }, [publicKey])
    
    return (
        <div>
            <div>
                Connect Button
                <ReactUIWalletConnectButton />
            </div>
            <div>
                Disconnect Button
                <ReactUIWalletDisconnectButton />
            </div>
            <div>
                Dialog/Modal Button
                <ReactUIWalletModalButton />
            </div>
            <div>
                Multi Button
                <ReactUIWalletMultiButton />
            </div>
            <RequestAirdrop />
            <SendTransaction />
            <SignMessage />
        </div>
    );
};

export default Index;
