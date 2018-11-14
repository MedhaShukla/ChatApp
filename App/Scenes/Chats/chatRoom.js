import React, { Component } from 'react';
import { FlatList, ScrollView, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import { Actions } from 'react-native-router-flux';
import PushNotification from 'react-native-push-notification';
import FCM, { NotificationActionType } from 'react-native-fcm';
import moment from 'moment';
import {
    CustomView,
    CustomText,
    CustomImage,
    CustomBackgroundImage,
    CustomTouchableOpacity,
    CustomTextInput
} from '../../Custom-Components';
import COLORS from '../../Constants/color.constants';
import { VedioCallImage, VoiceCallImage, BackArrowImage, MenuImage, DpImage } from '../../Config/image.config';

export default class ChatRoom extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            ids: '',
            chat: '',
            time: [],
            timeStamp: '',
            message: [],
            sender: '',
            recieverName: this.props.recieverName,
            contacts: this.props.contacts,
            name: this.props.item,
            modalVisible: false,
            token: '',
            tokenCopyFeedback: '',
            lastText:'',
            lastTime:''
            
            // data:{ 'value': [message], 'key': [time]}
        }
        console.log('name', name, this.state.contacts, '+', this.state.recieverName)
    }


    componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
        this.showOldChats();
        
    }

    // componentWillMount() {
    //     this.notificationListener();
    //     this.notificationOpenedListener();
    // }

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            // console.log('enabled', this.getToken())
            this.getToken();
        } else {
            this.requestPermission();
        }
    }

    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            this.getToken();
        } catch{
            // console.log('permission rejected');
        }
    }

    async getToken() {
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
    }

    async createNotificationListeners() {
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        })

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        })

        const notificationOpen = firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }

        this.messageListener = firebase.messageing().onMessage((message) => {
            console.log(JSON.stringify(message));
        })
    }

    showAlert(title, body) {
        Alert.alert(title, body, [{ text: 'Ok', onPress: () => console.log('Ok Pressed') }],
            { cancelable: false })
    }




    showOldChats = () => {
        const { name, time,  recieverName, message } = this.state;

        if (!firebase.apps.length) {
            firebase.initializeApp(CONFIG);
            console.log('config', CONFIG)
        }
        const user = firebase.auth().currentUser;

        // check if user exists or not , if exists show old chats and push a new message

        firebase.database().ref('/chatroom').child('Entry-' + user._user.uid + '-' + (name || recieverName)).child('/conversation').once('value')
            .then((snapshot) => {
                // console.log('existss', snapshot)
                if (snapshot.exists()) {
                    var val = snapshot.val();
                    // console.log('exists', val)
                    Object.values(val).map((item) => {
                        // console.log('item', '+', message, '+', time, '=', item.text, '=', item.timeStamp)
                        let arr = message;
                        arr.push(item.text)
                        this.setState({ message: arr })
                        // console.log(message[0], message, 'message')
                        let array = time;
                        array.push(time)
                        this.setState({ time: array })
                        this.setState({ lastText: item.text, lastTime: item.timeStamp })
                    })
                }
            })

    }


    showItem = () => {

        const { text, message, sender, recieverName, name, ids, timeStamp, } = this.state;
        let arr = message;
        arr = arr.concat(text);
        this.setState({ message: arr.reverse(), text: '' });
        // console.log('med', this.state.message)
        if (!firebase.apps.length) {
            firebase.initializeApp(CONFIG);
            // console.log('config', CONFIG)
        }

        // create a new user
        const user = firebase.auth().currentUser;
        // console.log('user', user);
        firebase.database().ref('/chatroom').child('Entry-' + user._user.uid + '-' + (name || recieverName)).child('/conversation')
            .push({

                sender: user._user.uid,
                reciever: (name || recieverName),
                text,
                timeStamp: moment().format("DD/MM/YYYY, HH:mm")

            }).then(() => {
                firebase.database().ref("newChat").child(user._user.uid).child(name || recieverName).set({
                    text,
                    timeStamp: moment().format("DD/MM/YYYY, HH:mm")
                })
            }).catch(err => console.log("cannot set data to newChat"));
    }

    render() {
        const { contacts, name, lastText,lastTime,recieverName } = this.state;
        // console.log(contacts, 'show contacts');
        return (
            <CustomView style={{ flex: 1 }}>
                <CustomView style={{ height: 70, paddingTop: 20, backgroundColor: COLORS.PRIMARY, flexDirection: 'row' }}>

                    <CustomTouchableOpacity onPress={() => Actions.SCROLLABLE_TAB({ contacts: contacts, name, lastText, lastTime })}>
                        <CustomView style={{ width: 20, alignItems: 'flex-start', justifyContent: 'flex-start', marginTop: 10, marginLeft: 10 }}>
                            <CustomImage source={BackArrowImage()} style={{ width: 20, height: 20 }} />
                        </CustomView>
                    </CustomTouchableOpacity>

                    <CustomTouchableOpacity onPress={() => Actions.PROFILE()}>
                        <CustomView style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.FADE, marginLeft: 10, paddingBottom: 20 }}>
                            <CustomImage source={{}} style={{ width: 40, height: 40, borderRadius: 20, resizeMode: 'cover' }} />
                        </CustomView>
                    </CustomTouchableOpacity>

                    <CustomView style={{ width: 100, alignItems: 'flex-start', justifyContent: 'flex-end', marginTop: 20, marginLeft: 10 }}>
                        <CustomText style={{ color: COLORS.WHITE_BACKGROUND, fontWeight: 'bold', fontSize: 22, textAlign: 'center', marginBottom: 15 }}>  {this.props.contacts}</CustomText>
                    </CustomView>


                    <CustomView style={{ marginTop: 20, alignItems: 'flex-end', justifyContent: 'flex-end', flexDirection: 'row', paddingLeft: 60 }}>

                        <CustomTouchableOpacity >
                            <CustomImage source={VedioCallImage()} style={{ width: 20, height: 20, resizeMode: 'contain', paddingTop: 15, marginBottom: 20, marginRight: 20 }} />
                        </CustomTouchableOpacity>
                        <CustomTouchableOpacity >
                            <CustomImage source={VoiceCallImage()} style={{ width: 18, height: 18, resizeMode: 'contain', paddingTop: 15, marginBottom: 20, marginRight: 15 }} />
                        </CustomTouchableOpacity>
                        <CustomTouchableOpacity onPress={() => this.setState({ modalVisible: true })}>
                            <CustomImage source={MenuImage()} style={{ width: 18, height: 18, resizeMode: 'contain', paddingTop: 15, marginBottom: 20, marginRight: 10 }} />
                        </CustomTouchableOpacity>

                    </CustomView>

                </CustomView>

                <CustomView style={{ flex: .8, margin: 2 }}>

                    <FlatList
                        inverted
                        data={this.state.message}
                        renderItem={({ item }) =>
                            <CustomView style={{ alignItems: 'flex-end', justifyContent: 'center', padding: 5 }}>
                                <CustomText style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5, borderRadius: 12, borderWidth: 2, borderColor: '#C2C2C2', fontSize: 20, color: '#009688' }}>{item}</CustomText>
                                {/* {this.state.time.map((item)=> */}
                                    <CustomText>{moment().format("DD/MM/YYYY, HH:mm")}</CustomText>
                                {/* )} */}
                                
                            </CustomView>
                        }
                    />

                </CustomView>
                <CustomView style={{ flex: .2, flexDirection: 'row', alignItems: 'flex-end', marginBottom: 2 }}>
                    <CustomView style={{ alignItems: 'flex-start', justifyContent: 'flex-start', flex: 1, borderWidth: 2, borderRadius: 15, width: 300, height: 50, }}>
                        <CustomTextInput style={{ width: 350, height: 50 }}
                            placeholder=" Type here..."
                            value={this.state.text}
                            onChangeText={(text) => this.setState({ text: text })} />
                    </CustomView>
                    <CustomView style={{ alignItems: 'center', justifyContent: 'center', flex: .2, width: 50, height: 50 }}>
                        <CustomTouchableOpacity style={{ borderRadius: 25, width: 50, height: 50 }} onPress={() => this.showItem()}>
                            <CustomImage source={{ uri: 'https://cdn4.iconfinder.com/data/icons/flat-circle-content/800/circle-content-send-512.png' }} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
                        </CustomTouchableOpacity>
                    </CustomView>
                </CustomView>

                {this.state.modalVisible ?
                    <CustomView style={{ width: 170, height: 60, borderWidth: 2, borderColor: COLORS.FADE, zIndex: 10, top: 1, position: 'absolute', backgroundColor: COLORS.WHITE_BACKGROUND, marginTop: 5, marginRight: 5, borderRadius: 10, marginLeft: 185 }}>
                        <CustomTouchableOpacity onPress={() => Actions.PROFILE({ contacts })} style={{ alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                            <CustomText style={{ color: COLORS.BLACK, fontSize: 20 }}>Settings</CustomText>
                        </CustomTouchableOpacity>
                    </CustomView>
                    : null
                }
            </CustomView>
        )
    }
}