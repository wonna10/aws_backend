import axios from 'axios';
import config from '../../Config.js';
const Download = (file_id, file_name) => {
    axios({
        url: `${config.baseUrl}/u/file/download/${file_id}`,
        method: 'GET',
        responseType: 'blob',
    }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url;
        link.setAttribute('download', file_name)
        link.click();
    }).catch(error => {
        console.log(error);
    });
}

export default Download;