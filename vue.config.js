const path = require('path')
const CompressionPlugin = require('compression-webpack-plugin')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  publicPath: isProduction ? '././' : '',
  // assetsDir: "static",
  lintOnSave: false,
  productionSourceMap: false,
  devServer: {
    open: false, // 自动打开浏览器
    port: '9070',
  },
  configureWebpack: config => {
    if (isProduction) {
      return {
        plugins: [new CompressionPlugin({
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10K的进行压缩
          deleteOriginalAssets: false, // 是否删除原文件
        })]
      }
    }
  },
  chainWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      if (process.env.npm_config_report) {
        config.plugin('webpack-bundle-analyzer').use(
          require('webpack-bundle-analyzer').BundleAnalyzerPlugin
        ).end()
      }
    }
    config.plugins.delete('prefetch')
    config.resolve.alias
    .set('vue$', 'vue/dist/vue.esm.js')
    .set('@', resolve('src'))
    .set('_c', resolve('src/components'))
    .end()
    config.module
    .rule('svg')
    .exclude.add(resolve('src/assets/icons'))
    .end()
    config.module
    .rule('icons')
    .test(/\.svg$/)
    .include.add(resolve('src/assets/icons'))
    .end()
    .use('svg-sprite-loader')
    .loader('svg-sprite-loader')
    .options({
      symbolId: 'icon-[name]'
    })
    .end()
  }
}