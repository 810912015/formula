import React, { Component } from 'react';
import '../css/bootstrap.css';
import '../App.css'
import {makeBracket} from './make-bracket'
import AttrEdit from './attr-edit'

export default class Formula extends Component{
    constructor(props){
        super(props)
        this.state={
            edits:[],
            count:0,
            summary:'',
            valid:true,
            msg:''
        }
        this.modi=this.modi.bind(this)
        this.editChange=this.editChange.bind(this)
        this.preview=this.preview.bind(this)
        this.validate=this.validate.bind(this)
        this.makeEdits=this.makeEdits.bind(this)
    }
    componentWillMount(){
        let c=this.props.edits&&this.props.edits.length
        if(!c) c=0;
        let e=this.props.edits;
        if(!e) e=[];
        this.setState({edits:e,count:c})
    }
    editChange(type,i,e){
        let ea=[];
        this.state.edits.forEach((t,index)=>{
            if(i===index){
                if(type==='edit'){
                    ea.push({
                        pre:e.pre,
                        cur:e.cur,
                        post:e.post,
                        op:i===0?'':e.op,
                        value:e.value
                    })
                }
                else {
                    ea.push({
                        pre:t.pre,
                        cur:t.cur,
                        post:t.post,
                        op:e.target.value,
                        value:t.value
                    })
                }
            }
            else {
                ea.push(t)
            }
        })

        this.setState({edits:ea},()=>{
            this.preview()
            this.validate()
        })
    }
    validate(){
        let preCount=0,postCount=0,valid=true,msg='';
        this.state.edits.forEach((t)=>{
            preCount+=t.pre;
            postCount+=t.post;
            if(t.cur==='常量'){
                let tv=parseFloat(t.value,10);
                if(isNaN(tv)){
                    valid=false;
                    msg+='常量的值必须数字'
                }
            }
        })
        if(preCount!==postCount){
            valid=false;
            msg+='前后括号个数必须相等'
        }
        this.setState({valid:valid,msg:msg},()=>{
            if(valid){
                this.props.onChange(this.state.edits)
            }
        })
    }
    preview(){
        let pvs='';
        this.state.edits.forEach(t=>{
            pvs+=' '+t.op+' ';
            pvs+=makeBracket("(",t.pre)
            if(t.cur==='常量'){
                pvs+=t.value;
            }else {
                pvs += t.cur;
            }
            pvs+=makeBracket(")",t.post)

        })
        this.setState({summary:pvs})
    }
    modi(op){
        let pa=[];
        let ct=this.state.count;
        if(op==='+'){
            this.state.edits.forEach(a=>pa.push(a))
            pa.push({})
            ct+=1;
            this.setState({edits:pa,count:ct})
        }
        else {
            ct-=1
            if(ct<0){
                ct=0
            }
            if(this.state.edits.length>0){
                let c=this.state.edits.length-1;
                this.state.edits.forEach((a,i)=>{
                    if(i<c){
                        pa.push(a)
                    }
                })
            }
            this.setState({edits:pa,count:ct},()=>{
                this.preview()
                this.validate()
            })
        }

    }
    makeEdits(){
        let pa=[]
        for(let i=0;i<this.state.count;i++){
            if(i===0) {
                pa.push(
                    <div className='root'key={i}>
                        <AttrEdit formula={this.state.edits[i]} attrs={this.props.attrs} editChanged={(e)=>this.editChange('edit',i,e)}/>
                    </div>)
            }
            else {
                pa.push(
                    <div className='root' key={i}>
                        <select className='ui-select' value={this.state.edits[i].op} onChange={(e)=>this.editChange('op',i,e)}>
                            <option value='+'>+</option>
                            <option value='-'>-</option>
                            <option value='*'>*</option>
                            <option value='/'>/</option>
                        </select>
                        <AttrEdit formula={this.state.edits[i]} attrs={this.props.attrs} editChanged={(e)=>this.editChange('edit',i,e)}/>
                    </div>
                )
            }
        }
        return pa;
    }
    render(){
        let msgStyle={color:'green'}
        if(!this.state.valid){
            msgStyle.color='red'
        }
        return(
            <div>
                <div className='btn btn-group'>
                    <button className='btn btn-success' onClick={()=>this.modi("+")}>添加字段</button>
                    <button className='btn btn-danger' onClick={()=>this.modi("-")}>删除字段</button>
                </div>
                <div style={{paddingLeft:'17px'}}>
                    {this.makeEdits()}
                    <div style={{padding:'10px',fontWeight:'bolder'}}>
                        {this.state.summary}
                    </div>
                    <div style={msgStyle}>
                        {this.state.msg}
                    </div>
                </div>
            </div>
        )
    }
}