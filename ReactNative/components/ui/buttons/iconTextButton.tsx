import * as React from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { IconButton } from 'react-native-paper';

export type Props = {
    onPress: () => void,
    iconColor: string,
    icon: string,
    text: string,
    containerStyle?: StyleProp<ViewStyle> | undefined,
    iconSize: number
};

export const IconTextButton: React.FC<Props> = ({ onPress, icon, iconColor, text, containerStyle, iconSize }) => {
    return (
        <View style={containerStyle ?? { alignItems: 'center' }}>
            <IconButton
                icon={icon}
                iconColor={iconColor}
                size={iconSize}
                onPress={onPress} />
            <Text style={{ color: iconColor }}>{text}</Text>
        </View>
    );
}