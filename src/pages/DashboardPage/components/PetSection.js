import React, { Component } from 'react';
import { Form, Input, Select, Button, Divider, List, Avatar, Alert } from 'antd';
import axios from 'axios';

const FormItem = Form.Item;
const Option = Select.Option;
const ListItem = List.Item;
const ListItemMeta = ListItem.Meta;
const petStubs = [
  {
    name: 'John',
    species: 'Dog',
    breed: 'Corgi',
    specialNote: 'Likes to poop',
  },
  {
    name: 'Doe',
    species: 'Dog',
    breed: 'Golden Retriever',
    specialNote: 'Likes to poop',
  }
]; // + this.props.pets

const breedsOpt = ['No Species Specified']
const speciesOpt = []


class PetSection extends Component {
  constructor(props) {
    super(props);
    this.pets = this.props.pets
    this.userId = this.props.userId
    this.state = {
      userId: this.userId,
      pets: this.pets,
      name: '',
      species: '',
      breed: '',
      specialNote: '',
      diet: '',
      alert: 'invisible',
      submitted: true,
      breedsOpt: breedsOpt,
    };
    // Changed to true when Add pet button is clicked
    this.submitted = false
    this.handleNameChange = (e) => {
      console.log('handleNameChange: ' + e.target.value);
      this.setState({ name: e.target.value })
    };
    this.handleSpeciesChange = (value, e) => {
      console.log('handleBreedChange: ' + value);
      this.setState({ species: value })
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
    this.handleBreedsListChange = (value, e) => {
      console.log('handleBreedChange: ' + value);
      this.setState({ breedsOpt: value })
    };
  }

  getDietsOpt = (async (event) => {
    // TODO: API call to register user
    event.preventDefault();
    let response = {};
    try{
      response = await axios.post('http://localhost:3030/petsection/', {
        post: 'getDietsOpt'
      });
    } catch (err) {
      console.error("Unable to retrieve diets from Database. Error: " + err.message)
    }
    if (response.status === 200) {
      speciesOpt = response.data.diets
    } else {
      // TODO: Show error
      console.error("Unable to retrieve diets from Database")
    }
  });

  getSpeciesOpt = (async (event) => {
    // TODO: API call to register user
    event.preventDefault();
    let response = {};
    try{
      response = await axios.post('http://localhost:3030/petsection/', {
        post: 'getSpeciesOpt'
      });
    } catch (err) {
      console.error("Unable to retrieve species from Database. Error: " + err.message)
    }
    if (response.status === 200) {
      speciesOpt = response.data.speciesName
    } else {
      // TODO: Show error
      console.error("Unable to retrieve species from Database")
    }
  });

  getBreedsOpt = (async (event) => {
    // TODO: API call to register user
    event.preventDefault();
    const { species } = this.state;
    let response = {};
    try {
      response = await axios.post('http://localhost:3030/petsection/', {
        post: 'getBreedsOpt', 
        species //speciesName
      });
    } catch (err) {
      console.error("Unable to retrieve breeds from Database for chosen species. Error: " + err.message)
    }
    if (response.status === 200) {
      this.setState({ breedsOpt: response.data.breedName })
    } else {
      // TODO: Show error
      console.error("Unable to retrieve breeds from Database for chosen species")
    }
  });

  onChangeSpecies = ((value, event) => {
    this.handleSpeciesChange(value, event)
    this.getBreedsOpt(event)
  })

  toggleSubmitted = (() => {
    this.setState({ submitted: !this.state.submitted })
      console.log('toggled submitted: '+ this.submitted)
  })

  addToPets = (async (event) => {
    this.submitted = true
    this.toggleSubmitted()
    if (this.state.name === '' ||
      this.state.species === '' ||
      // this.state.breed === '' ||
      this.state.diet === ''){
        this.setState({ alert: 'empty' })
      console.log('Empty fields: Will not update pets');
      return
    }
    var newPet = {
      name: this.state.name,
      species: this.state.species,
      breed: this.state.breed,
      specialNote: this.state.specialNote,
      diet: this.state.diet
    };
    const nextPets = Object.assign([], this.state.pets);
    // Check if there are duplicate (name, breed)
    for (var i=0; i<nextPets.length; i++){
      if (nextPets[i].name === this.state.name && 
          nextPets[i].species === this.state.species && 
          nextPets[i].breed === this.state.breed ){
        this.setState({ alert: 'duplicate' })
        console.log('Duplicated Name, Species and Breed: ('+this.state.name+', '+this.state.breed+') Will not update pets');
        return
      }
    }
    console.log('Updating Pets ' + JSON.stringify(this.state.pets));
    // Database
    event.preventDefault();
    const { userId } = this.state;
    const { name, species, breed, specialNote, diet } = newPet
    let response = {};
    const data = {
      email: userId,
      name: name,
      speciesName: species,
      breedName: breed,
      diet: diet,
      specialNote: specialNote,
    }
    console.log("Posting data: " + JSON.stringify(data))
    try {
      response = await axios.post('http://localhost:3030/addpets/', data);
    } catch (err) {
      console.error("Unable to add pet to Database for user. Error: " + err.message )
      this.setState({ alert: 'error' })
    }
    if (response.status === 200) {
      console.log("Added pet to Database for " + this.state.userId)
      console.log('onClick Event addToPets: Adding '+ JSON.stringify(newPet));
      nextPets.push(newPet);
      this.setState({ 
        pets: nextPets,
        alert: 'success'
      });
    } else {
      // TODO: Show error
      console.error("Unable to add pet to Database for user. Status: " + response.status )
      this.setState({ alert: 'error' })
    }
  });

  handleClose = (() => {
    this.setState({ alert: 'invisible' });
  });

  SubmitResponse = (e) => {
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
        //       description="There are duplicate Pets with similar name."
        //       type="warning"
        //       showIcon
        //       closable
        //       afterClose={this.handleClose}
        //     />;
        case 'duplicate':  
          return (<Alert
              message="Error"
              description="There are duplicate Pets with similar name, species and breed."
              type="error"
              showIcon
              closable
              afterClose={this.handleClose}
            />);
        case 'error':  
          return (<Alert
              message="Error"
              description="Error adding pet to database"
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
        {/* <Form className="d-flex flex-column" onLoad={this.getSpeciesOpt} onAbort={this.handleClose}> */}
        <Form className="d-flex flex-column" onAbort={this.handleClose}>
          <div className="d-flex w-100">
            <FormItem className="col-5 mx-2" label="Name">
              {getFieldDecorator('petName', {
                rules: [{ required: true, message: 'Please input your Pet name!' }],
              })(
                <Input onChange={this.handleNameChange}/>
              )}
            </FormItem>
            <FormItem className="col-3 mx-2" label="Species">
              {getFieldDecorator('speciesSelect', {
                rules: [{ required: true, message: 'Please select a species' }],
              })(
                <Select placeholder="Please select a species" onSelect={this.handleSpeciesChange}>
                  <Option value="Dog">Dog</Option>
                  <Option value="Cat">Cat</Option>
                </Select>
              )}
            </FormItem>
            <FormItem className="col-3 mx-2" label="Breed">
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
                title={`${item.name}, ${item.breed}`}
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