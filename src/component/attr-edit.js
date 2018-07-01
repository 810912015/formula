import React, { Component } from 'react';
import '../css/bootstrap.css';
import '../App.css'

import {makeBracket} from './make-bracket'


export default class AttrEdit extends Component{
    constructor(props){
        super(props)
        this.state={
            pre:0,
            cur:'',
            post:0,
            value:''
        }
        this.changeBracket=this.changeBracket.bind(this)
        this.changeState=this.changeState.bind(this)
        this.curChange=this.curChange.bind(this)
        this.valueChange=this.valueChange.bind(this)
    }
    componentWillMount(){
        let st=Object.assign({pre:0,
            cur:this.props.attrs[0],
            post:0,
            value:''},this.props.formula)
        this.changeState(st)
    }
    changeState(e){
        let ec=this.props.editChanged;
        this.setState(e,()=>ec(this.state))
    }
    valueChange(e){
        this.changeState({value:e.target.value})
    }
    curChange(e){
        this.changeState({cur:e.target.value})
    }
    changeBracket(type,op){
        if(type==="pre"){
            if(op==="+"){
                this.changeState({pre:this.state.pre+1})
            }
            else {
                let c=this.state.pre-1;
                if(c<0){
                    c=0;
                }
                this.setState({pre:c})
            }
        }
        else if(type==="post"){
            if(op==="+"){
                this.changeState({post:this.state.post+1})
            }
            else {
                let c=this.state.post-1;
                if(c<0){
                    c=0;
                }
                this.changeState({post:c})
            }
        }
    }

    render() {
        let pre = makeBracket('(', this.state.pre);
        let post = makeBracket(')', this.state.post);
        let opa = [];
        this.props.attrs.forEach((a, i) => {
            opa.push(
                <option key={i} value={a}>{a}</option>
            )
        })
        let cv=(<span></span>)
        if(this.state.cur==='常量'){
            cv=(
                <span >
                    <input className='ui-input' value={this.state.value} onChange={this.valueChange}/>
                </span>
            )
        }
        return (
            <span className='ui-item'>
                <span>
                    <button className='ui-btn ui-sky' onClick={() => this.changeBracket('pre', '+')}>+(</button>
                </span>
                <span>
                    <button className='ui-btn ui-sky' onClick={() => this.changeBracket('pre', '-')}>-(</button>
                </span>
                <span>{pre}</span>
                <select className="ui-select" value={this.state.cur} onChange={this.curChange}>
                    {opa}
                </select>
                {cv}
                <span>
                    {post}
                </span>
                 <span>
                    <button className='ui-btn ui-sky' onClick={() => this.changeBracket('post', '+')}>+)</button>
                </span>
                <span>
                    <button className='ui-btn ui-sky' onClick={() => this.changeBracket('post', '-')}>-)</button>
                </span>
            </span>
        )
    }
}