import React, { Component } from 'react';
import '../css/bootstrap.css';
import '../App.css'
import Formula from './formula'
import {simpleAttr} from './attr'

export default class FormulaEdit extends Component{
    render(){
        let pa=[];
        simpleAttr.forEach(a=>{
            pa.push(a.dname)
        })
        return (
            <div>
                <Formula attrs={pa} onChange={this.props.onChange} edits={this.props.edits}/>
            </div>
        )
    }
}