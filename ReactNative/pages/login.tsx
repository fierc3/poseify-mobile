import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuthSession } from '../hooks/use-auth-session';
import { useAccessToken } from '../hooks/use-access-token';
import { TextSpinner } from '../components/ui/loading/textSpinner';

export type Props = {};

const Login: React.FC<Props> = ({
}) => {
    console.log("|| Login")
    const { promptAsync, request, redirectUri, response } = useAuthSession()
    const { retrieveAccessToken } = useAccessToken();
    const [loginInProgress, setLoginInProgress] = useState<Boolean>(false);
    const [devMessage, setDevMessage] = useState<string>("");
    const { isServerUp } = useServerCheck();

    useEffect(() => {
        console.log("Getting dev message")
        const fetchData = async () => {
            const response = await axios.get('https://amaruq.ch/wp-content/uploads/devmessage.txt');
            setDevMessage(response.data)
        }

        fetchData();
    }, [])


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

            {!loginInProgress ? (<Button

                title="Login with IdentityServer"
                onPress={async () => {
                    setLoginInProgress(true)
                    await promptAsync();
                }}
            />) : <TextSpinner label='Login in progress' />}
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