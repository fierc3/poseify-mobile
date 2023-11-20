import * as React from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { useNav } from '../../../hooks/use-nav';
import { TextSpinner } from '../loading/textSpinner';

type ApiState = 'beforeApi' | 'duringApi' | 'afterApi'

export const ConfirmApiDialog:
    React.FC<{ visible: boolean, hideDialog: () => any, apiCall: (...args: any) => any, apiProps: any[], text: string, startButtonText: string, apiLoadingText: string, apiDoneText: string }> =
    ({ visible, hideDialog, apiCall, apiProps, text, startButtonText, apiLoadingText, apiDoneText }) => {
        console.log("|| ConfirmApiDialog")
        const [apiState, setApiState] = React.useState<ApiState>('beforeApi');
        const { setCurrentPage } = useNav();

        const action = async () => {
            setApiState('duringApi');
            await apiCall(...apiProps);
            setApiState('afterApi')
        }

        return (
            <Portal>
                <Dialog style={{ position: 'absolute', width: '80%', justifyContent: 'space-evenly', gap: 10 }} visible={visible} onDismiss={hideDialog}>
                    <Dialog.Title>Delete Animation</Dialog.Title>
                    {apiState === 'beforeApi' && (
                        <Dialog.Content style={{ justifyContent: 'space-evenly', gap: 15 }}>
                            <Text variant="bodyMedium">{text}</Text>
                        </Dialog.Content>
                    )}
                    {apiState === 'duringApi' && (
                        <Dialog.Content style={{ justifyContent: 'space-evenly', gap: 15 }}>
                            <TextSpinner label={apiLoadingText} />
                        </Dialog.Content>
                    )}
                    {apiState === 'afterApi' && (
                        <Dialog.Content style={{ justifyContent: 'space-evenly', gap: 15 }}>
                            <Text variant="bodyMedium">{apiDoneText}</Text>
                        </Dialog.Content>
                    )}
                    {apiState !== 'afterApi' ? (
                        <Dialog.Actions>
                            <Button onPress={hideDialog} disabled={apiState !== 'beforeApi'}>Cancel</Button>
                            <Button onPress={() => action()} disabled={apiState !== 'beforeApi'}>{startButtonText}</Button>
                        </Dialog.Actions>
                    ) : (
                        <Dialog.Actions>
                            <Button onPress={() => (setCurrentPage(0), hideDialog())}>Go to Animations</Button>
                        </Dialog.Actions>
                    )}
                </Dialog>
            </Portal>
        );
    }