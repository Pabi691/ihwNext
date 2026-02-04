import axios from 'axios';
import { useAuth } from './AuthContext';

export const useApi = () => {
  const { getToken } = useAuth();

  const fetchWithToken = async (url, options = {}) => {
    const token = getToken();
    return axios({
      ...options,
      url,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return { fetchWithToken };
};
