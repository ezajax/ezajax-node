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
var timer;

export var port;

/**
 * 启动服务器
 */
export async function start() {
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

  //准备启动测试服务器
  var listen = async(port) => new Promise((resolve, reject)=> {
    server.removeAllListeners('error');
    server.on('error', err=> {
      if (err.code === 'EADDRINUSE')
        reject(err);
    });
    server.listen(port, ()=>resolve());
  });


  var currentPort = 3000;
  while (1) {
    try {
      await listen(currentPort);
      break;
    } catch (e) {
      currentPort++;
    }
  }
  port = currentPort;
  //启动成功,设置定时器,防止长时间开启
  timer = setTimeout(()=> {
    console.log('测试服务器1min没有关闭,自动关闭它');
    stop()
  }, 120000);
}

/**
 * 关闭服务器
 * @returns {Promise}
 */
export async function stop() {
  return new Promise(resolve=> {
    server.close(() => {
      if (timer) clearTimeout(timer);
      resolve();
    });
  });
}