import * as React from 'react';
import { View, Text } from 'react-native';
import { IconButton } from 'react-native-paper';
import { iconButtonProps } from './buttons.types';

export const IconTextButton: React.FC<iconButtonProps> = ({ onPress, icon, iconColor, text, containerStyle, iconSize, disabled = false }) => {
    return (
        <View style={containerStyle ?? { alignItems: 'center' }}>
            <IconButton
                icon={icon ?? 'alien'} // oh no 👽
                iconColor={iconColor}
                size={iconSize ?? 20}
                disabled={disabled}
                onPress={onPress} />
            <Text style={{ color: iconColor }}>{text}</Text>
        </View>
    );
}