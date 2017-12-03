
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
  ScrollView,
  Platform,
  Alert,
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import {Colors, Fonts, Images, Metrics, Styles, Constants } from '../Themes';
import firebase from 'react-native-firebase';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import firebaseImage from 'firebase'
import ImagePicker from 'react-native-image-picker'
import RNFetchBlob from 'react-native-fetch-blob'
import GooglePlaceAutocomplete from 'react-native-google-place-autocomplete';
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';

const config = {
  apiKey: "AIzaSyAk9P6ljgNipYfOXZBE9Gqa4CpOqC7i4GM",
  authDomain: "gujjuwedsrndaniel",
  storageBucket: "gujjuwedsrndaniel.appspot.com",
}
firebaseImage.initializeApp(config)
const storage = firebaseImage.storage()

var gender = ['Male','Female'];
var feet = ['3 feet','4 feet','5 feet','6 feet','7 feet','8 feet'];
var inch = ['0 inches','1 inch','2 inches','3 inches','4 inches','5 inches','6 inches','7 inches','8 inches','9 inches','10 inches','11 inches'];
var relationship = ['Never Married','Currently Separated','Divorced','Widow / Widower'];
var skin = ['Fair','Wheatish or genhua','Brown','Dark or saanwla']
var religion = ['Hindu','Muslim - Shia','Muslim - Sunni','Muslim - Others','Jain - Digambar','Jain - Shwetambar','Jain - Others','Christian','Sikh','Parsi','Buddhist','Other']
var bodytype  = ['Slim','Athletic','Average','A few extra pounds','Chubby']
var education = ['Doesn\'t Matter/ Any','High school','Bachelors Student','Masters Student','Ph.D / Doctorate Student','Bachelors in Engineering','Bachelors in Management/Leal/\nAccounting','Bachelors in Medical','Masters in Engineering','Masters in Management/Legal/\nAccounting','Masters in Others','Ph.D / Doctorate']
var occupation = ['Student','Not Working at the Moment','Administrative / Secretarial','Artistic / Creative /Performance','Executive / Management','Financial /Accounting / Real\nEstate','Labor / Construction','Medical / Dental / Veterinary /\nFitness','Folitical / Govt / Civil Service /\nMilitary','Retail / Food services Retired','Sales / Marketing','Self-Employed / Entrepreneur','Education / Teacher / Professor','Technical / Science / Computers / \nEngineering','Travel / Hospitality / \nTransportation','Other profession','Nonprofit / Volunteer / Activist','Law enforcement / Security / \nMilitary','Fashion / Model / Beauty','Architecture / Interior design']
var smoke = ['No Way','Occasionally','Daily','Cigar aficionado','Yes\, but trying to quit']
var drink = ['Never','Social Drinker','Regularly','Moderately']
var kids = ['No','Yes']
var diettype=['Veg','Non-Veg','Occasionally Non-Veg','Eggetarian','Vegan']
var oftenexercise = ['I don\'t exercise','I exercise occasionally/randomly','I exercise 1-2 times per week','I exercise 3-4 times per week','I exercise 5 or more times per\nweek']
var pets = ['No','Yes']

