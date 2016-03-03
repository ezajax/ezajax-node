/**
 * 参数校验器
 * Created by demon on 16-1-18.
 */
import joi from 'joi';
import util from 'util';

module.exports = function (req, res, next) {
  var context = req.eazyajax;

  var schemas = context.method.validate;

  //如果存在校验器
  if (util.isArray(schemas)) {

    //遍历校验器
    for (var index = 0; index < schemas.length; index++) {
      var value = context.args[index];
      var schema = schemas[index];
      var vaild = joi.validate(value, schema, {convert: false});

      //验证不通过
      if (vaild.error) {
        res.sendError(-4, vaild.error.message);
        return;
      }
    }
  }
  return next();
};


