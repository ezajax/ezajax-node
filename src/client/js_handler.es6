/**
 * 客户端 JS Handler
 * Created by demon on 15-12-19.
 */

import path from 'path';
import bluebird from 'bluebird';

import normalJSGenerator from './normal/js_generator';
import angularJSGenerator from './angular/js_generator';

var fs = bluebird.promisifyAll(require('fs'));

export default async function (req, res, next) {

  //拿到文件名,用来做区别分发
  var fileName = path.basename(req.baseUrl);

  //获取通用js内容
  var commonJSContent = await getCommonJS();

  try {
    //客户端JS请求的分发
    switch (fileName) {
      case 'angular-ezajax.js':
        res.contentType('text/javascript');
        var angularjsContent = await angularJSGenerator();
        res.send(`${commonJSContent}
        
/************angularjs***********/        
${angularjsContent}
/*********angularjs  end*********/
        `);
        break;

      case 'normal.js':
        res.contentType('text/javascript');
        var normaljsContent = await normalJSGenerator();
        res.send(`${commonJSContent}
        
/************normaljs***********/        
${normaljsContent}
/*********normaljs  end*********/
        `);
        break;

      case 'ezajax.js':
        res.contentType('text/javascript');
        var normaljsContent = await normalJSGenerator();
        var angularjsContent = await angularJSGenerator();

        res.send(`${commonJSContent}
        
/************normaljs***********/        
${normaljsContent}
/*********normaljs  end*********/

/************angularjs***********/        
${angularjsContent}
/*********angularjs  end*********/
        `);
        break;

      default:
        throw new Error('错误请求');
    }
  } catch (error) {
    res.statusCode = 502;
    res.send(`获取客户端JS时发生错误: ${error.message}`);
  }
}

/**
 * 获取通用JS内容
 */
var jsCache;

async function getCommonJS() {
  if (!jsCache) {
    //加载第三方文件
    var assetsLoadPromises = ['es5-shim', 'promise', 'json', 'ajax', 'invoker'].map(assetsName => fs.readFileAsync(path.join(__dirname, './assets', `${assetsName}.js`)));

    //将加载的文件存入到变量中
    var [es5ShimContent,promiseContent,jsonContent,ajaxContent,invokerContent] = (await Promise.all(assetsLoadPromises)).map(fileBuffer=>fileBuffer.toString());


    //将内容拼接起来返回
    jsCache = `/***********es5-shim.js***********/
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

  return jsCache;
}