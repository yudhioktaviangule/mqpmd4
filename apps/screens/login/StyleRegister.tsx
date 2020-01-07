
import { StyleSheet } from 'react-native';
import { warna } from '../../constants';

export const styleRegis = StyleSheet.create({
    container:{
        flex:1,
        alignContent:'center',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:warna.clouds
    },
    textboxContainer:{
        marginVertical:15,
        borderColor:warna.silver,
        borderWidth:1,
        borderStyle:'solid',
        borderRadius:5
    },
    textbox:{
        color:warna.blueNight,
        paddingHorizontal:15,
        paddingVertical:15,        
    },
    formContainer:{
        width:'95%',
        backgroundColor:'#fff',
        padding:15,
        marginVertical:15
        
    }

})