import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAccessToken } from '../hooks/use-access-token';
import { getUser, getUserEstimations } from '../helpers/api';
import { IEstimation } from '../helpers/api.types';

export type Props = {
    userName: string;
};

const Animations: React.FC<Props> = ({
    userName,
}) => {
    const { accessToken } = useAccessToken();
    const [estimations, setEstimations] = React.useState<IEstimation[]>([]);

    useEffect(() => {
        getUserEstimations(accessToken.accessToken).then(result => setEstimations(result))
    }, [accessToken.accessToken])


    return (
        <View style={styles.container}>
            <Text>Animations Page</Text>
            <Text style={styles.greeting}>Hi, {userName}👋</Text>
            {estimations.map(e => <Text key={e.internalGuid}>{e.displayName}</Text>)}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 20,
        fontWeight: 'bold',
        margin: 16,
    },
});

export default Animations;