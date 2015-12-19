/**
 * 客户端 JS Handler
 * Created by demon on 15-12-19.
 */

import path from 'path';

import {D,W,E} from '../utils/logger';
import normalJSGenerator from './normal/js_generator';

export default async function (req, res, next) {

    //拿到文件名,用来做区别分发
    var fileName = path.basename(req.baseUrl);

    //客户端JS请求的分发
    switch (fileName) {
        case 'angular.js':
            res.send('angular.js');
            break;
        case 'normal.js':
            try {
                let jsContent = await normalJSGenerator();
                res.send(jsContent);
            } catch (error) {
                E(error.message);
            }
            break;
        default:
            res.statusCode = 404;
            res.send('Not Found!!!');
            W(`有错误的客户端文件请求 ${req.baseUrl}`);
    }
}