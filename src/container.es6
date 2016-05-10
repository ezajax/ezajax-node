/**
 * Ajax模块容器
 * Created by demon on 15-12-18.
 */

import bluebird from "bluebird";
import path from "path";
import util from "util";
import {watchTree} from "watch"
import getParams from "get-parameter-names";
import { clearCache as clearJSCahce } from './client/js_handler';
var fs = bluebird.promisifyAll(require('fs'));

//ajax模块缓存
var moduleCache = new Map();

/**
 * 加载指定的模块
 * @param filePath  模块文件地址
 */
function load(filePath) {
  try {
    //获取模块名
    var moduleName = path.basename(filePath).replace('.js', '');

    //检查模块是否已经被加载,也有可能是重名的情况
    if (moduleCache.has(moduleName)) {
      console.log(`模块 ${moduleName} 已经被加载,请注意重名情况`)
    }

    //加载模块
    var jsModule = require(filePath);
    //获取到默认模块
    jsModule = jsModule.default || jsModule;

    //方法名
    var module = {};

    //拿到所有的静态方法(属性方法)
    for (let staticMethodName of Object.getOwnPropertyNames(jsModule)) {
      if (util.isFunction(jsModule[staticMethodName]))
        module[staticMethodName] = jsModule[staticMethodName];
    }

    //判断模块是不是一个类,如果是,则拿到所有的成员方法
    if (util.isFunction(jsModule)) {
      var instance = new jsModule();
      for (let memberMethodName of Object.getOwnPropertyNames(Object.getPrototypeOf(instance))) {
        if (util.isFunction(instance[memberMethodName]) && memberMethodName != 'constructor')
          module[memberMethodName] = instance[memberMethodName];
      }
    }

    //存入模块
    moduleCache.set(moduleName, module);

    //输出模块图谱
    console.log(`+--+-- ${moduleName} 模块`);
    //D(`   |`);
    for (let key in module) {
      if (util.isFunction(module[key])) {
        console.log(`   |-- ${key}(${module[key].paramNames || getParams(module[key])})`);
      }
    }
    console.log('   ^');
  } catch (err) {
    console.error(`加载模块时发生错误: \n ${err}`);
  }
}

/**
 * 清楚指定的模块缓存
 * @param filePath  模块文件地址
 */
function unload(filePath) {
  try {
    //获取模块名
    var moduleName = path.basename(filePath).replace('.js', '');

    //释放占用的子模块
    var module = require.cache[filePath];
    if (module.parent) {
      module.parent.children.splice(module.parent.children.indexOf(module), 1);
    }
    //清除缓存
    require.cache[filePath] = null;
    moduleCache.delete(moduleName);
    console.log(`模块 ${moduleName} 卸载完成`);
  } catch (err) {
    console.error(`卸载模块时发生错误: \n ${err}`);
  }
}

/**
 * 扫描路径下的所有js文件,并存储在fileList数组中
 * @param filePath    文件路径
 * @param fileList    文件列表
 */
function scan(filePath, fileList) {
  try {
    //初始化参数
    fileList = fileList || [];
    //读取文件信息
    var stats = fs.statSync(filePath);

    //判断文件的类型
    if (stats.isDirectory()) {
      //获取到目录下所有的文件
      var files = fs.readdirSync(filePath);
      //挨个遍历
      files.forEach(filename => scan(path.join(filePath, filename), fileList));
    } else {
      //如果是个普通的文件,先判断是不是JS文件
      if (filePath.endsWith('.js'))
        fileList.push(filePath);
    }
    return fileList;
  } catch (err) {
    console.error(`扫描模块时发生错误: \n ${err}`);
  }
}

/**
 * 容器初始化
 * @param rootPath  根路径
 */
export function init(rootPath) {
  try {
    //读取文件信息
    var stats = fs.statSync(rootPath);

    //判断路径的类型
    if (!stats.isDirectory()) {
      console.error(`模块根路径必须为目录,但却是 ${rootPath}`);
      return;
    }

    //扫描到所有的js文件
    var fileList = scan(rootPath);
    //挨个加载文件
    fileList.forEach(filePath => load(filePath));

    //如果不是生产环境下运行,则监视整个目录的变更
    if (process.env.NODE_ENV != 'production') {
      watchTree(rootPath, {
        ignoreDotFiles: true,
        persistent: false,
        filter: filepath => /^.+\.js$/.test(filepath)
      }, (filePath, curr, prev) => {
        if (typeof filePath == "object" && prev === null && curr === null) {
          console.log('开始监听目录变更,以进行热更新. 如需关闭热更新,请以生产模式启动(NODE_ENV=production)')
        } else if (prev === null) {
          load(filePath)
        } else if (curr.nlink === 0) {
          unload(filePath)
        } else {
          unload(filePath);
          load(filePath)
        }

        //刷新JS缓存
        clearJSCahce();
      });
    }

  } catch (err) {
    console.error('加载模块时发生错误: \n' + err);
  }
}

/**
 * 返回所有已经扫描到的模块
 * @returns {Map}   模块名称到模块的映射map
 */
export function getModules() {
  return moduleCache;
}
