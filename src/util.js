import axios from 'axios';

const functions = {
  async base64(url) {
    return axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
    }).then(({ data, headers }) => {
      const mimeType = headers['content-type'].toLowerCase();
      const imgBase64 = Buffer.from(data, 'binary').toString('base64');

      return `data:${mimeType};base64,${imgBase64}`;
    });
  },
};

export default functions;
