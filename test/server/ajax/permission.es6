/**
 * 带权限验证的Ajax模块
 * Created by demon on 15-12-22.
 */
import {permission} from '../../../index'

/********权限定义-这一部分可以定义在外部,作为通用权限验证的定义********/
//管理员权限的验证方式
var admin = function () {
  var self = this;
  return new Promise((resolve, reject)=> {
    setTimeout(()=> {
      try {
        resolve(self.session.user.role === 'admin');
      } catch (error) {
        reject(error);
      }
    }, 20);
  });
};

//用户权限的验证方式
var user = function () {
  if (!!this.session.user)
    return Promise.resolve(true);
  else
    return Promise.reject();
};

//个人权限的验证方式
var myself = function (username) {
  if (username === this.session.user.username)
    return true;
  else
    throw new Error('a cute error');
};

//任意权限
var everyone = function () {
  return true;
};
/***************************************************************/

//管理员能够访问所有的模块
@permission(admin)
class Permission {
  /**
   * 获取所有的用户,该方法还需要管理员登陆权限
   * @returns {*[]}   所有的用户
   */
  //不需要写,函数默认继承模块的权限
  //@permission(admin)
  static getAllUser() {
    return [
      {username: 'admin'},
      {username: 'user1'},
      {username: 'user2'},
      {username: 'user3'},
      {username: 'user4'},
      {username: 'user5'}
    ];
  }

  /**
   * 根据用户名获取指定的用户信息
   * @param username      指定的用户名
   * @returns {Promise}   对应的用户信息
   */
  //该方法可以被管理员任意调用(模块权限指定了),也可以被拥有个人权限(获取的信息为自己的)的用户调用
  @permission(myself, admin)   //后面的这个admin其实可以不用
  static getUser(username) {
    return new Promise((resolve)=> {
      setTimeout(()=>resolve({username}), 20);
    });
  }

  /**
   * 获取内部信息,任意登陆的人员都能调用
   * @returns {string}
   */
  //该方法可以被任意登陆的用户调用
  @permission(user)
  static getInternalInfo() {
    return 'this is internal information';
  }

  /**
   * 获取公开信息,可以被任意人员调用
   * @returns {string}
   */
  //在其他的模块里面,无需权限的方法本来不用声明一个everyone权限,但是该模块已经申明了全局模块权限
  @permission(everyone)
  static getPublicInfo() {
    return 'this is public information';
  }
}

exports = {
  getAllUser: Permission.getAllUser,
  getUser: Permission.getUser,
  getInternalInfo: Permission.getInternalInfo,
  getPublicInfo: Permission.getPublicInfo
};
