import React, { Component } from 'react';
import { Slider, Button, List, Card, Divider } from 'antd';
import DateSection from './DateSection';

const ListItem = List.item;

class CareTakerSearchSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rating: 5,
      experience: 10,
      startDate: '',
      endDate: ''
    }
  }

  updateSearchRating = ((value) => {
    console.log('rating change: '+ value)
    this.setState({ rating: value });
  })

  updateSearchExperience = ((value) => {
    console.log('experience change: '+ value)
    this.setState({ experience: value });
  })

  changeDate = ((startDate, endDate) => {
    this.setState({ startDate: startDate });
    this.setState({ endDate: endDate });
    console.log('State: '+JSON.stringify(this.state))
  })

  render() {
    const { rating, experience } = this.state;
    const resultStub = [
      {
        name: "John Doe",
        experience: 5,
        rating: 4.5,
        specialty: 'Dogs'
      },
      {
        name: "John Tan",
        experience: 5,
        rating: 4.5,
        specialty: 'Dogs'
      },
      {
        name: "John Low",
        experience: 5,
        rating: 4.5,
        specialty: 'Dogs'
      }
    ]
    return (
      <div className="d-flex flex-column">
        {/* Search Section */}
        <section className="d-flex flex-column mt-2">
          <div className="col-5 d-flex flex-column">
            <span>Average Rating</span>
            <Slider defaultValue={rating} max={5} min={0} onChange={this.updateSearchRating} />
          </div>
          <div className="col-5 d-flex flex-column mt-2">
            <span>Years of Experience</span>
            <Slider defaultValue={experience} max={20} min={0} onChange={this.updateSearchExperience} />
          </div>
          <div>
            <DateSection changeDate={this.changeDate}/>
          </div>
          <div className="d-flex justify-content-center mt-2">
            <Button className="col-3 mt-2" type="primary" htmlType="submit">Search</Button>
          </div>
        </section>
        <Divider />
        {/* Results Section */}
        <section className="mt-4">
          <List
            grid={{
              gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3,
            }}
            dataSource={resultStub}
            renderItem={item => (
              <List.Item>
                <Card title={item.name}>{item.specialty}</Card>
              </List.Item>
            )}
          />
        </section>
      </div>
    )
  }
}

export default CareTakerSearchSection;