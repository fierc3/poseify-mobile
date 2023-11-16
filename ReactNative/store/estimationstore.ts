// @src/store.js
import { atom } from "jotai";
import { IEstimation } from "../helpers/api.types";

interface IEstimationStore {
    estimations: IEstimation[]
}

export const estimationStore = atom<IEstimationStore>({
  estimations:[]
});
