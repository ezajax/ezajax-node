var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var print = require('gulp-print');
var phantom = require('gulp-mocha-phantomjs');
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
  'example/web/**/*',
  'test/browser/**/*'
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
gulp.task('build', function (done) {
  runSequence('clean', ['compile', 'static-sync'], done);
});

gulp.task('build:dev', function () {
  runSequence('clean', ['compile:dev', 'static-sync:dev']);
});

//启动测试服务器
gulp.task('test:start-test-server', function (done) {
  var server = require('./' + config.dist + '/test/server/index');
  server.start(function (port) {
    config.port = port;
    util.log('[Test] 测试服务器启动完毕,监听 ' + port + ' 端口');
    done();
  });
});

//关闭测试服务器
gulp.task('test:stop-test-server', function (done) {
  var server = require('./' + config.dist + '/test/server/index');
  server.stop(function () {
    util.log('[Test] 测试服务器关闭');
    done();
  });
});

//http客户端(APP-API)测试
gulp.task('test:http-client', function () {
  util.log('[Test] 开始测试 http / app-api 客户端调用')
  return gulp.src(config.dist + '/test/http_client/**/*.js', {read: false})
    .pipe(mocha());
});

//浏览器测试
gulp.task('test:browser', function () {
  util.log('[Test] 开始测试浏览器的调用');
  var stream = phantom({useColors: true});
  stream.write({path: 'http://localhost:' + config.port + '/index.html'});
  stream.on('data', util.log);
  stream.end();
  return stream;
});

//测试
gulp.task('test', function (done) {
  runSequence('build', 'test:start-test-server', 'test:http-client', 'test:browser', 'test:stop-test-server', done);
});

//清理文件
gulp.task('clean', function () {
  return gulp.src([config.dist, 'coverage'], {read: false})
    .pipe(clean());
});

//默认任务
gulp.task('default', ['build']);