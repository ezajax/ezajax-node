/**
 * EzAjax Middleware
 * Created by demon on 15-12-17.
 */
import path from 'path';
import express from 'express'
import bodyParser from 'body-parser';

import {init as containerInit} from './container';
import jsHandler from './client/js_handler';

import contextInit from './middleware/context_init';
import multipartyParse from './middleware/multiparty_parse';
import invokeCheck from './middleware/invoke_check';
import argsFormat from './middleware/args_format';
import argsValidate from './middleware/args_validate';
import permissionCheck from './middleware/permission_check';
import invoke from './middleware/invoke';

var router = express.Router();

/**
 * 根据路径和配置,初始化ezajax环境
 * 并返回express的中间件
 *
 * @param ajaxModuleRoot            ajax模块的根路径
 * @param option                    选项
 * @returns {Promise.<Function>}    express中间件
 */
export default function (ajaxModuleRoot = path.join(process.cwd(), 'ajax'), option = {}) {
  //参数初始化
  var root = option.root || 'ezajax';

  //输出LOGO
  console.log(`
++++++++++++++++++++++++++++++++++++++++++++++++++++++
 ███████╗███████╗     █████╗      ██╗ █████╗ ██╗  ██╗
 ██╔════╝╚══███╔╝    ██╔══██╗     ██║██╔══██╗╚██╗██╔╝
 █████╗    ███╔╝     ███████║     ██║███████║ ╚███╔╝ 
 ██╔══╝   ███╔╝      ██╔══██║██   ██║██╔══██║ ██╔██╗ 
 ███████╗███████╗    ██║  ██║╚█████╔╝██║  ██║██╔╝ ██╗
 ╚══════╝╚══════╝    ╚═╝  ╚═╝ ╚════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
++++++++++++++++++++++++++++++++++++++++++++++++++++++`);

  //加载和扫描模块
  containerInit(ajaxModuleRoot);
  console.log('模块加载完毕!\n');

  //注册JS文件处理器
  router.use(`/${root}/*.js`, jsHandler);

  //注册ajax调用处理器
  router.use(
    `/${root}/:moduleName/:methodName.ac`,
    bodyParser.json(),
    bodyParser.urlencoded({extended: false}),
    contextInit,
    multipartyParse(option.file),
    invokeCheck,
    argsFormat,
    argsValidate,
    permissionCheck,
    invoke
  );

  //返回一个express中间件
  return router;
}