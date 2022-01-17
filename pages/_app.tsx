import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { SolanaContextProvider } from '../components/SolanaContextProvider';
import { EthereumProviderProvider } from "../components/EthereumContextProvider";

// Use require instead of import since order matters
require('@solana/wallet-adapter-react-ui/styles.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
    return (
        <>
            <Head>
                <title>@solana/wallet-adapter Example</title>
            </Head>
            <SolanaContextProvider>
                <EthereumProviderProvider>
                    <Component {...pageProps} />
                </EthereumProviderProvider>
            </SolanaContextProvider>
        </>
    );
};

export default App;
