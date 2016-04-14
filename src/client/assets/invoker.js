/**
 * ezajax调用者
 * Created by demon on 16/4/12.
 */
//ezajax 调用根路径
var __scripts = [];
for (var index = 0; index < document.scripts.length; index++)
  if (document.scripts[index].src !== '')
    __scripts.push(document.scripts[index]);
var __currentJSUrl = __scripts[__scripts.length - 1].src
var __ezajaxRoot = __currentJSUrl.substring(0, __currentJSUrl.lastIndexOf("/") + 1);

//invoker方法,所有的调用实际由它来处理
var __ezajax_invoker = function (moduleName, methodName, argsArray) {
  //构造url
  var url = __ezajaxRoot + moduleName + '/' + methodName + '.ac';

  var args = {};

  for (var index = 0; index < argsArray.length; index++) {
    args['ezajax_arg_' + index] = encodeURIComponent(JSON.stringify(argsArray[index]));
  }

  var promise = new Promise(function (resolve, reject) {
    __ezajax({
      url: url,
      method: 'POST',
      data: args,
      success: function (data) {
        //时间解析器
        var dateParse = function (key, value) {
          if (typeof value === 'string') {
            var segments = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d*)Z$/.exec(value);
            if (segments)
              return new Date(Date.UTC(+segments[1], +segments[2] - 1, +segments[3], +segments[4], +segments[5], +segments[6], +segments[7]));
          }
          return value;
        };
        //解析json
        if (data === '') {
          var json = undefined;
        } else {
          var json = JSON.parse(data, dateParse);
        }
        resolve(json);
      },
      error: function (status, data) {
        if (status === 500) {
          var json = JSON.parse(data);
          var error = new Error(json.message);
          error.code = json.code;
          reject(error);
        } else {
          var error = new Error("Ajax调用异常");
          error.code = -1;
          reject(error);
        }
      }
    });
  });

  return promise;
};