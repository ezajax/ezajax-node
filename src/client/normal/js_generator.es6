/**
 * 通用JS生成器
 * Created by demon on 15-12-19.
 */

import handlebars from 'handlebars';
import bluebird from 'bluebird';
import path from 'path';
import util from 'util';

import {D,W,E} from '../../utils/logger';
import {getModules} from '../../container';

var fs = bluebird.promisifyAll(require('fs'));

//js内容缓存
var jsCache;

export default async function () {
    if (!jsCache) {
        //加载第三方文件
        var assetsLoadPromises = ['es5-shim', 'promise', 'json', 'ajax'].map((assetsName)=> {
            return fs.readFileAsync(path.join(__dirname, '../assets', `${assetsName}.jsfile`));
        });

        //将加载的文件存入到变量中
        var [es5ShimContent,promiseContent,jsonContent,ajaxContent] = (await Promise.all(assetsLoadPromises)).map(fileBuffer=>fileBuffer.toString());

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
        var templateContent = (await fs.readFileAsync(path.join(__dirname, 'template.hbs'))).toString('UTF-8');
        //编译模板
        var templateCompiler = handlebars.compile(templateContent);
        //编译模板,拿到动态生成的js内容
        var jsContent = templateCompiler({moduleStubs});

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
${jsContent}
/**********invoker.js end*********/`;
    }

    return jsCache;
}