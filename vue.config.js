const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/article': {
        target: 'http://localhost:8089',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/article': '' }
      },
      '/class': {
        target: 'http://localhost:8089',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/class': '' }
      },
      '/comment': {
        target: 'http://localhost:8089',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/comment': '' }
      },

      //music服务
      '/music':{
        target: 'http://localhost:8088',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/music': '' }
      },


      //以下属于User服务
      '/user':{
        target: 'http://localhost:8090',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/user': '' }
      }
    }
  }
})
