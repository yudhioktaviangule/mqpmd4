import React, * as react from 'react'
import { View, SafeAreaView, StatusBar, StyleSheet } from 'react-native'
import {  Avatar } from "react-native-elements";
import { MemberDataRedux } from '../../../../reducer';
import { device, warna } from '../../../constants';
import { connect } from 'react-redux';
import { DEVICE_DIMENSION } from '../../../constants/device';
import FlatlistKategori from './components/FlatlistKategori';
import { httpHeader } from '../../../service-function';
import { getRouterURLArray } from '../../../constants/ConstantURLs';
import { sendHttpGET, serverResponses } from '../../../service-function/httpService';
import { serviceNotifications } from '../notifikasi/NotificationModel';
import { WhiteLoading } from '../componentsData/LoadingComponent';

const DIMENSI_WIDTH = DEVICE_DIMENSION.width; 
const DIMENSI_HEIGHT = DEVICE_DIMENSION.height; 
const NAV_HEIGHT = DIMENSI_HEIGHT*0.15;
const NAV_HALF_HEIGHT = NAV_HEIGHT/2;
const ICON_TOP = NAV_HEIGHT-NAV_HALF_HEIGHT;

const home = StyleSheet.create({
    appContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center'
    },
    contentContainer:{
        flex:1,
        width:DIMENSI_WIDTH
    },
    
    smallContainer:{
        paddingVertical:30,
    },
    
    navContainer:{
        
        minHeight:NAV_HEIGHT
    },
    bgNav:{
        backgroundColor:warna.alizarin,
    },
    bgContent:{
        backgroundColor:warna.whiteLynx
    },
    nav:{
        alignContent:'center',
        alignItems:'center'
    }


})
class Home extends react.Component<any> {
    state={
        loading:true,
        categories:[]        
    }
    handlers={
        clickKategoriHandler:(params)=>{
            this.props.navigation.navigate("AllProduct",params);
        },
        createURL:(child)=>{
            let prefix = "categories";
            return getRouterURLArray(prefix,child).completeUrl;
        },
        createHeaders:()=>{
            let id = device;
            let token = this.props.remember_token;
            return httpHeader(id,token)
        },
        getCategories:(callbackResponse)=>{
            let url = this.handlers.createURL("category");
            let headers = this.handlers.createHeaders();
            sendHttpGET(url,headers,(response)=>{
               // console.log(response.data);
               let data:serverResponses = response.data; 
               if(data.pesan.code==200){
                   const {id,remember_token} = this.props;
                   serviceNotifications(id,remember_token,(notificationValue)=>{
                        this.props.updateNotification(notificationValue);
                   })
                   console.log('Response OK',data.pesan.msg,'From Function ',data.sendInfo._func)
                }else{
                    console.log('Response FAIL',data.pesan.msg)
               }
               callbackResponse(data.result)
            })
            
        },
        renderComponent:()=>{
            return(

                <View style={[home.appContainer,home.bgNav]}>
                    <StatusBar
                        barStyle='light-content'
                        
                    />
                <SafeAreaView>
                    <View style={[home.navContainer,home.smallContainer,home.bgNav,home.nav]}>
                        <Avatar
                            rounded
                            source={require("../../../assets/logo.png")}
                            size={"large"}
                            containerStyle={{
                                position:'absolute',
                                borderColor:warna.whitePolos,
                                borderWidth:1,
                                zIndex:999,
                                bottom:ICON_TOP/3
                            }}
                        />
                        <View style={{
                            width:DIMENSI_WIDTH,
                            position:'absolute',
                            bottom:0,
                            left:0,
                            height:ICON_TOP,
                            backgroundColor:warna.whiteLynx
                        }}></View>
                    </View>
                    <View style={[home.contentContainer,home.bgContent]}>
                        <View style={{
                            width:DIMENSI_WIDTH,
                            flex:1,
                        }}>
                            <FlatlistKategori 
                                data = {this.state.categories}
                                handleClickItem={(param)=>{
                                    this.handlers.clickKategoriHandler(param);
                                }}
                                />  
                        </View>
                    </View>
                </SafeAreaView>

            </View>

            )
        },
        
        setLoading:(stopLoading:boolean,callWhenStateChange?)=>{          
            this.setState({loading:stopLoading},()=>{
                if(callWhenStateChange!=undefined){
                    callWhenStateChange();
                }else{
                   // console.log('state loading changed to',stopLoading);
                }
            })
        },
        loadingComponent:()=>{
            return(
                <WhiteLoading/>
            );
        }

    }

    
    componentDidMount(){
        const {navigation} = this.props;
        
        const thisRoute = navigation.state.routeName;
        navigation.addListener("willFocus", payload => {
          if (payload.state.routeName == thisRoute){
            this.handlers.setLoading(true,()=>{
                this.handlers.getCategories((response)=>{
                    this.setState({categories:response},()=>{
                        this.handlers.setLoading(false)
                    })
                });
            })
          }
        });
 
    }
    render() {
        return (
            !this.state.loading? this.handlers.renderComponent():this.handlers.loadingComponent()
        )
    }
}


function mapStateToProps(state: MemberDataRedux = { id: 0, name: '', dev_id: device, email: '', remember_token: '' }) {
    return state;
}

function mapDispatchStateToProps(dispatch) {
    return {
        setMemberProps: (s) => dispatch({ type: 'SAVE_MEMBER', state: s }),
        resetTransaksi: () => dispatch({ type: 'REFRESH_TRANSAKSI', state: {} }),
        updateNotification: st => dispatch({ type: "UPDATE_NOTIFICATION", state: st }),

    }
}
export default connect(mapStateToProps, mapDispatchStateToProps)(Home)
