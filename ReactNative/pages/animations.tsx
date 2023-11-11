import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAccessToken } from '../hooks/use-access-token';
import { getUserEstimations } from '../helpers/api';
import { IEstimation } from '../helpers/api.types';
import { useNav } from '../hooks/use-nav';
import useInterval from '../hooks/use-interval';

export type Props = {
    userName: string;
};

const Animations: React.FC<Props> = ({
    userName,
}) => {
    const { accessToken } = useAccessToken();
    const { setEstimation } = useNav();
    const [estimations, setEstimations] = useState<IEstimation[]>([]);

    const refreshTimer = 10000;
    useInterval(() => getUserEstimations(accessToken.accessToken).then(result => (console.log(`Updated after ${refreshTimer} seconds` ), setEstimations(result))), 10000)


    useEffect(() => {
        getUserEstimations(accessToken.accessToken).then(result => setEstimations(result))
    }, [accessToken.accessToken])

    return (
        <View style={styles.container}>
            <>
                <Text>Animations Page</Text>
                <Text style={styles.greeting}>Hi, {userName}👋</Text>
                {estimations.map(e =>
                    <TouchableOpacity key={e.internalGuid} onPress={() => setEstimation(e)}>
                        <Text>{e.displayName}</Text>
                    </TouchableOpacity>
                )}
            </>

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