/**
 * Ajax调用器
 * Created by demon on 15/12/19.
 */
import getParams from 'get-parameter-names';

export default function (req, res) {
  try {
    var context = req.ezajax;
    var args = [];

    //参数检查和位置重排
    var keyCount = 0;
    for (let key in context.args) {
      if (context.args.hasOwnProperty(key)) {
        keyCount++;
      }
    }

    //参数不为空
    if (keyCount) {
      if (!context.args.hasOwnProperty('ezajax_arg_0')) {
        //基于参数命名的调用,用于APP的调用
        //获取到函数签名时候的参数
        var paramNames = getParams(context.method);
        for (var index = 0; index < paramNames.length; index++) {
          //拿到参数名
          var paramName = paramNames[index];
          //找到对应的参数的值
          var value = context.args[paramName];
          //设置到对应位置的数组中
          args[index] = value;
        }
      } else {
        //基于位置的调用
        for (let key in context.args) {
          if (context.args.hasOwnProperty(key))
            args[parseInt(key.replace('ezajax_arg_', ''))] = context.args[key];
        }
      }
    }

    //权限检查通过,开始调用函数
    let returnValue = context.method.apply(context, args);

    //判断函数有没有返回值
    if (returnValue === undefined) {
      //返回自定义
      res.sendReturnValue(undefined);
    } else if (returnValue === null) {
      //返回空值
      res.sendReturnValue(null);
    } else {
      //如果有返回值,先判断是不是一个承诺
      if (returnValue.then) {
        //如果是一个承诺,则异步返回
        returnValue.then((value)=> {
          res.sendReturnValue(value);
        }).catch((error)=> {
          if (error.code == null)
            error.code = -5;
          if (error.message == null || error.message == '')
            error.message = '未知错误';
          res.sendError(error.code, error.message);
        });
      } else {
        //不是承诺,直接返回结果
        res.sendReturnValue(returnValue);
      }
    }
  } catch (error) {
    if (error.code == null)
      error.code = -5;
    if (error.message == null || error.message == '')
      error.message = '未知错误';
    res.sendError(error.code, error.message);
  }
}