import { AsyncStorage } from 'react-native'
import axios from 'axios';

// baseURL: 'http://172.17.165.53:8040',
// baseURL: 'http://10.0.0.116:8040',

const api = axios.create({
  baseURL: 'https://api.userede.com.br/',  
});


api.interceptors.request.use(async (config) => {
  try{
    const token = "MTAwMDQ2MTE6ZmE0NWYyMDI1MzFiNDU0NGFkN2UxMTQyZjlhYWMyMmQ="

    if(token){
      config.headers.Authorization = `BASIC ${token}`;
    }
    return config
  }catch (err){
    alert(err);
  }
})

export default api;