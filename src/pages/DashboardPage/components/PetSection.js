import React, { Component } from 'react';
import { Form, Input, Select, Button, Divider, List, Avatar, Alert, message } from 'antd';
import axios from 'axios';

const FormItem = Form.Item;
const Option = Select.Option;
const ListItem = List.Item;
const ListItemMeta = ListItem.Meta;

class PetSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      pets: [],
      pid: '',
      name: '',
      speciesname: '',
      breedname: '',
      specialnote: '',
      diet: '',
      alert: 'invisible',
      breedsOpt: [{ breedname: 'No Species Specified' }],
      speciesOpt: [],
      dietsOpt: [],
    };
  }

  // Update name of pet
  handleNameChange = ((e) => {
    this.setState({ name: e.target.value })
  });

  // Update breedname of pet, e.g Golden Retriever
  handleBreedChange = ((value) => {
    this.setState({ breedname: value });
  });

  // Changing of diet
  handleDietChange = ((value) => {
    this.setState({ diet: value });
  });

  // Changing of any notes of pet
  handleSpecialNoteChange = ((e) => {
    this.setState({ specialnote: e.target.value })
  });

  // When speciesname change, e.g to "dog". We have to fetch the breeds allowed for the speciesname.
  handleSpeciesChange = (async (value) => {
    try {
      const response = await axios.post('http://localhost:3030/petsection/', {
        post: 'getAllBreeds',
        speciesName: value
      });
      if (response.status === 200) {
        let breedsOpt = response.data.rows
        console.log(`> Loaded breeds for species: ${value}`);
        this.setState({ breedsOpt: breedsOpt, speciesname: value });
      }
    } catch (err) {
      message.warn(`Unable to retrieve breeds from DB for chosen species: ${value} Error: ${err.response.data}`);
    }
  })

  // When component firsts load. 
  // Fetch speciesname & diets that PetCare supports.
  async componentDidMount() {
    try {
      // Fetch diets & speciesname
      const dietResponse = await axios.post('http://localhost:3030/petsection/', { post: 'getAllDiets' });
      const speciesResponse = await axios.post('http://localhost:3030/petsection/', { post: 'getAllSpecies' });
      if (dietResponse.status === 200 && speciesResponse.status === 200) {
        const dietsOpt = dietResponse.data.rows;
        const speciesOpt = speciesResponse.data.rows;
        console.log('> Loaded Diets & Species');
        this.setState({ dietsOpt, speciesOpt });
      }
    } catch (error) {
      message.warn(`Error while fetching diets and species`);
    }
    await this.getAllPets();
  }

  // Get all pets that belong to the pet owner
  getAllPets = (async () => {
    const { userId } = this.state;
    try {
      // Fetch pets for user
      const petResponse = await axios.post('http://localhost:3030/petsection/', {
        post: 'getAllPets',
        email: userId,
      });
      if (petResponse.status === 200) {
        const pets = petResponse.data;
        console.log('> Loaded Pets', pets);
        this.setState({ pets });
      }
    } catch (error) {
      message.warn(`Error while fetching Pets`);
    }

  });

  // Adding a new pet for a pet owner
  addToPets = (async (event) => {
    // Guard against missing fields.
    const { userId, name, speciesname, breedname, diet, specialnote, pets } = this.state;
    if (name === '' || speciesname === '' || breedname === '' || diet === '') {
      this.setState({ alert: 'empty' });
      return;
    }
    // All guards pass, proceed to add pet to DB
    const data = {
      name,
      diet,
      specialNote: specialnote,
      post: 'addPets',
      email: userId,
      speciesName: speciesname,
      breedName: breedname
    };
    try {
      const response = await axios.post('http://localhost:3030/petsection/', data);
      if (response.status === 200) {
        this.setState({ pets: response.data.rows, alert: `Success! Added ${name} as your pet` });
        await this.getAllPets();
      }
    } catch (err) {
      console.error("Unable to add pet to Database for user. Error: " + err.response.data);
      this.setState({ alert: 'error' });
    }
  });

  // Delete Pets
  deletePet = (async (pid) => {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/petsection/', {
        post: 'deletePet',
        email: userId,
        pid,
      });
      if (response.status === 200) {
        const pets = response.data.rows;
        this.setState({ pets, alert: `Success! Deleted pet of pid: ${pid}` });
        await this.getAllPets();
      }
    } catch (err) {
      console.error("Unable to delete pet in Database for user. Error: " + err.response.data);
      this.setState({ alert: 'error' });
    }
  });

  // Closing of Alert
  handleAlertClose = (() => { this.setState({ alert: 'invisible' }); });

  render() {
    const { getFieldDecorator } = this.props.form;
    const { speciesOpt, breedsOpt, dietsOpt, pets } = this.state;
    return (
      <div>
        {/* Adding new pets */}
        <Form className="d-flex flex-wrap" onAbort={this.handleClose}>

          {/* Pet Name */}
          <FormItem className="col-5 mx-2" label="Name">
            {getFieldDecorator('petName', { rules: [{ required: true, message: 'Please input your Pet name!' }] })(
              <Input onChange={this.handleNameChange} />
            )}
          </FormItem>

          {/* Species of Pet, e.g Dog or Cat */}
          <FormItem className="col-3 mx-2" label="Species">
            {getFieldDecorator('speciesSelect', { rules: [{ required: true, message: 'Please select a speciesname' }] })(
              <Select placeholder="Please select a species" onSelect={this.handleSpeciesChange}>
                {speciesOpt.map((item) => <Option value={item.speciesname}>{item.speciesname}</Option>)}
              </Select>
            )}
          </FormItem>

          {/* Breed of speciesname e.g Golden Retriever */}
          <FormItem className="col-3 mx-2" label="Breed">
            {getFieldDecorator('breedSelect', { rules: [{ required: true, message: 'Please select a breed' }] })(
              <Select placeholder="Please select a breed" onSelect={this.handleBreedChange}>
                {breedsOpt.map((item) => <Option value={item.breedname}>{item.breedname}</Option>)}
              </Select>
            )}
          </FormItem>

          {/* Diet of Pet */}
          <FormItem className="col-5 mx-2" label="Diet">
            {getFieldDecorator('dietSelect', { rules: [{ required: true, message: 'Please select a diet' }] })(
              <Select placeholder="Please select a diet" onSelect={this.handleDietChange}>
                {dietsOpt.map((item) => <Option value={item.diet}>{item.diet}</Option>)}
              </Select>
            )}
          </FormItem>

          {/* Other notes we need to know */}
          <FormItem className="col-5 mx-2" label="Special Notes">
            {getFieldDecorator('specialnote', { rules: [{ required: false, message: 'Any other concerns?' }] })(
              <Input onChange={this.handleSpecialNoteChange} />
            )}
          </FormItem>

          <Button className="col-3" type="primary" onClick={this.addToPets}>Add Pet</Button>
        </Form>
        <Divider />

        {/* Display of pets */}
        <List
          itemLayout="horizontal"
          dataSource={pets}
          renderItem={item => (
            <ListItem>
              <ListItemMeta
                avatar={<Avatar src="http://adventuretimeforum.com/jakehead.png" />}
                title={`${item.name}`}
                description={`${item.speciesname} | ${item.breedname} | ${item.diet} | ${item.specialnote}`}
              />
              <Button icon="delete" onClick={(() => this.deletePet(item.pid))}>Delete Pet</Button>
            </ListItem>
          )}
        />
      </div >
    )
  }
}

export default Form.create({ name: "pet" })(PetSection);