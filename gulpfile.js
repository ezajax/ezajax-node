var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var uglify = require('gulp-uglify');

//属性配置
var config = {
    dist: 'dist',
    babel: {
        plugins: ['transform-runtime'],
        presets: ['es2015', 'stage-0']
    }
};

//ES6 to ES5 转换,核心库代码
gulp.task('babel', ['clean'], function () {
    return gulp.src(
        [
            'index.es6',
            'src/**/*.es6'
        ], {base: './'})
        .pipe(babel(config.babel))
        .pipe(gulp.dest(config.dist));
});

//ES6 to ES5 转换,用例代码
gulp.task('babel-example', ['clean'], function () {
    return gulp.src(
        [
            'example/**/*.es6'
        ], {base: './'})
        .pipe(babel(config.babel))
        .pipe(gulp.dest(config.dist));
});

//压缩JS
gulp.task('uglify', ['babel'], function () {
    gulp.src(
        [
            'index.js',
            'src/**/*.js'
        ], {base: './'})
        .pipe(uglify())
        .pipe(gulp.dest(config.dist))
});

//文件拷贝
gulp.task('files', ['clean'], function () {
    return gulp.src(
        [
            'package.json'
        ], {base: './'})
        .pipe(gulp.dest(config.dist));
});

//清理文件
gulp.task('clean', function () {
    return gulp.src(config.dist, {read: false})
        .pipe(clean());
});

//构建核心库
gulp.task('build', ['uglify', 'files']);

//构建用例
gulp.task('build-example', ['uglify', 'babel-example', 'files']);

//默认任务
gulp.task('default', ['build']);