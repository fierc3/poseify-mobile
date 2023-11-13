import * as React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { IconTextButton } from '../ui/buttons/iconTextButton';
import { useNav } from '../../hooks/use-nav';
import { deleteAsync } from 'expo-file-system';

export type Props = {
    path: string
};

export const VideoViewer: React.FC<Props> = ({ path }) => {
    const { setCurrentPage } = useNav()
    const video = React.useRef(null);
    return (
        <View style={{ height: "100%", display: 'flex', flexDirection: 'column' }}>
            <Video
                ref={video}
                style={{ flexGrow: 1 }}
                source={{
                    uri: path
                }}
                resizeMode={ResizeMode.CONTAIN}
                isLooping
                shouldPlay
            />
            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' }}>
                <IconTextButton icon='delete' iconColor='blue' iconSize={30} onPress={() => (deleteAsync('file://'+path), setCurrentPage(0))} text='Abort' />
                <IconTextButton icon='cloud-upload' iconColor='blue' iconSize={30} onPress={() => console.log("xxxx")} text='Upload' />
            </View>
        </View>
    );
}