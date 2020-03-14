import React, {Component} from 'react';
import {
    View,
    TextInput,
    Text,
    TouchableOpacity,
    FlatList,
    Dimensions
} from 'react-native';
import styles from '../constants/styles'
import firebase from 'firebase';
import User from '../user';

export default class ChatScreen extends Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: navigation.getParam('name'),
        }
    };

    constructor(props) {
        super(props)
        this.state = {
            textMessage: '',
            person: {
                name: this.props.navigation.getParam('name'),
                phone: this.props.navigation.getParam('phone')
            },
            messageList: [],
        }
    };

    componentDidMount() {
        firebase.database().ref('messages').child(User.phone).child(this.state.person.phone)
            .on('child_added', (val) => {
                this.setState((prevState) => {
                    return {
                        messageList: [...prevState.messageList, val.val()]
                    }
                })
            })
    };

    changeInput = (text) => {
        this.setState({textMessage: text})
    }

    sendMessage = async () => {
        if(this.state.textMessage) {
            let msgId = firebase.database().ref('messages').child(User.phone).child(this.state.person.phone).push().key;
            let updates = {};
            let message = {
                message: this.state.textMessage,
                time: firebase.database.ServerValue.TIMESTAMP,
                from: User.phone
            }
            updates[`messages/${User.phone}/${this.state.person.phone}/${msgId}`] = message;
            updates[`messages/${this.state.person.phone}/${User.phone}/${msgId}`] = message;
            firebase.database().ref().update(updates);
            this.setState({textMessage: ''});
        }
    };

    formatTime = (time) => {
        let d = new Date(time);
        let today = new Date();
        let result = (d.getHours() < 10 ? '0' : '') + d.getHours() + ':';
        result += (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
        
        if(`${d.getDate}${d.getMonth}${d.getFullYear}` !== `${today.getDate}${today.getMonth}${today.getFullYear}`) {
            result = `${d.getDate}/${d.getMonth + 1}/${d.getFullYear} ` + result
        }

        return result;
    };

    renderMessageList = ({item}) => {
        return(
            <View style={{
                // flexDirection: 'row',
                width: "60%",
                alignSelf: item.from === User.phone ? 'flex-end' : 'flex-start',
                backgroundColor: item.from === User.phone ? 'blue' : 'white',
                borderRadius: 10,
                marginBottom: 10
            }}>
                <Text style={{
                    color: item.from === User.phone ? 'white' : 'black',
                    paddingTop: 3,
                    paddingRight: 3,
                    fontSize: 12,
                    alignSelf: 'flex-end'
                }}>
                    {this.formatTime(item.time)}
                </Text>
                <Text style={{
                    color: item.from === User.phone ? 'white' : 'black',
                    paddingLeft: 7,
                    paddingRight: 7,
                    paddingBottom: 7,
                    fontSize: 16
                }}>
                    {item.message}
                </Text>
            </View>
        );
    };

    render() {
        let {height, width} = Dimensions.get('window');
        return(
            <View>
                <FlatList
                    style={{padding: 10, height: height * 0.79}}
                    data={this.state.messageList}
                    renderItem={this.renderMessageList}
                    keyExtractor={(item, index) => index.toString()}
                />
                <View style={{flexDirection: 'row'}}>
                    <TextInput
                        style={[styles.input, {width: '85%'}]}
                        value={this.state.textMessage}
                        onChangeText={(text) => this.changeInput(text)}
                        placeholder={'Nhập tin nhắn...'}
                    />
                    <TouchableOpacity 
                        style={{justifyContent: 'center', marginLeft: 10}}
                        onPress={this.sendMessage}
                        >
                        <Text style={styles.btnText}>
                            Gửi
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
}