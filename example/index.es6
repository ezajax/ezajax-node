/**
 * 使用例子演示
 * Created by demon on 15-12-18.
 */
import http from 'http';
import express from 'express';
import {D, W, E} from '../src/util/logger';

import ezajax from '../index';

(async function () {
  try {
    //初始化express
    var app = express();

    //设定静态映射
    app.use(express.static('web'));

    //初始化ezajax
    app.use(ezajax());

    //初始化服务
    var port = 3001;
    var server = http.createServer(app);
    //服务器开始监听
    server.listen(port);

    server.on('error', error=> E(error));
    server.on('listening', ()=> D(`服务器监听 ${server.address().port} 端口`));
  } catch (error) {
    E(error.message);
  }
})();