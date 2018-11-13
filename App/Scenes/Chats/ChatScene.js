import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { FlatList, ScrollView } from 'react-native';
import firebase from 'react-native-firebase';
import {
    CustomView,
    CustomText,
    CustomImage,
    CustomTouchableOpacity,
} from '../../Custom-Components';
import COLORS from '../../Constants/color.constants';
import { ChatImage, DpImage } from '../../Config/image.config';
import { CONFIG } from '../../Constants/global.constants';

export default class Chats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chats: [],
            recieverInfo: [],
            contacts: '',
            recieverName: '',
            lastText:[],
            lastTime:[]
        }
        this.showPeople = this.showPeople.bind(this);
        console.log('contactName', this.state.contactName, props.contacts)
    }

    componentDidMount() {
        this.showPeople();
    }


    showPeople = () => {

        const { recieverName } = this.state;

        if (!firebase.apps.length) {
            firebase.initializeApp(CONFIG);
            console.log('config', CONFIG)
        }
        const user = firebase.auth().currentUser;
        var ref = firebase.database().ref('chatroom/');
        ref.once('value')
            .then((snapshot) => {
                if (snapshot.exists()) {
                    var val = snapshot.val();
                    console.log('hellow', val)
                    Object.values(val).map((element)=>{
                        console.log(element)
                        Object.values(element).map(()=>{
                            console.log('eklement', element)
                            element.sort((a, b) => a.timeStamp > b.timeStamp)
                            .map((element, i) => 
                                console.log('values',key={i},element.timeStamp, element.text)
                            );
                        
                        })
                    })
                }})
        ref.once('value').then((snapshot) => {
            var value = snapshot.val()
            Object.keys(value).map((item) => { 
                var name = item.split('-')[2];
                firebase.database().ref('user').once('value')
                    .then((snapshot) => {
                        var userId = snapshot._childKeys;
                        userId.map((item) => {
                            if (name == item) {
                                firebase.database().ref('user/' + item).once('value')
                                    .then((namess) => {
                                        var shubhnaam = new Array();
                                        shubhnaam['name'] = namess._value.name;
                                        shubhnaam['id'] = namess.key;
                                        console.log('Exactname', shubhnaam, namess.key)
                                        this.setState({ recieverName: namess.key })
                                        let arr = this.state.chats;
                                        arr.push(shubhnaam);
                                        this.setState({ chats: arr });
                                    })
                            }
                        })
                    })
            })

        }).catch((err) => {
            console.log('err', err)
        })


        // const user = firebase.auth().currentUser;
        // firebase.database().ref('/chatroom').child('Entry-' + user._user.uid + '-' + (name || recieverName)).child('/conversation').once('value')
        //     .then((snapshot) => {
        //         if (snapshot.exists()) {
        //             var val = snapshot.val();
        //             console.log('hellow')
        //             Object.values(val).map((item) => {
        //                 console.log('item', item.text, '=', item.timeStamp)
        //                 let array = this.state.lastText;
        //                 array.push(lastText);
        //                 this.setState({ lastText: array })
        //                 let array1 = this.state.lastTime;
        //                 array1.push(lastTime)
        //                 this.setState({ lastTime: array1})
        //             })
        //         }
        //     })
    ref.on('value', this.showMeUser)

}

showMeUser = () => {
    const { chats, recieverName, recieverInfo, lastText, lastTime } = this.state;
    console.log('chats', chats, recieverName,'+' )
    return (
        <ScrollView showsVerticalScrollIndicator={false}>
            {chats.map((item) =>
                    <CustomView style={{ height: 70, paddingTop: 10, flexDirection: 'row', marginLeft: 20, }}>
                        <CustomTouchableOpacity style={{ flexDirection: 'row' }} onPress={() => Actions.CHAT_ROOM({ contacts: item['name'], recieverName: item['id'], })}>
                            <CustomView style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.FADE, width: 40, height: 40, borderRadius: 25 }}>
                                <CustomImage source={DpImage()} style={{ height: 25, width: 25 }} />
                            </CustomView>

                            <CustomView style={{ marginLeft: 20, marginTop: 10, width: 170, alignItems: 'flex-start', justifyContent: 'flex-start', borderBottomWidth: .4, borderColor: COLORS.FADE }}>
                                <CustomText style={{ color: COLORS.BLACK, fontWeight: 'bold', fontSize: 18 }}>{item['name']}</CustomText>
                                {lastText.map((element)=>
                                <CustomText>{element}</CustomText>)}
                            </CustomView>
                            <CustomView style={{ marginTop: 10, width: 150, alignItems: 'flex-start', justifyContent: 'flex-start', borderBottomWidth: .4, borderColor: COLORS.FADE, marginRight: 10 }}>
                            {lastTime.map((val)=>
                                <CustomText>{val}</CustomText>)}
                            </CustomView>
                                
                        </CustomTouchableOpacity>
                    </CustomView>
                )
            }
        </ScrollView>
    )
}

render() {
    return (

        <CustomView style={{ flex: 1, backgroundColor: 'white' }}>

            <this.showMeUser />
            <CustomView style={{ zIndex: 10, marginLeft: 280, marginTop: 400, position: 'absolute', alignItems: 'flex-end', marginRight: 20 }}>
                <CustomTouchableOpacity onPress={() => Actions.CONTACT_LIST()}>
                    <CustomView style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.BUTTON, alignItems: 'center', justifyContent: 'center' }}>
                        <CustomImage source={ChatImage()} style={{ width: 22, height: 22, resizeMode: 'contain', }} />
                    </CustomView>
                </CustomTouchableOpacity>
            </CustomView>
        </CustomView>

    )
}
}    
