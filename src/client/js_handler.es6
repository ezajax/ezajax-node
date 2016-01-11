/**
 * 客户端 JS Handler
 * Created by demon on 15-12-19.
 */

import path from 'path';

import {D,W,E} from '../utils/logger';
import normalJSGenerator from './normal/js_generator';
import angularJSGenerator from './angular/js_generator';

export default async function (req, res, next) {

    //拿到文件名,用来做区别分发
    var fileName = path.basename(req.baseUrl);

    try {
        //客户端JS请求的分发
        switch (fileName) {
            case 'angular-eazyajax.js':
                res.contentType('text/javascript');
                res.send(await angularJSGenerator());
                break;

            case 'normal.js':
                res.contentType('text/javascript');
                res.send(await normalJSGenerator());
                break;

            default:
                throw new Error('错误请求');
        }
    } catch (error) {
        res.statusCode = 502;
        res.send(`获取客户端JS时发生错误: ${error.message}`);
    }
}