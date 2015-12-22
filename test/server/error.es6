/**
 * 获取调用异常单元测试
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

describe('异常调用测试', ()=> {
    it('基本异常', (done)=> {
        request(app)
            .get('/eazyajax/throw_error/throwError.ac?args=[1]')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse(res.text);
                result.should.property('error');
                result.should.not.property('returnValue');
                result.error.should.property('code', -5);
                result.error.should.property('message', '未知错误');
                done();
            });
    });

    it('承诺中的异常', (done)=> {
        request(app)
            .get('/eazyajax/throw_error/throwErrorInPromise.ac?args=[1]')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse(res.text);
                result.should.property('error');
                result.should.not.property('returnValue');
                result.error.should.property('code', -5);
                result.error.should.property('message', '未知错误');
                done();
            });
    });

    it('承诺中reject的异常', (done)=> {
        request(app)
            .get('/eazyajax/throw_error/rejectErrorInPromise.ac?args=[1]')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse(res.text);
                result.should.property('error');
                result.should.not.property('returnValue');
                result.error.should.property('code', -5);
                result.error.should.property('message', 'reject异常');
                done();
            });
    });

    it('带code和message的基本异常', (done)=> {
        request(app)
            .get('/eazyajax/throw_error/throwErrorWithCodeAndMessage.ac?args=[1]')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse(res.text);
                result.should.property('error');
                result.should.not.property('returnValue');
                result.error.should.property('code', 1);
                result.error.should.property('message', 'id异常');
                done();
            });
    });

    it('带code和message的承诺异常', (done)=> {
        request(app)
            .get('/eazyajax/throw_error/throwErrorWithCodeAndMessageInPromise.ac?args=[1]')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse(res.text);
                result.should.property('error');
                result.should.not.property('returnValue');
                result.error.should.property('code', 1);
                result.error.should.property('message', 'id异常');
                done();
            });
    });
});
