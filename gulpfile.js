// Todo. CONSTANTS
// ? src - откуда берём, dest - куда складываем, watch - слежение за изменениями в файлах, parallel - параллельная работа функций, series - выполнение функций по очереди

const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const webpackStream = require('webpack-stream');
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const fileInclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const imagemin = require('gulp-imagemin');

// Todo. Path
const srcFolder = './src';
const buildFolder = './build';

const paths = {
  srcScss: `${srcFolder}/scss/**/*.scss`,
  buildCss: `${buildFolder}/css`,
  srcHtml: `${srcFolder}/*.html`,
  srcResourcesFolder: `${srcFolder}/resources`,
  srcImgFolder: `${srcFolder}/img`,
  buildImgFolder: `${buildFolder}/img`,
  srcSvg: `${srcFolder}/img/svg/**.svg`,
  srcPartialsFolder: `${srcFolder}/partials`,
  srcFontsFolder: `${srcFolder}/resources/fonts`,
  buildFontsFolder: `${buildFolder}/fonts`,
  srcJs: `${srcFolder}/js/main.js`,
  srcAllJs: `${srcFolder}/js/**/*.js`,
  buildJsFolder: `${buildFolder}/js`,
};

let isProd = false; // dev by default

// Todo. Functions
// ? Компиляция файлов из scss в css
function styles() {
  return src(`${paths.srcScss}`) // забираем исходные scss
  .pipe(sourcemaps.init())
  .pipe(sass({ // компиляция в css
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(autoprefixer({ overrideBrowserslist: ['last 5 version'] }))
  .pipe(sourcemaps.write('.')) // создание «main.min.css.map»
  .pipe(dest(paths.buildCss)) // сюда кладём скомпилированный css
  .pipe(browserSync.stream())
}

// ? BUILD version. Компиляция файлов из scss в css
function stylesBuild() {
  return src(`${paths.srcScss}`)
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError))
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(autoprefixer({ overrideBrowserslist: ['last 5 version'] }))
  .pipe(cleanCss({
    level: 2
  }))
  .pipe(dest(paths.buildCss))
  .pipe(browserSync.stream())
}

// ? Компиляция JS
function javascript() {
  return src(paths.srcJs)
    .pipe(webpackStream({
      mode: isProd ? 'production' : 'development',
      output: {
        filename: 'main.min.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: !isProd ? 'source-map' : false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
}

// ? BUILD version. Компиляция JS
function javascriptBuild() {
  return src(paths.srcJs)
    .pipe(webpackStream({
      mode: 'production',
      output: {
        filename: 'main.min.js',
      },
      module: {
        rules: [{
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: "defaults"
                }]
              ]
            }
          }
        }]
      },
      devtool: false
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
}

// ? Подключение html-компонентов
function htmlInclude() {
  return src(`${paths.srcHtml}`)
    .pipe(fileInclude({
      prefix: '@',
      basepath: '@file'
    }))
    .pipe(dest(buildFolder))
    .pipe(browserSync.stream());
}

// ? Копированик файлов из «resources» в «build»
function resourcesToBuild() {
  return src([`${paths.srcResourcesFolder}/**`, `!${paths.srcFontsFolder}**/*.ttf`])
    .pipe(dest(buildFolder))
}

// ? Обработка изображений
function images() {
  return src([`${paths.srcImgFolder}/*.*`, '!src/img/*.svg'])
    .pipe(avif({ quality: 50 }))

    .pipe(src(`${paths.srcImgFolder}/*.*`))
    .pipe(webp())

    .pipe(src(`${paths.srcImgFolder}/*.*`))
    .pipe(imagemin())

    .pipe(dest(paths.buildImgFolder))
}

// ? Создания svg-спрайта
function sprite() {
  return src(`${paths.srcSvg}`)
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg',
          example: true
        }
      }
    }))
    .pipe(dest(paths.buildImgFolder))
}

// ? Работа со шрифтами
function fonts() {
  src(`${paths.srcFontsFolder}/**.ttf`)
    .pipe(ttf2woff())
    .pipe(dest(paths.buildFontsFolder))
  return src(`${paths.srcFontsFolder}/**.ttf`)
    .pipe(ttf2woff2())
    .pipe(dest(paths.buildFontsFolder))
}

// ? Удаление папки «build»
function cleanBuild() {
  return src(`${buildFolder}/**/`)
    .pipe(clean())
}

// ? Обновление изменений в браузере.
function watchFiles() {
  browserSync.init({
    server: {
      baseDir: buildFolder // папка за которой нужно следить
    }
  });

  // ? «watch» позволяет наблюдать за изменениями в файлах и после этого запускать нужную функцию
  watch(paths.srcScss, styles);
  watch(paths.srcHtml, htmlInclude);
  watch(`${paths.srcPartialsFolder}/*.html`, htmlInclude);
  watch(`${paths.srcResourcesFolder}/**`, resourcesToBuild);
  watch(`${paths.srcImgFolder}/*.*`, images);
  watch(paths.srcSvg, sprite);
  watch(`${paths.srcFontsFolder}/**.ttf`, fonts);
  watch(paths.srcAllJs, javascript);
}

// ? Выполнение функций по отдельности
exports.styles = styles;
exports.javascript = javascript;
exports.fonts = fonts;
exports.images = images;
exports.sprite = sprite;
exports.watchFiles = watchFiles;
exports.fileInclude = htmlInclude;
exports.cleanBuild = cleanBuild;

// ? Запуск сборки в режиме ’development’
exports.default = series(cleanBuild, htmlInclude, javascript, fonts, resourcesToBuild, sprite, styles, images, watchFiles);

// ? Запуск сборки в режиме 'production'
exports.build = series(cleanBuild, htmlInclude, javascriptBuild, fonts, resourcesToBuild, sprite, stylesBuild, images, watchFiles);