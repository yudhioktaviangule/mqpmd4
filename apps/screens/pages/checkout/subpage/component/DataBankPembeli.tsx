//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Clipboard } from 'react-native';
import { warna } from '../../../../../constants';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getURLGambar } from '../../../../../constants/ConstantURLs';
import { Image } from 'react-native-elements';

// create a component
class DataBankPembeli extends Component<any> {
    handler={
        saveToClipboard:(text)=>{
            Clipboard.setString(text);
            alert("Rekening disalin")
        }
    };
    render() {
        const { bank } = this.props.transaksi
        let foto = {uri:getURLGambar(bank.iconbank)};
        return (
            <View style={bankStyle.container}>
                <View style={[bankStyle.topContainer,bankStyle.borderBottomSoft]}>
                    <Text style={{ fontWeight: '600' }}>
                        Metode Pembayaran
                    </Text>
                </View>
                
              
                <View style={[{paddingVertical: 5,alignItems:'center' },bankStyle.row]}>
                    <View style={{width:64,height:64,marginHorizontal:10}}>
                        <Image
                            source={foto}
                            style={{
                                
                                width:64,
                                height:64,
                                resizeMode:'cover',
                                
                            }}
                            />
                    </View>
                    <View style={{flex:1}}>
                        <Text>BANK {bank.namabank}</Text>
                        <TouchableOpacity
                            onPress={()=>{
                                this.handler.saveToClipboard(bank.norek)
                            }}
                            >
                            <View style={bankStyle.row}>
                                <Text style={{color:warna.alizarin,fontSize:24,fontWeight:'600'}}>{bank.norek}</Text>
                                <Text style={{color:warna.alizarin,marginLeft:10}}>SALIN</Text>
                            </View>
                        </TouchableOpacity>
                    
                    </View>
                </View>
              
            </View>
        );
    }
}


const bankStyle = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 5
    },
    borderBottomSoft:{
        paddingBottom:5,
        borderBottomColor:warna.e3e3e3,
        borderBottomWidth:0.7
    },
    row: {
        flexDirection: 'row',
    },
    topContainer: {
        paddingVertical: 5,
    },
    separateItem: {
        justifyContent: 'space-between',
        alignItems: 'center',
    },


})

//make this component available to the app
export default DataBankPembeli;
