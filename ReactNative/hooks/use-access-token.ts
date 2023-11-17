import { exchangeCodeForToken } from '../helpers/token';
import { useAtom } from 'jotai';
import { authAtom } from '../store/authstore';
import { useNav } from './use-nav';



const useAccessToken = () => {
    const [accessToken, setAccessToken] = useAtom(authAtom);
    const {setCurrentPage} = useNav();

    const retrieveAccessToken = async (code: string, codeVerifier: string, redirectUri: string) => {
        //const accessToken = await exchangeCodeForToken(response.params.code, request.codeVerifier, redirectUri)
        const token = await exchangeCodeForToken(code, codeVerifier, redirectUri);
        setAccessToken({ accessToken: token })
    }

    const logout = () => (setAccessToken({accessToken: ''}), setCurrentPage(0));

    return { accessToken, retrieveAccessToken, logout };
};


export { useAccessToken };