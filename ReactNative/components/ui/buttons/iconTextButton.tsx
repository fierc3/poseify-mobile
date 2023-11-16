import * as React from 'react';
import { View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { iconButtonProps } from './buttons.types';

export const IconTextButton: React.FC<iconButtonProps> = ({ onPress, icon, iconColor, text, containerStyle, iconSize, disabled = false }) => {
    return (
        <View style={containerStyle ?? { alignItems: 'center' }}>
            <IconButton
                icon={icon ?? 'alien'} // oh no 👽
                iconColor={iconColor}
                size={iconSize ?? 30}
                disabled={disabled}
                onPress={onPress} />
            <Text variant='bodyMedium' style={{ color: iconColor }}>{text}</Text>
        </View>
    );
}