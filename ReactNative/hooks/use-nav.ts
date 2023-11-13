import { IEstimation } from './../helpers/api.types';
import * as AuthSession from 'expo-auth-session';
import { useAtom } from 'jotai';
import { navAtom } from '../store/navstore';

const useNav = () => {
    const [nav, setNav] = useAtom(navAtom);

    const getCurrentPage = () => {
        return nav.currentPage;
    }

    const getEstimation = () => {
        return nav.selectedEstimation;
    }

    const setEstimation = (estimation: IEstimation | null) => {
        setNav(x => ({...x, selectedEstimation: estimation}))
    }

    const setCurrentPage = (page: number) => {
        setNav(x => ({...x, currentPage: page}))
    }

    return { getCurrentPage, getEstimation, setEstimation, setCurrentPage };
  };
  

  export { useNav };