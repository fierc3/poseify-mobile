import axios from 'axios';
import * as FileSystem from 'expo-file-system';

export type uploadResult = {
    success: boolean;
    message: string;
}

export const uploadFile = async (token: string, fileUri: string, estimationName: string, tags: string[]): Promise<uploadResult> => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(fileUri);
        const formData = new FormData();

        // Append the file for uploading
        formData.append("FormFile", {
            uri: fileInfo.uri,
            type: 'image/jpeg', // or the correct file type
            name: 'photo.jpg', // or the correct file name
        });

        formData.append("EstimationName", estimationName);
        formData.append("Tags", tags.join(","));

        // Execute the upload
        const res = await axios.post<{ url: string }>(
            `https://poseify.ngrok.app/api/PostUpload`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Access-Control-Allow-Origin": "*",
                    'X-CSRF': '1',
                    'Content-Type': 'multipart/form-data', // This is important for FormData
                },
            },
        );

        console.log("res", res)
        if (res.status === 200) {
            return { success: true, message: '' };
        }

        return { success: false, message: res.statusText };

    } catch (error) {
        return { success: false, message: (error as any).message ?? '' };
    }
};
