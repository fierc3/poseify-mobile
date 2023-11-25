import { IEstimation } from './../helpers/api.types';
import { useAtom } from 'jotai';
import { estimationAtom } from '../atoms/estimationAtom';

const useEstimations = () => {
    const [atom, setAtom] = useAtom(estimationAtom);

    const getEstimations = () => {
        return atom.estimations;
    }

    const setEstimations = (input: IEstimation[]) => {
        setAtom(x => ({ ...x, estimations: input }))
    }

    return { getEstimations, setEstimations };
};


export { useEstimations };