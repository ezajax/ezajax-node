/**
 * 参数校验器
 * Created by demon on 16-1-18.
 */
import joi from 'joi';
import util from 'util';
import getParams from 'get-parameter-names';

export default function (req, res, next) {
  var context = req.ezajax;

  var schemas = context.method.validate;

  //如果存在校验器
  if (util.isArray(schemas)) {

    //遍历校验器
    for (var index = 0; index < schemas.length; index++) {
      var name = context.args[index];
      var schema = schemas[index];
      var result = joi.validate(name, schema, {convert: false});

      //验证不通过
      if (result.error) {
        //获取到参数名
        var paramNames = getParams(context.method);
        var paramName = paramNames[index] || 'arg' + index;

        res.sendError(-4, `[${paramName} valid fail] ${result.error.message.replace('"value"', '')}`);
        return;
      }
    }
  }
  return next();
};


