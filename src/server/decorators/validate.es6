/**
 * 参数验证修饰器
 * Created by demon on 16-1-18.
 */
import joi from 'joi';

module.exports = function (...schemas) {
    return function (target, name) {
        target[name].validate = schemas;
    }
};

module.exports.should = joi;