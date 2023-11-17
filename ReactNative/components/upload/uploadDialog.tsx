import * as React from 'react';
import { Button, Chip, Dialog, Icon, Text, TextInput } from 'react-native-paper';
import { uploadFile, uploadResult } from '../../helpers/upload';
import { useAccessToken } from '../../hooks/use-access-token';
import { TextSpinner } from '../ui/loading/textSpinner';
import { useNav } from '../../hooks/use-nav';
import { DefaultTags, Tag } from '../../helpers/tags';


const Result: React.FC<uploadResult> = ({ message, success }) => {

    return (
        <Dialog.Content style={{ flexDirection: 'column', alignItems: 'center' }}>
            <Icon size={30} source={success ? 'cloud-upload' : 'exclamation-thick'} color={success ? '#36978D' : '#DF6E49'} />
            <Text variant='bodyMedium'>{success ? 'Upload done! Animation will be ready soon under ANIMATIONS' : `Sadly failed to upload! ${message}`}</Text>
        </Dialog.Content>
    )
}


type UploadState = 'beforeUpload' | 'duringUpload' | 'failedUpload' | 'successfulUpload'

export const UploadDialog: React.FC<{ visible: boolean, hideDialog: () => any, fileUri: string }> = ({ visible, hideDialog, fileUri }) => {
    const { accessToken } = useAccessToken();
    const { setCurrentPage } = useNav();
    const [animationName, setAnimationName] = React.useState("");
    const [uploadState, setUploadState] = React.useState<UploadState>('beforeUpload');
    const [uploadResult, setUploadResult] = React.useState<uploadResult | null>(null);
    const [categories, setCategories] = React.useState<string[]>([]);
    
    const toggleSelection = (tag: Tag) => {
        if (categories.find(cat => cat === tag.value) !== undefined) {
            setCategories(categories.filter(cat => cat !== tag.value))
        } else {
            setCategories([...categories, tag.value])
        }
    }

    const upload = async () => {
        setUploadState('duringUpload')
        const result = await uploadFile(accessToken.accessToken, fileUri, animationName, categories)
        setUploadResult(result);
        if (result.success) {
            setUploadState('successfulUpload');
        } else {
            setUploadState('failedUpload')
        }
    }

    return (
        <Dialog style={{ position: 'absolute', width: '80%', justifyContent: 'space-evenly', gap: 10 }} visible={visible} onDismiss={hideDialog}>
            <Dialog.Title>Upload Video</Dialog.Title>
            {uploadState === 'beforeUpload' && (<Dialog.Content style={{ justifyContent: 'space-evenly', gap: 15 }}>
                <Text variant="bodyMedium">Enter name and category to start uploading.</Text>
                <Text variant="labelMedium">Animation Name</Text>
                <TextInput
                    label="Ex: My first run"
                    value={animationName}
                    onChangeText={text => setAnimationName(text)}
                />
                <Text variant="labelMedium">Categories</Text>
                {DefaultTags.map((tag, i) => <Chip textStyle={{ fontSize: 10 }} showSelectedOverlay selected={categories.find(cat => cat === tag.value) !== undefined} key={i} icon={tag.icon} onPress={() => toggleSelection(tag)}>{tag.label}</Chip>)}
            </Dialog.Content>
            )}
            {uploadState === 'duringUpload' && (<TextSpinner label='Uploading video! Do not leave this page' />)}
            {uploadResult && (<Result message={uploadResult.message} success={uploadResult.success} />)}

            {uploadResult ? (
                <Dialog.Actions>
                    <Button onPress={() => setCurrentPage(0)}>Go To Animations</Button>
                </Dialog.Actions>) :
                <Dialog.Actions>
                    <Button onPress={hideDialog} disabled={uploadState !== 'beforeUpload'}>Cancel</Button>
                    <Button onPress={() => upload()} disabled={animationName.length === 0 || uploadState !== 'beforeUpload'}>Start Upload</Button>
                </Dialog.Actions>}
        </Dialog>
    );
}