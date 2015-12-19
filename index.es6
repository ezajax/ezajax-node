/**
 * Module initer and Modules exporter
 * Created by demon on 15-12-17.
 */

import eazyajax from './src/eazyajax';
import util from 'util';

/**
 * 包装方法,将eazyajax包装一下共外部使用
 * @param path      路径
 * @param option    选项
 * @param callback  回调
 */
module.exports = function (path, option, callback) {
    if (util.isFunction(path)) {
        callback = path;
        path = undefined;
    }
    if (util.isObject(path)) {
        option = path;
        path = undefined;
    }
    if (util.isFunction(option)) {
        callback = option;
        option = undefined;
    }

    if (callback) {
        (async function () {
            try {
                var middleware = await  eazyajax(path, option);
                callback(null, middleware);
            } catch (error) {
                callback(error, null);
            }
        })();
    } else {
        return eazyajax(path, option);
    }
};