/**
 * 上下文增加
 *    经过该中间件，res对象将挂载两个增强方法
 * Created by demon on 15/12/19.
 */
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

  //初始化ezajax调用的context到req对象上
  req.ezajax = {req, res, session: req.session};

  return next();
}