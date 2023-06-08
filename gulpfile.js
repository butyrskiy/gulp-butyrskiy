// Todo. CONSTANTS
// ? src - откуда берём, dest - куда складываем, watch - слежение за изменениями в файлах, parallel - параллельная работа функций, series - выполнение функций по очереди
const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;
const notify = require("gulp-notify");
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const fileInclude = require('gulp-file-include');
const svgSprite = require('gulp-svg-sprite');
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const avif = require('gulp-avif');
const webp = require('gulp-webp');
const newer = require('gulp-newer');
const imagemin = require('gulp-imagemin');

// Todo. PATH
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

// Todo. FUNCTIONS
// ? Компиляция файлов из scss в css
function styles() {
  return src(`${paths.srcScss}`) // забираем исходные scss
  .pipe(sourcemaps.init())
  .pipe(sass({
    outputStyle: 'expanded'
  }).on('error', sass.logError)) // компиляция в css
  .pipe(rename({
    suffix: '.min'
  }))
  .pipe(autoprefixer({ overrideBrowserslist: ['last 5 version'] }))
  .pipe(cleanCss({
    level: 2
  }))
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
}

// ? Компиляция JS
function javascript() {
  return src(paths.srcJs)
    .pipe(webpackStream({
      output: {
        filename: 'main.min.js'
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
          }
        ]
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify().on("error", notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream());
}

// ? BUILD version. Компиляция JS
function javascriptBuild() {
  return src(paths.srcJs)
    .pipe(webpackStream({
      output: {
        filename: 'main.min.js'
      },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
          }
        ],
      },
    }))
    .pipe(uglify().on("error", notify.onError()))
    .pipe(dest(paths.buildJsFolder))
}

// ? Подключение html-компоненты
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

// ? Копированик обработанных изображений в «build»
function imagesToBuild() {
  return src([`${paths.srcImgFolder}/prepared/*.*`])
    .pipe(dest(paths.buildImgFolder))
}

// ? Обработка изображений
function images() {
  return src([`${paths.srcImgFolder}/*.*`, '!src/img/*.svg'])
    .pipe(newer(`${paths.srcImgFolder}/prepared/`)) // не будут повторно сжиматься уже обработанные файлы
    .pipe(avif({ quality: 50 }))

    .pipe(src(`${paths.srcImgFolder}/*.*`))
    .pipe(newer(`${paths.srcImgFolder}/prepared/`))
    .pipe(webp())

    .pipe(src(`${paths.srcImgFolder}/*.*`))
    .pipe(newer(`${paths.srcImgFolder}/prepared/`))
    .pipe(imagemin())

    .pipe(dest(`${paths.srcImgFolder}/prepared`))
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

  // «watch» позволяет наблюдать за изменениями в файлах и после этого запускать нужную функцию
  watch(paths.srcScss, styles);
  watch(paths.srcHtml, htmlInclude);
  watch(`${paths.srcPartialsFolder}/*.html`, htmlInclude);
  watch(`${paths.srcResourcesFolder}/**`, resourcesToBuild);
  watch(`${paths.srcImgFolder}/*.*`, images)
  watch(`${paths.srcImgFolder}/prepared/*.*`, imagesToBuild)
  watch(paths.srcSvg, sprite)
  watch(`${paths.srcFontsFolder}/**.ttf`, fonts)
  watch(paths.srcAllJs, javascript)
}

// ? Выполнение функций по отдельности
exports.styles = styles;
exports.fonts = fonts;
exports.images = images;
exports.javascript = javascript;
exports.sprite = sprite;
exports.watchFiles = watchFiles;
exports.fileInclude = htmlInclude;
exports.cleanBuild = cleanBuild;

// ? Запуск сборки в режиме разработки
exports.default = series(cleanBuild, htmlInclude, javascript, fonts, resourcesToBuild, sprite, styles, images, imagesToBuild, watchFiles);

// ? Финальная версия проекта
exports.build = series(cleanBuild, htmlInclude, javascriptBuild, fonts, resourcesToBuild, sprite, stylesBuild, images, imagesToBuild);