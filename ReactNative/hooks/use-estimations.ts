import { IEstimation } from './../helpers/api.types';
import { useAtom } from 'jotai';
import { estimationStore } from '../store/estimationstore';

const useEstimations = () => {
    const [store, setStore] = useAtom(estimationStore);

    const getEstimations = () => {
        return store.estimations;
    }

    const setEstimations = (input: IEstimation[]) => {
        setStore(x => ({ ...x, estimations: input }))
    }

    return { getEstimations, setEstimations };
};


export { useEstimations };