import React, { Component } from 'react';
import { Button, List } from 'antd';
import axios from 'axios';
import DateSection from './components/DateSection';


class CareTakerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem('userId'),
      availabilities: [],
      startDate: '',
      endDate: '',
    }
  }

  // When component is loaded. Fetch all availbilities for care taker
  async componentDidMount() {
    await this.getDatesForCareTaker();
  }

  // Make API call to fetch dates
  getDatesForCareTaker = (async () => {
    // TODO: @chiasin. Make API call for all availabilities
    // const response = await axios.get('http://localhost:3030/', {
    // userId: this.state.userId,
    // });
    const availabilityRangeStub = [
      { startDate: '2019-04-01', endDate: '2019-04-02' },
      { startDate: '2019-04-05', endDate: '2019-04-10' },
    ]

    // Transform start and end dates to be day by day
    const avilabilitiesStub = [];

    // TODO: Assumes all availbility range are in the same month
    for (let i = 0; i < availabilityRangeStub.length; i++) {
      const range = availabilityRangeStub[i];
      const yyyymm = range.startDate.slice(0, 8);
      const startDay = parseInt(range.startDate.split('-')[2]);
      const endDay = parseInt(range.endDate.split('-')[2]);

      for (let j = startDay; j <= endDay; j++) {
        if (j < 10) {
          avilabilitiesStub.push(`${yyyymm}0${j}`);
        } else {
          avilabilitiesStub.push(`${yyyymm}${j}`);
        }
      }
    }

    this.setState({
      availabilities: avilabilitiesStub,
    })
  });

  setAvailbilityForCareTaker = (async () => {
    const { startDate, endDate } = this.state;
    console.log(startDate, endDate);
    //TODO: @chiasin. Make API call to set avilability.
    // const response = {};
    // try {
    //   response = await axios.post('http://localhost:3030/', {
    //     startDate,
    //     endDate,
    //     userId: this.state.userId
    //   });
    // } catch (err) {
    //   console.log("STUB")
    // }
    
    // TODO: @chiasin. Refresh availbilities.
    // await this.getDatesForCareTaker();
  });

  // Called when the calendar gets updated
  changeDate = ((startDate, endDate) => {
    this.setState({
      startDate,
      endDate,
    });
  });

  render() {
    return (
      <div className="w-100 d-flex">
        <section className="col-6">
          <h3>Add your availbilities here</h3>
          <DateSection changeDate={this.changeDate} title={""} />
          <Button className="mt-4" onClick={this.setAvailbilityForCareTaker}>Add new Availbility</Button>
        </section>
        <section className="col-6">
          <h3>List of availbilities</h3>
          <List
            dataSource={this.state.availabilities}
            renderItem={(item) => (<List.Item>{item}</List.Item>)}
          />
        </section>
      </div>
    )
  }
}

export default CareTakerView;