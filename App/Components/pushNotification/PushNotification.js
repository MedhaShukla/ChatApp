import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase';
import {
    CustomView,
    CustomText,
    CustomImage,
    CustomTouchableOpacity,
} from '../../Custom-Components';
import COLORS from '../../Constants/color.constants';

export default class PushNotification extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    async componentDidMount() {
        this.checkPermission();
        this.createNotificationListeners();
    }

    componentWillMount() {
        this.notificationListener();
        this.notificationOpenedListener();
    }

    async checkPermission() {
        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
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
        let fcmToken = await AsyncStorage.getItem('fcmToken', value);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                await AsyncStorage.setItem('fcmToken', fcmToken);
            }
        }
    }

    async createNotificationListeners(){
        this.notificationListener = firebase.notifications().onNotification((notification)=>{
            const { title, body } = notification;
            this.showAlert(title, body);
        })

        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen)=>{
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        })

        const notificationOpen =  firebase.notifications().getInitialNotification();
        if ( notificationOpen){
            const {title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }

        this.messageListener = firebase.messageing().onMessage((message)=>{
            console.log(JSON.stringify(message));
        })
    }

    showAlert(title,body){
        Alert.alert(title, body, [{ text: 'Ok', onPress:()=> console.log('Ok Pressed')}],
        { cancelable: false})
    }

    render() {
        return (
            <CustomView>

            </CustomView>

        )
    }
}