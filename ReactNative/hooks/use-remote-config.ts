import { useEffect } from 'react';
import axios from 'axios';
import { useAtom } from 'jotai';
import { configAtom } from '../atoms/configAtom';

export const useRemoteConfig = () => {
    const [atom, setAtom] = useAtom(configAtom)

    const getDevMessage = () => atom.devMesssage;

    useEffect(() => {
        if (atom.devMesssage.length > 0) return;

        console.log("Fetching dev message");
        const fetchData = async () => {
            try {
                const response = await axios.get("https://amaruq.ch/wp-content/uploads/devmessage.txt");
                setAtom(x => ({ ...x, devMesssage: response.data }))
            } catch (error) {
                console.warn("Error fetching dev message:", error);
                setAtom(x => ({ ...x, devMesssage: '' }))
            }
        };
        fetchData();
    }, []);

    return { getDevMessage };
};

