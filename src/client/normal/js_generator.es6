/**
 * 通用JS生成器
 * Created by demon on 15-12-19.
 */

import handlebars from 'handlebars';
import bluebird from 'bluebird';
import path from 'path';

import {D,W,E} from '../../utils/logger';

var fs = bluebird.promisifyAll(require('fs'));

export default async function () {
    var templateContent = (await fs.readFileAsync(path.join(__dirname, 'template.hbs'))).toString('UTF-8');
    return templateContent;
}