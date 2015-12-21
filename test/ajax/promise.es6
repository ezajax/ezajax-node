/**
 * Ajax基础模块-返回一个承诺
 * Created by demon on 15-12-21.
 */

/**
 * 没有返回值
 */
export function getNone() {
    return new Promise((resolve)=> {
        setTimeout(()=>resolve(), 20);
    });
}

/**
 * 返回一个空
 * @returns {Promise}      空值
 */
export function getNull() {
    return new Promise((resolve)=> {
        setTimeout(()=>resolve(null), 20);
    });
}

/**
 * 返回一个数字
 * @returns {Promise}    数字3.14
 */
export function getNumber() {
    return new Promise((resolve)=> {
        setTimeout(()=>resolve(3.14), 20);
    });
}

/**
 * 返回一个字符串
 * @returns {Promise}    字符串'eazyajax'
 */
export function getString() {
    return new Promise((resolve)=> {
        setTimeout(()=>resolve('eazyajax'), 20);
    });
}

/**
 * 返回一个数组
 * @returns {Promise}       数组[1, 2, 3, 4, 'five', null]
 */
export function getArray() {
    return new Promise((resolve)=> {
        setTimeout(()=>resolve([1, 2, 3, 4, 'five', null]), 20);
    });
}

/**
 * 返回一个对象
 * @returns {Promise}    对象
 */
export function getObject() {
    return new Promise((resolve)=> {
        setTimeout(()=>resolve({name: 'eazyajax', author: 'danwi'}), 20);
    });
}
