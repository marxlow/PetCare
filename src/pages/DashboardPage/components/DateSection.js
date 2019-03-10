import React, { Component } from 'react';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

class DateSection extends Component {
  
  //TODO: Set start and end date from value in DB
  onChange = ((date, dateString) => {
    const startDate = dateString[0];
    const endDate = dateString[1];
  });

  render(){
    return(
      <div className="d-flex flex-column">
        <span className="my-4">Select a date range for all your pets to be taken care of</span>
        <RangePicker className="col-6" onChange={this.onChange}/>
      </div>
    )
  }
}

export default DateSection;