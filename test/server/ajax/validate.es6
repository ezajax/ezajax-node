/**
 * 参数校验
 * Created by demon on 16-4-11.
 */
import {validate} from '../../../index'

class ValidateAjax {
  /**
   * 参数不能为空
   * @param name
   * @param age
   */
  @validate(validate.should.required(), validate.should.required())
  static requireArgs(name, age) {
  }

  /**
   * 必须为字符串
   * @param name
   */
  @validate(validate.should.string())
  static mustBeString(name) {
  }

  /**
   * 必须为数字
   * @param age
   */
  @validate(validate.should.number())
  static mustBeNumber(age) {
  }

  /**
   * 复杂校验
   * @param name  必须为字符串,且长度为 5~10
   * @param age   必须为数字,且大小 1~120
   */
  @validate(
    validate.should.string().min(5).max(10),
    validate.should.number().min(1).max(120)
  )
  static complexValidate(name, age) {

  }
}

module.exports = {
  requireArgs: ValidateAjax.requireArgs,
  mustBeString: ValidateAjax.mustBeString,
  mustBeNumber: ValidateAjax.mustBeNumber,
  complexValidate: ValidateAjax.complexValidate
}