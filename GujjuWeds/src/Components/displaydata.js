
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
} from 'react-native'
import { Actions } from 'react-native-router-flux';
import {Colors, Fonts, Images, Metrics, Styles, Constants } from '../Themes';
import SegmentControl from 'react-native-segmented-control-tab'
import firebaseImage from 'firebase'
//import MessengerContainer from './MessengerContainer'
import firebase from 'react-native-firebase';
var totalData = []
class DisplayData extends Component {

    constructor(props){
      
    	var photoURL='';
        super(props);
        this.state=({
        	photoURL:'',
        	selectedIndex:0,
          dataSource: [],
        });
      }

    componentDidMount() {
      let documents = firebase.firestore().collection("users").get()
        .then(snapshot => {
          snapshot.forEach(doc => {  

            let subCollectionDocs = firebase.firestore().collection('users')
                                       .doc(doc.id)
                                       .get()
                                       .then((documentSnapshot) => {
                                          const value = documentSnapshot.data();
                                          totalData.push(value);
                                          this.setState({dataSource: totalData})
                                        }).catch(err => {
                                          alert(err);
                                        })
          });
        }).catch(err => {
        alert(err);
      });
      
    }

    goBack(){
    	Actions.pop()
    }

    editProfile(){
    	Actions.editprofile();
    }

    notification(){

    }

    handleIndexChange = (index) => {
      this.setState({
        selectedIndex: index,
      });
    }
    // render component
    render() {
       jsonData = this.state.dataSource.map(function(item) {
            return (
                            <View style={{width:Metrics.screenWidth/2,marginTop:20,backgroundColor:'white',alignItems:'center'}}>
                                <Image source={{uri:item['photoURL']}} style={{width:Metrics.screenWidth/2,height:Metrics.screenWidth/2,resizeMode:'cover'}}>
                                    
                                </Image>
                                <Text style={{position:'absolute',bottom:20,backgroundColor:'#c43c3c',color:'white'}}>{item['age']}</Text>                            
                                <Text style={{textAlign:'center'}}>{item['displayName']} </Text>
                            </View>    
                       
                    );
        });
        return(
	        <View style={{flex:1}}>
	            <View style={Styles.statusBar}/>
	            <View style={Styles.titleBar}>
	              <View>
	              		<TouchableOpacity onPress={this.editProfile.bind(this)} style={{marginLeft:10}}>
	              				<Image source = {Images.editprofile} style={{width:20,height:15,resizeMode:'cover'}} />
	              		</TouchableOpacity>		
	              </View>	
	              <View style={{flex:1}}>
	                  <Text style={{backgroundColor:'transparent',textAlign:'center',fontSize:20,fontWeight:'700',color:'white'}}> GujjuWeds - Matrimonial App</Text>
	              </View>
	              <View style={{alignItems:'flex-end'}}>
                    <TouchableOpacity onPress={this.notification.bind(this)} style={{marginRight:10}}>
                        <Image source = {Images.notification} style={{width:20,height:20,resizeMode:'cover'}} />
                    </TouchableOpacity>   
                </View>
	            </View>
	            <View style={{height:3,backgroundColor:'#af3737',shadowOffset:{width:3,height:3}}} />
	            <View style={Styles.mainBody}>	
	            	 <SegmentControl
	                      tabStyle = {{height:50,backgroundColor:'#c43c3c',borderRadius:0,borderTopWidth:0,borderLeftWidth:0,borderRightWidth:0,borderColor:'#c43c3c'}}
	                      tabTextStyle = {{color:'white'}}
	                      activeTabStyle = {{backgroundColor:'#c43c3c',borderTopWidth:0,borderLeftWidth:0,borderRightWidth:0,borderBottomWidth:3,borderColor:'red'}}
	                      activeTabTextStyle = {{color:'white'}}
	                      values={['ONLINE', 'NEARYOU']}
	                      selectedIndex={this.state.selectedIndex}
	                      onTabPress = {this.handleIndexChange}
                    >
                        
                </SegmentControl>	
                {
                  (this.state.selectedIndex == 0)
                  ?
                  
                  <ScrollView style={{alignItems:'center'}}>
                            {jsonData}
                  </ScrollView>
                  :
                  <View style={{flex:1,alignItems: 'center',justifyContent: 'center'}}>
                            <Text>NEARYOU</Text>
                  </View>
                }
                
	            </View>
	        </View>
    )}
}

module.exports = DisplayData;
