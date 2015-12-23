/**
 * 带参数的Ajax模块
 * Created by demon on 15-12-21.
 */

/**
 * 返回一个布尔值
 * @returns {boolean}
 */
export function getBoolean(bool) {
    return !bool;
}

/**
 * 返回一个数字
 * @returns {number}    数字3.14
 */
export function getNumber(num) {
    return num + 1;
}

/**
 * 返回一个字符串
 * @returns {string}    字符串'eazyajax'
 */
export function getString(str) {
    return str + 'ajax';
}

/**
 * 返回一个数组
 * @returns {Promise}       数组[1, 2, 3, 4, 'five', null]
 */
export function getArray(arr) {
    return new Promise((resolve)=> {
        arr[4] = 'five';
        setTimeout(()=>resolve(arr), 20);
    });
}

/**
 * 返回一个对象
 * @returns {Object}    对象
 */
export function getObject(obj) {
    return new Promise((resolve)=> {
        obj.author = 'danwi';
        setTimeout(()=>resolve(obj), 20);
    });
}

/**
 * 返回一个时间
 * @param time
 * @returns {Promise}
 */
export function getDate(time) {
    return new Promise((resolve)=> {
        time.setFullYear(time.getFullYear() + 1);
        setTimeout(()=>resolve(time), 20);
    });
}

