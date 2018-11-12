import axios from 'axios';
import {Message} from 'iview';

// create an axios instance
const service = axios.create({
  baseURL: '/api/order', // api的base_url
  timeout: 60000 // request timeout
});

// respone interceptor
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error); // for debug
    Message.error({
      content: error.message,
      duration: 3
    });
    return Promise.reject(error);
  });

function downLoad (blob, fileName) {
  if ('download' in document.createElement('a')) { // 非IE下载
    const elink = document.createElement('a');

    elink.download = fileName;
    elink.style.display = 'none';
    elink.href = URL.createObjectURL(blob);
    document.body.appendChild(elink);
    elink.click();
    URL.revokeObjectURL(elink.href); // 释放URL 对象
    document.body.removeChild(elink);
  } else { // IE10+下载
    navigator.msSaveBlob(blob, fileName);
  }
}

export const exportTableListDemo = params => {
  return service.post('/export/exportTableListDemo', params, {responseType: 'arraybuffer'}).then((res) => {
    let fileName = decodeURI(res.headers.filename || 'export');
    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'});

    downLoad(blob, fileName);
  });
};

let api = {
  exportTableListDemo
};

export default api;
