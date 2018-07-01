import React, { Component } from 'react';
import '../css/bootstrap.css';
import '../App.css'
import PropRow from './prop-row'
import PropCtrl from './prop-ctrl'
import moment from 'moment'
import 'moment/locale/zh-cn'
import {Name,stateVal,Props} from "./validate";
import {exByJson,ExData} from "./exchange";
import {simpleAttr} from "./attr";
import {first} from "./exchange";

const makeState=function (){
        var ts={};
        if(document.pvm&&document.pvm){
            ts.group=(document.pvm.gid)||0;
            let m=document.pvm.model;
            if(m) {
                ts = {
                    robot: m.robot || false,
                    eid: (m.eid) || '',
                    name: (m.name) || '',
                    status: (m.status) || '',
                    weight: (m.weight) || '',
                    startWorkTime:!m.startWorkTime?null: moment(m.startWorkTime,"HH:mm"),
                    endWorkTime:!m.endWorkTime?null: moment(m.endWorkTime,"HH:mm"),
                    group: (document.pvm.gid) || 0,
                    clerk: (m.clerk) || 0
                }
                ts.formulas=makeFormula(m.formulas)
            }
        }
        else {
            this.state={
                robot:false,
                formulas:[],
                eid:'',
                name:'',
                status:'',
                weight:'',
                startWorkTime:null,
                endWorkTime:null,
                group:0,
                clerk:0,
            }
        }
        ts.msg='';
        ts.valid=null;
        ts.posting=false;
        return ts;
    }
const makeFormula=function (fml) {
        let r=[];
        if(fml&&fml.length&&fml.length>0) {
            fml.forEach((t) => {
                r.push({
                    cur: t.propDisplayName,
                    op: t.operateMark,
                    pre: t.preBracket,
                    post: t.postBracket,
                    value: t.propValue
                })
            })
            return r;
        }
    }
const toSave=function (state) {
        let ps=Object.assign({},state);
        ps.formulas=[];
        ps.startWorkTime=!ps.startWorkTime?"":ps.startWorkTime.format("HH:mm")
        ps.endWorkTime=!ps.endWorkTime?"":ps.endWorkTime.format("HH:mm")
        if(state.robot) {
            state.formulas.forEach((t, i) => {
                let tp = first(simpleAttr, (tt) => tt.dname === t.cur)
                ps.formulas.push({
                    sequence: i,
                    propId: tp.id,
                    propDisplayName: tp.dname,
                    propTransferName: tp.tname,
                    propType: tp.type,
                    operateMark: t.op,
                    preBracket: t.pre,
                    postBracket: t.post,
                    propValue: t.value
                })
            })
        }
        else{
            ps.wight=state.wight;
            ps.name=state.name;
        }
        return ps;
    }

