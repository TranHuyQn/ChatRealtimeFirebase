import React, {Component} from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import User from '../user';
import styles from '../constants/styles';
import firebase from 'firebase';

export default class HomeScreen extends Component {
    static navigationOptions = {
        title: 'Chats'
    };

    constructor(props) {
        super(props);
        this.state = {
            users: [],
        };
    };

    componentDidMount() {
        let dbRef = firebase.database().ref('user');
        dbRef.on('child_added', (val) => {
            let person = val.val();
            person.phone = val.key;
            if(person.phone === User.phone) {
                User.name = person.name
            } else {
                this.setState((prevState) => {
                    return {
                        users: [...prevState.users, person]
                    }
                })
            }            
        })
    };

    logout = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    };

    renderListUsers = ({item}) => {
        return(
            <TouchableOpacity 
                onPress={() => this.props.navigation.navigate('Chat', item)} 
                style={{padding: 10, borderBottomColor: '#ccc', borderBottomWidth:1}}
            >
                <Text style={{fontSize: 20}}>
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    };

    render() {
        return(
            <View style={styles.container}>
                <FlatList
                    data={this.state.users}
                    renderItem={this.renderListUsers}
                    keyExtractor={(item) => item.phone}
                />
                <TouchableOpacity onPress={this.logout}>
                    <Text>logout</Text>
                </TouchableOpacity>
            </View>
        );
    };
}