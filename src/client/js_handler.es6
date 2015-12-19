/**
 * 客户端 JS Handler
 * Created by demon on 15-12-19.
 */

import path from 'path';

import {D,W,E} from '../utils/logger';

export default async function (req, res, next) {
    
    //拿到文件名,用来做区别分发
    var fileName = path.basename(req.baseUrl);

    //客户端JS请求的分发
    switch (fileName) {
        case 'angular-eazyajax.js':
            res.send('angular-eazyajax.js');
            break;
        case 'eazyajax.js':
            res.send('eazyajax.js');
            break;
        default:
            res.statusCode = 404;
            res.send('Not Found!!!');
            W(`有错误的客户端文件请求 ${req.baseUrl}`);
    }
}