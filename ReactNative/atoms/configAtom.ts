import { atom } from "jotai";

interface IConfigAtom {
    devMesssage: string
}

export const configAtom = atom<IConfigAtom>({
    devMesssage: ''
});
