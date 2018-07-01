import React, { Component } from 'react';
import '../css/bootstrap.css';
import '../App.css'

//属性行使用的样式
export default class PropRow extends Component{
    render(){
        return (
            <div className="row" style={{padding:'6px'}}>
                <div className="col-md-2" style={{textAlign:'right'}}>
                    <div>{this.props.name}</div>
                </div>
                <div className="col-md-6">
                    {this.props.value}
                </div>
            </div>
        )
    }
}