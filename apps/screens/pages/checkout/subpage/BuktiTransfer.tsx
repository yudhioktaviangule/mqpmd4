//import liraries
import React, { Component } from 'react';
import { View,Text, StyleSheet, SafeAreaView } from 'react-native';
import { MemberDataRedux } from '../../../../../reducer';
import { device, warna } from '../../../../constants';
import { connect } from 'react-redux';
import { httpHeader } from '../../../../service-function';
import { sendHttpGET, sendHTTPPOST } from '../../../../service-function/httpService';
import { getRouterURLArray } from '../../../../constants/ConstantURLs';
import InvoiceSection from './component/invoiceSection';
import { ActivityIndicator } from 'react-native';
import { Transaksi, TransaksiKey } from '../../../../models/Trans';
import { StatusPembelian } from './component/StatusPembelian';
import { DEVICE_DIMENSION } from '../../../../constants/device';
import BatasWaktuSection from './component/BatasWaktuSection';
import DataBankPembeli from './component/DataBankPembeli';
import UploadBukti from './component/UploadBukti';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Pulse } from '../../../../customComponent/animationLoader';
import { home } from '../../Stylish';
import { RedBackButton } from '../../componentsData/Header';
import ViewContent from '../../componentsData/Content';
import { WhiteLoading } from '../../componentsData/LoadingComponent';

const dimension = DEVICE_DIMENSION;
const styleD = home;
const styles = StyleSheet.create({
    itemFlex:{
        flex:1,
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor: "#FFF",
    },
    row:{
        flexDirection:'row'
    },
    backgroundTurqo:{
        backgroundColor:warna.turquise
    },
    backgroundDark:{
        backgroundColor:warna.draculaOrchid
    },

    backgroundGrey:{
        backgroundColor:warna.e3e3e3
    },
    galleryImageContainer:{
        height:dimension.height*0.3
    },
    itemContainer:{
        paddingVertical:10,
        paddingHorizontal:10,
    },
    bordere3e3e3:{
        borderColor:warna.e3e3e3,
    },
    borderTopBottom:{
        borderTopWidth:0.7,
        borderBottomWidth:0.7,
    }
});

class BuktiTransfer extends Component<any> {
    paramsTrans:Transaksi;
    
    state={
        buttonSave:false,
        isLoadingData:true,
        transaksi:{
            id:'',
            bukti_bayar:''
        },
    }
    
  
    httpService = {
        createJSONHeader:()=>{
            let remember_token = this.props.remember_token
            return httpHeader(device,remember_token)
        }
    }
    handlers = {
        enableTheButtonSave:(enable)=>{
            this.setState({buttonSave:enable})
        },
        composeHttpSimpan:()=>{
            this.setState({isLoadingData:true},()=>{
                let header = this.httpService.createJSONHeader()
                this.handlers.setParamTransaksi({keys:'bukti_bayar'},this.state.transaksi.bukti_bayar)
                this.handlers.setParamTransaksi({keys:'_method'},'put')
                let url = getRouterURLArray("transaksi","transaksi").completeUrl
                url = `${url}${this.paramsTrans.id}`;
                sendHTTPPOST(url,this.paramsTrans,header,(response)=>{
                    alert("Berhasil Mengunggah Bukti Transfer")
                    this.props.navigation.push("DetailTransaksi",{id:this.state.transaksi.id});
                }) 
            })
        },
        getTransaksi:()=>{
            let id = this.state.transaksi.id
            let header = this.httpService.createJSONHeader()
            let url = getRouterURLArray("transaksi","get_trans").completeUrl+id;
            sendHttpGET(url,header,(response)=>{
                let resp = response.data.result
                this.setState({transaksi:resp,isLoadingData:false},()=>{
                    this.handlers.setParamTransaksi({keys:"id"},resp.id)
                })
            })
        },
        setParamTransaksi:(key:TransaksiKey,value:any)=>{
            this.paramsTrans = {
                ...this.paramsTrans,
                [key.keys]:value
            };
           // console.log(`after loading ${key.keys}` ,this.paramsTrans)
        }
    }
    
    componentDidMount(){
        
        let transaksi = this.props.navigation.getParam("transaksi");
        this.setState({buttonSave:false,transaksi:transaksi},()=>{
            this.paramsTrans = {
                status_transaksi:"menunggu verifikasi",
            }
            this.handlers.getTransaksi();
        })
    }
    render() {
        if(this.state.isLoadingData){
            return (
            <WhiteLoading/>)
        }
        return (
            <View style={[styleD.appContainer,styleD.bgNavRed]}>
                <SafeAreaView style={[styleD.appContainer]} >
                    <RedBackButton title="Bukti Transfer" { ...this.props }/>
                    <ViewContent>
                        <View style={[styleD.smallContainer,styleD.bgContent,styleD.fluidMore]}>
                            {(!this.state.isLoadingData ?
                                <StatusPembelian transaksi={this.state.transaksi}/>
                                :
                                <View style={styles.itemFlex}>
                                    <ActivityIndicator/>
                                </View>
                                )
                            }
                            
                        </View>
        
                        <View style={[styles.itemContainer,styles.row,styles.bordere3e3e3,styles.borderTopBottom,]}>
                            {(!this.state.isLoadingData ?
                                <InvoiceSection transaksi={this.state.transaksi}/>
                                :
                                <View style={styles.itemFlex}>
                                    <ActivityIndicator/>
                                </View>
                                )
                            }
                            
                        </View>            
        
                        <View style={[styles.itemContainer,styles.row,styles.bordere3e3e3,styles.borderTopBottom,]}>
                            {(!this.state.isLoadingData ?
                                <BatasWaktuSection transaksi={this.state.transaksi}/>
                                :
                                <View style={styles.itemFlex}>
                                    <ActivityIndicator/>
                                </View>
                                )
                            }
                        </View>            
        
                        <View style={[styles.itemContainer,styles.row,styles.bordere3e3e3,styles.borderTopBottom,]}>
                            {(!this.state.isLoadingData ?
                                <DataBankPembeli transaksi={this.state.transaksi}/>
                                :
                                <View style={styles.itemFlex}>
                                    <ActivityIndicator/>
                                </View>
                                )
                            }
                        </View>            
        
                        <View style={[styles.itemContainer,styles.row,styles.bordere3e3e3,styles.borderTopBottom,]}>
                            {(!this.state.isLoadingData ?
                                <UploadBukti 
                                    transaksi={this.state.transaksi}
                                    setAvailableSaveButton={(nilai:boolean,base64Image:string)=>{
                                        this.setState({transaksi:{
                                            ...this.state.transaksi,
                                            bukti_bayar:base64Image
                                        }},()=>{this.handlers.enableTheButtonSave(nilai)})
                                    }}
                                    />
                                :
                                <View style={styles.itemFlex}>
                                    <ActivityIndicator/>
                                </View>
                                )
                            }
                        </View>
        
                        <View style={[styles.row,{width:dimension.width,marginTop:10}]}>
                            <TouchableOpacity
                                onPress={
                                    ()=>{
                                        this.handlers.composeHttpSimpan()
                                    }
                                }
                                style={{width:dimension.width,paddingVertical:20,backgroundColor:warna.alizarin}}
                                >
                                    <View style={{alignSelf:'center'}}>
                                        <Text style={{color:'white'}}>KIRIM</Text>
                                    </View>
                            </TouchableOpacity>
                        </View>
                

                    </ViewContent>
                </SafeAreaView>
            
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
export default connect(mapStateToProps, mapDispatchStateToProps)(BuktiTransfer)