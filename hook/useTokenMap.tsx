import React, { useEffect, useState } from 'react';
import { TokenListProvider, TokenInfo } from '@solana/spl-token-registry';
import {SOLANA_CHAIN_ID} from '../utils/const'

export const useTokenMap = () => {
    const [tokenMap, setTokenMap] = useState<Map<string, TokenInfo>>(new Map());

    useEffect(() => {
        new TokenListProvider().resolve().then(tokens => {
            const tokenList = tokens.filterByChainId(SOLANA_CHAIN_ID).getList();
            setTokenMap(tokenList.reduce((map, item) => {
                map.set(item.address, item);
                return map;
            },new Map()));
        });
    }, [setTokenMap]);

    return tokenMap
}