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
import Link from 'next/link'

const Index: NextPage = () => {
    const { autoConnect, setAutoConnect } = useAutoConnect();

    return (
        <div className='flex flex-col space-y-4 justify-start items-start'>
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
            <Link href='/solana'>Solana</Link>
            <Link href='/wormhole'>Wormhole</Link>
            <Link href='/test'>Test Pyth price</Link>
        </div>
    );
};

export default Index;
