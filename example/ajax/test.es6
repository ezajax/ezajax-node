/**
 * 测试模块
 * Created by demon on 15-12-18.
 */

export function getName(id) {
    return id;
}
getName.perms = [function (id) {
    console.log(id);
    return true;
}];