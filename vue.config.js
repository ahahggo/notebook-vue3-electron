const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  runtimeCompiler: true, //生产环境注释掉 运行时编译vue
  transpileDependencies: true,
  configureWebpack:{
    target: "electron-renderer",
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: '/node_modules[\\/]core-js/' // 注意此处
        },{
          test: /\.less$/,
          use: [
            {
              loader: "less-loader",
              options:{
                lessOptions: {
                  javascriptEnabled:true
                }
              }
            }
          ]

        }
      ]
    }

  }


})
