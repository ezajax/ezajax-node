/**
 * EazyAjax for JS
 * Created by demon on 15-12-17.
 */

/**
 * 测试方法
 * @param name
 * @returns {Promise}
 */
export default async function (name) {
    return new Promise((resolve)=> {
        setTimeout(()=> {
            resolve(`hello ${name}`);
        }, 3000);
    });
};