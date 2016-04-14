/**
 * 参数格式化
 *      将http请求参数进行处理,并反序列化为JSON对象
 *      并且将调用统一为 "按参数位置调用" 的数组形式
 * Created by demon on 16-4-14.
 */
import getParams from 'get-parameter-names'

export default function (req, res, next) {
  try {
    //处理从post,get上来的参数
    //如果存在字段重名multiparty的优先级最高,其次是普通的post,最后是get的url参数
    var httpArgs = Object.assign({}, req.query, req.body);

    //合并文件内容到请求参数中
    if (req.files)
      for (var file of req.files)
        httpArgs[file.fieldname] = file;

    //反序列化每一个字段的值
    for (var key in httpArgs) {
      let value = httpArgs[key];
      let param;

      try {
        //如果字段是一个json字符串,或者'数字字符串'如 123123,这里会成功解析
        param = JSON.parse(httpArgs[key], jsonProcessor);
      } catch (e) {
        //如果字段是一个普通的字符串,或者对象将会引发异常
        if (typeof value === 'string')
        //如果是一个普通字符串,则加个 "" 包起来,再做处理
          param = JSON.parse(`"${httpArgs[key]}"`, jsonProcessor);
        else
        //否则的话应该是对象,直接赋值就是了
          param = value;
      }
      httpArgs[key] = param;
    }

    //反序列化完毕,开始进行参数排序
    var invokeArgs = [];

    if (!httpArgs.hasOwnProperty('ezajax_arg_0')) {
      //基于参数命名的调用,用于APP的调用
      //获取到函数签名时候的参数
      var paramNames = getParams(context.method);
      for (var index = 0; index < paramNames.length; index++) {
        //拿到参数名
        var paramName = paramNames[index];
        //找到对应的参数的值,设置到对应位置的数组中
        invokeArgs[index] = httpArgs[paramName];
      }
    } else {
      //基于位置的调用
      for (let key in httpArgs) {
        if (httpArgs.hasOwnProperty(key)) {
          let argPosition = 0;
          try {
            argPosition = parseInt(key.replace('ezajax_arg_', ''));
          } catch (error) {
            console.warn('基于参数位置的调用却包含非法的字段');
          }
          invokeArgs[argPosition] = httpArgs[key];
        }
      }
    }

    //将处理好的参数存入到上下文中
    context.args = invokeArgs;
  } catch (error) {
    res.sendError(-1, error.message);
    return false;
  }

  return next();
}

/**
 * json处理器
 *    将标准的UTC时间字符串反序列化为Date对象
 * @param key
 * @param value
 * @returns {*}
 */
function jsonProcessor(key, value) {
  if (typeof value === 'string') {
    var segments = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d*)Z$/.exec(value);
    if (segments) {
      return new Date(Date.UTC(+segments[1], +segments[2] - 1, +segments[3], +segments[4],
        +segments[5], +segments[6], +segments[7]));
    }
  }
  return value;
};