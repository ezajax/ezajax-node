/**
 * 错误调用单元测试
 * Created by demon on 15-12-22.
 */
import request from 'supertest';
import express from 'express';
import path from 'path';
import should from 'should';

import serverInit from '../lib/server_init';

var app;

//先启动服务器
before(async(done)=> {
    try {
        app = await serverInit();
        done();
    } catch (err) {
        done(err);
    }
});

describe('错误调用测试', ()=> {
    it('模块不存在', (done)=> {
        request(app)
            .get('/eazyajax/anymodule/anymethod.ac')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse(res.text);
                result.should.property('error');
                result.should.not.property('returnValue');
                result.error.should.property('code', -2);
                result.error.should.property('message', '模块 anymodule 找不到');
                done();
            });
    });

    it('方法不存在', (done)=> {
        request(app)
            .get('/eazyajax/basic/anymethod.ac')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse(res.text);
                result.should.property('error');
                result.should.not.property('returnValue');
                result.error.should.property('code', -2);
                result.error.should.property('message', '方法 basic.anymethod 找不到');
                done();
            });
    });
});
