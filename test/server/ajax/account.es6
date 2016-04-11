/**
 * 账户登陆注销Ajax
 * Created by demon on 15-12-22.
 */

/**
 * 登陆函数,任意权限即可执行,当用户名==密码时登陆成功
 * @param username      用户名
 * @param password      密码
 */
export function login(username, password) {
  if (username === password) {
    this.session.user = {
      username,
      password
    };
    this.session.user.role = username === 'admin' ? 'admin' : 'user';
    return true;
  }

}

/**
 * 登出函数
 */
export function logout() {
  delete this.session.user;
}

