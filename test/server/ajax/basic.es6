/**
 * Ajax基础模块
 * Created by demon on 15-12-21.
 */

/**
 * 没有返回值
 */
export function getNone() {

}

/**
 * 返回一个空
 * @returns {null}      空值
 */
export function getNull() {
  return null;
}

/**
 * 返回一个布尔值
 * @returns {boolean}
 */
export function getBoolean() {
  return false;
}

/**
 * 返回一个数字
 * @returns {number}    数字3.14
 */
export function getNumber() {
  return 3.14;
}

/**
 * 返回一个字符串
 * @returns {string}    字符串'ezajax'
 */
export function getString() {
  return 'ezajax';
}

/**
 * 返回一个数组
 * @returns {*[]}       数组[1, 2, 3, 4, 'five', null]
 */
export function getArray() {
  return [1, 2, 3, 4, 'five', null];
}

/**
 * 返回一个对象
 * @returns {Object}    对象
 */
export function getObject() {
  return {
    name: 'ezajax',
    author: 'danwi'
  }
}


