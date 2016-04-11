/**
 * http context增强处理器
 * Created by demon on 15/12/19.
 */
import util from 'util';

export default function (req, res, next) {

  //设置统一的content-type
  res.contentType('application/json');

  //发送成功调用结果
  res.sendReturnValue = returnValue => res.send(JSON.stringify(returnValue));

  //发送异常信息
  res.sendError = (code, message) => {
    //异常请求服务器会返回500,以便前端来区分
    res.statusCode = 500;
    res.send(JSON.stringify({code, message}));
  };

  try {
    //获取调用信息
    var moduleName = req.params.moduleName;
    var methodName = req.params.methodName;
    var httpParams = Object.assign({}, req.query, req.body);
    var args = null;

    if (httpParams.args) {
      //如果有参数
      //时间解析器
      var dateParse = function (key, value) {
        if (typeof value === 'string') {
          var segments = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d*)Z$/.exec(value);
          if (segments) {
            return new Date(Date.UTC(+segments[1], +segments[2] - 1, +segments[3], +segments[4],
              +segments[5], +segments[6], +segments[7]));
          }
        }
        return value;
      };

      args = JSON.parse(httpParams.args, dateParse);
    }

    //初始化eazyajax调用的context到req对象上
    req.eazyajax = {req, res, session: req.session, moduleName, methodName, args};

  } catch (error) {
    res.sendError(-1, error.message);
    return false;
  }

  return next();
}