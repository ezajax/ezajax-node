/**
 * Created by demon on 16/4/12.
 */
describe('带参数测试', function () {
  it('返回一个布尔值', function (done) {
    WithArgsAjax.getBoolean(true).then(function (value) {
      value === false ? done() : done(new Error('返回值不为假'));
    });
  });

  it('返回一个数字', function (done) {
    WithArgsAjax.getNumber(2.14).then(function (value) {
      value === 3.14 ? done() : done(new Error('返回值不为 3.14'));
    });
  });

  it('返回一个字符串', function (done) {
    WithArgsAjax.getString('eazy').then(function (value) {
      value === 'eazyajax' ? done() : done(new Error('返回值不为"eazyajax"'));
    });
  });

  it('返回一个数组', function (done) {
    WithArgsAjax.getArray([1, 2, 3, 4]).then(function (value) {
      try {
        value.should.be.a.Array;
        value.should.eql([1, 2, 3, 4, 'five']);
        done();
      } catch (err) {
        done(err);
      }
    });
  });

  it('返回一个对象', function (done) {
    WithArgsAjax.getObject({
      name: 'eazyajax'
    }).then(function (value) {
      try {
        value.should.be.a.Object;
        value.should.eql({
          name: 'eazyajax',
          author: 'danwi'
        });
        done();
      } catch (err) {
        done(err)
      }
    });
  });
});