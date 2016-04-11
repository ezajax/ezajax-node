/**
 * 服务器端初始化
 * Created by demon on 15-12-21.
 */

import express from 'express';
import session from 'express-session';
import path from 'path';
import http from 'http';

import eazyajax from '../../index';

var server;

export function start(done) {
  //初始化express
  var app = express();

  //挂载browser测试目录
  app.use(express.static(path.join(__dirname, '../browser')));

  //初始化session
  app.use(session({
    secret: 'eazyajax',
    resave: false,
    saveUninitialized: true
  }));

  //初始化eazyajax
  app.use(eazyajax(path.join(__dirname, 'ajax')));

  server = http.createServer(app);
  server.listen(3000, err => {
    err ? console.log('listening on 3000') : console.error(err);
    done(3000);
  });
}

export function stop(done) {
  server.close(function () {
    done();
  });
}
