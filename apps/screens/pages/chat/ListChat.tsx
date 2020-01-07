import React, { Component } from 'react'
import { View, Text,  SafeAreaView, FlatList, TouchableOpacity, StatusBar } from 'react-native'

import { connect } from 'react-redux'
import { MemberDataRedux } from '../../../../reducer'
import { device, warna } from '../../../constants'

import { httpHeader } from '../../../service-function'
import { getRouterURLArray } from '../../../constants/ConstantURLs'
import { sendHttpGET } from '../../../service-function/httpService'
import { 
    home as hom
} from '../Stylish';
import { Feather } from '../../../constants/Feather'
import { RedBackButton } from '../componentsData/Header'

const home = hom;

class ListChat extends Component<any> {
    textChatJSX;
    state = {
        hasBlurred:false,
        pesanText:"",

        loadModal:false,
        isLoading:false,
        adminOnline:[],
     
    }

    handler = {
        renderNav:()=>{
            return (
                <RedBackButton navBackto={()=>{
                    const {navigation} = this.props;
                  
                    navigation.navigate("ProfileIndex");
                }} title="Chat" {...this.props}/>
            );
        },
        renderFlatAdmin:(item)=>{
            const {admin} = item
            const {lastchat} = item
            return(
            <TouchableOpacity
                style={{borderColor:warna.e3e3e3,borderWidth:0.7,padding:15,margin:5,backgroundColor:'white'}}
                onPress={()=>{
                    const { navigation } = this.props;
                    navigation.navigate("DetailChat",{admin:item})
                }}
                >
                    <View style={{flex:1,flexDirection:'row',alignItems:"center"}}>
                        <Feather
                            name="message-circle"
                            color={warna.turquise}
                            size={18}
                            />
                        <View style={{marginHorizontal:15,flex:1}}>
                            <Text style={{fontWeight:"500",fontSize:16}}>{admin.name}</Text>
                            <Text style={{fontWeight:"100",fontSize:14}}>{lastchat}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                )
        },
        renderContent:()=>{
            const { adminOnline } = this.state;
            return (
                <View style={[home.bgContent,home.contentContainer]}>
                    <FlatList
                        data={adminOnline}
                        renderItem={(item)=>{
                            return this.handler.renderFlatAdmin(item.item);
                        }}
                        keyExtractor={(index)=>{return index}}
                        />
                </View>
            );
        },
        getChatGroup:()=>{
            const header = this.handler.getHeader();
            const url = this.handler.getGroupURL();
            sendHttpGET(url,header,(response)=>{
                const {result} = response.data;
                this.setState({adminOnline:result})
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
    
    }


  

    componentDidMount(){
        const {navigation} = this.props;
        
        const {routeName} = navigation.state;
  
        navigation.addListener('willFocus',payload=>{
            if(payload.state.routeName==routeName){
                this.handler.getChatGroup();
            }
        })     
    }
    render() {
        return (
            <View style={[home.appContainer,home.bgNavRed]}>
                <StatusBar
                    barStyle="light-content"/>
                <SafeAreaView style={{flex:1}}>
                    {this.handler.renderNav()}
                    {this.handler.renderContent()}
                </SafeAreaView>
            </View>
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
export default connect(mapStateToProps, mapDispatchStateToProps)(ListChat)

