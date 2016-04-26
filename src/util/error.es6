/**
 * 方便的Ajax异常规范生成
 * Created by demon on 15-12-18.
 */
class EzError extends Error {
  constructor(message, code = 10000) {
    super(message);
    this.code = code;
  }
}

//导出到全局控件
global.EzError = EzError;
