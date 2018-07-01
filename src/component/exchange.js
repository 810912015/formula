/*
json请求
 */
export function exByJson(exdata){
    fetch(exdata.url,{
        method:exdata.method||'POST',
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify(exdata.pay)
    })
        .then((p)=>p.json())
        .then(d=>{exdata.good(d)})
        .catch(d=>{exdata.bad(d)})
}
/*
用户进行ajax请求需要的参数类
url:请求地址
goodFunc:成功回调
pay:请求数据
method:使用的httpMethod,默认post
execeptionFunc:异常时回调
 */
export function ExData(url,pay,goodFunc,method='POST',exceptionFunc=null) {
    this.url=url;
    this.good=goodFunc;
    this.pay=pay;
    this.method=method;
    this.bad=exceptionFunc;
}

export function isFunc(functionToCheck) {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}
/*
chrome 44 不支持Array.find,请使用此函数替代
 */
export function first(arr,f) {
    if(!isFunc(f)) return null;
    if(!arr||!arr.length) return null;
    for(let i=0;i<arr.length;i++){
        if(f(arr[i],i)) return arr[i];
    }
    return null;
}