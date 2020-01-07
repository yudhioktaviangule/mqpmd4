import React, { Component } from 'react'
import { View, Text,  SafeAreaView, FlatList, TouchableOpacity, TextInput, KeyboardAvoidingView, Keyboard, StatusBar } from 'react-native'

import { connect } from 'react-redux'
import { MemberDataRedux } from '../../../../../reducer'
import { device, warna } from '../../../../constants'

import { httpHeader } from '../../../../service-function'
import { getRouterURLArray } from '../../../../constants/ConstantURLs'
import { sendHttpGET, sendHTTPPOST } from '../../../../service-function/httpService'
import { 
    home as hom
} from '../../Stylish';
import { Image } from 'react-native-elements'
import { Feather } from '../../../../constants/Feather'

import { formatCurrency } from '../../../../functions/pipes'
import registerPush, { vib } from '../../../../push/notifikasi'
import { Notifications } from 'expo'
import { NavigationEvents } from 'react-navigation'
import NavRouteBackFunction from '../../../../service-function/NavRouteBackFunction'

const home = hom;

class DetailChat extends Component<any> {
    textChatJSX;
    flist: FlatList<any>
    state = {
        hasBlurred:false,
        pesanText:"",
        attachs:undefined,
        attachJSON:{componentType:undefined},
        admin:{admin_id:0,name:'',fcm_token:''},
        loadModal:false,
        isLoading:false,
        adminOnline:[],
        chats:[
            
        ],
    }

