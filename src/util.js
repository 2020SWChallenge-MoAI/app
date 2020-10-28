import axios from 'axios';

const functions = {
  async base64(url) {
    const resp = await axios({
      method: 'get',
      url,
      responseType: 'arraybuffer',
    });

    const mimeType = resp.headers['content-type'].toLowerCase();
    const imgBase64 = Buffer.from(resp.data, 'binary').toString('base64');

    return `data:${mimeType};base64,${imgBase64}`;
  },
};

export default functions;
