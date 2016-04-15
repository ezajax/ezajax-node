/**
 * 客户端 JS Handler
 * Created by demon on 15-12-19.
 */

import handlebars from 'handlebars';
import bluebird from 'bluebird';
import path from 'path';
import util from 'util';
import uglifyjs from 'uglify-js';

import {getModules} from '../container';
var fs = bluebird.promisifyAll(require('fs'));


//js缓存
var jsCache;

export default async function (req, res) {
  try {
    //拿到文件名,用来做区别分发
    var fileName = path.basename(req.baseUrl);

    //生成JS缓存
    if (!jsCache) {
      jsCache = {};

      //生成公用JS
      jsCache.commonJS = await generatorCommonJS();

      //生成普通js调用接口
      jsCache.normalJS = jsCache.commonJS + `
    
/************normaljs***********/
${await generatorTemplateJS(path.join(__dirname, 'normal_template.hbs'))}
/**********normaljs end*********/`;

      //生成angularjs调用接口
      jsCache.angularJS = jsCache.commonJS + `
    
/************angularjs***********/
    ${await generatorTemplateJS(path.join(__dirname, 'angular_template.hbs'))}
/*********angularjs end**********/`;

      //生成ezajaxjs调用接口
      jsCache.ezajaxJS = jsCache.commonJS + `
    
/************normaljs***********/
${await generatorTemplateJS(path.join(__dirname, 'normal_template.hbs'))}
/**********normaljs end*********/
    
/************angularjs***********/
    ${await generatorTemplateJS(path.join(__dirname, 'angular_template.hbs'))}
/*********angularjs end**********/`;

      //压缩normalJS
      var result = uglifyjs.minify(jsCache.normalJS, {
        fromString: true,
        outSourceMap: 'normal.map.js'
      });
      jsCache.normalJSMin = result.code;
      jsCache.normalJSMinMap = result.map;

      //压缩angularJS
      var result = uglifyjs.minify(jsCache.angularJS, {
        fromString: true,
        outSourceMap: 'angular.map.js',
        mangle: false
      });
      jsCache.angularJSMin = result.code;
      jsCache.angularJSMinMap = result.map;

      //压缩ezajaxJS
      var result = uglifyjs.minify(jsCache.ezajaxJS, {
        fromString: true,
        outSourceMap: 'ezajax.map.js',
        mangle: false
      });
      jsCache.ezajaxJSMin = result.code;
      jsCache.ezajaxJSMinMap = result.map;
    }

    //客户端JS请求的分发
    switch (fileName) {
      //返回未压缩的开发版本文件,主要为了哪些不支持source-map的浏览器
      case 'normal.dev.js':
        res.contentType('text/javascript');
        res.send(jsCache.normalJS);
        break;
      case 'angular-ezajax.dev.js':
        res.contentType('text/javascript');
        res.send(jsCache.angularJS);
        break;
      case 'ezajax.dev.js':
        res.contentType('text/javascript');
        res.send(jsCache.ezajaxJS);
        break;

      //返回压缩版本的文件
      case 'normal.js':
        res.contentType('text/javascript');
        res.send(jsCache.normalJSMin);
        break;
      case 'angular-ezajax.js':
        res.contentType('text/javascript');
        res.send(jsCache.angularJSMin);
        break;
      case 'ezajax.js':
        res.contentType('text/javascript');
        res.send(jsCache.ezajaxJSMin);
        break;

      //返回map文件
      case 'normal.map.js':
        res.contentType('application/octet-stream');
        res.send(jsCache.normalJSMinMap);
        break;
      case 'angular-ezajax.map.js':
        res.contentType('application/octet-stream');
        res.send(jsCache.angularJSMinMap);
        break;
      case 'ezajax.map.js':
        res.contentType('application/octet-stream');
        res.send(jsCache.ezajaxJSMinMap);
        break;

      default:
        res.statusCode = 404;
        res.send('JS Not Found!!!')

    }
  } catch (error) {
    res.statusCode = 500;
    res.send(`获取客户端JS时发生错误: ${error.message}`);
  }
}

/**
 * 生成公用的JS文件内容,其实就是讲assets里面的几个文件拼起来
 */
async function generatorCommonJS() {
  //加载第三方文件
  var assetsLoadPromises = ['es5-shim', 'promise', 'json', 'ajax', 'invoker'].map(assetsName => fs.readFileAsync(path.join(__dirname, './assets', `${assetsName}.js`)));

  //将加载的文件存入到变量中
  var [es5ShimContent,promiseContent,jsonContent,ajaxContent,invokerContent] = (await Promise.all(assetsLoadPromises)).map(fileBuffer=>fileBuffer.toString());

  //将内容拼接起来返回
  return `/***********es5-shim.js***********/
${es5ShimContent}
/********es5-shim.js end**********/

/***********promise.js************/
${promiseContent}
/**********promise.js end*********/

/*************json.js*************/
${jsonContent}
/***********json.js end***********/

/*************ajax.js*************/
${ajaxContent}
/***********ajax.js end***********/

/***********invoker.js************/
${invokerContent}
/**********invoker.js end*********/`;
}

/**
 * 通过模板来生成特定的JS文件
 * @param templateFile  模板文件
 * @returns {*}
 */
async function generatorTemplateJS(templateFile) {
  //从容器中读取已经加载的模块
  var modulesCache = getModules();
  //模块存根
  var moduleStubs = [];

  //遍历整个缓存
  for (var [moduleName,moduleInstance] of modulesCache) {
    var moduleStub = {
      name: moduleName,
      pascalcaseName: '',
      methods: []
    };

    //将模块名称变换一下 如:  a_module_name -> AModuleName
    moduleName.split('_')
      .map(word=>word.substring(0, 1).toUpperCase() + word.substring(1))
      .forEach(word=>moduleStub.pascalcaseName += word);

    //遍历整个模块,处理其中的每一个方法
    for (var methodName in moduleInstance) {
      //拿到方法实例
      var methodInstance = moduleInstance[methodName];
      if (util.isFunction(methodInstance)) {
        moduleStub.methods.push({name: methodName});
      }
    }
    moduleStubs.push(moduleStub);
  }

  //读取模板文件内容
  var templateContent = (await fs.readFileAsync(templateFile)).toString('UTF-8');
  //编译模板
  var templateCompiler = handlebars.compile(templateContent);
  //编译模板,拿到动态生成的js内容
  return templateCompiler({moduleStubs});
}