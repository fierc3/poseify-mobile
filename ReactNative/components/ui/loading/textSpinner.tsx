import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';


type Props = {
    label: string
}

export const TextSpinner: React.FC<Props> = ({ label }) => {
    return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text variant='labelSmall' style={styles.label}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    label: {
        marginTop: 10,
    },
});