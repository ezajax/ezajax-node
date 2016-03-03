/**
 * 权限验证测试
 * Created by demon on 15-12-22.
 */
import request from 'supertest';
import path from 'path';
import should from 'should';

import serverInit from '../assets/lib/server_init';

var app;
var userSession, adminSession;

//先启动服务器
before(async(done)=> {
  try {
    app = await serverInit();

    //拿到管理员权限
    request(app)
      .get('/eazyajax/account/login.ac?args=["user1","user1"]')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res)=> {
        if (err)done(err);

        var loginResult = JSON.parse(res.text);
        loginResult.should.not.property('error');
        loginResult.should.property('returnValue', true);

        userSession = res.headers['set-cookie'].pop().split(';')[0];
      });
    //普通用户权限
    request(app)
      .get('/eazyajax/account/login.ac?args=["admin","admin"]')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res)=> {
        if (err)done(err);

        var loginResult = JSON.parse(res.text);
        loginResult.should.not.property('error');
        loginResult.should.property('returnValue', true);

        adminSession = res.headers['set-cookie'].pop().split(';')[0];
      });
    done();
  } catch (err) {
    done(err);
  }
});

describe('权限验证测试', ()=> {

  it('不带权限调用getPublicInfo', (done)=> {
    request(app)
      .get('/eazyajax/permission/getPublicInfo.ac')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res)=> {
        if (err)done(err);

        var result = JSON.parse(res.text);
        result.should.not.property('error');
        result.should.property('returnValue', 'this is public information');
        done();
      });
  });

  it('不带权限调用getInternalInfo', (done)=> {
    request(app)
      .get('/eazyajax/permission/getInternalInfo.ac')
      .expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res)=> {
        if (err)done(err);

        var result = JSON.parse(res.text);
        result.should.property('error');
        result.error.should.property('code', -3);       //权限错误的错误码为-3
        result.error.should.property('message', '你不具备调用方法 permission.getInternalInfo 的权限');
        done();
      });
  });

  it('带普通用户权限调用getInternalInfo', (done)=> {
    //登陆成功,开始发送带权限的请求
    var req = request(app).get('/eazyajax/permission/getInternalInfo.ac');
    //回复登陆会话的cookie
    req.cookies = userSession;
    req.expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res)=> {
        if (err)done(err);

        var result = JSON.parse(res.text);
        result.should.not.property('error');
        result.should.property('returnValue', 'this is internal information');
        done();
      });
  });

  it('带普通用户权限调用getUser,username不是自己', (done)=> {
    //登陆成功,开始发送带权限的请求
    var req = request(app).get('/eazyajax/permission/getUser.ac?args=["user2"]');
    //回复登陆会话的cookie
    req.cookies = userSession;
    req.expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res)=> {
        if (err)done(err);

        var result = JSON.parse(res.text);
        result.should.property('error');
        result.should.not.property('returnValue');
        result.error.should.property('code', -3);
        result.error.should.property('message', '你不具备调用方法 permission.getUser 的权限');
        done();
      });
  });

  it('带普通用户权限调用getUser,username是自己', (done)=> {
    //登陆成功,开始发送带权限的请求
    var req = request(app).get('/eazyajax/permission/getUser.ac?args=["user1"]');
    //回复登陆会话的cookie
    req.cookies = userSession;
    req.expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res)=> {
        if (err)done(err);

        var result = JSON.parse(res.text);
        result.should.not.property('error');
        result.should.property('returnValue');
        result.returnValue.should.eql({username: 'user1'});
        done();
      });
  });

  it('带普通用户权限调用getAllUser', (done)=> {
    //登陆成功,开始发送带权限的请求
    var req = request(app).get('/eazyajax/permission/getAllUser.ac');
    //回复登陆会话的cookie
    req.cookies = userSession;
    req.expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res)=> {
        if (err)done(err);

        var result = JSON.parse(res.text);
        result.should.property('error');
        result.should.not.property('returnValue');
        result.error.should.property('code', -3);
        result.error.should.property('message', '你不具备调用方法 permission.getAllUser 的权限');
        done();
      });
  });

  it('带管理员权限调用getAllUser', (done)=> {
    //登陆成功,开始发送带权限的请求
    var req = request(app).get('/eazyajax/permission/getAllUser.ac');
    //回复登陆会话的cookie
    req.cookies = adminSession;
    req.expect(200)
      .expect('Content-Type', 'application/json; charset=utf-8')
      .end((err, res)=> {
        if (err)done(err);

        var result = JSON.parse(res.text);
        result.should.not.property('error');
        result.should.property('returnValue');
        result.returnValue.should.eql([
          {username: 'admin'},
          {username: 'user1'},
          {username: 'user2'},
          {username: 'user3'},
          {username: 'user4'},
          {username: 'user5'}
        ]);
        done();
      });
  });
});