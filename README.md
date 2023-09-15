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
- Загрузка проекта на gitHub

**Краткое описание:**

> В сборке две главных директории: **«build»** и **«src»**.

После запуска сборки создаётся директория **«build»**. При изменении/добавлении файлов в директорях **src/img, src/js, src/partials, src/resources, src/scss** запускается соответствующая функция и происходит компиляция или копирование файлов из директории **«src»** в **«build»**.

---

## Начало работы

В первую очередь необходимо скопировать всё содержимое данного репозитория в папку с проектом. В терминале ввести команду `npm i` - все необходимые пакеты будут установлены.

> Если клиент gulp не установлен глобально, то для установки используйте эту команду: (сам gulp глобально устанавливать не обязательно)

```
npm i gulp-cli -g
```

_Если этого не сделать, то нельзя будет в консоли просто написать `gulp`. Ко всем командам «gulp» придётся добавлять «npx» - `npx gulp`._

## Основные команды

- `gulp` - Запуск сборки для разработки
- `npm run deploy` - Build версия + выгрузка проекта на gitHub
- `gulp build` - Build версия

> _После запуска сборки все команды ниже будут выполняться автоматически, но при необходимости можно вызывать отдельно:_

- `gulp styles` - Компиляция SCSS в CSS
- `gulp javascript` - Компиляция JS
- `gulp fonts` - Конвертация шрифтов
- `gulp images` - Сжатие и конвертация изображений
- `gulp sprite` - Создание svg спрайта
- `gulp cleanBuild` - Удаление папки «build»

---

## Описание работы

### Работа с изображениями

Изображения, попадая в папку **«src/img»** обрабатываются и складываются в папку **«build/img»** в трёх форматах: avif, jpg, webp (по-умолчанию происходит сжатие исходного изображения в png, jpg форматах. При необходимости конвертирования в webp и avif - раскомментируйте код в gulpfile.js)

### Работа с JS

Все файлы из папки **«src/js»** собираются в один main.min.js и помещается в **«build/js»**

### Работа с HTML

В директории **«src/partials»** находятся html-файлы, которые подключаются с помощью `@include` в файле **«src/index.html»**. Затем всё собирается в один файл «index.html» и помещается в **«build/index.html»**.

### Работа с CSS

В директории **«src/scss»** находятся только scss-файлы (за исключением папки «vendor». В ней могут быть и css-файлы, например, «normalize.css»). В файл **«src/scss/main.scss»** подключаются все scss-файлы. В итоге всё компилируется в css и складывается в **«build/css»**

В файле **«src/scss/global.scss»** пишутся общие стили, которые могут быть использованы в любом месте проекта.

### Работа с SVG-sprite

SVG-изображения из которых нужен спрайт помещаем в директорию **«src/img/svg-sprite»**. После этого svg-спрайт сгенерируется автоматически и будет размещён в **«build/img/sprite/»**.

### Работа с остальными изображениями

Изображения можно хранить как в папках, например «partners», «portfolio» и т.д. (в таком случае такие же папки будут в «build»), но и просто в корне папки **«src/img/»**

## Build mode

Команда `gulp build` запустит сборку в режиме билд версии. Её особенность в том, что не будет созданы файлы «main.min.css.map» и «main.min.js.map». Также файлы «main.min.js» и «main.min.css» будут минимизированы.

## Загрузка проекта на gitHub

Командой `npm run deploy` сборка запускается в build-режиме, затем происходит публикация проекта на gitHub.

Для того, чтобы это сработало необходимо:

1. Установить и настроить git
2. Создать и настроить репозиторий проекта

В репозитории проекта будет создана ветка «gh-pages» куда будет загружено содержимое папки **build**.

Это нужно для того, чтобы:

1. Посмотреть как исходный код, который находится в ветке **main** в папке **src**, так и build-версию, которая находится в отдельной ветке **gh-pages**
2. Открыть проект с помощью сервиса gitHub pages. Для этого необходимо зайти в соответствующий раздел на gitHub и выбрать ветку **gh-pages** из которой, с помощью файла index.html, будет осуществляться работа проекта по ссылке.

- [Пример репозитория](https://github.com/butyrskiy/todo-list-UI)
- [Ссылка на проект](https://butyrskiy.github.io/todo-list-UI/)

## Пакеты, использованные в сборке

- [gulp](https://www.npmjs.com/package/gulp)
- [gulp-sass](https://www.npmjs.com/package/gulp-sass) (работа с sass)
- [sass](https://www.npmjs.com/package/sass)
- [gulp-rename](https://www.npmjs.com/package/gulp-rename) (изменение имени файла)
- [gulp-clean-css](https://www.npmjs.com/package/gulp-clean-css) (сжатие/минификация css)
- [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer) (префиксы в CSS)
- [gulp-sourcemaps](https://www.npmjs.com/package/gulp-sourcemaps) (создание sourcemap файлов)
- [browser-sync](https://www.npmjs.com/package/browser-sync) (обновление браузера)
- [gh-pages](https://www.npmjs.com/package/gh-pages) (публикация проекта на gitHub)
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

> ### Спасибо за интерес к данной сборке

> По вопросам и предложениям - [contacts](https://taplink.cc/butyrskiy)
![](![](![]()))