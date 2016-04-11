/**
 * Created by demon on 16-1-18.
 */
export default function (...permissionFunctions) {
  return function (target, name) {
    if (name)
      target[name].permission = permissionFunctions;
    else
      target.permission = permissionFunctions;
  }
}