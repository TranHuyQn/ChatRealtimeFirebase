import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../user';
import firebase from 'firebase';

export default class AuthLoadingScreen extends React.Component {
  componentDidMount() {
    this._bootstrapAsync();
    var firebaseConfig = {
      apiKey: "AIzaSyB9im9byeRX00_ufdywFaNuVH6aKla85ck",
      authDomain: "testchat-64c39.firebaseapp.com",
      databaseURL: "https://testchat-64c39.firebaseio.com",
      projectId: "testchat-64c39",
      storageBucket: "testchat-64c39.appspot.com",
      messagingSenderId: "370581402491",
      appId: "1:370581402491:web:935fa4942eb971303dc3de",
      measurementId: "G-732R4NBLHD"
    };
    // Initialize Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    };
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    User.phone = await AsyncStorage.getItem('userPhone');

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(User.phone ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}