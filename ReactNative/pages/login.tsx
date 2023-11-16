import React, { useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuthSession } from '../hooks/use-auth-session';
import { useAccessToken } from '../hooks/use-access-token';

export type Props = {};

const Login: React.FC<Props> = ({
}) => {
    console.log("|| Login")
    const { isLoggedIn, promptAsync, request, redirectUri, response } = useAuthSession()
    const { retrieveAccessToken, accessToken } = useAccessToken();

    useEffect(() => {
        if (response == null) {
            return;
        }
        const latestResponse = response as unknown as { params: { code: string } };
        const latestRequest = request as unknown as { codeVerifier: string };

        retrieveAccessToken(latestResponse.params.code, latestRequest.codeVerifier, redirectUri)
    }, [response])

    return (
        <View style={styles.container}>
            <Text>Login Page</Text>

            {!isLoggedIn && (<Button

                title="Login with IdentityServer"
                onPress={async () => {
                    const res = await promptAsync();
                }}
            />)}
            <Text>{accessToken.accessToken + ""}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default Login;