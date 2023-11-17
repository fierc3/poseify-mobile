import * as React from 'react';
import { View } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { IconTextButton } from '../ui/buttons/iconTextButton';
import { useNav } from '../../hooks/use-nav';
import { deleteAsync } from 'expo-file-system';
import { UploadDialog } from '../upload/uploadDialog';
import { useState } from 'react';

export type Props = {
    path: string
};

export const VideoViewer: React.FC<Props> = ({ path }) => {
    const { setCurrentPage } = useNav()
    const [dialogVisiblity, setDialogVisiblity] = useState<boolean>( false);

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
                <IconTextButton icon='alpha-x' iconSize={30} onPress={() => (deleteAsync('file://'+path), setCurrentPage(0))} text='Abort' />
                <IconTextButton icon='cloud-upload' iconSize={30} onPress={() => setDialogVisiblity(true)} text='Upload' />
            </View>
            <UploadDialog fileUri={'file://'+path} visible={dialogVisiblity} hideDialog={() => setDialogVisiblity(false)} />
        </View>
    );
}