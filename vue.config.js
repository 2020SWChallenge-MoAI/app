module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    pwa: {
        name: 'Ddokdok',
        appleMobileWebAppCapable: 'yes',
        appleMobileWebAppStatusBarStyle: 'black'
    },
    devServer: {
        disableHostCheck: true,
        proxy: {
            '/api': {
                target: "http://34.64.132.130:8080",
                changeOrigin: true
            }
        }

    }
}