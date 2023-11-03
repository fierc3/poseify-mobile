import axios from 'axios';

async function exchangeCodeForToken(code: string, verifier: string, redirectUri: string) {
    try {
      const data = new URLSearchParams({
        code: code,
        client_id: 'PoseifyNative',
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        scope: ["openid", "profile", "poseifyApiScope"] as any,
        client_secret: "hehe",
        code_verifier: verifier
      });

      const response = await axios.post('https://identity.poseify.ngrok.app/connect/token', data.toString(), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      }).catch(e => console.error("ex", JSON.stringify(e)));;
  
      if(!response || !response.data){
        var noDataError = new Error("Data is missing")
        console.error(noDataError);
        throw noDataError;
      }

      return response.data.access_token;
  
    } catch (error) {
      console.error("Error exchanging code for token:", error);
      throw error;
    }
  }
  
export { exchangeCodeForToken };