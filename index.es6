/**
 * Modules Exporter
 * Created by demon on 15-12-17.
 */

import sayHello from './src/eazyajax';

//main function
(async function () {
    var content = await sayHello('demon');
    console.log(content);
})();