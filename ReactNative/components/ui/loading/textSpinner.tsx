import * as React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';


type Props = {
    label: string
    styleContainer?: StyleProp<ViewStyle>
}

export const TextSpinner: React.FC<Props> = ({ label, styleContainer }) => {
    return (
        <View style={[styles.loadingContainer, styleContainer]}>
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