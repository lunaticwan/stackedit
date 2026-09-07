require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var shell = require('shelljs')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    // Copy additional static routes/files into dist for static web server compatibility
    shell.mkdir('-p', path.join(config.build.assetsRoot, 'app'))
    shell.cp(path.join(config.build.assetsRoot, 'index.html'), path.join(config.build.assetsRoot, 'app/index.html'))

    shell.mkdir('-p', path.join(config.build.assetsRoot, 'oauth2/callback'))
    if (shell.test('-f', path.resolve(__dirname, '../static/oauth2/callback.html'))) {
      shell.cp(path.resolve(__dirname, '../static/oauth2/callback.html'), path.join(config.build.assetsRoot, 'oauth2/callback.html'))
      shell.cp(path.resolve(__dirname, '../static/oauth2/callback.html'), path.join(config.build.assetsRoot, 'oauth2/callback/index.html'))
    }

    if (shell.test('-f', path.resolve(__dirname, '../static/sitemap.xml'))) {
      shell.cp(path.resolve(__dirname, '../static/sitemap.xml'), path.join(config.build.assetsRoot, 'sitemap.xml'))
    }

    if (shell.test('-f', path.resolve(__dirname, '../static/landing/favicon.ico'))) {
      shell.cp(path.resolve(__dirname, '../static/landing/favicon.ico'), path.join(config.build.assetsRoot, 'favicon.ico'))
    }

    // Default static conf endpoint
    shell.ShellString('{}').to(path.join(config.build.assetsRoot, 'conf'))

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))
  })
})
