import React, { Component } from 'react';
import '../css/bootstrap.css';
import '../App.css'
import FormulaEdit from './formula-edit'
import 'moment/locale/zh-cn'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'

//属性控件
export default class PropCtrl extends Component{
    render(){
        switch (this.props.type){
            case 'input':{
                return (<input onChange={this.props.change} value={this.props.selected}/>)
            }
            case 'datepicker':{
                return (
                    <DatePicker id="startPicker"
                                showTimeSelect
                                showTimeSelectOnly
                                timeCaption="时间"
                                timeFormat='HH:mm'
                                dateFormat="HH:mm"
                                timeIntervals={1}
                                isClearable={true}
                                onChange={this.props.change} selected={this.props.selected}
                                onChangeRaw={(event)=>{this.props.raw(event.target.value)}}
                    />
                )
            }
            case 'select':{
                let sa=[];
                if(this.props.addition&&this.props.addition.ops){
                    this.props.addition.ops.forEach(a=>{
                        sa.push(
                            <option value={a.value} key={a.value}>{a.name}</option>
                        )
                    })
                }
                return (
                    <select onChange={this.props.change} value={this.props.selected}>
                        {sa}
                    </select>
                )
            }
            case 'checkbox':{
                return (
                    <span>
                  <input type="checkbox" checked={this.props.selected}  onChange={this.props.change}/>
                  <span>{this.props.addition.tag}</span>
                  </span>
                )
            }
            case 'formula':{
                return (
                    <FormulaEdit onChange={this.props.change} edits={this.props.selected}/>
                )
            }
            default:{
                return (
                    <div></div>
                )
            }
        }
    }
}