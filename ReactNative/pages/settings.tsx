import React, { } from 'react';
import { Appbar, Button } from 'react-native-paper';
import { useAccessToken } from '../hooks/use-access-token';
import { useEmail } from '../hooks/use-email';
import { View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';


export const Settings: React.FC = () => {
    console.log("|| Settings")
    const { logout } = useAccessToken();
    const { sendDevInquiry } = useEmail();

    return (
        <>
            <Appbar.Header style={{ display: 'flex', flexDirection: 'column' }}>
                <Appbar.Content title="Settings" style={{ justifyContent: 'center' }} />
            </Appbar.Header>
            <View style={{ height: '100%', justifyContent: 'space-evenly' }}>
                <Button icon="help-circle-outline" onPress={() => WebBrowser.openBrowserAsync('https://github.com/fierc3/poseify/wiki/Poseify-Mobile-%E2%80%90-Quickstart')}> View Quickstart Guide </Button>
                <Button icon="email-fast" onPress={() => sendDevInquiry()}> Send Email to Devs </Button>
                <Button icon="logout" onPress={() => logout()}> Logout </Button>
            </View>
        </>
    );
};

export default Settings;