import React, { Component } from 'react';
import { List, Button, Modal, Typography, Rate, Icon, message } from 'antd';
import axios from 'axios';

const { Paragraph } = Typography;

class CompletedServicesSection extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      reviewMessage: '',
      rating: 0,
      openModal: false,
      completed: [],

      bid: 0,
      dateofservice: '',
      bidamount: 0,
      caretakername: '',
      caretakeremail: '',
    };
  }

  // When component first loads, find all bids belonging to current user
  async componentDidMount() {
    this.getAllCompletedServices();
  }

  getAllCompletedServices = (async () => {
    const { userId } = this.state;
    try {
      // Fetch completed services
      const response = await axios.post('http://localhost:3030/search/', {
        post: 'getAllCompletedServices',
        petownerEmail: userId,
      });
      if (response.status === 200) {
        const completed = response.data;
        console.log('> Loaded Completed Services', completed);
        this.setState({ completed });
      }
    } catch (error) {
      message.warn(`Error while fetching Completed Services`);
    }
  });

  // Called before writing a review
  openModal(email, bid) {
    this.setState({ caretakeremail: email, bid: bid, showModal: true });
  }

  // Modal functions
  handleOk = (async (event) => {
    const { reviewMessage, rating, userId, caretakeremail, bid } = this.state;
    try {
      // Fetch completed services
      const response = await axios.post('http://localhost:3030/review/', {
        post: 'createReview',
        email: caretakeremail,
        bid: bid,
        review: reviewMessage,
        rating: rating,
        byUser: userId,
      });

      if (response.status === 200) {
        const createdReview = response.data;
        console.log('> Write Review Successful', createdReview);
        this.setState({ showModal: false, reviewMessage: '' });
        // Hide review button once created.
      }
    } catch (error) {
      message.warn(`Error while writing review`);
    }

  });

  handleCancel = (() => {
    this.setState({ showModal: false });
  });

  handleWriting = ((text) => {
    this.setState({ reviewMessage: text });
  });

  updateRating = ((value) => {
    this.setState({ rating: value });
  });

  render() {
    const { showModal, reviewMessage, caretakeremail, completed } = this.state;

    return (
      <div className="w-100">
        <List
          bordered
          dataSource={completed}
          renderItem={((item) => {
            return (
              <List.Item>
                <div className="d-flex w-100 justify-content-between">
                  <span>{`Date: ${item.dateofservice}`}</span>
                  <span>{`Price: $${item.bidamount}`}</span>
                  <span>{`Taker: ${item.caretakername}`}</span>
                  <Button icon="write" onClick={() => this.openModal(item.caretakeremail, item.bid)}>Write Review</Button>
                </div>
              </List.Item>
            )
          })}
        />
        <Modal
          title={`Care-taker Review: ${caretakeremail}`}
          visible={showModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Rate className="mb-4" onChange={this.updateRating} />
          <Paragraph editable={{ onChange: this.handleWriting }}>{reviewMessage}</Paragraph>
        </Modal>
      </div >
    )
  }
}

export default CompletedServicesSection;