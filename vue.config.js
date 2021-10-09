const { tap } = require("lodash")

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
      }
    }
  },
  // 发布模式
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')

    })
  }
}
