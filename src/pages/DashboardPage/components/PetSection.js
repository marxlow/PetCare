import React, { Component } from 'react';
import { Form, Input, Select, Button, Divider, List, Avatar, Alert } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const ListItem = List.Item;
const ListItemMeta = ListItem.Meta;
const petStubs = [
  {
    nickName: 'John',
    breed: 'Corgi',
    specialNote: 'Likes to poop',
    diet: 'Vegeterian',
  },
  {
    nickName: 'Doe',
    breed: 'Golden Retriever',
    specialNote: 'Likes to poop',
    diet: 'Vegeterian',
  }
];

class PetSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pets: petStubs,
      nickName: '',
      breed: '',
      specialNote: '',
      diet: '',
      alert: 'invisible',
      submitted: true
    };
    // Changed to true when Add pet button is clicked
    this.submitted = false
    this.handleNickNameChange = (e) => {
      console.log('handleNickNameChange: ' + e.target.value);
      this.setState({ nickName: e.target.value })
    };
    this.handleBreedChange = (value, e) => {
      console.log('handleBreedChange: ' + value);
      this.setState({ breed: value })
    };
    this.handleDietChange = (value, e) => {
      console.log('handleDietChange: ' + value);
      this.setState({ diet: value })
    };
    this.handleSpecialNoteChange = (e) => {
      console.log('handleSpecialNoteChange: ' + e.target.value);
      this.setState({ specialNote: e.target.value })
    };
  }

  toggleSubmitted = (() => {
    this.setState({ submitted: !this.state.submitted })
      console.log('toggled submitted: '+ this.submitted)
  })

  addToPets = ((event) => {
    this.submitted = true
    this.toggleSubmitted()
    if (this.state.nickName === '' ||
      this.state.breed === '' ||
      // this.state.specialNote === '' ||
      this.state.diet === ''){
        this.setState({ alert: 'empty' })
      console.log('Empty fields: Will not update pets');
      return
    }
    var newPet = {
      nickName: this.state.nickName,
      breed: this.state.breed,
      specialNote: this.state.specialNote,
      diet: this.state.diet
    };
    const nextPets = Object.assign([], this.state.pets);
    // Check if there are duplicate (nickName, breed)
    for (var i=0; i<nextPets.length; i++){
      if (nextPets[i].nickName === this.state.nickName && 
          nextPets[i].breed === this.state.breed ){
        this.setState({ alert: 'duplicate' })
        console.log('Duplicated NickName and Breed: ('+this.state.nickName+', '+this.state.breed+') Will not update pets');
        return
      }
    }
    console.log('onClick Event addToPets: Adding '+ JSON.stringify(newPet));
    nextPets.push(newPet);
    this.setState({ 
      pets: nextPets,
      alert: 'success'
    });
    console.log('Updated' + JSON.stringify(this.state.pets));
  });

  handleClose = (() => {
    this.setState({ alert: 'invisible' });
  });

  SubmitResponse = (e) => {
    console.log('SubmitResponse: ' + this.submitted)
    if (this.submitted === true) {
      this.submitted = false
      switch(this.state.alert) {
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
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        {/* Adding new pets */}
        <Form className="d-flex flex-column" onAbort={this.handleClose}>
          <div className="d-flex w-100">
            <FormItem className="col-5 mx-2" label="NickName">
              {getFieldDecorator('petNickName', {
                rules: [{ required: true, message: 'Please input your Pet name!' }],
              })(
                <Input onChange={this.handleNickNameChange}/>
              )}
            </FormItem>
            <FormItem className="col-5 mx-2" label="Breed">
              {getFieldDecorator('breedSelect', {
                rules: [{ required: true, message: 'Please select a breed' }],
              })(
                <Select placeholder="Please select a breed" onSelect={this.handleBreedChange}>
                  <Option value="Golden Retriever">Golden Retriever</Option>
                  <Option value="Corgi">Corgi</Option>
                </Select>
              )}
            </FormItem>
          </div>
          <div className="d-flex w-100">
            <FormItem className="col-5 mx-2" label="Diet">
              {getFieldDecorator('dietSelect', {
                rules: [{ required: true, message: 'Please select a diet' }],
              })(
                <Select placeholder="Please select a diet" onSelect={this.handleDietChange}>
                  <Option value="Vegetarian">Vegetarian</Option>
                  <Option value="Carnivore">Carnivore</Option>
                  <Option value="Gluten-free">Gluten-free</Option>
                </Select>
              )}
            </FormItem>
            <FormItem className="col-5 mx-2" label="Special Notes">
              {getFieldDecorator('specialNote', {
                rules: [{ required: false, message: 'Any other concerns?' }],
              })(
                <Input onChange={this.handleSpecialNoteChange}/>
              )}
            </FormItem>
          </div>
          <Button className="col-3" type="primary" htmlType="submit"
             onClick={this.addToPets}>Add Pet</Button>
          {/* Submission response alerts when there is error */}
          {this.SubmitResponse()}
        </Form>
        <Divider />
        <List
          itemLayout="horizontal"
          dataSource={this.state.pets}
          renderItem={item => (
            <ListItem>
              <ListItemMeta
                avatar={<Avatar src="https://cdn.hipwallpaper.com/m/18/64/UZMFiI.jpg" />}
                title={`${item.nickName}, ${item.breed}`}
                description={`${item.diet} | ${item.specialNote}`}
              />
            </ListItem>
          )}
        />
      </div >
    )
  }
}
    
export default Form.create({name: "pet" })(PetSection);