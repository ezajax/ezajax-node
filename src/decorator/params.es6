/**
 * Created by demon on 16/4/20.
 */
export default function (...paramNames) {
  return function (target, name) {
    target[name].paramNames = paramNames;
  }
}