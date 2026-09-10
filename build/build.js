require('./check-versions')();

process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const shell = require('shelljs');
const webpack = require('webpack');
const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');

/**
 * 프로덕션 정적 자산 빌드 및 후처리 복사 스크립트.
 */
const spinner = ora('building for production...');
spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), (err) => {
  if (err) throw err;
  webpack(webpackConfig, (webpackErr, stats) => {
    spinner.stop();
    if (webpackErr) throw webpackErr;
    process.stdout.write(`${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}\n\n`);

    const { assetsRoot } = config.build;

    // 정적 웹 서버 호환성을 위한 라우팅 파일 복사
    shell.mkdir('-p', path.join(assetsRoot, 'app'));
    shell.cp(path.join(assetsRoot, 'index.html'), path.join(assetsRoot, 'app/index.html'));

    shell.mkdir('-p', path.join(assetsRoot, 'oauth2/callback'));
    const oauthCallbackPath = path.resolve(__dirname, '../static/oauth2/callback.html');
    if (shell.test('-f', oauthCallbackPath)) {
      shell.cp(oauthCallbackPath, path.join(assetsRoot, 'oauth2/callback.html'));
      shell.cp(oauthCallbackPath, path.join(assetsRoot, 'oauth2/callback/index.html'));
    }

    const sitemapPath = path.resolve(__dirname, '../static/sitemap.xml');
    if (shell.test('-f', sitemapPath)) {
      shell.cp(sitemapPath, path.join(assetsRoot, 'sitemap.xml'));
    }

    const faviconPath = path.resolve(__dirname, '../static/landing/favicon.ico');
    if (shell.test('-f', faviconPath)) {
      shell.cp(faviconPath, path.join(assetsRoot, 'favicon.ico'));
    }

    // 기본 정적 설정 엔드포인트 생성
    shell.ShellString('{}').to(path.join(assetsRoot, 'conf'));

    console.log(chalk.cyan('  Build complete.\n'));
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n',
    ));
  });
});
