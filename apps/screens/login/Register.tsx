import React from "react";
import { View, KeyboardAvoidingView, Text } from "react-native";
import { warna } from "../../constants";
import { validateDataState } from "../../service-function/validasi";
import { getRouterURLArray } from "../../constants/ConstantURLs";
import { sendFreelyHttpPOST } from "../../service-function/httpService";
import { SafeAreaView } from "react-navigation";
import { styleRegis } from "./StyleRegister";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { DoubleBounce } from 'react-native-loader';
import { StyleLogin } from "./StyleLogin";
import { connect } from 'react-redux';



const styleLogin = StyleLogin
class Register extends React.Component<any> {
    
    borderColor: string;
    borderColorActive: string;
    _textA: View;
    _textB: View;
    _textC: View;
    _textD: View;
    constructor(props) {
      super(props)
      this.state = {
        name:'',
        email:'',
        password:'',
        retypePass:'',
        photo:'default.png',
        disabled:'y',
        remember_token:'0',
        dev_id:0,
        isLoading:false
      };
        this.borderColor = warna.silver
        this.borderColorActive = warna.peterRiver
    }
    
    render() {
        
        
        const { navigation } = this.props;
        const handleBack =()=>{
            let oldRouter = navigation.getParam("oldNav");
            let deviceID = navigation.getParam("dev_id")
            navigation.navigate(oldRouter,{dev_id:deviceID});
        }
        const onLostFocusedInput=(view:View)=>{
            view.setNativeProps({
                style:{
                    borderColor: this.borderColor,
                },
                
            })
        }
        const onFocusedInput=(view:View)=>{
            view.setNativeProps({
                style:{
                    borderColor: this.borderColorActive,
                },
                
            })
        }
        const registerHandler=()=>{
            let data = {
                name:this.state['name'],
                email:this.state['email'],
                password:this.state['password'],
                photo:this.state['photo'],
                disabled:this.state['disabled'],
                remember_token:this.state['remember_token'],
                dev_id:navigation.getParam("dev_id"),
            };
            let validasi = validateDataState(data);
            
            if(validasi){
                this.setState({isLoading:!this.state['isLoading']})
                console.log('dataMember',data);
                let url = getRouterURLArray("members","member").completeUrl;
                setTimeout(()=>{
                    sendFreelyHttpPOST(url,data,()=>{
                        this.setState({isLoading:!this.state['isLoading']});
                        alert("Registrasi Berhasil");
                        navigation.goBack()
    
                    });
                },3000);
            }
        }
  
        return (
            
            <SafeAreaView style={styleRegis.container}>
                <View style={[styleLogin.container,{width:'100%',display:this.state['isLoading']?'flex':'none'}]}>
                    <DoubleBounce size={30} color={warna.whiteLynx}/>
                </View>
                <KeyboardAvoidingView behavior="padding" style={{
                        padding:15,
                        width:'90%',
                        alignContent:'center',
                        alignItems:'center',
                        justifyContent:'center',
                        display:(this.state['isLoading'] ? 'none':'flex')
                    }}>
                    <View style={styleRegis.formContainer}>
                        <View style={{
                            minHeight:'5%',
                            marginVertical:15
                        }}>
                            <Text style={
                                {
                                    fontSize:24,
                                    fontWeight:'bold',
                                }
                            }>Register</Text>
                            <Text style={
                                {
                                    fontSize:14,
                                    color:warna.concrette

                                }
                            }>Register member mannaQueen</Text>
                        </View>
                        <View
                            ref={component=>{this._textA=component}} 
                            style={[styleRegis.textboxContainer]}>
                            <TextInput
                                style={styleRegis.textbox}
                                placeholder="Nama Lengkap"
                                placeholderTextColor={warna.silver}
                                onFocus={()=>{
                                    onFocusedInput(this._textA)
                                }}
                                onBlur={()=>{
                                    onLostFocusedInput(this._textA)
                                }}
                                onChangeText={(text)=>this.setState({name:text})}
                            />
                        </View>
                        <View
                            ref={component=>{this._textB=component}}
                            style={[styleRegis.textboxContainer]}>
                            <TextInput
                                style={styleRegis.textbox}
                                placeholder="Email"
                                placeholderTextColor={warna.silver}
                                onFocus={()=>{
                                    onFocusedInput(this._textB)
                                }}
                                onBlur={()=>{
                                    onLostFocusedInput(this._textB)
                                }}
                                onChangeText={(text)=>this.setState({email:text})}                                
                            />
                        </View>
                        <View ref={component=>{this._textC=component}} style={styleRegis.textboxContainer}>
                            <TextInput
                                style={styleRegis.textbox}
                                placeholder="Password"
                                placeholderTextColor={warna.silver}
                                onFocus={()=>{
                                    onFocusedInput(this._textC)
                                }}
                                onBlur={()=>{
                                    onLostFocusedInput(this._textC)
                                }} 
                                onChangeText={(text)=>this.setState({password:text})}
                            />
                        </View>
                        <View ref={component=>{this._textD=component}} style={styleRegis.textboxContainer}>
                            <TextInput
                                style={styleRegis.textbox}
                                placeholder="Ketik Ulang Password"
                                placeholderTextColor={warna.silver}
                                onFocus={()=>{
                                    onFocusedInput(this._textD)
                                }}
                                onBlur={()=>{
                                    onLostFocusedInput(this._textD)
                                }}  
                                onChangeText={(text)=>this.setState({retypePass:text})}                               
                            />
                        </View>
                    
                    </View>
                    <View style={{
                        justifyContent:'center',
                        alignItems:'center',
                        alignContent:'center',
                        width:'95%'
                    }}>
                        <View style={{flexDirection:'row',width:'100%'}}>
                            <TouchableOpacity
                                    style={
                                        {
                                            borderColor:warna.alizarin,
                                            borderWidth:1,
                                            marginHorizontal:7.5,
                                            padding:20,
                                            alignContent:'center',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            marginVertical:15,
                                            borderRadius:5,
                                            flexGrow:1
                                        }
                                    }
                                    onPress={()=>{
                                        handleBack();
                                    }}
                            >
                                <Text
                                    style={{
                                        color:warna.alizarin
                                    }}
                                >
                                    Kembali
                                </Text>
                        </TouchableOpacity>
                        

                            <TouchableOpacity
                                    style={
                                        {
                                            backgroundColor:warna.alizarin,
                                            flexGrow:1,
                                            padding:20,
                                            alignContent:'center',
                                            alignItems:'center',
                                            justifyContent:'center',
                                            marginVertical:15,
                                            marginHorizontal:15,
                                            borderRadius:5
                                        }
                                    }
                                    onPress={()=>{
                                        registerHandler();
                                    }}
                            >
                                <Text
                                    style={{
                                        color:warna.clouds
                                    }}
                                >
                                    Register
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
     
     
     )
    }
}

function mapStateToProps(state){
    return state;
}

function mapDispatchStateToProps(dispatch){
    return{
        setMemberProps:(st)=>dispatch({type:'SAVE_MEMBER',state:st}),
    }
}
export default connect(mapStateToProps,mapDispatchStateToProps)(Register)