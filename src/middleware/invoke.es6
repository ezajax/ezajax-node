/**
 * Ajax调用器
 * Created by demon on 15/12/19.
 */

export default function (req, res) {
  try {
    var context = req.ezajax;

    //权限检查通过,开始调用函数
    let returnValue = context.method.apply(context, context.args);

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
          error.code = error.code || -5;
          error.code = isNaN(error.code) ? -5 : error.code;
          error.message = error.message || '未知错误';
          res.sendError(error.code, error.message);
        });
      } else {
        //不是承诺,直接返回结果
        res.sendReturnValue(returnValue);
      }
    }
  } catch (error) {
    error.code = error.code || -5;
    error.code = isNaN(error.code) ? -5 : error.code;
    error.message = error.message || '未知错误';
    res.sendError(error.code, error.message);
  }
}
