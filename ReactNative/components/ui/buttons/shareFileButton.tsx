import * as React from 'react';
import { AttachmentType } from '../../../helpers/api.types';
import * as Sharing from 'expo-sharing';
import { downloadAndStoreAttachment } from '../../../helpers/api';
import { useAccessToken } from '../../../hooks/use-access-token';
import { useState } from 'react';
import { IconTextButton } from './iconTextButton';
import { shareFileButtonProps } from './buttons.types';

enum LoadState {
    Loading,
    Loaded,
    Failed,
    NotStarted
}

export const ShareFileButton: React.FC<shareFileButtonProps> = ({ onShareFinished, icon, iconColor, text, containerStyle, iconSize, estimation, attachmentType }) => {

    const { accessToken } = useAccessToken();
    const [loadState, setLoadState] = useState<LoadState>(LoadState.NotStarted);

    const shareFile = async (filePath: string) => {

        if (!(await Sharing.isAvailableAsync())) {
            console.warn("Can't share, not available")
            return;
        }

        await Sharing.shareAsync(filePath);

        if (onShareFinished) {
            onShareFinished();
        }

    };

    const handleDownloadAndShare = async (attachmentType: AttachmentType) => {
        try {
            setLoadState(LoadState.Loading)
            const filePath = await downloadAndStoreAttachment(accessToken.accessToken, estimation.internalGuid, estimation.displayName, attachmentType);
            if (filePath) {
                await shareFile(filePath);
            }
            setLoadState(LoadState.Loaded)
        } catch (error) {
            setLoadState(LoadState.Failed)
            console.error("Error sharing file:", error);
        }
    };

    return (
        <IconTextButton
            icon={icon ?? 'share'}
            iconColor={iconColor}
            iconSize={iconSize}
            disabled={loadState === LoadState.Loading}
            onPress={() => handleDownloadAndShare(attachmentType)} text={text} />
    );
}