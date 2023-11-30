import { useEffect } from 'react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { configAtom } from '../atoms/configAtom';

export const useRemoteConfig = () => {
    const [atom, setAtom] = useAtom(configAtom)

    const getDevMessage = () => atom.devMesssage;
    const getParallelProcessingLimit = () => atom.parallelProcesses;
    const getSupportedVersion = () => atom.supportedVersion;

    useEffect(() => {
        if (atom.devMesssage.length > 0) return;

        console.log("Fetching remote configs");
        const fetchData = async () => {
            try {
                const configResponse = await axios.get("https://amaruq.ch/wp-content/uploads/config.json", {
                    headers: { 'Cache-Control': 'no-cache' }
                });
                setAtom(x => ({ ...x, 
                    devMesssage: configResponse.data.DevMessage, 
                    parallelProcesses: configResponse.data.ParallelProcesses ?? 1,
                    supportedVersion: configResponse.data.SupportedVersion ?? 0.0,
                 }))
            } catch (error) {
                console.warn("Error fetching dev message:", error);
                setAtom(x => ({ ...x, devMesssage: '' }))
            }
        };
        fetchData();
    }, []);

    return { getDevMessage, getParallelProcessingLimit, getSupportedVersion };
};

