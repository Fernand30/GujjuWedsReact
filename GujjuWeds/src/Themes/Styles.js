import { responsiveHeight, responsiveWidth, responsiveFontSize } from 'react-native-responsive-dimensions';
import Metrics from './Metrics';
import Constants from './Constants';
import Fonts from './Fonts';

const Styles = {
    container : {
        flex : 1,
    },

    fullContainer : {
        width : Metrics.screenWidth,
        height : Metrics.screenHeight,
    },
    titleBar:{flexDirection:'row',height:50,backgroundColor:'#c43c3c',alignItems:'center',justifyContent:'space-between'},
    columnContainer : {
        flex : 1,
        flexDirection : 'column'
    },
    statusBar:{height:20,backgroundColor:'#af3737'},
    rowContainer : {
        flex : 1,
        flexDirection : 'row',
    },

    mainBody:{flex:1,backgroundColor:'#f25c5c'},
    buttonStyle1:{
      width:200,
      height:40,
      justifyContent:'center',
      backgroundColor:'white',
      shadowOffset:{  width: 3,  height: 3,  },
      shadowColor: 'black',
      shadowOpacity: 0.5,
    },
    buttonStyle2:{
      marginTop:20,
      width:200,
      height:40,
      justifyContent:'center',
      backgroundColor:'#075575',
      shadowOffset:{  width: 3,  height: 3,  },
      shadowColor: 'black',
      shadowOpacity: 0.5,
    },
    responsiveContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: responsiveHeight(50), // 50% of screen height
      width: responsiveWidth(50), // 50% of screen width
    },
    sampleText: {
      fontSize: responsiveFontSize(5), // 2% of total screen size
      fontFamily:Fonts.ultra,
    },
    alignCenter:{
      alignItems:'center'
    },
    justifyCenter:{
      justifyContent:'center'
    },
}

export default Styles;
