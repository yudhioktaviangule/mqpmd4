import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import formatWaktu from '../../../../../service-function/formatWaktu'
import FormatWaktu from '../../../../../service-function/formatWaktu'


const batasWaktu = StyleSheet.create({
    container:{
        flex:1,
        paddingHorizontal:5
    },
    row:{
        flexDirection: 'row',
    },
    topContainer:{
        paddingVertical:5,
    },
    separateItem:{
        justifyContent:'space-between',
        alignItems:'center',
    },

    
})
export default class BatasWaktuSection extends Component<any> {
    state={
        transaksi:{
            batas_waktu:''
        },
    }
    componentDidMount(){
        this.setState({transaksi:this.props.transaksi})
    }
    render() {
        return (
            <View style={[batasWaktu.container,batasWaktu.row,batasWaktu.separateItem]}>
                <Text style={{fontWeight:'600'}}> Batas Waktu Pembayaran </Text>
                <View>
                    <Text>
                        {new FormatWaktu().getWaktu( this.state.transaksi.batas_waktu )}
                    </Text>
                </View>
            </View>
        )
    }
}
