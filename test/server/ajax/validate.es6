/**
 * 参数校验
 * Created by demon on 16-4-11.
 */
import {validate} from '../../../index'

class Validate {
  /**
   * 参数不能为空
   * @param name
   * @param age
   */
  @validate(validate.require(), validate.require())
  static requireArgs(name, age) {
  }

  /**
   * 必须为字符串
   * @param name
   */
  @validate(validate.string)
  static mustBeString(name) {
  }

  /**
   * 必须为数字
   * @param age
   */
  @validate(validate.number)
  static mustBeNumber(age) {
  }

  /**
   * 复杂校验
   * @param name  必须为字符串,且长度为 5~10
   * @param age   必须为数字,且大小 1~120
   */
  @validate(
    validate.string.min(5).max(10),
    validate.number.min(1).max(120)
  )
  static complexValidate(name, age) {

  }
}