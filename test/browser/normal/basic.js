/**
 * Created by demon on 16-4-11.
 */
describe('基本测试', function () {
  it('没有返回值', function () {
    return BasicAjax.getNone();
  });

  it('返回一个空', function (done) {
    BasicAjax.getNull().then(function (value) {
      value === null ? done() : done(new Error('返回值不为空'));
    });
  });

  it('返回一个布尔值', function (done) {
    BasicAjax.getBoolean().then(function (value) {
      value === false ? done() : done(new Error('返回值不为假'));
    });
  });

  it('返回一个数字', function (done) {
    BasicAjax.getNumber().then(function (value) {
      value === 3.14 ? done() : done(new Error('返回值不为 3.14'));
    });
  });

  it('返回一个字符串', function (done) {
    BasicAjax.getString().then(function (value) {
      value === 'eazyajax' ? done() : done(new Error('返回值不为"eazyajax"'));
    });
  });

  it('返回一个数组', function (done) {
    BasicAjax.getArray().then(function (value) {
      try {
        value.should.be.a.Array;
        value.should.eql([1, 2, 3, 4, 'five', null]);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('返回一个对象', function (done) {
    BasicAjax.getObject().then(function (value) {
      try {
        value.should.be.a.Object;
        value.should.eql({
          name: 'eazyajax',
          author: 'danwi'
        });
        done();
      } catch (err) {
        done(err);
      }
    });
  });
});