import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useAuthSession } from '../hooks/use-auth-session';
import { useAccessToken } from '../hooks/use-access-token';
import { TextSpinner } from '../components/ui/loading/textSpinner';
import axios from 'axios';
import { Button, Text } from 'react-native-paper';
import logo from '../assets/logo.png';
import { useServerCheck } from '../hooks/use-server-check';
import { Video, ResizeMode } from 'expo-av';
import introVideo from '../assets/intro.mp4'
import { BlurView } from 'expo-blur';
import useInterval from '../hooks/use-interval';



export type Props = {};

const Login: React.FC<Props> = ({
}) => {
    console.log("|| Login")
    const { promptAsync, request, redirectUri, response } = useAuthSession()
    const { retrieveAccessToken } = useAccessToken();
    const [loginInProgress, setLoginInProgress] = useState<Boolean>(false);
    const [devMessage, setDevMessage] = useState<string>("");
    const { isServerUp, checkServer } = useServerCheck();

    // check if server is online every few seconds
    useInterval(checkServer, 10000);

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


    const Login = () => {
        return <>
            <Button
                icon="login"
                mode="contained"
                onPress={async () => {
                    setLoginInProgress(true)
                    await promptAsync();
                }}
                disabled={isServerUp !== 'Online'}
            >
                Login with Poseify IdentityServer
            </Button>
            {isServerUp === 'Unknown' && (<Text>Checking Server Status...</Text>)}
            {isServerUp === 'Offline' && (<Text>Server is currently offline</Text>)}
        </>
    }

    return (
        <View style={styles.container}>
            <BlurView
                style={styles.absolute}
                tint="light" // or 'dark'
                intensity={50} // Adjust the intensity of the blur
            />
            <Video
                style={styles.video}
                source={introVideo}
                resizeMode={ResizeMode.COVER}
                isLooping
                shouldPlay
                isMuted
            />
            <Image source={logo}
                style={{ left: 0, right: 0, flexShrink: 1, maxWidth: '90%' }}
                resizeMode="contain" />
            <Text variant='labelLarge'>{devMessage}</Text>

            {!loginInProgress ? (<Login />) : <TextSpinner label='Login in progress' />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 40,
        width: '100%',
        backgroundColor: 'white'
    },
    video: {
        position: 'absolute',
        height: '100%', // You can adjust this value
        width: '100%',
        backgroundColor: 'white',
        top: 0,
        left: 0,
        zIndex: -1
    },
    absolute: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: 0
    },
});

export default Login;