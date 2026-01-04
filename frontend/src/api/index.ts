import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    const { data } = response;
    if (data.code === 0) {
      return data.data;
    } else {
      return Promise.reject(new Error(data.message || '请求失败'));
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

