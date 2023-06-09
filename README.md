# Gulp-сборка Butyrskiy

## О сборке

Данная сборка представляет собой базовый набор инструментов для полноценной работы по разработке сайта.

### Что умеет

- Компиляция SCSS в CSS
- Компиляция JS
- Конвертация шрифтов .ttf в .woff и .woff2
- Использование `@include` в HTML
- Сжатие изображений .jpg в .webp, .avif, .jpg
- Создание спрайта из svg изображений
- Слежение за изменениями файлов и автоматическое обновление браузера

**Краткое описание:**

> В сборке две главных директории: **«build»** и **«src»**.

После запуска сборки создаётся директория **«build»**. При изменении/добавлении файлов в директорях **src/img, src/js, src/partials, src/resources, src/scss** запускается соответствующая функция и происходит компиляция или копирование файлов из директории **«src»** в **«build»**.

---

## Начало работы

В первую очередь необходимо скопировать всё содержимое данного репозитория в папку с проектом. В терминале ввести команду `npm i` и все необходимые пакеты будут установлены.

> Если клиент gulp не установлен глобально, то для установки используйте эту команду: (сам gulp глобально устанавливать не обязательно)

```
npm i gulp-cli -g
```

_Если этого не сделать, то нельзя будет в консоли просто написать `gulp`. Ко всем командам «gulp» придётся добавлять «npx» - `npx gulp`._

## Основные команды

- `gulp` - Запуск сборки для разработки
- `gulp build` - Build версия

> _После запуска сборки все команды ниже будут выполняться автоматически, но при необходимости можно вызывать отдельно:_

- `gulp styles` - Компиляция SCSS в CSS
- `gulp javascript` - Компиляция JS
- `gulp fonts` - Конвертация шрифтов
- `gulp images` - Сжатие и конвертация изображений
- `gulp sprite` - Создание svg спрайта
- `gulp cleanBuild` - Удаление папки «build»

## Используемые пакеты

- [gulp](https://www.npmjs.com/package/gulp)
- [gulp-sass](https://www.npmjs.com/package/gulp-sass) (работа с sass)
- [sass](https://www.npmjs.com/package/sass) (работа с sass)
- [gulp-rename](https://www.npmjs.com/package/gulp-rename) (изменение имени файла)
- [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css) (сжатие/минификация css)
- [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) (префиксы в CSS)
- [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) (создание sourcemap файлов)
- [browser-sync](https://www.npmjs.com/package/browser-sync) (обновление браузера)
- [gulp-clean](https://www.npmjs.com/package/gulp-cleanc) (удаление файлов)
- [gulp-file-include](https://www.npmjs.com/package/gulp-file-include) (возможноcть использовать @include в html)
- [gulp-svg-sprite](https://www.npmjs.com/package/gulp-svg-sprite) (создание svg спрайта)
- [gulp-ttf2woff](https://www.npmjs.com/package/gulp-ttf2woff) (конвертация шрифтов в woff)
- [gulp-ttf2woff2](https://www.npmjs.com/package/gulp-ttf2woff2) (конвертация шрифтов в woff2)
- [gulp-avif](https://www.npmjs.com/package/gulp-avif) (конвертация изображений в avif)
- [gulp-webp](https://www.npmjs.com/package/gulp-webp) (конвертация изображений в webp)
- [gulp-imagemin](https://www.npmjs.com/package/gulp-imagemin) (сжатие jpg, png изображений)
- [gulp-newer](https://www.npmjs.com/package/gulp-newer) (позволяет повторно не обрабатывать файлы)
- [@babel/core, @babel/preset-env, babel-loader](https://www.npmjs.com/package/gulp-newer) (транспайлер JS)
- [webpack-stream](https://www.npmjs.com/package/webpack-stream) (сборка JS-файлов)

---

## Описание работы

### Работа с изображениями

Изображения, попадая в папку **«src/img»** обрабатываются, складываются в папку **«src/img/prepared»** и после этого копируются в **«build/img»**

### Работа с JS

Все файлы из папки **«src/js»** собираются в один main.min.js и помещается в **«build/js»**

### Работа с HTML

В директории **«src/partials»** находятся html-файлы, которые подключаются с помощью `@include` в **«src/index.html»**.

### Работа с CSS

В директории **«src/scss»** находятся только scss-файлы (за исключением **«src/scss/base/normalize.css»**). В файл **«src/scss/main.scss»** подключаются все необходимые файлы. В итоге всё компилируется в css и складывается в **«build/css»**

### Работа с SVG

SVG-изображения помещаем в директорию **«src/img/svg»**. После этого svg-спрайт сгенерируется автоматически и будет размещён в **«build/img»**.

## Build mode

Команда `gulp build` запустит сборку в режиме билд версии. Её особенность в том, что не будет созданы файлы «main.min.css.map» и «main.min.js.map». Также не будет запущены функции «browserSync» и «watchFiles».

> ### Спасибо за интерес к данной сборке
>
> По мере добавления, изменения чего-то в сборке буду обновлять также readme-файл.
