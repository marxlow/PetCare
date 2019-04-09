import React, { Component } from 'react';
import { Slider, Button, List, Card, Divider, InputNumber, DatePicker } from 'antd';

const ListItem = List.Item;

class CareTakerSearchSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rating: 5,
      experience: 10,
      date: '',
    }
  }

  updateSearchRating = ((value) => {
    this.setState({ rating: value });
  })

  updateSearchExperience = ((value) => {
    this.setState({ experience: value });
  })

  changeDate = ((date) => {
    this.setState({ date });
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
            <DatePicker onChange={this.changeDate} placeHolder="Choose a date" />
          </div>
          <div className="d-flex justify-content-center mt-2">
            <Button className="col-3 mt-2" type="primary" htmlType="submit" onClick>Search</Button>
          </div>
        </section>
        <Divider />
        
        {/* Results Section */}
        <section className="d-flex flex-wrap mt-4">
          <List
            grid={{
              gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3,
            }}
            dataSource={resultStub}
            renderItem={item => (
              <ListItem>
                <Card
                  hoverable={true}
                  title={item.name}
                >
                  Specialty: {item.specialty}<br />
                  Rating: {item.rating}<br />
                  Experience: {item.experience}<br />
                </Card>
                <InputNumber
                  defaultValue={1000}
                  className={"w-100"}
                  size={'large'}
                  formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                  parser={value => value.replace(/\$\s?|(,*)/g, '')}
                // onChange={onChange}
                />
                <Button className={"w-100"}>Confirm Bid</Button>

              </ListItem>
            )}
          />
          <small id="bidHelp" className="form-text text-muted">
          Bid Amount will be deducted from wallet. It will be refunded if you are outbidded.</small>
        </section>
      </div>
    )
  }
}

export default CareTakerSearchSection;