import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { warna } from '../../../../../constants'
import { getStatusPembelian } from '../../../../../models/Trans'
import { Feather } from '../../../../../constants/Feather'



const invoice = StyleSheet.create({
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

const detail = StyleSheet.create({
    topContainerText:{
        color:warna.draculaOrchid,
        
    },
    viewDetail:{
        fontSize:16
    },
    bolder:{
        fontWeight:'600'
    },
    thicker:{
        fontWeight:'300'
    },
    textEnd:{
        textAlign:'right'
    }
})


export class StatusPembelian extends Component<any> {
    state={
        transaksi:{
            invoice:"",
            jumlah_pembayaran:0,
            biaya_pengiriman:0,
            unik:0,
            status_transaksi:'',
        }
    }
    handler= {
        getStatusPembelian:(status)=>{
            return getStatusPembelian({status_transaksi:status})
        }
    }  
    
    componentDidMount(){
        this.setState({transaksi:this.props.transaksi})
    }
    render() {
        return (
            <View style={invoice.container}>
                <View style={[invoice.topContainer,{flexDirection:"row"}]}>
                    <Feather
                        name="check-square"
                        color="#FFF"
                        size={14}
                    />
                    <Text style={[detail.viewDetail,detail.thicker,{color:'#FFF',marginHorizontal:10}]}>
                        {this.handler.getStatusPembelian(this.state.transaksi.status_transaksi)}
                    </Text>
                </View>
            </View>
        )
    }
}
