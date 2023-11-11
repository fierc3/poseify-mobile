import axios from 'axios';
import { IEstimation, AttachmentType } from './api.types';

const apiCall = async (url: string , token: string) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF': '1'
        },
      }).catch(e => console.error("ex", JSON.stringify(e)));;
  
      if(!response){
        var noDataError = new Error("Data is missing")
        console.error(noDataError);
        throw noDataError;
      }

      return response.data;
    } catch (error) {
      console.error("Error making authenticated API call:", error);
    }
  };

const getUserEstimations = async (token: string): Promise<IEstimation[]> => apiCall("https://poseify.ngrok.app/api/GetUserEstimations", token);
const getUser = async(token: string): Promise<any> => apiCall("https://poseify.ngrok.app/bff/user", token);
const getBvh = async(estimation: IEstimation, token: string): Promise<string> => {
  const url = `https://poseify.ngrok.app/api/GetAttachment?estimationId=${estimation.internalGuid}&attachmentType=${AttachmentType.Bvh}`
  const response = await apiCall(url, token);
  //console.log("response", response)
  return response;
}

export {getUserEstimations, getUser, getBvh}