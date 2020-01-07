import React, { Component } from 'react'
import { Text, View, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native'
import { home } from '../../../Stylish'
import { MemberDataRedux } from '../../../../../../reducer'
import { device, warna } from '../../../../../constants'
import { connect } from 'react-redux';
import { Feather } from '../../../../../constants/Feather'
import { createImagePicklet, manipulateImage } from '../../../../../service-function/ImagePicklet';
import { getRouterURLArray } from '../../../../../constants/ConstantURLs'
import { Image } from 'react-native-elements'
import { httpHeader, sendHTTPPOST } from '../../../../../service-function'

const style = home
class UploadPhotoProfile extends Component<any> {
    state={
        photo:'',
        imageLoaded:false
    };
    handler={
        initialize:()=>{
            
        },
        renderNav:()=>{
            return (
                <View style={[style.navContainer,style.flexRow,style.lineSepa]}>
                    <StatusBar
                    barStyle="dark-content" />
                <View style={{flex:1,justifyContent:'center'}}>
                    <TouchableOpacity
                        style={{flex:1,paddingRight:25,justifyContent:'center'}}
                        onPress={()=>{
                            const { navigation } = this.props
                            navigation.goBack();
                        }}>
                        <Feather
                            name="arrow-left"
                            size={20}
                            />
                    </TouchableOpacity>
                </View> 
                <View style={{
                    flex:1,
                    justifyContent:"center",
                    alignItems:"center",
                    alignContent:"center"
                    }}>
                        <Text style={[style.navTextStyle,{textAlign:'center'}]}>Upload Foto</Text>
                </View>                   
                <View style={{flex:1}}></View>                   
            </View>)
        },
        renderContent:(prop)=>{
            return(
                <View style={[style.contentContainer]}>
                    <View style={[style.smallContainer,style.flexRow,style.lineSepa,{paddingHorizontal:10}]}>
                        <Feather
                            name="user"/>
                        <Text style={{fontWeight:'200',marginLeft:10}}>
                            YUDHI
                        </Text>
                    </View>
                    
                    <View style={[style.smallContainer,style.flexRow,style.lineSepa,{paddingHorizontal:10}]}>
                        <Feather
                            name="mail"/>
                        <Text style={{fontWeight:'200',marginLeft:10}}>
                            devrax*****mail.com
                        </Text>
                    </View>
                    
                    <View style={[style.smallContainer,style.flexRow,{justifyContent:'center'}]}>
                        
                        {this.state.imageLoaded ? (<View style={{width:128,height:128}}>
                            <Image
                                source={{uri:`data:image/png;base64,${this.state.photo}`}}
                                style={{height:128,width:128,resizeMode:"cover",borderRadius:10}}
                            />
                            <TouchableOpacity 
                                onPress={()=>{
                                    this.handler.send();
                                }}
                                style={{marginTop:10, paddingVertical:10,justifyContent:'center',alignItems:'center',alignContent:'center', borderColor:warna.alizarin,borderWidth:1,backgroundColor:warna.whitePolos}}>
                                <Text style={{color:warna.alizarin}}>
                                    KIRIM
                                </Text>
                            </TouchableOpacity>
                        </View>
                            ):(
                            <TouchableOpacity 
                                onPress={()=>{
                                    this.handler.openUploader()
                                }}
                                style={{borderRadius:10,borderColor:warna.alizarin,borderWidth:0.7,width:128,height:128,borderStyle:'dashed',justifyContent:'center',alignContent:'center',alignItems:'center',}}>
                                <Feather
                                    name="camera"
                                    size={30}
                                    color={warna.alizarin}
                                    />
                                <Text style={{fontWeight:'200',fontSize:20,paddingTop:10,color:warna.alizarin}}>
                                    TAP TO BROWSE
                                </Text>
                            </TouchableOpacity>)} 
                        
                    </View>

                </View>
            );
        },
        openUploader:()=>{
            manipulateImage((base64)=>{
                this.setState({photo:base64,imageLoaded:true},()=>{
                    const { photo } = this.state
                    
                })
            },{width:128,height:128})
        },
        send:()=>{
            const { id, remember_token } = this.props
            const { photo } = this.state
            const { completeUrl } = getRouterURLArray("members","upload_profile_photo");
            const url = `${completeUrl}${id}`;
            const param = {photo:`data:image/png;base64,${photo}`};
            const header = httpHeader(device,remember_token)
            sendHTTPPOST(url,param,header,(response)=>{
                const { navigation } = this.props;
                navigation.goBack();
            })
        }

    };

    componentDidMount(){
        const {navigation} = this.props;
        const thisRoute = navigation.state.routeName;
        navigation.addListener("willFocus",payload=>{
            if( payload.state.routeName == thisRoute){
                this.setState({imageLoaded:false},()=>{
                    this.handler.initialize();
                });
            }
        })        
    }
    render() {
        return (
            <SafeAreaView style={[style.appContainer,style.bgNav]}>
                <this.handler.renderNav/>
                <this.handler.renderContent/>
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

    }
}
export default connect(mapStateToProps, mapDispatchStateToProps)(UploadPhotoProfile)