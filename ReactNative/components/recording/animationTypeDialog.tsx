import * as React from 'react';
import { Card, Dialog, Text, TouchableRipple } from 'react-native-paper';
import { StyleSheet } from 'react-native';

type LargeButtonProps = { title: string, subtitle: string, onPress?: () => any, disabled?: boolean };

const LargeButtonCard: React.FC<LargeButtonProps> = ({ title = '', subtitle = '', onPress = undefined, disabled = false }) => {
    return (
        <Card style={[styles.card, { opacity: disabled ? 0.4 : 1 }]}>
            <TouchableRipple onPress={!disabled ? onPress : undefined}>
                <Card.Title title={title} subtitle={subtitle} subtitleNumberOfLines={20} titleVariant="bodyLarge" subtitleVariant='bodySmall' />
            </TouchableRipple>
        </Card>
    );
};

export const AnimatonTypeDialog: React.FC = () => {
    const [display, setDisplay] = React.useState(true);

    return (
        <Dialog style={{ position: 'absolute', width: '90%' }} visible={display} onDismiss={() => setDisplay(false)}>
            <Dialog.Title><Text>Choose Animation Type</Text></Dialog.Title>
            <Dialog.Content style={{ justifyContent: 'space-evenly', gap: 15 }}>
                <LargeButtonCard
                    title="Single Full Body <DEFAULT>"
                    subtitle="Creates an animation from a single video. For optimal results, include only one person in the frame, who must remain visible throughout."
                    onPress={() => setDisplay(false)}
                />
                <LargeButtonCard
                    title="Face Capture"
                    subtitle="Captures facial animations. NOT SUPPORTED IN CURRENT VERSION"
                    disabled
                />
                <LargeButtonCard
                    title="Hands Capture"
                    subtitle="Focuses on hand movements. NOT SUPPORTED IN CURRENT VERSION"
                    disabled
                />
            </Dialog.Content>

        </Dialog>
    );
}

const styles = StyleSheet.create({
    card: {
        margin: 10,
        borderRadius: 8,
        display: 'flex',
    }
});
