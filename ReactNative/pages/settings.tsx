import React, { } from 'react';
import { Appbar, Button } from 'react-native-paper';
import { useAccessToken } from '../hooks/use-access-token';
import { useEmail } from '../hooks/use-email';
import { View } from 'react-native';


export const Settings: React.FC = () => {
    console.log("|| Settings")
    const { logout } = useAccessToken();
    const { sendDevInquiry } = useEmail();

    return (
        <>
            <Appbar.Header style={{ display: 'flex', flexDirection: 'column' }}>
                <Appbar.Content title="Settings" style={{ justifyContent: 'center' }} />
            </Appbar.Header>
            <View style={{height: '100%', justifyContent: 'space-evenly'}}>
                <Button icon="logout" onPress={() => logout()}> Logout </Button>
                <Button icon="email-fast" onPress={() => sendDevInquiry()}> Send Email to Devs </Button>
            </View>
        </>
    );
};

export default Settings;