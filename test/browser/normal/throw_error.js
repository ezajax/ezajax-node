/**
 * Created by demon on 16/4/12.
 */
describe('抛出异常测试', function () {
  it('如果id为1,抛出异常', function (done) {
    ThrowErrorAjax.throwError(1).then(function () {
      done(new Error('没有抓取到异常,竟然成功返回了'));
    }).catch(function (error) {
      try {
        error.code.should.eql(-5);
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('如果id为1,在承诺中抛出异常', function (done) {
    ThrowErrorAjax.throwErrorInPromise(1).then(function () {
      done(new Error('没有抓取到异常,竟然成功返回了'));
    }).catch(function (error) {
      try {
        error.code.should.eql(-5);
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('如果id为1,在承诺中reject异常', function (done) {
    ThrowErrorAjax.rejectErrorInPromise(1).then(function () {
      done(new Error('没有抓取到异常,竟然成功返回了'));
    }).catch(function (error) {
      try {
        error.code.should.eql(-5);
        error.message.should.eql('reject异常');
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('如果id为1,抛出异常,且附带错误码', function (done) {
    ThrowErrorAjax.throwErrorWithCodeAndMessage(1).then(function () {
      done(new Error('没有抓取到异常,竟然成功返回了'));
    }).catch(function (error) {
      try {
        error.code.should.eql(1);
        error.message.should.eql('id异常');
        done();
      } catch (error) {
        done(error);
      }
    });
  });

  it('如果id为1,在承诺中抛出异常,且附带错误码', function (done) {
    ThrowErrorAjax.throwErrorWithCodeAndMessageInPromise(1).then(function () {
      done(new Error('没有抓取到异常,竟然成功返回了'));
    }).catch(function (error) {
      try {
        error.code.should.eql(1);
        error.message.should.eql('id异常');
        done();
      } catch (error) {
        done(error);
      }
    });
  });
});