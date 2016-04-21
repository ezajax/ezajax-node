var gulp = require('gulp');
var babel = require('gulp-babel');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var print = require('gulp-print');
var phantom = require('gulp-mocha-phantomjs');
var sourcemaps = require('gulp-sourcemaps')
var watch = require('gulp-watch');
var runSequence = require('run-sequence');
var util = require('gulp-util');

//构建配置
var config = {};

//输出地址
config.dist = 'dist';

//babel配置
config.babel = {
  presets: ['danwi']
};

//静态资源
config.static = [
  'package.json',
  'src/**/*.hbs',
  'src/client/assets/*',
  'example/web/**/*',
  'test/browser/**/*',
  '!**/*_tmp___'
];

//phantomjs设置
config.phantomjs = {
  useColors: true,
  suppressStderr: true
};

//清理任务
gulp.task('clean', function () {
  return gulp.src(config.dist + '/*', {read: false})
    .pipe(clean());
});

//编译脚本
gulp.task('compile', function () {
  if (config.babel.sourceMaps)
    return gulp.src('**/*.es6', {base: './'})
      .pipe(sourcemaps.init())
      .pipe(babel(config.babel))
      .pipe(sourcemaps.write('.', {sourceRoot: '/ezajax'}))
      .pipe(gulp.dest(config.dist));
  else
    return gulp.src('**/*.es6', {base: './'})
      .pipe(babel(config.babel))
      .pipe(gulp.dest(config.dist));
});

//实时编译脚本
gulp.task('compile:dev', ()=> {
  // generate sourcemap, just for debug
  config.babel.sourceMaps = true;

  return runSequence(
    'compile',
    () => {
      util.log('[Babel] starting es6 script watch');
      return watch('**/*.es6', obj=> {
        if (obj.event === 'change' || obj.event === 'add') {
          util.log('[Babel] file compiling: ' + obj.path.replace(obj.base, ''));
          return gulp.src(obj.path, {base: './'})
            .pipe(sourcemaps.init())
            .pipe(babel(config.babel))
            .on('error', err => util.log('[Babel] compile error: ' + obj.path.replace(obj.base, '') + '\n' + err))
            .pipe(sourcemaps.write('.', {sourceRoot: '/ezajax'}))
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
  //加载测试服务器
  config.server = require('./' + config.dist + '/test/server/index');
  config.server.start().then(function () {
    util.log('[Test] 测试服务器启动完毕,监听 ' + config.server.port + ' 端口');
    done();
  });
});

//关闭测试服务器
gulp.task('test:stop-test-server', function (done) {
  config.server.stop().then(function () {
    util.log('[Test] 测试服务器关闭');
    done();
  }).catch(function (error) {
    util.log('[Test] 测试服务器启动失败:\n' + error);
  });
});

//http客户端(APP-API)测试
gulp.task('test:http-client', function () {
  util.log('[Test] 开始测试 http / app-api 客户端调用');
  return gulp.src(config.dist + '/test/http_client/**/*.js', {read: false})
    .pipe(mocha())
    .on('error', config.server.stop);
});

//浏览器测试-通用情况
gulp.task('test:browser:normal', function () {
  util.log('[Test] 开始测试normal.js的调用');
  var stream = phantom(config.phantomjs);
  stream.write({path: 'http://localhost:' + config.server.port + '/normal.html'});
  stream.on('phantomjsStderrData', function (data) {
    data = data.toString();
    if (!/Internal Server Error/.match(data))
      console.error(data);
  });
  stream.on('error', config.server.stop);
  stream.end();
  return stream;
});

//浏览器测试-angularjs
gulp.task('test:browser:angularjs', function () {
  util.log('[Test] 开始测试angularjs的调用');
  var stream = phantom(config.phantomjs);
  stream.write({path: 'http://localhost:' + config.server.port + '/angularjs.html'});
  stream.on('phantomjsStderrData', function (data) {
    data = data.toString();
    if (!/Internal Server Error/.match(data))
      console.error(data);
  });
  stream.on('error', config.server.stop);
  stream.end();
  return stream;
});

//测试
gulp.task('test', function (done) {
  runSequence(
    'build',
    'test:start-test-server', 'test:http-client', 'test:stop-test-server',
    'test:start-test-server', 'test:browser:normal', 'test:stop-test-server',
    'test:start-test-server', 'test:browser:angularjs', 'test:stop-test-server',
    done
  );
});

//清理文件
gulp.task('clean', function () {
  return gulp.src([config.dist, 'coverage'], {read: false})
    .pipe(clean());
});

//默认任务
gulp.task('default', ['build']);