import { useEffect, useState } from 'react';
import {SonarWatchEnpoint} from '../utils/const'
import axios from 'axios';

export const useLPTokenMap = () => {
    const [farms, setFarms] = useState<Map<string, Object>>(new Map());
    const [pools, setPools] = useState<Map<string, Object>>(new Map());
    const [prices, setPrices] = useState<Map<string, Object>>(new Map());
    const [loading, setLoading] = useState<Boolean>(false);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        setLoading(true)
        axios
            .get(`${SonarWatchEnpoint}/latest`)
            .then(response => {
                const {data, status} = response
                const {farms, pools, prices} = data
                setFarms(farms)
                setPools(pools)
                setPrices(prices)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [setFarms, setPools, setPrices]);

    return {
        farms,
        pools,
        prices,
        loading,
        error
    }
}