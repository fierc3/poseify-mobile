import { IEstimation } from './../helpers/api.types';
import { useAtom } from 'jotai';
import { navAtom } from '../atoms/navAtom';

const useNav = () => {
    const [nav, setNav] = useAtom(navAtom);

    const getCurrentPage = () => {
        return nav.currentPage;
    }

    const getEstimation = () => {
        return nav.selectedEstimation;
    }

    const setEstimation = (estimation: IEstimation | null) => {
        setNav(x => ({ ...x, selectedEstimation: estimation }))
    }

    const setCurrentPage = (page: number) => {
        setNav(x => ({ ...x, currentPage: page }))
    }

    return { getCurrentPage, getEstimation, setEstimation, setCurrentPage };
};


export { useNav };