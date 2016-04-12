/**
 * 文件上传中间件
 * Created by demon on 16/4/12.
 */
import multer from 'multer';

export default function (option) {
  //参数初始化
  option = Object.assign({}, {
    maxCount: 5,
    maxSize: 50000000
  }, option);

  var uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
      files: option.maxCount,
      fileSize: option.maxSize
    }
  }).any();

  return function (req, res, next) {
    //手动调用解析
    uploader(req, res, function (err) {
      if (err) {
        res.statusCode = 500;
        res.send(JSON.stringify({
          code: -1,
          message: err.message
        }))
      } else {
        next();
      }
    });
  }
}