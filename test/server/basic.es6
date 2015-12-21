/**
 * 基本测试
 * Created by demon on 15-12-21.
 */
import request from 'supertest';
import express from 'express';
import path from 'path';
import should from 'should';

import eazyajax from '../../index';

var app;

//先启动服务器
before(async(done)=> {
    try {
        //初始化express
        app = express();

        //初始化eazyajax
        var middleware = await eazyajax(path.join(__dirname, '../', 'ajax'));
        app.use(middleware);
        done();
    } catch (err) {
        done(err);
    }
});

describe('基本测试', ()=> {

    it('没有返回值', (done)=> {
        request(app)
            .get('/eazyajax/basic/getNull.ac')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse(res.text);
                result.should.not.property('returnValue');
                done();
            });
    });

    it('返回值为字符串', (done)=> {
        request(app)
            .get('/eazyajax/basic/getString.ac')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse((res.text));
                result.should.property('returnValue', 'eazyajax');
                done();
            });
    });

    it('返回值为数字', (done)=> {
        request(app)
            .get('/eazyajax/basic/getNumber.ac')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse((res.text));
                result.should.property('returnValue', 3.14);
                done();
            });
    });

    it('返回值为数组', (done)=> {
        request(app)
            .get('/eazyajax/basic/getArray.ac')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse((res.text));
                result.should.property('returnValue');
                var returnValue = result.returnValue;
                returnValue.should.be.a.Array
                returnValue.should.eql([1, 2, 3, 4, 'five', null]);

                done();
            });
    });

    it('返回值为对象', (done)=> {
        request(app)
            .get('/eazyajax/basic/getObject.ac')
            .expect(200)
            .expect('Content-Type', 'application/json; charset=utf-8')
            .end((err, res)=> {
                if (err)done(err);

                var result = JSON.parse((res.text));
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
});