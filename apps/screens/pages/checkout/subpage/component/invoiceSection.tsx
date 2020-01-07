//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MemberDataRedux } from '../../../../../../reducer';
import { device, warna } from '../../../../../constants';
import { connect } from 'react-redux';
import Dash from 'react-native-dash';
import { formatCurrency } from '../../../../../functions/pipes';
import { getStatusPembelian } from '../../../../../models/Trans';

// create a component

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
class InvoiceSection extends Component<any> {
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
        getjumlahBayar:()=>{
            let bayar : number = parseInt(this.state.transaksi.jumlah_pembayaran.toString());
            let ongkir: number = parseInt(this.state.transaksi.biaya_pengiriman.toString());
            let unik  : number = parseInt(this.state.transaksi.unik.toString());
            return bayar+ongkir+unik
        },
        getStatusPembelian:(status)=>{
            return getStatusPembelian({status_transaksi:status})
        }
    };
    componentDidMount(){
        this.setState({transaksi:this.props.transaksi})
    }
    render() {
        return (
            <View style={invoice.container}>
                <View style={invoice.topContainer}>
                    <Text style={[detail.topContainerText,detail.bolder]}>
                        Informasi Pembayaran
                    </Text>
                </View>
                <Dash
                    dashGap={2}
                    dashThickness={0.9}
                    dashLength={5}
                    dashColor={warna.e3e3e3}
                    />
                <View style={[invoice.topContainer, invoice.row,invoice.separateItem,]}>
                    <Text style={[detail.viewDetail,detail.bolder]}>
                        Invoice
                    </Text>
                    <Text style={[detail.viewDetail,detail.textEnd,detail.thicker]}>
                        {this.state.transaksi.invoice}
                    </Text>
                </View>
                
                <View style={[invoice.topContainer, invoice.row,invoice.separateItem,]}>
                    <Text style={[detail.viewDetail,detail.bolder]}>
                        Jumlah Pembayaran
                    </Text>
                    <Text style={[detail.viewDetail,detail.textEnd,detail.thicker]}>
                        IDR. {formatCurrency(this.handler.getjumlahBayar())}
                    </Text>
                </View>

                

            </View>
        );
    }
}

function mapStateToProps(state: MemberDataRedux = { id: 0, name: '', dev_id: device, email: '', remember_token: '' }) {
    return state;
}

function mapDispatchStateToProps(dispatch) {
    return {
        setMemberProps: (s) => dispatch({ type: 'SAVE_MEMBER', state: s }),

    }
}
export default connect(mapStateToProps, mapDispatchStateToProps)(InvoiceSection)
