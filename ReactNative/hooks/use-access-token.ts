import * as AuthSession from 'expo-auth-session';
import { useState } from 'react';
import { exchangeCodeForToken } from '../helpers/token';
import { useAtom } from 'jotai';
import { authAtom } from '../store/authstore';
import JWT from 'expo-jwt';



const useAccessToken = () => {
    const [accessToken, setAccessToken] = useAtom(authAtom);

    const retrieveAccessToken = async (code: string, codeVerifier: string, redirectUri: string) => {
        //const accessToken = await exchangeCodeForToken(response.params.code, request.codeVerifier, redirectUri)
        const token = await exchangeCodeForToken(code, codeVerifier, redirectUri);
        setAccessToken({ accessToken: token })
    }

    return { accessToken, retrieveAccessToken };
};


export { useAccessToken };