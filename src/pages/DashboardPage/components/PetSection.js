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
    diet: 'None',
    specialNote: 'Likes to poop',
  },
  {
    name: 'Doe',
    species: 'Dog',
    breed: 'Golden Retriever',
    diet: 'Vegetarian',
    specialNote: 'Likes to poop',
  }
]; // + this.props.pets

let breedsOpt = [{ breedname: 'No Species Specified' }]

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
      speciesOpt: [],
      dietsOpt: [],
    };
    // Changed to true when Add pet button is clicked
    this.submitted = false
    this.handleNameChange = (e) => {
      console.log('handleNameChange: ' + e.target.value);
      this.setState({ name: e.target.value })
    };
    this.handleSpeciesChange = (value, e) => {
      this.setState({ species: value })
      console.log('handleSpeciesChange: ' + value + ":" + this.state.species);
    };
    this.handleBreedChange = (value, e) => {
      this.setState({ breed: value })
      console.log('handleBreedChange: ' + value + ":" + this.state.breed);
    };
    this.handleDietChange = (value, e) => {
      this.setState({ diet: value })
      console.log('handleDietChange: ' + value + ":" + this.state.diet);
    };
    this.handleSpecialNoteChange = (e) => {
      console.log('handleSpecialNoteChange: ' + e.target.value);
      this.setState({ specialNote: e.target.value })
    };
    this.handleBreedsListChange = (value, e) => {
      this.setState({ breedsOpt: value })
      console.log('handleBreedsListChange: ' + value + ":" + this.state.breedsOpt);
    };
  }

  getDietsOpt = (async (event) => {
    // TODO: API call to register user
    // event.preventDefault();
    let response = {};
    try{
      response = await axios.post('http://localhost:3030/petsection/', {
        post: 'getAllDiets'
      });
    } catch (err) {
      console.error("Unable to retrieve diets from Database. Error: " + err.response.data)
    }
    if (response.status === 200) {
      let dietsOpt = response.data.rows    
      console.log("GET Diets: " + dietsOpt)
      this.setState({ dietsOpt: dietsOpt })
      console.log("GET Diets: " + dietsOpt[0].diet)
    } else {
      // TODO: Show error
      console.error("Unable to retrieve diets from Database")
    }
  });

  getSpeciesOpt = (async (event) => {
    // TODO: API call to register user
    // event.preventDefault();
    let response = {};
    try{
      response = await axios.post('http://localhost:3030/petsection/', {
        post: 'getAllSpecies'
      });
    } catch (err) {
      console.error("Unable to retrieve species from Database. Error: " + err.response.data)
    }
    if (response.status === 200) {
      let speciesOpt = response.data.rows
      console.log("GET Species: " + speciesOpt)
      this.setState({ speciesOpt: speciesOpt })
      console.log("GET Species: " + speciesOpt[0].speciesname)
    } else {
      // TODO: Show error
      console.error("Unable to retrieve species from Database")
    }
  });

  getBreedsOpt = (async (event) => {
    // TODO: API call to register user
    // event.preventDefault(); 
    const { species } = this.state;
    console.log("POST Breeds: " + species)
    let response = {};
    try {
      response = await axios.post('http://localhost:3030/petsection/', {
        post: 'getAllBreeds', 
        speciesName: species
      });
    } catch (err) {
      console.error("Unable to retrieve breeds from Database for chosen species. Error: " + err.response.data)
    }
    if (response.status === 200) {
      let breedsOpt = response.data.rows
      this.setState({ breedsOpt: breedsOpt })
      console.log("GET Breeds: " + breedsOpt)
      console.log("GET Breeds: " + breedsOpt[0].breedname)
    } else {
      // TODO: Show error
      console.error("Unable to retrieve breeds from Database for chosen species")
    }
  });

  onChangeSpecies = ((value, event) => {
    this.handleSpeciesChange(value, event);
    const { species } = this.state;
    console.log("POST Breeds: " + species)
    this.getBreedsOpt(event);
  })

  loadSpeciesDiet = ((event) => {
    console.log("On Load PetSection")
    this.getDietsOpt(event);
    this.getSpeciesOpt(event);
  });

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
      post: 'addPets',
      email: userId,
      name: name,
      speciesName: species,
      breedName: breed,
      diet: diet,
      specialNote: specialNote,
    }
    console.log("Posting data: " + JSON.stringify(data))
    try {
      response = await axios.post('http://localhost:3030/petsection/', data);
    } catch (err) {
      console.error("Unable to add pet to Database for user. Error: " + err.response.data)
      this.setState({ alert: 'error' })
      return
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
      <div onLoad={this.loadSpeciesDiet}>
        {/* Adding new pets */}
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
                <Select placeholder="Please select a species" onSelect={this.onChangeSpecies}>
                  {this.state.speciesOpt.map((item) => <Option value={item.speciesname}>{item.speciesname}</Option>)}
                </Select>
              )}
            </FormItem>
            <FormItem className="col-3 mx-2" label="Breed">
              {getFieldDecorator('breedSelect', {
                rules: [{ required: true, message: 'Please select a breed' }],
              })(
                <Select placeholder="Please select a breed" onSelect={this.handleBreedChange}>
                  {/* <Option value="Golden Retriever">Golden Retriever</Option>
                  <Option value="Corgi">Corgi</Option> */}
                  {this.state.breedsOpt.map((item) => <Option value={item.breedname}>{item.breedname}</Option>)}
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
                  {/* <Option value="Vegetarian">Vegetarian</Option>
                  <Option value="Carnivore">Carnivore</Option>
                  <Option value="Gluten-free">Gluten-free</Option> */}
                  {this.state.dietsOpt.map((item) => <Option value={item.diet}>{item.diet}</Option>)}
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