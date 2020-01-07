//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ActivityIndicator } from 'react-native';
import { MemberDataRedux } from '../../../../reducer';
import { device, warna } from '../../../constants';
import { connect } from 'react-redux';
import { DEVICE_DIMENSION } from '../../../constants/device';
import ComponentListTransaksi from './component/ComponentListTransaksi';
import { httpHeader } from '../../../service-function';
import { getRouterURLArray } from '../../../constants/ConstantURLs';
import { sendHttpGET } from '../../../service-function/httpService';
import { serviceNotifications, notifURL } from '../notifikasi/NotificationModel';
import { WhiteLoading } from '../componentsData/LoadingComponent';




const DIMENSI_WIDTH = DEVICE_DIMENSION.width; 
const DIMENSI_HEIGHT = DEVICE_DIMENSION.height; 
const NAV_HEIGHT = DIMENSI_HEIGHT*0.15;
const NAV_HALF_HEIGHT = NAV_HEIGHT/2;
const ICON_TOP = NAV_HEIGHT-NAV_HALF_HEIGHT;

const home = StyleSheet.create({
    appContainer:{
        flex:1
    },
    contentContainer:{
        flex:1,
        width:DIMENSI_WIDTH
    },
    
    smallContainer:{
        paddingVertical:30,
    },
    bgDark:{
        backgroundColor:warna.draculaOrchid,
    },
    navContainer:{
        minHeight:NAV_HEIGHT/2
    },
    bgNav:{
        backgroundColor:warna.whitePolos,
    },
    bgContent:{
        backgroundColor:warna.whiteLynx
    },
    nav:{
        alignContent:'center',
        alignItems:'center'
    },
    flexRow:{
        flexDirection:'row'
    },
    titleContents:{
        flex:1,
        paddingVertical:10,
        justifyContent:"center", 
        alignItems:'center'
    },
    titleTextStyle:{
        color:warna.whitePolos,
        fontSize:20,
        fontWeight:'500'
    },
    softTopBorder:{
        borderTopColor:warna.e3e3e3,
        borderTopWidth:0.7,
    },
    padding:{
        padding:10,
    },flex2:{
        flex:2
    }


})
// create a component
class TransaksiPage extends Component<any> {
    state = {
        loadComponent:false,
        transactions:[],
    };
    handler = {
        clickItemHandler:(id)=>{
            this.props.navigation.navigate("DetailTransaksi",{id:id})
        },
        composHttp:()=>{
            let data=[];
            let url = getRouterURLArray("transaksi","trans_by_member").completeUrl;
            
            url=`${url}${this.props.id}`;
            sendHttpGET(url,this.handler.getHttpHeader(),(r)=>{
                data = r.data.result;
                this.setState({transactions:data},()=>{
                    this.setState({loadComponent:true},()=>{
                       serviceNotifications(this.props.id,this.props.remember_token,(notification)=>{
                           this.props.updateNotification(notification);
                       })
                    })
                })
            },(err)=>{
                console.log(`${url} error, KODE:`,err)
            })
        },
        getHttpHeader:()=>{
            return httpHeader(device,this.props.remember_token)
        }
     
    };
    componentDidMount(){
        const navigation = this.props.navigation;
        const thisRoute = navigation.state.routeName;
        navigation.addListener('willFocus',payload=>{
            if( payload.state.routeName == thisRoute){
                this.setState({loadComponent:false},()=>{
                    this.handler.composHttp();
                });
            }
        })
    }
    render() {
        return (
            <SafeAreaView style={[home.appContainer,home.bgDark]}>
                <View style={[home.navContainer,home.flexRow]}>
                    <StatusBar
                        barStyle="light-content"
                        />
                    <View style={[home.titleContents]}>
                        <Text style={[home.titleTextStyle]}>Pembayaran</Text>
                    </View>
                </View>
                {
                    this.state.loadComponent?(
                        <View style={[home.bgContent,home.flex2]}>
                            <View style={[home.bgContent,home.flex2,home.softTopBorder,home.padding]}>
                                <ComponentListTransaksi 
                                    data={this.state.transactions}
                                    handlerClickItem={(id)=>{
                                        this.handler.clickItemHandler(id)
                                    }}
                                    />
                            </View>
        
                            
                        </View>
                    ):(<WhiteLoading/>)
                }
            </SafeAreaView>
        );
    }
}


function mapStateToProps(state: MemberDataRedux = { id: 0, name: '', dev_id: device, email: '', remember_token: '' }) {
    return state;
}

function mapDispatchStateToProps(dispatch) {
    return {
        setMemberProps: (s) => dispatch({ type: 'SAVE_MEMBER', state: s }),
        updateNotification: st => dispatch({ type: "UPDATE_NOTIFICATION", state: st })
    }
}
export default connect(mapStateToProps, mapDispatchStateToProps)(TransaksiPage)
