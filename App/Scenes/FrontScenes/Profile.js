import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import firebase from 'react-native-firebase';
import ImagePicker from 'react-native-image-picker';
// import RNFetchBlob from 'react-native-fetch-blob';
import {
    CustomView,
    CustomText,
    CustomImage,
    CustomBackgroundImage,
    CustomTouchableOpacity,
    CustomTextInput
} from '../../Custom-Components';
// import {Dropdown} from 'react-native-dropdown';
import COLORS from '../../Constants/color.constants';
import { } from '../../Config/image.config';

const options = {
    title: 'Select a pic',
    takePhotoButtonTitle: 'Take photo from camera',
    chooseFromLibraryButtonTitle: 'Choose from gallery'

}

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text: '',
            name: '',
            avatarSource: null,
            uri: ''
        }
        console.log('recieverName', this.props.contacts)
    }

    pickImage = () => {
        const { uri } = this.state;
        // const Blob = RNFetchBlob.polyfill.Blob
        // const fs = RNFetchBlob.fs
        // window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
        // window.Blob = Blob
        const user = firebase.auth().currentUser;
        const uid = user._user.uid;
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response=', response, response.uri);
            if(response.didCancel){
                console.log('User canceled ')
            }else if(response.error) {
                console.log('ImagePicker', response.error)
            }
            else{
                const source = { uri: 'data:image/jpeg;base64,' + response.data}
                this.setState({ avatarSource: source})
                // const imagePath = image.path;
                // const imageRef = firebase.storage().ref(uid).child("avatarSource.jpg")
                // let mime = 'image/jpg'
                // fs.readFile(imagePath, 'base64').then((data)=>{
                //     return Blob.build(data, { type: {mime}+';BASE64'})
                // }).then((blob)=>{
                //     uploadBlob =  blob
                //     return imageRef.put(blob, { contentType: mime})
                // }).then(()=>{
                //     uploadBlob.close();
                //     return imageRef.getDownloadURL()
                // }).error((err)=>{
                //     console.log('err', err)
                // }).error((error)=>{
                //     console.log('error', error)
                // })


            // if(response.didCancel){
            //     console.log('User canceled ')
            // }else if(response.error) {
            //     console.log('ImagePicker', response.error)
            // }
            // else{
            //     const source = { uri: 'data:image/jpeg;base64,' + response.data}
            //     this.setState({ avatarSource: source})

            //     var ref = firebase.database().ref('/user');
            //     var firebaseStorageRef = firebase.storage().ref;
            //     var pathReference = storage.ref('images/profile.jpg'); 


            //     pathReference.getDownloadURL().then(function (url){
            //         console.log(url);
            //         ref.push().set({
            //              uri : url  
            //          }).then((uri)=>{
            //             console.log('imageurl', uri)
            //          })

            //      })

        }
        })
}



onPress = () => {
    const { name, uri } = this.state;
    if (!name) {
        alert(' please enter your name !')
    }
    else {
        if (!firebase.apps.length) {
            firebase.initializeApp(CONFIG);
            console.log('config', CONFIG)
        }
        const user = firebase.auth().currentUser;
        console.log('user', user)
        firebase.database().ref('user/' + user._user.uid).update({
            name,

        }).then((data) => {
            console.log('data', data);
        }).catch((error) => {
            console.log('error', error);
        })
        Actions.SCROLLABLE_TAB();
    }
}

render() {
    return (

        <CustomView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.WHITE_BACKGROUND }}>

            <CustomView style={{ paddingTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                <CustomText style={{ color: COLORS.PRIMARY, fontSize: 20 }}>Profile info</CustomText>
            </CustomView>

            <CustomView style={{ paddingTop: 20 }}>
                <CustomText>Please provide your name and an optional profile </CustomText>
                <CustomView style={{ alignItems: 'center', justifyContent: 'center' }}>
                    <CustomText>photo</CustomText>
                </CustomView>
            </CustomView>

            <CustomView style={{ flexDirection: 'row', paddingTop: 20 }}>
                <CustomTouchableOpacity onPress={() => this.pickImage()}>
                    <CustomView style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.FADE, margin: 10, marginBottom: 40, alignItems: 'center', justifyContent: 'center' }}>

                        <CustomImage source={this.state.avatarSource} style={{ width: 60, height: 60, borderRadius: 30, resizeMode: 'cover' }} />

                    </CustomView>
                </CustomTouchableOpacity>
                <CustomView style={{ width: 200, height: 60, borderBottomWidth: 2, borderBottomColor: COLORS.PRIMARY, paddingTop: 20 }}>

                    <CustomTextInput style={{ height: 40}}
                        placeholder={this.props.contacts || 'Type your name here'}
                        // placeholderTextColor= {COLORS. }
                        value={this.state.name}
                        onChangeText={(text) => this.setState({ name: text })} />
                </CustomView>
            </CustomView>


            <CustomView style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 250 }}>
                <CustomTouchableOpacity onPress={() => this.onPress()}
                    style={{ width: 100, height: 40, backgroundColor: '#8BC34A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: COLORS.FADE }}>
                    <CustomText style={{ color: COLORS.WHITE_BACKGROUND, fontSize: 15, alignSelf: 'center' }}>NEXT</CustomText>
                </CustomTouchableOpacity>
            </CustomView >

        </CustomView>
    )
}
}