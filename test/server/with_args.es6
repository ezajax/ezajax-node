/**
 * 带参数测试
 * Created by demon on 15-12-21.
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

describe('带参数测试', ()=> {

    it('参数为布尔', (done)=> {
        request(app)
            .get('/eazyajax/with_args/getBoolean.ac?args=[false]')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse((res.text));
                result.should.not.property('error');
                result.should.property('returnValue', true);
                done();
            });
    });

    it('参数为数字', (done)=> {
        request(app)
            .get('/eazyajax/with_args/getNumber.ac?args=[2.14]')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse((res.text));
                result.should.not.property('error');
                result.should.property('returnValue', 3.14);
                done();
            });
    });

    it('参数为字符串', (done)=> {
        request(app)
            .get('/eazyajax/with_args/getString.ac?args=["eazy"]')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse((res.text));
                result.should.not.property('error');
                result.should.property('returnValue', 'eazyajax');
                done();
            });
    });

    it('参数为数组,返回承诺', (done)=> {
        request(app)
            .get('/eazyajax/with_args/getArray.ac?args=[[1,2,3,4,"six",null]]')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse((res.text));
                result.should.not.property('error');
                result.should.property('returnValue');

                var returnValue = result.returnValue;
                returnValue.should.be.a.Array
                returnValue.should.eql([1, 2, 3, 4, 'five', null]);

                done();
            });
    });

    it('参数为对象,返回承诺', (done)=> {
        request(app)
            .get('/eazyajax/with_args/getObject.ac?args=[{"name":"eazyajax"}]')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse((res.text));
                result.should.not.property('error');
                result.should.property('returnValue');

                var returnValue = result.returnValue;
                returnValue.should.be.a.Object;
                returnValue.should.eql({
                    name: 'eazyajax',
                    author: 'danwi'
                });

                done();
            });
    });

    it('参数为时间,返回承诺', (done)=> {
        request(app)
            .get('/eazyajax/with_args/getDate.ac?args=["2016-01-01T12:00:00.126Z"]')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse((res.text));
                result.should.not.property('error');
                result.should.property('returnValue');

                var returnValue = result.returnValue;
                returnValue.should.be.a.string;
                returnValue.should.eql('2017-01-01T12:00:00.126Z');

                done();
            });
    });
});