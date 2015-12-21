/**
 * Ajax调用器
 * Created by demon on 15/12/19.
 */
export default function (req, res) {
    try {
        var context = req.eazyajax;
        var args = context.args;

        //权限检查通过,开始调用函数
        let returnValue = context.method.apply(context, args);

        //判断函数有没有返回值
        if (returnValue == null || returnValue == undefined) {
            //如果没有,直接返回一个空json
            res.sendReturnValue(undefined);
        } else {
            //如果有返回值,先判断是不是一个承诺
            if (returnValue.then) {
                //如果是一个承诺,则异步返回
                returnValue.then((value)=> {
                    res.sendReturnValue(value);
                }).catch((error)=> {
                    res.sendError(-5, error.message);
                });
            } else {
                //不是承诺,直接返回结果
                res.sendReturnValue(returnValue);
            }
        }
    } catch (error) {
        res.sendError(-1, error.message);
    }
}