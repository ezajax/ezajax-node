/**
 * 抛出异常的Ajax模块
 * Created by demon on 15-12-22.
 */

export default class ThrowError {
  /**
   * 如果id为1,抛出异常
   * @param id
   * @returns {*}
   */
  static throwError(id) {
    if (id === 1)
      throw new Error();
    return id;
  }

  /**
   * 如果id为1,在承诺中抛出异常
   * @param id
   * @returns {Promise}
   */
  static throwErrorInPromise(id) {
    return new Promise((resolve, reject)=> {
      if (id === 1)
        throw new Error();
      resolve(id);
    });
  }

  /**
   * 如果id为1,在承诺中reject异常
   * @param id
   * @returns {Promise}
   */
  static rejectErrorInPromise(id) {
    return new Promise((resolve, reject)=> {
      if (id === 1) {
        reject(new Error('reject异常'));
        return;
      }
      resolve(1);
    });
  }

  /**
   * 如果id为1,抛出异常,且附带错误码
   * @param id
   * @returns {*}
   */
  throwErrorWithCodeAndMessage(id) {
    if (id === 1) {
      var error = new Error('id异常');
      error.code = 1;
      throw  error;
    }
    return id;
  }

  /**
   * 如果id为1,在承诺中抛出异常,且附带错误码
   * @param id
   * @returns {Promise}
   */
  throwErrorWithCodeAndMessageInPromise(id) {
    return new Promise((resolve, reject)=> {
      if (id === 1) {
        var error = new Error('id异常');
        error.code = 1;
        throw error;
      }
      resolve(id);
    });
  }
}