import {first} from "./exchange";
//属性名称
export const Props= {
    common: ['用户名','工作状态','工作开始时间','工作结束时间',''],
    simple:['姓名','分配权重'],
    formula:['编辑公式']
}
export function Name(d,v) {
    this.display=d;
    this.value=v
}
Name.prototype.isMe=function(n){
    return this.display===n||this.value===n;
}
Name.constant=[
    new Name('用户名','eid'),
    new Name('姓名','name'),
    new Name('','robot'),
    new Name('工作状态','status'),
    new Name('分配权重','weight'),
    new Name('工作开始时间','startWorkTime'),
    new Name('工作结束时间','endWorkTime'),
    new Name('编辑公式','formulas'),
]
Name.get=function (v) {
    return first(Name.constant,t=>t.isMe(v));
}
Name.isTime=function (n) {
    return n==='工作开始时间'||n==='工作结束时间'
}
//验证state对象
export function stateVal(state) {
    function Vr(msg,valid=false) {
        this.msg=msg;
        this.valid=valid;
    }
    const specChars="'\";:?/>.<,|\\+=)(*&^%$#@!~` ";
    function valName(name,key) {
        function mkMsg(msg) {
            return key+msg
        }
        if(!name) return new Vr(mkMsg('不能为空'))
        let na=name.split('');
        if(na.length>50||na.length<2) return new Vr(mkMsg("最多50字符,最少2个字符"))
        let sc=first(na,t=>specChars.indexOf(t)>-1);
        if(sc!=null) return new Vr(mkMsg("符号只能使用下划线'_'或连接线'-',不能包含"+sc))
        return null;
    }
    let r=[];
    let er=valName(state.eid,Name.get('eid').display)
    if(er!=null) r.push(er);
    if(!state.robot){
        let nr=valName(state.name,Name.get('name').display)
        if(nr!=null) r.push(nr)
        if(!!state.weight){
            let wi=parseInt(state.weight,10);
            if(isNaN(wi)||wi<=0){
                r.push(new Vr("分配权重必须为空或是大于0的整数"))
            }
        }

    }
    else {
        if(!state.formulas||!state.formulas.length||state.formulas.length===0){
            r.push(new Vr('公式至少要包含一项'))
        }
    }
    let msg='';
    r.forEach((t,i)=>{
        if(i>0){
            msg+=','
        }
        if(t) msg+=t.msg;
    })
    var rr= {
        valid:r.length===0,
        msg:msg,
        items:r
    }
    return rr;
}