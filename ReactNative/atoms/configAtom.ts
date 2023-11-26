import { atom } from "jotai";

interface IConfigAtom {
    devMesssage: string,
    parallelProcesses: number
}

export const configAtom = atom<IConfigAtom>({
    devMesssage: '',
    parallelProcesses: 1
});
