import Josa from 'josa-js';

export default {
  install(Vue) {
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.josa = Josa;
  },
};
