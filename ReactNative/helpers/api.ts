import axios, { AxiosError, AxiosResponse } from 'axios';
import { IEstimation, AttachmentType, ServerStatus } from './api.types';
import * as FileSystem from 'expo-file-system';

const apiCall = async (url: string, token: string) => {
  console.log("API: " + url);
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-CSRF': '1'
      },
    }).catch(e => console.error("ex", JSON.stringify(e)));;

    if (!response) {
      var noDataError = new Error("Data is missing")
      console.error(noDataError);
      throw noDataError;
    }

    return response.data;
  } catch (error) {
    console.error("Error making authenticated API call:", error);
  }
};

const checkFileExists = async (filePath: string) => {
  try {
    const fileInfo = await FileSystem.getInfoAsync(filePath);
    return fileInfo.exists;
  } catch (error) {
    console.error("Error checking file existence:", error);
    return false;
  }
};

const downloadAndStoreAttachment = async (token: string, estimationGuid: string, name: string, attachmentType: AttachmentType) => {
  try {

    const response = await axios.get(`https://poseify.ngrok.app/api/GetAttachment?estimationId=${estimationGuid}&attachmentType=${attachmentType}`,
      {
        responseType: 'arraybuffer',
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF': '1'
        }
      })
    const fileEnding = attachmentType === AttachmentType.TBvh ? 't.bvh'
      : attachmentType === AttachmentType.TFbx ? 't.fbx'
        : attachmentType.toLocaleLowerCase()
    const filePath = `${FileSystem.documentDirectory}${name.substring(0, 8)}_${estimationGuid.substring(0, 5)}.${fileEnding}`;

    if (!(await checkFileExists(filePath))) {
      // if the file isn't downloaded yet then we should download it
      console.log("Downloading Attachment", estimationGuid)
      await FileSystem.writeAsStringAsync(filePath, response.request._response, {
        encoding: FileSystem.EncodingType.Base64
      });
    }

    return filePath;
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}

const getUserEstimations = async (token: string): Promise<IEstimation[]> => apiCall("https://poseify.ngrok.app/api/GetUserEstimations", token);
const getUser = async (token: string): Promise<any> => apiCall("https://poseify.ngrok.app/bff/user", token);
const getBvh = async (estimation: IEstimation, token: string): Promise<string> => {
  const url = `https://poseify.ngrok.app/api/GetAttachment?estimationId=${estimation.internalGuid}&attachmentType=${AttachmentType.Bvh}`
  const response = await apiCall(url, token);
  //console.log("response", response)
  return response;
}
const deleteAnimation = async (token: string, animationGuid: string): Promise<AxiosResponse> => {
  console.log(token)
  console.log(animationGuid)
  return axios.delete(`https://poseify.ngrok.app/api/DeleteEstimation?estimationId=${animationGuid}`,
    {
      headers:
      {
        Authorization: `Bearer ${token}`,
        'X-CSRF': '1'
      }
    })
}

const isServerUp = async (): Promise<ServerStatus> => {
  try {
    await axios.get(`https://poseify.ngrok.app/bff/user`);
  } catch (error) {
    const axiosError = error as AxiosError
    return axiosError.response?.status === 401 ? 'Online' : 'Offline'
  }
  return 'Online';
}


export { getUserEstimations, getUser, getBvh, downloadAndStoreAttachment, deleteAnimation, isServerUp }