//创建或修改员工
export  default class Clerk extends Component {
    constructor(props){
        super(props)
        this.state=makeState();
        this.propChange=this.propChange.bind(this)
        this.makeCtrl=this.makeCtrl.bind(this)
        this.save=this.save.bind(this)
        this.makeInput=this.makeInput.bind(this)
        this.makeCheckbox=this.makeCheckbox.bind(this)
        this.makeFormula=this.makeFormula.bind(this)
        this.makeSelect=this.makeSelect.bind(this)
        this.validate=this.validate.bind(this)
        this.changeState=this.changeState.bind(this)
        this.suc=this.suc.bind(this)
        this.fail=this.fail.bind(this)
    }
    changeState(e){
        this.setState(e,this.validate)
    }
    validate(){
        let r=stateVal(this.state);
        this.setState({
            valid:r.valid,
            msg:r.msg
        })
        return r;
    }
    suc(e){
        this.setState({posting: false})
        if(e.success) {
            window.location = document.pvm.loc;
        }else{
            let msg=e.msg||"操作失败,请查询日志";
            this.setState({msg: msg})
        }
    }
    fail(e){
        this.setState({posting: false,msg:"异常:"+e.toString()+",请查询日志"})
        console.log("error",e,e.toString())
    }
    save(){
        if(this.state.posting) return;
        if(this.state.valid===null){
           let r= this.validate()
            if(!r.valid) return;
        }
        else {
            if (!this.state.valid) return;
        }
        let ps= toSave(this.state)
        var ed=new ExData("/subject/create",ps,this.suc,'POST',this.fail)
        this.setState({posting:true,msg:'正在操作请稍候...'})
        exByJson(ed)
    }
    propChange(key,value){
        let v=null;
        if(Name.isTime(key)){
            v=value
        }else {
            v=value.value;
        }
        if(key===''){
            v=value.checked;
            this.changeState({robot:v})
        }else{
            let k=Name.get(key).value;
            this.changeState({[k]:v})
        }
    }
    makeInput(name){
        return {
            type:'input',
            selected:this.state[Name.get(name).value],
            change:(value)=>{
                this.propChange(name,value.target)
            }
        }
    }
    makePicker(name){
        return {
            type:'datepicker',
            selected:this.state[Name.get(name).value],
            change:(value)=>{
                this.propChange(name,value)
            },
            raw:(value)=>{
                if(value===null||value.length!==5) return;
                let mv= moment(value,"HH:mm");
                this.propChange(name,mv);
            }
        }
    }
    makeCheckbox(name){
        return {
            type:'checkbox',
            selected:this.state[Name.get(name).value],
            change:(value)=>{
                this.propChange(name,value.target)
            },
            addition:{
                tag:'公式机器人'
            }
        }
    }
    makeFormula(name){
        return {
            type:'formula',
            selected:this.state[Name.get(name).value],
            change:(e)=>{
                this.changeState({formulas:e})
            },
            addition:{}
        }
    }
    makeSelect(name){
        return {
            type:'select',
            selected:this.state[Name.get(name).value],
            change:(value)=>{
                this.propChange(name,value.target)
            },
            addition:{
                ops:[
                    {
                        name:'工作中',
                        value:'1'
                    },
                    {
                        name:'暂停',
                        value:'2'
                    },
                    {
                        name:'下班',
                        value:'3'
                    }
                ]
            }
        }
    }
    makeCtrl(name){
        switch (name){
            case '用户名':
            case '姓名':
            case '分配权重':{
                return this.makeInput(name)
            }
            case '工作开始时间':
            case '工作结束时间':{
                return this.makePicker(name)
            }
            case '':{
                return this.makeCheckbox(name)
            }
            case '编辑公式':{
                return this.makeFormula(name)
            }
            case '工作状态':{
                return this.makeSelect(name)
            }
            default:{
                return {
                    type:''
                }
            }
        }
    }
    render() {
        let rs=[];
        Props.common.forEach((a)=>{rs.push(a)})
        if(this.state.robot) {
            Props.formula.forEach(a => rs.push(a))
        }
        else {
            Props.simple.forEach(a=>rs.push(a))
        }
        let ru=[]
        rs.forEach((a,i)=>{
            let v=this.makeCtrl(a);
            let vv=(
                <PropCtrl {...v}/>
            )
            ru.push(<PropRow key={i} name={a} value={vv}/>)
        })
        let title=(this.state.clerk===0?"新建":"修改")+"员工"
        return (
                <div className="panel panel-default">
                    <div className="panel-heading">
                        {title}
                        <button className="btn btn-primary btn-xs" onClick={()=>this.suc({success:true})} style={{float:'right'}}>
                            返回
                        </button>
                    </div>
            <div className="panel-body">
                {ru}
                <hr/>
                <div className="row">
                    <div className="col-md-6 col-md-offset-2">
                        <div style={{color:this.state.valid?'black':'red'}}>
                            {this.state.msg}
                        </div>
                        <div>
                        <a className="btn btn-default" onClick={this.save}>保存</a>
                        </div>
                    </div>
                </div>
            </div>
                </div>
        );
    }
}