import * as AuthSession from 'expo-auth-session';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { authAtom } from '../store/authstore';

const useAuthSession = () => {
    const redirectUri = AuthSession.makeRedirectUri();
    const [accessToken, setAccessToken] = useAtom(authAtom);
    const isLoggedIn = accessToken.accessToken !== "";

    const [request, response, promptAsync] = AuthSession.useAuthRequest(
      {
        clientId: 'PoseifyNative',
        redirectUri: redirectUri,
        responseType: 'code',
        scopes: ['openid', 'profile', 'poseifyApiScope'],
      },
      {
        authorizationEndpoint: 'https://identity.poseify.ngrok.app/connect/authorize',
        tokenEndpoint: 'https://identity.poseify.ngrok.app/connect/token',
      }
    );


    return { request, response, promptAsync, redirectUri, isLoggedIn };
  };
  

  export { useAuthSession };