const Blob = RNFetchBlob.polyfill.Blob
const fs = RNFetchBlob.fs
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest
window.Blob = Blob
const uploadImage = (uri, mime = 'application/octet-stream') => {
  return new Promise((resolve, reject) => {
    const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
    const sessionId = new Date().getTime()
    let uploadBlob = null
    const imageRef = storage.ref('images').child(`${sessionId}`)

    fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` })
      })
      .then((blob) => {
        uploadBlob = blob
        return imageRef.put(blob, { contentType: mime })
      })
      .then(() => {
        uploadBlob.close()
        return imageRef.getDownloadURL()
      })
      .then((url) => {
        resolve(url)
      })
      .catch((error) => {
        reject(error)
    })
  })
}

FCM.on(FCMEvent.Notification, async (notif) => {
    // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
    if(notif.local_notification){
      //this is a local notification
    }
    if(notif.opened_from_tray){
      //iOS: app is open/resumed because user clicked banner
      //Android: app is open/resumed because user clicked banner or tapped app icon
    }
    // await someAsyncCall();
 
    if(Platform.OS ==='ios'){
      //optional
      //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see the above documentation link.
      //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
      //notif._notificationType is available for iOS platfrom
      switch(notif._notificationType){
        case NotificationType.Remote:
          notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
          break;
        case NotificationType.NotificationResponse:
          notif.finish();
          break;
        case NotificationType.WillPresent:
          notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
          break;
      }
    }
});
FCM.on(FCMEvent.RefreshToken, (token) => {
    console.log(token)
    //alert(token)
    // fcm token may not be available on first load, catch it here
});

global.locationFlag = 0;

class EditProfile extends Component {

    constructor(props){
        super(props);
        this.state=({
        	photoURL: '',
          displayName: '',
          email: '',
          location: '',
          age: '',
          gender: '',
          feet: '',
          inch: '',
          relationship: '',
          skin: '',
          religion: '',
          bodytype: '',
          education: ' ',
          occupation: '',
          smoke: '',
          drink: '',
          kids: '',
          diettype: '',
          oftenexercise: '',
          pets: '',
          message: '',
          isModalVisible: false,
          modalItems:gender,
          currentItem:'',
          currentView:'',
          uploadURL: '',
        }); 
      }

    componentDidMount() {

      global.locationFlag = 0;
       this.ref = firebase.firestore().collection('users')
       .doc(global.userGlobalId)
       .get()
       .then((documentSnapshot) => {
           const value = documentSnapshot.data();
           this.setState({
            photoURL:value['photoURL'],
            displayName:value['displayName'],
            email:value['email'],
            location:value['location'],
            age: value['age'],
            gender: value['gender'],
            feet: value['feet'],
            inch: value['inch'],
            relationship: value['relationship'],
            skin: value['skin'],
            religion: value['religion'],
            bodytype: value['bodytype'],
            education: value['education'],
            occupation: value['occupation'],
            smoke: value['smoke'],
            drink: value['drink'],
            kids: value['kids'],
            diettype: value['diettype'],
            oftenexercise: value['oftenexercise'],
            pets: value['pets'],
           })
       });
       // iOS: show permission prompt for the first call. later just check permission in user settings
        // Android: check permission in user settings
        FCM.requestPermissions().then(()=>console.log('granted')).catch(()=>console.log('notification permission rejected'));
        
        FCM.getFCMToken().then(token => {
            console.log(token)
            //alert(token)
            // store fcm token in your server
        });
        
        this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
            // optional, do some component related stuff
        });
        
        // initial notification contains the notification that launchs the app. If user launchs app by clicking banner, the banner notification info will be here rather than through FCM.on event
        // sometimes Android kills activity when app goes to background, and when resume it broadcasts notification before JS is run. You can use FCM.getInitialNotification() to capture those missed events.
        // initial notification will be triggered all the time even when open app by icon so send some action identifier when you send notification
        FCM.getInitialNotification().then(notif=>{
           console.log(notif)
           //alert(notif)
        });
    }

    componentWillUnmount() {
        // stop listening for events
        this.notificationListener.remove();
    }

    otherMethods(){
 
        FCM.subscribeToTopic('/topics/foo-bar');
        FCM.unsubscribeFromTopic('/topics/foo-bar');
        FCM.presentLocalNotification({
            id: "UNIQ_ID_STRING",                               // (optional for instant notification)
            title: "My Notification Title",                     // as FCM payload
            body: "My Notification Message",                    // as FCM payload (required)
            sound: "default",                                   // as FCM payload
            priority: "high",                                   // as FCM payload
            click_action: "ACTION",                             // as FCM payload
            badge: 10,                                          // as FCM payload IOS only, set 0 to clear badges
            number: 10,                                         // Android only
            ticker: "My Notification Ticker",                   // Android only
            auto_cancel: true,                                  // Android only (default true)
            large_icon: "ic_launcher",                           // Android only
            icon: "ic_launcher",                                // as FCM payload, you can relace this with custom icon you put in mipmap
            big_text: "Show when notification is expanded",     // Android only
            sub_text: "This is a subText",                      // Android only
            color: "red",                                       // Android only
            vibrate: 300,                                       // Android only default: 300, no vibration if you pass 0
            group: "group",                                     // Android only
            picture: "https://google.png",                      // Android only bigPicture style
            ongoing: true,                                      // Android only
            my_custom_data:'my_custom_field_value',             // extra data you want to throw
            lights: true,                                       // Android only, LED blinking (default false)
            show_in_foreground                                  // notification when app is in foreground (local & remote)
        });
 
        FCM.scheduleLocalNotification({
            fire_date: new Date().getTime(),      //RN's converter is used, accept epoch time and whatever that converter supports
            id: "UNIQ_ID_STRING",    //REQUIRED! this is what you use to lookup and delete notification. In android notification with same ID will override each other
            body: "from future past",
            repeat_interval: "week" //day, hour
        })
 
        FCM.getScheduledLocalNotifications().then(notif=>console.log(notif));
 
        //these clears notification from notification center/tray
        FCM.removeAllDeliveredNotifications()
        FCM.removeDeliveredNotification("UNIQ_ID_STRING")
 
        //these removes future local notifications
        FCM.cancelAllLocalNotifications()
        FCM.cancelLocalNotification("UNIQ_ID_STRING")
 
        FCM.setBadgeNumber(1);                                       // iOS only and there's no way to set it in Android, yet.
        FCM.getBadgeNumber().then(number=>console.log(number));     // iOS only and there's no way to get it in Android, yet.
        FCM.send('984XXXXXXXXX', {
          my_custom_data_1: 'my_custom_field_value_1',
          my_custom_data_2: 'my_custom_field_value_2'
        });
 
        FCM.deleteInstanceId()
            .then( () => {
              //Deleted instance id successfully
              //This will reset Instance ID and revokes all tokens.
            })
            .catch(error => {
              //Error while deleting instance id
            });
    }

    goBack(){
    	Actions.pop()
    }
    save(){
      Alert.alert(
        'Alert',
        'Do you want to save ?',
        [
          {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: 'OK', onPress: () => this.dataSave()},
        ],
        { cancelable: false }
      );      
    }

    dataSave(){
      this.ref = firebase.firestore().collection('users').doc(global.userGlobalId).set(
                          {
                            displayName: this.state.displayName,
                            photoURL: this.state.photoURL,
                            email: this.state.email,
                            location: this.state.location,
                            age: this.state.age,
                            gender: this.state.gender,
                            feet: this.state.feet,
                            inch: this.state.inch,
                            relationship: this.state.relationship,
                            skin: this.state.skin,
                            religion: this.state.religion,
                            bodytype: this.state.bodytype,
                            education: this.state.education,
                            occupation: this.state.occupation,
                            smoke: this.state.smoke,
                            drink: this.state.drink,
                            kids: this.state.kids,
                            diettype: this.state.diettype,
                            oftenexercise: this.state.oftenexercise,
                            pets: this.state.pets,
                            message: this.state.message,
                          }
                      );  
    }

    modalContol(param,currentItem){
        if(param == 'gender'){
          this.setState({isModalVisible:true,modalItems:gender,currentItem:currentItem,currentView:param})
        }else if(param == 'feet'){
            this.setState({isModalVisible:true,modalItems:feet,currentItem:currentItem,currentView:param})
        }else if(param == 'inch'){
            this.setState({isModalVisible:true,modalItems:inch,currentItem:currentItem,currentView:param})
        }else if(param == 'relation'){
            this.setState({isModalVisible:true,modalItems:relationship,currentItem:currentItem,currentView:param})
        }else if(param == 'skin'){
            this.setState({isModalVisible:true,modalItems:skin,currentItem:currentItem,currentView:param})
        }else if(param == 'religion'){
            this.setState({isModalVisible:true,modalItems:religion,currentItem:currentItem,currentView:param})
        }else if(param == 'bodytype'){
            this.setState({isModalVisible:true,modalItems:bodytype,currentItem:currentItem,currentView:param})
        }else if(param == 'education'){
            this.setState({isModalVisible:true,modalItems:education,currentItem:currentItem,currentView:param})
        }else if(param == 'occupation'){
            this.setState({isModalVisible:true,modalItems:occupation,currentItem:currentItem,currentView:param})
        }else if(param == 'smoke'){
            this.setState({isModalVisible:true,modalItems:smoke,currentItem:currentItem,currentView:param})
        }else if(param == 'drink'){
            this.setState({isModalVisible:true,modalItems:drink,currentItem:currentItem,currentView:param})
        }else if(param == 'kids'){
            this.setState({isModalVisible:true,modalItems:kids,currentItem:currentItem,currentView:param})
        }else if(param == 'diettype'){
            this.setState({isModalVisible:true,modalItems:diettype,currentItem:currentItem,currentView:param})
        }else if(param == 'oftenexercise'){
            this.setState({isModalVisible:true,modalItems:oftenexercise,currentItem:currentItem,currentView:param})
        }else if(param == 'pets'){
            this.setState({isModalVisible:true,modalItems:pets,currentItem:currentItem,currentView:param})
        }
    }

    locationModal(){
        global.locationFlag = 1;
        this.setState({isModalVisible : true})       
    }

     hidenModal(item){
          if(this.state.currentView == 'gender'){
            that.setState({isModalVisible:false,gender:item})  
          }else if(this.state.currentView == 'feet'){
            that.setState({isModalVisible:false,feet:item})  
          }else if(this.state.currentView == 'inch'){
            that.setState({isModalVisible:false,inch:item})  
          }else if(this.state.currentView == 'relation'){
            that.setState({isModalVisible:false,relationship:item})  
          }else if(this.state.currentView == 'skin'){
            that.setState({isModalVisible:false,skin:item})  
          }else if(this.state.currentView == 'religion'){
            that.setState({isModalVisible:false,religion:item})  
          }else if(this.state.currentView == 'bodytype'){
            that.setState({isModalVisible:false,bodytype:item})  
          }else if(this.state.currentView == 'education'){
            that.setState({isModalVisible:false,education:item})  
          }else if(this.state.currentView == 'occupation'){
            that.setState({isModalVisible:false,occupation:item})  
          }else if(this.state.currentView == 'smoke'){
            that.setState({isModalVisible:false,smoke:item})  
          }else if(this.state.currentView == 'drink'){
            that.setState({isModalVisible:false,drink:item})  
          }else if(this.state.currentView == 'kids'){
            that.setState({isModalVisible:false,kids:item})  
          }else if(this.state.currentView == 'diettype'){
            that.setState({isModalVisible:false,diettype:item})  
          }else if(this.state.currentView == 'oftenexercise'){
            that.setState({isModalVisible:false,oftenexercise:item})  
          }else if(this.state.currentView == 'pets'){
            that.setState({isModalVisible:false,pets:item})  
          }
     }

     _pickImage() {
      ImagePicker.launchImageLibrary({}, response  => {
        uploadImage(response.uri)
          .then(url => this.photoUpdate(url))
          .catch(error => console.error(error))
      })
    }

    photoUpdate(url){
      this.setState({photoURL: url});
    }

    goBackLocation(location){
      global.locationFlag = 0;
      this.setState({
                        location: location,
                        isModalVisible: false,
                    });
    }

    nothingLocation(){
      global.locationFlag = 0;
      this.setState({isModalVisible: false});
    }

    // render component
    render() {
        var returnLayout;
        var i = 0;
        that  =this;
        var returnLayout = this.state.modalItems.map(function(item){
          i++;
          if(item == that.state.currentItem){
            return(
                <View style={{marginBottom:20,flexDirection:'row',justifyContent:'space-between'}} key = {i}>
                    <Text>{item}</Text>
                    <TouchableOpacity onPress={that.hidenModal.bind(that,item)} style={{alignItems:'center',justifyContent:'center', width:20,height:20,borderRadius:10,borderColor:'red',borderWidth:2}}>
                          <View style={{width:10,height:10,borderRadius:5,backgroundColor:'red'}}/>
                    </TouchableOpacity>
                </View>
              );
          }else{
              return(
                <View style={{marginBottom:20,flexDirection:'row',justifyContent:'space-between'}} key = {i}>
                    <Text>{item}</Text>
                    <TouchableOpacity onPress={that.hidenModal.bind(that,item)} style={{width:20,height:20,borderRadius:10,borderColor:'black',borderWidth:2}}>
                          
                    </TouchableOpacity>
                </View>
              );
          }
        });

        return(
            <View style={{flex:1}}>
                    <View style={Styles.statusBar}/>
                    <View style={Styles.titleBar}>
                          <View>
                              		<TouchableOpacity onPress={this.goBack.bind(this)} style={{marginLeft:10}}>
                              				<Image source = {Images.close} style={{width:15,height:15,resizeMode:'cover'}} />
                              		</TouchableOpacity>		
                          </View>	
                          <View style={{flex:1}}>
                                  <Text style={{backgroundColor:'transparent',textAlign:'center',fontSize:20,fontWeight:'700',color:'white'}}> Edit Profile</Text>
                          </View>
                          <View style={{alignItems:'flex-end'}}>
                                  <TouchableOpacity onPress={this.save.bind(this)} style={{marginRight:10}}>
                                      <Text style={{fontSize:16,color:'white'}}>save</Text>
                                  </TouchableOpacity>   
                          </View> 
                    </View>
                    <View style={Styles.mainBody}>
                          <KeyboardAwareScrollView>
                                 <View  style={{margin:20,alignItems:'center'}}>
                                      <TouchableOpacity onPress={this._pickImage.bind(this)}> 
                                          {(this.state.photoURL!='')?<Image source={{uri:this.state.photoURL}} style={{borderRadius:60,width:120,height:120}} />:
                                                                     <View style={{borderRadius:60,width:120,height:120, backgroundColor:'blue'}} />}
                                      </TouchableOpacity>                   
                                      <Text style={{marginTop:20,fontSize:20,color:'white',textAlign:'center'}}>Edit Picture</Text>
                                          
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                          <Text style={{color:'white'}}>Name  </Text>
                                          <Text >{this.state.displayName} </Text>
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                          <Text style={{color:'white'}}>Email  </Text>
                                          <Text >{this.state.email} </Text>
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                          <Text style={{color:'white'}}>Location  </Text>
                                          <TouchableOpacity onPress ={this.locationModal.bind(this)} style={{height:30,flex: 1,justifyContent:'center'}}>
                                              <Text >{this.state.location} </Text>
                                          </TouchableOpacity>    
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                          <View style={{flexDirection:'row',alignItems:'center'}}>
                                                  <Text style={{color:'white'}}>Age </Text>
                                                  <TextInput keyboardType = 'number-pad' onChangeText={(text)=>this.setState({age:text})} style={{width:50}} value = {this.state.age} returnKeyType='done'/>
                                          </View>
                                          <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                  <View style={{flexDirection:'row'}}>
                                                    <Text style={{color:'white'}}>Gender </Text>
                                                    <Text> {this.state.gender}</Text>
                                                  </View>  
                                                  <TouchableOpacity onPress={this.modalContol.bind(this,"gender",this.state.gender)} style={{justifyContent:'center'}}>
                                                      <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                                  </TouchableOpacity>   
                                          </View>
                                          
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Height </Text>
                                      <View style={{flex:1,flexDirection:'row',justifyContent:'space-between'}}>    
                                          <View style={{flexDirection:'row',alignItems:'center',marginRight:20,justifyContent:'space-between'}}>
                                                  <Text style={{marginRight:30}}>{this.state.feet}</Text>
                                                  <TouchableOpacity onPress={this.modalContol.bind(this,'feet',this.state.feet)} style={{justifyContent:'center'}}>
                                                      <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                                  </TouchableOpacity>   
                                          </View>
                                          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                                  <Text  style={{marginRight:30}}>{this.state.inch}</Text>
                                                  <TouchableOpacity onPress={this.modalContol.bind(this,'inch',this.state.inch)} style={{justifyContent:'center'}}>
                                                      <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                                  </TouchableOpacity>   
                                          </View>
                                      </View>     
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Relationship status </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.relationship}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'relation',this.state.relationship)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Skin complexion </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.skin}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'skin',this.state.skin)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Religion </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.religion}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'religion',this.state.religion)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Body Type </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.bodytype}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'bodytype',this.state.bodytype)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Educaiton </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.education}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'education',this.state.education)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Occupation </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.occupation}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'occupation',this.state.occupation)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Smoke? </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.smoke}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'smoke',this.state.smoke)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Drink? </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.drink}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'drink',this.state.drink)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Kids? </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.kids}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'kids',this.state.kids)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Diet type </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.diettype}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'diettype',this.state.diettype)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Often Exercise </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.oftenexercise}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'oftenexercise',this.state.oftenexercise)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{height:50,padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <Text style={{width:130,color:'white'}}>Pets </Text>
                                      <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                              <Text  style={{marginRight:30}}>{this.state.pets}</Text>
                                              <TouchableOpacity onPress={this.modalContol.bind(this,'pets',this.state.pets)} style={{justifyContent:'center'}}>
                                                  <Image source={Images.dropdown} style={{width:10,height:5,resizeMode:'cover'}}/>
                                              </TouchableOpacity>   
                                      </View>   
                                 </View>
                                 <View style={{padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white',height:30}} />
                                  <View style={{padding:10,alignItems:'center',flexDirection:'row',marginLeft:10,marginRight:10,borderBottomWidth:0.3,borderColor:'white'}}>
                                      <TextInput onChangeText={(text)=>this.setState({message:text})} blurOnSubmit={false} returnKeyType = {"return"} multiline={true} style={{height:100,backgroundColor:'transparent',color:'white',flex:1}}/>
                                 </View>     
                                 
                           </KeyboardAwareScrollView>      
                    </View>
                    <Modal isVisible={this.state.isModalVisible}>
                    {(global.locationFlag == 0) ?
                      <View style={{ backgroundColor:'white',paddingTop:20,paddingLeft:20,paddingRight:20,}}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          {returnLayout}
                        </ScrollView>
                      </View>
                      :
                      <View style={{ backgroundColor:'white',paddingTop:0,paddingLeft:0,paddingRight:0,}}>
                            <GooglePlaceAutocomplete
                              style={{height:Metrics.screenHeight-100,width: Metrics.screenWidth-40,marginLeft:0,marginRight:0,}}
                              googleAPIKey="AIzaSyBDlXDjhHSBgI6etr234bO23X6Dc1QYJ7I"
                              onResult={(result) => this.goBackLocation(result.formatted_address)}
                              placeholder="search location..." />
                                
                            <TouchableOpacity onPress={this.nothingLocation.bind(this)} style={{position:'absolute',top:10,right:10,alignItems:'center',justifyContent:'center'}}>
                              <Text style={{color:'black',fontSize:16}}>Cancel</Text>
                            </TouchableOpacity>
                      </View>}
                    </Modal>
            </View>


      )}
}

module.exports = EditProfile;
