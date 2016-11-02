/**
 * Created by SergST on 17.10.2016.
 */

var gulp = require('gulp'); // Подключаем Gulp
var sass = require('gulp-sass'); // Подключаем Sass пакет
var watch = require('gulp-watch'); //Наблюдение за изменением файлов
var browserSync = require('browser-sync'); // Автообновление веб-страницы
var plumber = require('gulp-plumber'); //обработчик ошибок

//сборка кртинок
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jpegtran = require('imagemin-jpegtran');
var cache = require('gulp-cache');           //кеширование изображений

var sourcemaps = require('gulp-sourcemaps');
var clean = require('del');                       //очистка папки
var autoprefixer = require('gulp-autoprefixer');  // вендорные префиксы
var minifyCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var rigger = require('gulp-rigger');
var runSequence = require('run-sequence'); //синхронный запуск задач
var spritesmith = require('gulp.spritesmith');// готовим спрайты
var ghPages = require('gulp-gh-pages'); //deploy build folder to gh-pages
var svgSprite = require("gulp-svg-sprites");  //svg sprite

//     babel = require("gulp-babel"),


//  объект с данными о путях
var PATHS = {
    src: {
        html: 'src/*.html',
        styles: 'src/styles/css/*.css',
        scripts: [
            'src/scripts/main.js'
        ],
        images: 'src/img/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    build: {
        html: 'build/',
        styles: 'build/styles/css/',
        scripts: 'build/scripts/',
        images: 'build/img/',
        fonts: 'build/fonts/'
    },
    watch: {
        html: 'src/**/*.html',
        sass: 'src/styles/sass/*.sass',
        styles: 'src/styles/css/*.css',
        scripts: 'src/scripts/**/*.js',
        images: 'src/img/**/*'
    }
};

//Очистка папки
gulp.task('clean', function () {
    return clean('build/**/*');
});

// задача по умолчанию
gulp.task('default', ['build'], function () {
    console.log('default task build - ok');
});

//Сервер и автоматическое обновление страницы
gulp.task('browser-sync', function () { // Создаем таск browser-sync
    browserSync({ // Выполняем browser Sync
        server: { // Определяем параметры сервера
            baseDir: 'build' // Директория для сервера
        },
        notify: false // Отключаем уведомления
    });
});

//SASS
gulp.task('sass', function () { // Создаем таск "sass"
         gulp.src([PATHS.watch.sass]) // Берем источник
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError)) // Преобразуем Sass в CSS посредством gulp-sass
        .pipe(gulp.dest('src/styles/css/')); // Выгружаем результата в папку css
});

//WATCH
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch([PATHS.watch.sass], ['sass']); // Наблюдение за sass файлами в папке sass
    gulp.watch([PATHS.watch.html], ['html']);
    gulp.watch([PATHS.watch.styles], ['styles']);
    gulp.watch([PATHS.watch.scripts], ['scripts']);
    gulp.watch([PATHS.watch.images], ['images']);
});

//deploy build to git
gulp.task('deploy', function() {
    return gulp.src('build/**/*')
        .pipe(ghPages());
});

//BUILD TASKS

//сборка спрайтов
gulp.task('sprite', function () {
    var spriteData = gulp.src('src/img/sprite/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        cssName: '_sprite.css',
        imgPath: '../../img/sprite.png'
    }));
    spriteData.img.pipe(gulp.dest('src/img/'));
    spriteData.css.pipe(gulp.dest('src/styles/sass/'));

});


gulp.task('spriteSVG', function () {
    return gulp.src('src/img/sprite/*.svg')
        .pipe(svgSprite({
            svg: {
                sprite: "sprite.svg"
            },
            templates: {
                css: require("fs").readFileSync("src/img/sprite/tmpl.css", "utf-8")
            },
            svgPath: '../../img/sprite.svg',
            cssFile: "../styles/sass/_spriteSVG.css",
            preview: false
        }))
        .pipe(gulp.dest("src/img/"));
});

// задача по сборке FONTS
gulp.task('fonts', function () {
    gulp.src(PATHS.src.fonts)
        .pipe(gulp.dest(PATHS.build.fonts));
});

// задача по сборке HTML
gulp.task('html', function () {
    gulp.src(PATHS.src.html) //Выберем файлы по нужному пути
        .pipe(plumber())
        .pipe(gulp.dest(PATHS.build.html))  //Переносим их в папку build
        .pipe(browserSync.reload({stream: true})); // перезагрузим сервер
});


// задача по сборке js для IE9
gulp.task('ie9', function () {
    gulp.src(['src/scripts/html5shiv.js', 'src/scripts/css3-mediaqueries.js']) //Выберем файлы по нужному пути
        .pipe(plumber())
        .pipe(gulp.dest('build/scripts/')) ;//Переносим их в папку build

});

// задача по сборке css для ie8
gulp.task('ie8', function () {
    gulp.src('src/styles/ie8/ie8.css') //Выберем файлы по нужному пути
        .pipe(plumber())
        .pipe(gulp.dest('build/styles/ie8/')) ;//Переносим их в папку build

});

// задача по сборке картинок
gulp.task('images', function () {
    return gulp.src(PATHS.src.images)
        .pipe(plumber())
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            verbose: true,
            use: [pngquant(), jpegtran()],
            interlaced: true
        })))
        .pipe(gulp.dest(PATHS.build.images))
        .pipe(browserSync.reload({stream: true})); // перезагрузим сервер
});

// задача по сборке стилей
gulp.task('styles', function () {
    return gulp.src(PATHS.src.styles)
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(autoprefixer({
            browsers: ['last 15 versions', 'ie >= 8'],
            cascade: false
        }))
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(PATHS.build.styles))
        .pipe(browserSync.reload({stream: true})); // перезагрузим сервер
});

// задача по сборке скриптов
gulp.task('scripts', function () {
    return gulp.src(PATHS.src.scripts)
        .pipe(plumber())
        .pipe(rigger()) //Прогоним через rigger
        // .pipe(sourcemaps.init()) //Инициализируем sourcemap
        // .pipe(uglify({
        //     compress: false,
        //     mangle: false
        // })) //минификация  js
        // .pipe(sourcemaps.write()) //Пропишем карты
        .pipe(gulp.dest(PATHS.build.scripts))
        .pipe(browserSync.reload({stream: true})); // перезагрузим сервер
});

// задача сборки проекта, до запуска build будут выполнены задачи из массива
gulp.task('build', function () {
    runSequence('clean', 'sass',
        ['fonts', 'html', 'styles', 'sprite', 'spriteSVG', 'images', 'scripts', 'ie9', 'ie8']
    );
});
