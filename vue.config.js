const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath:'/',
  devServer: {
    compress: false,
    proxy: {
       '/api': {
        target: 'http://192.168.100.199:8081',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
})
