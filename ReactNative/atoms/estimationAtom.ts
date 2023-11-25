import { atom } from "jotai";
import { IEstimation } from "../helpers/api.types";

interface IEstimationAtom {
    estimations: IEstimation[] | null
}

export const estimationAtom = atom<IEstimationAtom>({
  estimations: null
});
