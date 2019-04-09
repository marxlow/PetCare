import React, { Component } from 'react';
import { List, Button, Modal, Typography, Rate, Icon } from 'antd';
import axios from 'axios';

const { Paragraph } = Typography;

class BidHistorySection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      careTakerEmail: '', // Email of care taker, user is writing review for
      reviewMessage: '',
      rating: 0,
      openModal: false,
      bidHistory: [],
    };
  }

  // When component first loads, find all bids belonging to current user
  async componentDidMount() {
    const { userId } = this.state;
    // Axios.get('');
    // this.setState({ bidHistory });
  }

  // Called before writing a review
  openModal(email) {
    this.setState({ careTakerEmail: email, showModal: true });
  }

  // Modal functions
  handleOk = (async (event) => {
    const { reviewMessage, rating } = this.state;
    // Make API call to write review
    this.setState({ showModal: false, reviewMessage: '' });
  });

  handleCancel = (() => {
    this.setState({ showModal: false });
  });

  handleWriting = ((text) => {
    this.setState({ reviewMessage: text });
  });

  updateRating = ((value) =>{
    this.setState({ rating: value });
  });

  render() {
    const bidHistory = [
      { price: 100, date: '2019-01-15', careTaker: 'bob', careTakerEmail: 'bob@gmail.com' },
      { price: 100, date: '2019-01-13', careTaker: 'Greg', careTakerEmail: 'greg@gmail.com' },
    ]
    const { showModal, reviewMessage, careTakerEmail } = this.state;

    return (
      <div className="w-100">
        <List
          bordered
          dataSource={bidHistory}
          renderItem={((item) => {
            return (
              <List.Item>
                <div className="d-flex w-100 justify-content-between">
                  <span>{`Date: ${item.date} | Price: ${item.price} | Taker: ${item.careTaker}`}</span>
                  <Button icon="write" onClick={() => this.openModal(item.careTakerEmail)}>Write Review</Button>
                </div>
              </List.Item>
            )
          })}
        />
        <Modal
          title={`Care-taker Review: ${careTakerEmail}`}
          visible={showModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Rate className="mb-4" onChange={this.updateRating}/>
          <Paragraph editable={{ onChange: this.handleWriting }}>{reviewMessage}</Paragraph>
        </Modal>
      </div >
    )
  }
}

export default BidHistorySection;