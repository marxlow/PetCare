import React, { Component } from 'react';
import { Form, Input, Select, Button, Divider, List, Avatar } from 'antd';

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
      pets: petStubs
    }
  }

  addToPets = ((event) => {

  });

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <div>
        {/* Adding new dogs */}
        <Form className="d-flex flex-column" onSubmit={this.addNewDog}>
          <div className="d-flex w-100">
            <FormItem className="col-5 mx-2" label="NickName">
              {getFieldDecorator('note', {
                rules: [{ required: true, message: 'Please input your Pet name!' }],
              })(
                <Input />
              )}
            </FormItem>
            <FormItem className="col-5 mx-2" label="Breed">
              {getFieldDecorator('select', {
                rules: [{ required: true, message: 'Please select a breed' }],
              })(
                <Select placeholder="Please select a breed">
                  <Option value="Golden Retriever">Golden Retriever</Option>
                  <Option value="Corgi">Corgi</Option>
                </Select>
              )}
            </FormItem>
          </div>
          <div className="d-flex w-100">
            <FormItem className="col-5 mx-2" label="Diet">
              {getFieldDecorator('select', {
                rules: [{ required: true, message: 'Please select a diet' }],
              })(
                <Select placeholder="Please select a diet">
                  <Option value="Vegeterian">Vegeterian</Option>
                  <Option value="Carnivore">Carnivore</Option>
                  <Option value="Gluten-free">Gluten-free</Option>
                </Select>
              )}
            </FormItem>
            <FormItem className="col-5 mx-2" label="Special Notes">
              {getFieldDecorator('note', {
                rules: [{ required: false, message: 'Any other concerns?' }],
              })(
                <Input />
              )}
            </FormItem>
          </div>
          <Button className="col-3" type="primary" htmlType="submit">Add Pet</Button>
        </Form>
        <Divider />
        <List 
          itemLayout="horizontal"
          dataSource={petStubs}
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