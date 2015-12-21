var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');

//属性配置
var config = {
    dist: 'dist',
    babel: {
        plugins: ['transform-runtime'],
        presets: ['es2015', 'stage-0']
    }
};

//ES6 to ES5 转换,核心库代码
gulp.task('babel-core', ['clean'], function () {
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

//ES6 to ES5 转换,测试代码
gulp.task('babel-test', ['clean'], function () {
    return gulp.src(
        [
            'test/**/*.es6'
        ], {base: './'})
        .pipe(babel(config.babel))
        .pipe(gulp.dest(config.dist));
});

//文件拷贝
gulp.task('files', ['clean'], function () {
    return gulp.src(
        [
            'package.json',
            'src/**/*.hbs'
        ], {base: './'})
        .pipe(gulp.dest(config.dist));
});

//测试预处理任务
gulp.task('pre-test', ['babel-core', 'babel-test'], function () {
    return gulp.src(
        [
            config.dist + '/src/server/**/*.js',
            config.dist + '/src/utils/**/*.js',
            config.dist + '/src/*.js'
        ])
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

//测试任务
gulp.task('test', ['pre-test'], function () {
    return gulp.src(config.dist + '/test/**/*.js', {read: false})
        .pipe(mocha())
        .pipe(istanbul.writeReports())
        .pipe(istanbul.enforceThresholds({thresholds: {global: 20}}));
});

//清理文件
gulp.task('clean', function () {
    return gulp.src([config.dist, 'coverage'], {read: false})
        .pipe(clean());
});

//构建核心库
gulp.task('build-core', ['babel-core', 'files']);

//构建用例
gulp.task('build-all', ['babel-core', 'babel-example', 'babel-test', 'files']);

//默认任务
gulp.task('default', ['build-core']);