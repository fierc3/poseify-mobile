import { atom } from "jotai";

interface IConfigAtom {
    devMesssage: string,
    parallelProcesses: number,
    supportedVersion: number[]
}

export const configAtom = atom<IConfigAtom>({
    devMesssage: '',
    parallelProcesses: 1,
    supportedVersion: [0.0]
});
