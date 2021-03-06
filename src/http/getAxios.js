import axios from 'axios'
import qs from 'qs'

// 全局配置
axios.defaults.headers.post['Content-Type']= 'application/x-www-form-urlencoded';
axios.defaults.baseURL = 'http://118.25.178.83:9999';
axios.defaults.withCredentials = true;
/*
axios.interceptors.response.use(function (response) {
	if(response.data.status == 500 && response.data.message == '尚未登录，请登录!'){
		//获取根vue实例，然后进行跳转
    window.vm.currentComponent = 'Login';
	}
  return response;
});
*/

export default function(flag){
  let instance = axios.create();
  instance.interceptors.request.use((config) => {
      if (config.method === 'post') {
        if(flag && flag == 'array'){
          config.data = qs.stringify(config.data,{allowDots:true});
        } else {
          config.data = qs.stringify(config.data,{arrayFormat: 'repeat' });
        }
      }
      return config;
  }, (error) => {
      return Promise.reject(error);
  });
  return instance
};