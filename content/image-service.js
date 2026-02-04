import axios from './axios';

export const ImageService = {
  getAll() {
    return axios.get('/api/images');
  },
};
