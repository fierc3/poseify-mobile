import React, { } from 'react';
import { Appbar, Button } from 'react-native-paper';
import { useAccessToken } from '../hooks/use-access-token';


export const Settings: React.FC = () => {
    console.log("|| Settings")
    const { logout } = useAccessToken();

    return (
        <>
            <Appbar.Header style={{ display: 'flex', flexDirection: 'column' }}>
                <Appbar.Content title="Settings" style={{ justifyContent: 'center' }} />
            </Appbar.Header>
            <Button icon="logout" onPress={() => logout()}> Logout </Button>
        </>
    );
};

export default Settings;