/**
 * 用例
 * Created by demon on 15-12-18.
 */

import eazyajax from '../index';

((async function () {
    try {
        await eazyajax();
    } catch (error) {
        console.log(error.message);
    }
}))();
