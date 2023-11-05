import { IEstimation } from './../helpers/api.types';
// @src/store.js
import { atom } from "jotai";

interface NavAtomState {
    currentPage: number;
    selectedEstimation: IEstimation | null;
}

export const navAtom = atom<NavAtomState>({
    currentPage: 0,
    selectedEstimation: null
});
