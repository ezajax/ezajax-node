/**
 * 服务器端初始化
 * Created by demon on 15-12-21.
 */

import express from 'express';
import path from 'path';

import eazyajax from '../../index';

var app;

export default async function () {
    if (!app) {
        //初始化express
        app = express();

        //初始化eazyajax
        var middleware = await eazyajax(path.join(__dirname, '../', 'ajax'));
        app.use(middleware);
    }
    return app;

}