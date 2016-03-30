var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var print = require('gulp-print');
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var util = require('gulp-util');

//构建配置
var config = {};

//输出地址
config.dist = 'dist';

//babel配置
config.babel = {
  plugins: ['transform-runtime', 'transform-decorators-legacy'],
  presets: ['es2015', 'stage-0']
};

//静态资源
config.static = [
  'package.json',
  'src/**/*.hbs',
  'src/**/*.jsfile',
  'example/web/**/*'
];

//清理任务
gulp.task('clean', function () {
  return gulp.src(config.dist + '/*', {read: false})
    .pipe(clean());
});

//编译脚本
gulp.task('compile', function () {
  return gulp.src('**/*.es6', {base: './'})
    .pipe(babel(config.babel))
    .pipe(gulp.dest(config.dist));
});

//实时编译脚本
gulp.task('compile:dev', ()=> {
  // generate sourcemap in file, just for debug
  config.babel.sourceMaps = 'inline';

  return runSequence(
    'compile',
    () => {
      util.log('[Babel] starting es6 script watch');
      return watch('**/*.es6', obj=> {
        if (obj.event === 'change' || obj.event === 'add') {
          util.log('[Babel] file compiling: ' + obj.path.replace(obj.base, ''));
          return gulp.src(obj.path, {base: './'})
            .pipe(babel(config.babel))
            .on('error', err => util.log('[Babel] compile error: ' + obj.path.replace(obj.base, '') + '\n' + err))
            .pipe(gulp.dest(config.dist))
            .pipe(print(()=> '[Babel] file compiled: ' + obj.path.replace(obj.base, '')));
        } else if (obj.event === 'unlink') {
          var distFilePath = obj.path.replace(__dirname, __dirname + '/' + config.dist).replace('.es6', '.js');
          return gulp.src(distFilePath)
            .pipe(clean())
            .pipe(print(() =>'[Babel] file removed: ' + obj.path.replace(obj.base, '')));
        }
      });
    }
  );
});

//资源文件同步
gulp.task('static-sync', function () {
  return gulp.src(config.static, {base: './'})
    .pipe(gulp.dest(config.dist));
});

//实时资源文件同步
gulp.task('static-sync:dev', ['static-sync'], function () {
  util.log('[Sync] starting file watch');
  return watch(config.static, obj=> {
    if (obj.event === 'change' || obj.event === 'add')
      return gulp.src(obj.path, {base: './'})
        .pipe(gulp.dest(config.dist))
        .pipe(print(()=>'[Sync] file sync success: ' + obj.path.replace(obj.base, '')));
    else {
      var distFilePath = obj.path.replace(__dirname, __dirname + '/' + config.dist);
      return gulp.src(distFilePath)
        .pipe(clean())
        .pipe(print(() =>'[Sync] file remove success: ' + obj.path.replace(obj.base, '')));
    }
  });
});


//构建任务
gulp.task('build', ['compile', 'static-sync']);

gulp.task('build:dev', ['compile:dev', 'static-sync:dev']);

//测试预处理任务
gulp.task('pre-test', ['build'], function () {
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
    .pipe(istanbul.enforceThresholds({thresholds: {global: 80}}));
});

//清理文件
gulp.task('clean', function () {
  return gulp.src([config.dist, 'coverage'], {read: false})
    .pipe(clean());
});

//默认任务
gulp.task('default', ['build']);