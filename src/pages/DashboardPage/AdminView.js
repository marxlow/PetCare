import React, { Component } from 'react';
import { Button, List, message } from 'antd';
import axios from 'axios';

const ListItem = List.Item;
const ListItemMeta = ListItem.Meta;

class AdminView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: this.props.userId,
      allUsers: [],
    }
  }

  async componentDidMount() {
    const { userId } = this.state;
    try {
      const response = await axios.post('http://localhost:3030/user/', {
        post: 'getAllUsers',
        email: userId,
      });
      if (response.status === 200) {
        this.setState({ allUsers: response.data });
      }
    } catch (error) {
      message.warn('Error fetching users');
    }
  }

  removeUser = (async (emailToRemove) => {
    console.log(emailToRemove);
    // TODO: Make delete user cascade
  });

  render() {
    const { allUsers } = this.state;
    console.log(allUsers);
    return (
      <div>
        <List
          bordered
          dataSource={allUsers}
          renderItem={((user) => {
            return (
              <ListItem>
                <ListItemMeta
                  title={user.email}
                  description={`${user.name} | ${user.phone}`}
                />
                <Button icon="delete" onClick={(() => this.removeUser(user.email))}>Remove User</Button>
              </ListItem>
            )
          })}
        />
      </div>
    );
  }
}

export default AdminView;