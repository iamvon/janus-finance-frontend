import { Cluster, clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { PythConnection } from '../pyth/PythConnection'
import { getPythProgramKeyForCluster } from '../pyth/cluster'
import React, { useEffect, useState } from 'react';

function Test(props) {
    const [data, setData] = useState("")
    const [priceObj, setPriceObj] = useState({})

    useEffect(() => {
        const SOLANA_CLUSTER_NAME = 'devnet'
        const connection = new Connection(clusterApiUrl(SOLANA_CLUSTER_NAME))
        const pythPublicKey = getPythProgramKeyForCluster(SOLANA_CLUSTER_NAME)
        const pythConnection = new PythConnection(connection, pythPublicKey)
        let newPrice = {}
        pythConnection.onPriceChange((product, price) => {
        // sample output:
        // SRM/USD: $8.68725 ±$0.0131
            if (price.price && price.confidence) {
                // tslint:disable-next-line:no-console
                // console.log(`${product.symbol}: $${price.price} \xB1$${price.confidence}`)
                // setData(`${product.symbol}: $${price.price} \xB1$${price.confidence}`)
                // console.log(JSON.stringify(product))
                newPrice[product.symbol] = price.price
                // console.log(Object.keys(newPrice).length)
                handleUpdateData(newPrice)
            } else {
                // tslint:disable-next-line:no-console
                // console.log(`${product.symbol}: price currently unavailable`)
            }
        })

        // tslint:disable-next-line:no-console
        console.log('Reading from Pyth price feed...')
        pythConnection.start()
    }, [])

    const handleUpdateData = (newData) => {
        setPriceObj({...newData})
    }

    return (
        <div className='flex flex-col'>
            {/* <span>{data}</span> */}
            {
                Object.keys(priceObj).map((k, index) => {
                    return <span>{index} {k}: {priceObj[k]}</span>
                })
            }
            {/* <span>{Object.keys(priceObj).length}</span> */}
            
        </div>
    );
}

export default Test;