const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath:'/',
  devServer: {
    compress: false,
    proxy: {
       '/': {
        target: 'http://localhost:8081', // 后端地址
        changeOrigin: true,
        ws: false
      }
    }
  }
})
