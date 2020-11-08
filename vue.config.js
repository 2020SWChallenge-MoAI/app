module.exports = {
  transpileDependencies: ['vuetify'],
  pwa: {
    name: 'Ttokdok',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent',
  },
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:7002/',
        changeOrigin: true,
      },
    },
  },
};
