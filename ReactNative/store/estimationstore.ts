// @src/store.js
import { atom } from "jotai";
import { IEstimation } from "../helpers/api.types";

interface IEstimationStore {
    estimations: IEstimation[] | null
}

export const estimationStore = atom<IEstimationStore>({
  estimations: null
});
