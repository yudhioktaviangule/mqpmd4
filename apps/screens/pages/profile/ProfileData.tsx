import React, { Component } from 'react'
import {  SafeAreaView, StyleSheet, View, Text,TouchableOpacity, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import { MemberDataRedux } from '../../../../reducer'
import { device, warna } from '../../../constants'
import { home, NAV_HALF_HEIGHT } from '../Stylish';
import { Avatar } from 'react-native-elements'
import { httpHeader } from '../../../service-function'
import { getRouterURLArray, getURLGambar } from '../../../constants/ConstantURLs'
import { sendHttpGET } from '../../../service-function/httpService'
import { initialName } from '../../../service-function/initialName';

import { Feather } from '../../../constants/Feather'
import { Ant } from '../../../constants/AntIcon'
import { serviceNotifications } from '../notifikasi/NotificationModel'
import { formatCurrency } from '../../../functions/pipes'


const style = home;
const stylus = StyleSheet.create({

    bgblack:{
        backgroundColor:'#000',
    },
    bgWhite:{
        backgroundColor:'#FFF',
    },

    avatarText:{
        fontSize:32,
        fontWeight:'700',
    },
    avatarSecondaryText:{
        fontSize:18,
        fontWeight:'300',
    },
    content:{
        flex:1,
    },
    navContainer:{
        minHeight:NAV_HALF_HEIGHT,
        paddingVertical:30,
        paddingHorizontal:15,
    },
    commonContainer:{
        padding:15,
    },
    item:{
        borderBottomColor:warna.e3e3e3,
        borderWidth:0.7,
        paddingVertical:5,
    },
    alignAllCenter:{
        justifyContent:'center',
        alignContent:'center',
        alignItems:'center'
    },
    softThing:{
        fontWeight:'300',
    },
});
class ProfileData extends Component<any> {
    state = {
        members:{
            id:0,
            name:'',
            email:'',
            photo:'',
        },
        isIntialiseName:true,
        isLoadedDataMember:true,
        produkDisukaiCount:0,
        isLoadedCount:false,
        isLoadedPoints:false,
        points:0,
    }
    headers;

    navigateTo = (toRoute,params?:any)=>{
        const { navigation } = this.props;
        if(params==undefined){
            navigation.push(toRoute)
        }else{
            navigation.push(toRoute,params)
        }
    }
    handler={
        initialize:()=>{
            const { id,remember_token,name,email} = this.props;
            this.setState({isLoadedPoints:false,members:{name:name,email:email}},()=>{
                const { completeUrl } = getRouterURLArray("members","member");
                const URL = `${completeUrl}${id}`;
                this.headers = httpHeader(device,remember_token);
                sendHttpGET(URL,this.headers,(response)=>{
                    const { result } = response.data;
                    serviceNotifications(id,remember_token,(notificationValue)=>{
                        this.props.updateNotification(notificationValue);
                        this.handler.setMember(result);
                    })
                })
            })
        },
        navigate:(to,params?:any)=>{
            const { navigation } = this.props
            if(params==undefined){
                navigation.push(to)
            }else{
                navigation.push(to,params)
            }
        },
        setMember:(respResult)=>{
            const {id,name,photo,email,dev_id,remember_token} = respResult;
            const foto = photo === 'default.png' ? null : getURLGambar(`members/${photo}`);
            let member:MemberDataRedux={
                id:id,
                name:name,
                email:email,
                dev_id:dev_id,
                remember_token:remember_token,
                photo:foto,
            };
            
            this.setState({isLoadedDataMember:true,members:member,isIntialiseName:(foto===null?true:false)},()=>{
                this.handler.getLikedCount();
            })
        },

        getLikedCount:()=>{
            const { id } = this.state.members;
            const { completeUrl } = getRouterURLArray('products',"liked");
            const URL = `${completeUrl}${id}`
            sendHttpGET(URL,this.headers,(response)=>{
                const { count } = response.data.result;
                this.setState({produkDisukaiCount:count,isLoadedCount:true},()=>{
                    this.handler.getPoints();
                })
                
            })
        },

        getPoints:()=>{
            const { id } = this.state.members;
            const { completeUrl } = getRouterURLArray('members',"member_point");
            const URL = `${completeUrl}${id}`;
            sendHttpGET(URL,this.headers,(response)=>{
                const { point } = response.data.result;
                this.setState({points:point,isLoadedPoints:true})
            })                        
        }
        
    }

    componentDidMount(){
        const {navigation} = this.props;
        const thisRoute = navigation.state.routeName;
        navigation.addListener("willFocus",payload=>{
            if( payload.state.routeName == thisRoute){
                this.setState({isLoadedCount:false,loadComponent:false},()=>{
                    this.handler.initialize();
                });
            }
        })
    }
    render() {
        return (
            <SafeAreaView style={[style.appContainer,style.bgNavRed]}>
                <View style = {[stylus.navContainer,style.flexRow,{alignItems:'center'}]}>
                    {
                        this.state.members.photo==null?(<Avatar
                            rounded
                            size="large"
                            title={initialName(this.state.members.name)}
                            overlayContainerStyle={{backgroundColor:warna.draculaOrchid}}
                            showEditButton={true}
                            onPress={()=>{
                                const { navigation } = this.props;
                                navigation.push("UploadProfile");
                            }}
                            />):(<Avatar
                                rounded
                                size="large"
                                source={{uri:this.state.members.photo}}
                                overlayContainerStyle={{backgroundColor:warna.draculaOrchid}}
                                showEditButton={true}
                                onPress={()=>{
                                    const { navigation } = this.props;
                                    navigation.push("UploadProfile");
                                }}
                                />)
                    }
                    
                    <View style={{flex:1,paddingHorizontal:20}}>
                        <Text style={[stylus.avatarText,{marginBottom:5,color:warna.whitePolos}]}>
                            {this.state.members.name}
                        </Text>
                        <Text style={[stylus.avatarSecondaryText,{marginBottom:5,color:warna.whitePolos}]}>
                            {this.state.members.email}
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={()=>{
                            const {navigation} = this.props;
                            navigation.push("Chat")
                        }}
                        style={{width:48,height:48,justifyContent:'flex-end'}}>
                        <Feather
                            name="message-circle"
                            color={warna.whitePolos}
                            size={24}
                            />
                    </TouchableOpacity>
                </View>
                <View style={[stylus.content,stylus.bgWhite,{paddingHorizontal:5}]}>
                    <TouchableOpacity 
                        onPress={()=>{
                            this.navigateTo("UbahDataProfile");
                        }}
                        style={[stylus.commonContainer,style.lineSepa,style.flexRow,{alignItems:'center'}]}>
                        <Feather
                            name="user"
                            size={24}
                            />
                        <View style={{paddingHorizontal:10}}>
                            <Text style={[stylus.softThing]}>Lihat Profile</Text>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>{
                            this.navigateTo("ByProfileListTransaksi")
                        }}
                        style={[stylus.commonContainer,style.lineSepa,style.flexRow,{alignItems:'center'}]}>
                        <Feather
                            name="shopping-cart"
                            size={24}
                            />
                        <View style={{paddingHorizontal:10}}>
                            <Text style={[stylus.softThing]}>Lihat Pesanan</Text>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>{
                            const { navigation } = this.props;
                            if(this.state.isLoadedCount){
                                navigation.push("DisukaiPage",{pages:this.state.produkDisukaiCount});
                            }else{
                                alert("Harap tunggu! Sedang mengambil data");
                            }
                        }}
                        style={[stylus.commonContainer,style.lineSepa,style.flexRow,{alignItems:'center'}]}>
                        <Ant
                            name="hearto"
                            size={24}
                            />
                        <View style={[style.flexRow ,{flex:1,paddingHorizontal:10,justifyContent:'space-between'}]}>
                            <Text style={[stylus.softThing]}>Disukai</Text>
                            {
                                !this.state.isLoadedCount?(<ActivityIndicator/>):<Text style={[stylus.softThing]}>{this.state.produkDisukaiCount}</Text>
                            }
                            
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>{
                            const { navigation } = this.props;
                            navigation.push("TerakhirDilihat");
                            
                        }}
                        style={[stylus.commonContainer,style.lineSepa,style.flexRow,{alignItems:'center'}]}>
                        <Ant
                            name="eyeo"
                            size={24}
                            />
                        <View style={{paddingHorizontal:10}}>
                            <Text style={[stylus.softThing]}>Terakhir Dilihat</Text>
                        </View>

                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={()=>{
                            const { navigation } = this.props;
                            if(this.state.isLoadedPoints){
                                navigation.push("PointMember",{pages:this.state.produkDisukaiCount});
                            }else{
                                alert("Harap tunggu! Sedang mengambil data");
                            }
                        }}
                        style={[stylus.commonContainer,style.lineSepa,style.flexRow,{alignItems:'center'}]}>
                        <Feather
                            name="credit-card"
                            size={24}
                            />
                        <View style={[style.flexRow ,{flex:1,paddingHorizontal:10,justifyContent:'space-between'}]}>
                            <Text style={[stylus.softThing]}>Poin mannaQueen</Text>
                            {
                                !this.state.isLoadedPoints?(<ActivityIndicator/>):<Text style={[stylus.softThing]}>{this.state.points===0 ? "Belum ada point":formatCurrency(this.state.points)}</Text>
                            }
                            
                        </View>

                    </TouchableOpacity>
                </View>
            
            </SafeAreaView>
        )
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
export default connect(mapStateToProps, mapDispatchStateToProps)(ProfileData)