    handler = {
        getChats:()=>{
            const member_id = this.props.id;
            const { admin_id } = this.state.admin;
            const { completeUrl } = getRouterURLArray("chats","get_chat");
            const url = `${completeUrl}${member_id}/${admin_id}`;
            const header=httpHeader(device,this.props.remember_token);
            sendHttpGET(url,header,(resp)=>{
                const {result} = resp.data;
                this.setState({chats:result});
            })
        },
        renderLink:(json)=>{
            const {navigation} = this.props;
            let { link } = json;
            let { data } = json;
            let split = link.split("|");
            switch (split[0]) {
                case "DetailProduct":
                    return (
                        <TouchableOpacity style={{flexDirection:'row'}}
                            onPress ={()=>{
                                const {params,routeName} = navigation.state;
                                let parampampam = params;
                                delete parampampam.key;
                                const paramNavBack = NavRouteBackFunction(routeName,{...parampampam,product_id:split[1]});
                                //console.log(paramNavBack);
                                navigation.push(split[0],paramNavBack)
                                //navigation.pop();
                            }}
                            >
                            <Image
                                source={data.photo}
                                style={{width:32,height:32,resizeMode:'cover',marginRight:5}}
                                />
                            <View style={{flex:1,marginLeft:5}}>
                                <Text style={{fontWeight:'600'}}>
                                    {data.captionPrimary}
                                </Text>
                                <Text style={{fontWeight:'600',color:warna.alizarin}}>
                                    {formatCurrency(data.captionSecondary)}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                default:
                        return (
                            <TouchableOpacity style={{flexDirection:'row'}}
                                onPress ={()=>{
                                    const {params,routeName} = navigation.state;
                                    let parampampam = params;
                                    delete parampampam.key;
                                    const paramNavBack = NavRouteBackFunction(routeName,{...parampampam,id:split[1]});
                                    navigation.push(split[0],paramNavBack)
                                    //navigation.pop();
                                }}
                                >
                                <Feather name="shopping-cart" color={warna.alizarin} size={20} style={{marginRight:5}}/>
                                <View style={{flex:1,marginLeft:5}}>
                                    <Text style={{fontWeight:'600'}}>
                                        {data.captionPrimary}
                                    </Text>
                                    <Text style={{fontWeight:'600',color:warna.alizarin}}>
                                        {data.captionSecondary}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
            }
            
        },
    
        kirimPesan:()=>{
            Keyboard.dismiss();
            let formatPesan;
            let pesan;
            if(this.state.attachs!=undefined){
                formatPesan = {json:JSON.stringify({
                    "admin_id":this.state.admin.admin_id,
                    type:'toAdmin',
                    member_id:this.props.id,
                    data:{
                        text:this.state.pesanText,  
                        attachment:this.state.attachs 
                    }})
                }
                pesan = JSON.parse(formatPesan.json)
                
            }else{
                formatPesan = {json:JSON.stringify({
                    "admin_id":this.state.admin.admin_id,
                    type:'toAdmin',
                    member_id:this.props.id,
                    data:{
                        text:this.state.pesanText,   
                    }})
                }
                pesan = JSON.parse(formatPesan.json)
                
            }
            let jsonchat = this.state.chats;
            jsonchat.push(pesan);
            this.setState({attachs:undefined,chats:jsonchat},()=>{
                
            })
            this.setState({pesanText:''},()=>{
                
            });
            const headers = httpHeader(device,this.props.remember_token);
            const url = getRouterURLArray("chats","send_chat").completeUrl;
            sendHTTPPOST(url,formatPesan,headers,
                (response)=>{
                    let { result } = response.data
                    let json = result;
                    //console.log(json);
                    
                });
        },
        renderChatList:(items)=>{
            const { item } = items;
            let { type } = item;
            const { data } = item;
            //console.log(item);
            if(type.toLowerCase() =="tomember"){
                return (
                    <View style={[home.flexRow,{paddingHorizontal:15}]}>
                        <View style={{flex:1}}></View>
                        <View style={{flex:1,padding:15,margin:8,backgroundColor:warna.whitePolos,borderColor:warna.e3e3e3,borderWidth:1,borderRadius:5}}>
                            <Text>{data.text}</Text>
                        </View>
                    </View>
                );
            }else{
                return (
                    <View style={[home.flexRow,{paddingHorizontal:15}]}>
                        <View style={{flex:1,padding:15,margin:8,backgroundColor:warna.whiteTurqoa,borderColor:warna.e3e3e3,borderWidth:1,borderRadius:5}}>
                            {data.attachment!=undefined ? this.handler.renderLink(data.attachment):(<View></View>)}
                            <Text>{data.text}</Text>
                        </View>
                        <View style={{flex:1}}></View>
                    </View>
                );                
            }
        },
        renderChat:()=>{
            const { admin } = this.state;
            return (
                    
                <SafeAreaView style={[home.appContainer,home.bgNav]}>

         
                    <View style={[home.contentContainer,home.bgContent,home.softTopBorder]}>
                        <FlatList
                            ref={(ref)=>{this.flist=ref}}
                            data = {this.state.chats}
                            renderItem = {(item)=> {return this.handler.renderChatList(item)}}
                            keyExtractor={(index)=>{return index}}
                            refreshing ={true}
                            extraData = {this.state}
                            />
                        <View style={{backgroundColor:'white'}}
                            >
                            {this.state.attachs!=undefined ?(
                                <View style={{padding:10}}>
                                    {this.handler.renderLink(this.state.attachs)}
                                </View>

                            )  : null}
                            
                            <View style={{flexDirection:'row',minHeight:40,marginBottom:10,marginHorizontal:3,backgroundColor:'white'}}>
                                <TextInput 
                                    onChangeText={(text)=>{
                                        this.setState({pesanText:text});
                                    }}
                                    value={this.state.pesanText}
                                    ref={(ref)=>{this.textChatJSX = ref}}
                                    style={{paddingHorizontal:5,backgroundColor:warna.whiteLynx, flex:1,marginHorizontal:2,borderColor:warna.e3e3e3,borderWidth:0.7}}/>
                                <TouchableOpacity 
                                    onPress={()=>{
                                       this.handler.kirimPesan()
                                    }}
                                    style={{backgroundColor:warna.alizarin}}>
                                    <View style={{flex:1,paddingHorizontal:10,flexDirection:'row',alignItems:'center'}}>
                                        <Feather
                                            name="send"
                                            size={10}
                                            color={warna.whitePolos}
                                            />
                                        <Text style={{color:'white'}}>KIRIM</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    
                </SafeAreaView>
                    
            );
        },
        renderNav:()=>{
            return (
                <View style={[home.bgNav,home.navContainer,home.flexRow]}>
                    <View style={{flex:1,justifyContent:'center'}}>
                        <TouchableOpacity style={{paddingRight:30}}
                            onPress={()=>{
                                const { navigation } = this.props;
                                navigation.navigate("Chat");
                            }}
                        >
                            <Feather
                                name="arrow-left"
                                size={18}
                                color={warna.alizarin}
                                />
                        </TouchableOpacity>
                    </View>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <Text style={[home.navTextStyle,{color:warna.alizarin}]}>PESAN</Text>
                    </View>
                    <View style={{flex:1}}></View>
                </View>
            );
        },
        renderContent:()=>{
            
            return (
                <View style={[home.bgContent,home.contentContainer]}>
                    {this.handler.renderChat()}
                </View>
            );
        },
        getChatGroup:()=>{
            const header = this.handler.getHeader();
            const url = this.handler.getGroupURL();
            sendHttpGET(url,header,(response)=>{
                const {data:result} = response;
            })
        },
        getGroupURL:()=>{
            const { id } = this.props;
            const clsURL = getRouterURLArray("chats","get_admin_group_chat").completeUrl;
            const url = `${clsURL}${id}`;
            return url;
        },
        getHeader:()=>{
            const { remember_token } = this.props;
            return httpHeader(device,remember_token);
        },
        handleNotifications:({data})=>{
            console.log(data);
            let listChat = this.state.chats;
            listChat.push(data);
            this.setState({chats:listChat},()=>{
                vib([1000]);
                this.flist.forceUpdate(()=>{
                    this.flist.scrollToEnd();
                });
            });
            
        }
    }
    


    componentWillMount(){
        console.log('wilMount');
        registerPush((token)=>{
            console.log('expoToken',token);
            Notifications.addListener(this.handler.handleNotifications)
        })
    }

    componentDidMount(){
        const {navigation} = this.props;
        const thisRoute = navigation.state.routeName;
        
        navigation.addListener('willFocus',payload=>{
            const {routeName} = payload.state;
            console.log("router",thisRoute,routeName);
            if( routeName == thisRoute){
                
                const json = navigation.getParam('attachment')
                console.log("this JSON attachment",json);
                if(navigation.getParam("attachment")!=undefined){
                    this.setState({attachs:json,admin:navigation.getParam('admin'),loadModal:true},()=>{
                        this.handler.getChats();
                    });
                }else{
                    this.setState({loadModal:false,admin:navigation.getParam('admin')},()=>{
                        this.handler.getChats();
                    });
                }
                
            }
        })      
    }
    render() {
        return (
            <KeyboardAvoidingView behavior="padding" enabled style={[home.appContainer,home.bgNav]}>
                <StatusBar
                    barStyle="dark-content"/>
                <SafeAreaView style={{flex:1}}>
                    {this.handler.renderNav()}
                    {this.handler.renderContent()}
                </SafeAreaView>

            </KeyboardAvoidingView>
        )
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
export default connect(mapStateToProps, mapDispatchStateToProps)(DetailChat)

