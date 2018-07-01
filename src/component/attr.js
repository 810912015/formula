export default class Attr{
    constructor(id,dname,tname,type,value){
        this.id=id;
        this.dname=dname;
        this.tname=tname;
        this.type=type;
        this.value=value;
    }
    isConstant(){
        return this.type==="constant";
    }
}

const attrs=[
    {
        "values": [],
        "cats": [
            "动态通知测试"
        ],
        "moduleId": 61122,
        "id": 121,
        "name": {
            "display": "起飞时间",
            "value": "takeoff",
            "id": 121
        },
        "possibleValueJson": "[]",
        "common": false,
        "own": false,
        "nativeDesc": null,
        "propType": "datetime",
        "complex": true
    },
    {
        "values": [],
        "cats": [
            "RESCHEDULE_BILL"
        ],
        "moduleId": 61122,
        "id": 130,
        "name": {
            "display": "支付金额",
            "value": "PayAmount",
            "id": 130
        },
        "possibleValueJson": "[]",
        "common": false,
        "own": false,
        "nativeDesc": null,
        "propType": "decimal",
        "complex": true
    },
    {
        "values": [],
        "cats": [
            "REFUND_BILL"
        ],
        "moduleId": 61122,
        "id": 196,
        "name": {
            "display": "退票单ID",
            "value": "FlightRefundOrderID",
            "id": 196
        },
        "possibleValueJson": "[]",
        "common": false,
        "own": false,
        "nativeDesc": null,
        "propType": "decimal",
        "complex": true
    },
    {
        "values": [],
        "cats": [],
        "moduleId": 61122,
        "id": 205,
        "name": {
            "display": "处理时长",
            "value": "handleTimeSpan",
            "id": 205
        },
        "possibleValueJson": "[]",
        "common": false,
        "own": false,
        "nativeDesc": null,
        "propType": "timespan",
        "complex": true
    }
]

const makeSource=function (aas) {
    let ra=[];
    aas.forEach((t)=>{
        let ta=new Attr(t.id,t.name.display,t.name.value,t.propType,'');
        ra.push(ta)
    })
    ra.push(new Attr(0, '常量', '', 'constant', 'constant', ''))
    return ra;
}

//根据查出的属性生成展示需要用的属性对象
//后续从jsp中直接将属性json写入document.srvAttrs中
//测试时使用假数据-attrs
export const simpleAttr=(function () {
    if(document&&document.pvm&&document.pvm.props){
        return makeSource(document.pvm.props)
    }
    return makeSource(attrs)
}())



