import axios from "axios";
import { getItem, KEY_ACCESS_TOKEN, removeItem, setItem } from "./localStorageManager";


export const axiosClient=axios.create({
    baseURL: process.env.REACT_APP_SERVER_BASE_URL,
    withCredentials: true
});


axiosClient.interceptors.request.use(
    (request)=>{
        const accessToken=getItem(KEY_ACCESS_TOKEN);
       
        request.headers['Authorization']=`Bearer ${accessToken}`;

        return request
    }
);

axiosClient.interceptors.response.use(
    async (response)=>{
        const data=response.data;
        if(data.status==='Ok'){
            return data;
        }
        
        const originalRequest=response.config;
        const statusCode=data.statusCode;
        const error=data.error;
        
        //When refresh token expires, send user to login page
        if(statusCode===401 && originalRequest.url===`${REACT_APP_SERVER_BASE_URL}/auth/refresh`){
               removeItem(KEY_ACCESS_TOKEN);
               window.location.replace('/login', '_self');

               return Promise.reject(error);
        }

         // means the access token has expired
        if (statusCode === 401 && !originalRequest._retry) {
           
            originalRequest._retry = true;
    
            const response = await axios
                .create({
                    withCredentials: true,
                })
                .get(`${REACT_APP_SERVER_BASE_URL}/auth/refresh`);
            
            
            if(response.status==="Ok"){
                setItem(KEY_ACCESS_TOKEN, response.result.accessToken);
                originalRequest.headers['Authorization']=`Bearer ${response.result.accessToken}`;

                return axios(originalRequest);
            }

            return Promise.reject(error);
        }
    }
);