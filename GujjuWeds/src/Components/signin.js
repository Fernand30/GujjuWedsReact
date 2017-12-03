
import React, { Component } from 'react';
import {
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Navigator,
  Image,
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import {Colors, Fonts, Images, Metrics, Styles, Constants } from '../Themes';
import GoogleSignIn from 'react-native-google-sign-in';
import firebase from 'react-native-firebase'


global.userGlobalId = '';

class GujjuWedsReactNative extends Component {

    constructor(props){
        super(props);
        this.state=({
          photoURL:''
        })
      }

    componentDidMount() {
      
    }

    dataInsertToFirebase(user){
      firebase.auth().createUserWithEmailAndPassword(user.email, 'password').then((data)=>{
        // const crd = firebase.auth.GoogleAuthProvider.credential(
        //                   user.idToken,
        //                   user.accessToken,
        //               );
        
        //this.ref = firebase.firestore().collection(data.uid).doc('doc').set(
          this.ref = firebase.firestore().collection('users').doc(data.uid).set(
                          {
                            displayName: user.givenName+" "+user.familyName,
                            photoURL: user.photoUrl320,
                            email: user.email,
                          }
                      );  
          global.userGlobalId = data.uid;
          Actions.displaydata();
      }).catch(function(error) {
        firebase.auth().signInWithEmailAndPassword(user.email, 'password').then((data)=>{
              // const crd = firebase.auth.GoogleAuthProvider.credential(
              //     user.idToken,
              //     user.accessToken,
              // );     
              global.userGlobalId = data.uid;
              Actions.displaydata();             
          }).catch(function(error){
              alert(error)
          });
      });
    }
    //sign out firebase
    async logout() {
        try {

            await firebase.auth().signOut();

            // Navigate to login view

        } catch (error) {
            console.log(error);
        }
    }
    //login with gmail
   async goGmail(){

          await GoogleSignIn.configure({
            clientID: '418975558435-il473pkdtp0a8vcoa1eem2sbgtu7384l.apps.googleusercontent.com',
            scopes: ['openid', 'email', 'profile'],
            shouldFetchBasicProfile: true,
          });
          const user = await GoogleSignIn.signInPromise();   
          setTimeout(() => {
            this.dataInsertToFirebase(user)
          }, 500);
    }
    //login with facebook
    async goFaceBook(){
       await GoogleSignin.signOut();
    }
    // render component
    render() {
        return(
        <View style={{flex:1}}>
            <View style={Styles.statusBar}/>
            <View style={Styles.titleBar}>
              <View style={{width:10}}/>
              <View style={{flex:1}}>
                  <Text style={{backgroundColor:'transparent',textAlign:'center',fontSize:20,fontWeight:'700',color:'white'}}> GujjuWeds - Matrimonial App</Text>
              </View>
              <View style={{width:10}}/>
            </View>
            <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'white'}}>
                <TouchableOpacity onPress={this.goGmail.bind(this)} style={Styles.buttonStyle1} >
                    <View style={{flexDirection:'row',paddingLeft:10,alignItems:'center'}}>
                        <Image source={Images.googleIcon} style={{width:20,height:20,resizeMode:'cover'}}/>
                        <Text style={{marginLeft:5,}}> Sign in with Google</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.goFaceBook.bind(this)} style={Styles.buttonStyle2}>
                    <View style={{flexDirection:'row',paddingLeft:10,alignItems:'center'}}>
                        <Image source={Images.facebookIcon} style={{width:20,height:20,resizeMode:'cover'}}/>
                        <Text style={{marginLeft:10,color:'white'}}> Sign in with Facebook</Text>
                    </View>
                </TouchableOpacity>
                
            </View>
        </View>
    )}
}

module.exports = GujjuWedsReactNative;
