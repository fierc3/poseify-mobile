import { IEstimation } from '../helpers/api.types';
import { atom } from "jotai";

interface INavAtomState {
    currentPage: number;
    selectedEstimation: IEstimation | null;
}

export const navAtom = atom<INavAtomState>({
    currentPage: 0,
    selectedEstimation: null
});
