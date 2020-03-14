import React, {Component} from 'react';
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../user';
import styles from '../constants/styles';
import firebase from 'firebase';

export default class LoginScreen extends Component {
    static navigationOptions = {
        headerShown: false
    };

  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      name: '',
    };
  }

  componentDidMount() {
      
  };

  changeInput = (type, text) => {
    this.setState({[type]: text});
  };

  login = async () => {
    if (!this.state.phone || !this.state.name) {
      return Alert.alert('Lỗi', 'Nhập tên và số điện thoại');
    }
    await AsyncStorage.setItem('userPhone', this.state.phone);
    User.phone = this.state.phone;
    firebase.database().ref('user/' + User.phone).set({name: this.state.name});
    this.props.navigation.navigate('App');
  };

  render() {
    return(
      <View style={styles.container}>
        <TextInput
          placeholder={'Phone number'}
          style={styles.input}
          onChangeText={(text) => this.changeInput('phone', text)}
          value={this.state.phone}
        />
        <TextInput
          placeholder={'Name'}
          style={styles.input}
          onChangeText={(text) => this.changeInput('name', text)}
        />
        <TouchableOpacity onPress={() => this.login()}>
          <Text style={styles.btnText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  };
}

