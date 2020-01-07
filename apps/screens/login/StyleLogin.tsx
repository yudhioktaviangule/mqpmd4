import { StyleSheet } from "react-native";
import { warna } from "../../constants";


export const StyleLogin = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:warna.draculaOrchid,
        alignItems:'center',
        alignContent:'center',
        justifyContent:'center'
    },
    textInput: {
        color:warna.whiteLynx,
        width:'100%',
    },
    textInputContainer: {
        backgroundColor:warna.asbetos,
        paddingVertical:20,
        paddingHorizontal:15,
        borderRadius:5,
        color:warna.whiteLynx,
        width:'100%',
        marginVertical:15,
    }
})