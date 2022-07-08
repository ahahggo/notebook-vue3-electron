const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack:{
    target: "electron-renderer",
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: '/node_modules[\\/]core-js/' // 注意此处
        }
      ]
    }

  }


})
