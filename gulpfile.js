// Todo. CONSTANTS
// ? src - откуда берём, dest - куда складываем, watch - слежение за изменениями в файлах, parallel - параллельная работа функций, series - выполнение функций по очереди
const { src, dest, watch, parallel, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
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
  srcJs: `${srcFolder}/js/**/*.js`,
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
  // .pipe(cleanCss({
  //   level: 2
  // }))
  .pipe(sourcemaps.write('.')) // создание «main.min.css.map»
  .pipe(dest(paths.buildCss)) // сюда кладём скомпилированный css
  .pipe(browserSync.stream())
}

// ? Копирование js в «buils»
function javascript() {
  return src(paths.srcJs)
    .pipe(dest(paths.buildJsFolder))
    .pipe(browserSync.stream())
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
  watch(paths.srcJs, javascript)
}

// ? Выполнение функций по отдельности «gulp styles»
exports.styles = styles;
exports.fonts = fonts;
exports.images = images;
exports.javascript = javascript;
exports.sprite = sprite;
exports.watchFiles = watchFiles;
exports.fileInclude = htmlInclude;
exports.cleanBuild = cleanBuild;

// ? Выполнение всех функций «gulp»
exports.default = series(cleanBuild, htmlInclude, fonts, resourcesToBuild, sprite, styles, images, imagesToBuild, javascript, watchFiles);