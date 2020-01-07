import { StyleSheet, Dimensions } from "react-native";
import {warna}  from "../../constants";
const entireScreenWidth = Dimensions.get('window').width;

export const globalStyles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:warna.whiteLynx,
        alignItems:'center',
        justifyContent:'flex-start'
    },
    headerCol:{
        backgroundColor:warna.alizarin
    }
});
export const cards = StyleSheet.create({
    cards:{
        minWidth:'95%',

        justifyContent:'center',
        minHeight:240,
        marginTop:10,
        marginBottom:10,
        borderColor:warna.clouds,
        borderStyle:'solid',
        borderWidth:0.5,
        backgroundColor:'#fff',
        borderRadius:5    
          
    }
})



export const navbar = StyleSheet.create({
    red:{
        backgroundColor:warna.alizarin,
        minHeight:92,
        paddingTop:45,
        paddingBottom:15,
        width:'100%',
        flexDirection:'row',

    },
    black:{
        backgroundColor:warna.draculaOrchid,
        minHeight:92,
        paddingTop:45,
        paddingBottom:15,
        width:'100%',
        flexDirection:'row',
        

    }
})
