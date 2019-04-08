import React, { Component } from 'react';
import { DatePicker } from 'antd';
import axios from 'axios';

const { RangePicker } = DatePicker;

class DateSection extends Component {
  
  //TODO: Set start and end date from value in DB
  onChange = ((date, dateString) => {
    const startDate = dateString[0];
    const endDate = dateString[1];
    this.props.changeDate(startDate, endDate)
  });

  render(){
    return(
      <div className="d-flex flex-column">
        <span className="my-4">{this.props.title}</span>
        <RangePicker className="col-6" onChange={this.onChange}/>
      </div>
    )
  }
}

export default DateSection;