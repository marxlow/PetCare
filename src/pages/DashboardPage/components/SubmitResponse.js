import React, { Component } from 'react';
import { Alert, Info } from 'antd';

class SubmitResponse extends Component {
  constructor(props) {
    super(props);
    this.state = {
        visible: 'invisible',
    }
    this.setState({ visible: this.props.alert });
  }
  handleClose = () => {
    this.setState({ visible: 'invisible' });
    console.log('visible value:'+this.props.alert)
  }

  render() {
    console.log('visible value:'+this.props.alert)
    return (
      <div>
        {this.renderSwitch(this.props.alert)}
        {/* <p>placeholder text here</p> */}
      </div>
    );
  }

  renderSwitch(alert) {
    console.log('visible value:'+this.props.alert)
    switch(alert) {
      case 'success':
        return (<Alert
            message="Successful Update"
            type="success"
            showIcon
            closable
            afterClose={this.handleClose}
            />);
      case 'empty':  
        return (<Alert
            message="Error"
            description="There are missing fields. Please input them and submit again."
            type="error"
            showIcon
            closable
            afterClose={this.handleClose}
          />);
      // case 'duplicateName':
      //   return <Alert
      //       message="Warning"
      //       description="This is a warning notice about copywriting."
      //       type="warning"
      //       showIcon
      //       closable
      //       afterClose={this.handleClose}
      //     />;
      case 'duplicate':  
        return (<Alert
            message="Error"
            description="There are duplicate Pets with similar nickname and breed."
            type="error"
            showIcon
            closable
            afterClose={this.handleClose}
          />);
      default:
        return null; 
    }
  }
}

export default SubmitResponse;