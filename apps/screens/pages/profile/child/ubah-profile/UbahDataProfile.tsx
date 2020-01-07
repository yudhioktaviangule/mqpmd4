import React, { Component } from 'react'
import { Text, View, SafeAreaView,TouchableOpacity, StyleSheet, Modal, TextInput, StatusBar } from 'react-native'
import { MemberDataRedux, TypeUpdate } from '../../../../../../reducer';
import { device, warna } from '../../../../../constants';
import { connect } from 'react-redux';
import { home } from '../../../Stylish';
import { Feather } from '@expo/vector-icons';
import { Ant } from '../../../../../constants/AntIcon';
import { MatCommunity } from '../../../../../constants/MatIcons';
import { getRouterURLArray } from '../../../../../constants/ConstantURLs';
import { httpHeader, sendHTTPPOST } from '../../../../../service-function';


let PARAM_UPDATE ={
    _method:'put'
} 
const styles = home;
const thisStyle = StyleSheet.create({
    items:{
        paddingHorizontal:15,
        paddingVertical:20,
        
        borderBottomColor:warna.e3e3e3,
        borderBottomWidth:0.7
    },
    itemsNoBorder:{
        paddingHorizontal:15,
        paddingVertical:20,
    },
    spacingBeetwenContent:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    centeringRow:{
        alignItems:'center'
    },
    buttons:{
        borderColor:warna.alizarin,
        backgroundColor:warna.whitePolos,
        borderRadius:3,
        paddingVertical:15,
        borderWidth:1,
        alignItems:'center',
        alignContent:'center',
        justifyContent:'center'

    },
    buttonTextStyle:{
        color:warna.alizarin,
        fontWeight:'300'
    },

})

class UbahDataProfile extends Component<any> {
    state={
        isChangeData:false,
        contentChangeData:(<View></View>),
        isPassValidated:false,
        textEdit:"",
        textPassword:''
        
    }
    handler={

        logout:()=>{
            const TYPE_UPDATE:TypeUpdate={
                typeName:"DELETE"
            }
            const webParam={
                ...PARAM_UPDATE,
                dev_id:'0',
            }
            const header = httpHeader(device,this.props.remember_token);
            const { completeUrl } = getRouterURLArray("members","member");
            const {id}  = this.props;
            const url = `${completeUrl}${id}`; 
            sendHTTPPOST(url,webParam,header,(response)=>{
                const { result } = response.data;
                const { email }  = result.new;
                this.props.setMemberProps(TYPE_UPDATE,{email:email}); 
                this.setState({contentChangeData:<View/>,isChangeData:false},()=>{
                    alert("Silahkan Login Kembali");
                    const {navigation} = this.props;
                    navigation.navigate("Splash"); 
                })
            })            
        },
        postEmail:()=>{
            const TYPE_UPDATE:TypeUpdate={
                typeName:"CHANGE_EMAIL"
            };
            const paramUpdate={
                email:this.state.textEdit
            }
            const webParam={
                ...PARAM_UPDATE,
                email:paramUpdate.email
            }
            const header = httpHeader(device,this.props.remember_token);
            const { completeUrl } = getRouterURLArray("members","member");
            const {id}  = this.props;
            const url = `${completeUrl}${id}`; 
            sendHTTPPOST(url,webParam,header,(response)=>{
                const { result } = response.data;
                const { email }  = result.new;
                this.props.setMemberProps(TYPE_UPDATE,{email:email}); 
                this.setState({contentChangeData:<View/>,isChangeData:false},()=>{
                    alert("Ubah data Berhasil");
                })
            })
        },
        postPassword:()=>{
         
            const webParam={
                ...PARAM_UPDATE,
                password:this.state.textEdit,
            }
            const header = httpHeader(device,this.props.remember_token);
            const { completeUrl } = getRouterURLArray("members","member");
            const {id}  = this.props;
            const url = `${completeUrl}${id}`; 
            sendHTTPPOST(url,webParam,header,(response)=>{
                this.setState({contentChangeData:<View/>,isChangeData:false},()=>{
                    alert("Ubah Password Berhasil");
                })
            })
        },
        postName:()=>{
            const TYPE_UPDATE:TypeUpdate={
                typeName:"CHANGE_NAME"
            };
            const paramUpdate={
                name:this.state.textEdit
            }
            const webParam={
                ...PARAM_UPDATE,
                name:paramUpdate.name
            }
            const header = httpHeader(device,this.props.remember_token);
            const { completeUrl } = getRouterURLArray("members","member");
            const {id}  = this.props;
            const url = `${completeUrl}${id}`; 
            sendHTTPPOST(url,webParam,header,(response)=>{
                const { result } = response.data;
                const { name }  = result.new;
                this.props.setMemberProps(TYPE_UPDATE,{name:name}); 
                this.setState({contentChangeData:<View/>,isChangeData:false},()=>{
                    alert("Ubah data Berhasil");
                })
            })

        },
        validatePass:(callback)=>{
            const  content = (
            <View style={[styles.flexRow,thisStyle.itemsNoBorder,thisStyle.centeringRow ]}>
                <View style={{flex:1}}>
                    <TextInput 
                        onChangeText={(text)=>{
                            this.setState({textPassword:text})
                        }}
                        secureTextEntry={true}
                        style={{
                            paddingVertical:15,
                            paddingHorizontal:10,
                            borderColor:warna.e3e3e3,
                            borderWidth:1,
                            borderRadius:1,
                        }}
                        placeholder="Masukkan Password Anda Untuk Menyelesaikan Aksi"
                        />
                    <TouchableOpacity 
                        
                        onPress={
                            ()=>{
                                const { id,remember_token } = this.props;
                                const { completeUrl } = getRouterURLArray("members","check_pass");
                                const header  = httpHeader(device,remember_token);
                                sendHTTPPOST(
                                    completeUrl,
                                    {id:id,password:this.state.textPassword},
                                    header,
                                    (response)=>{
                                        const { isPassValidate } = response.data.result;
                                        if(isPassValidate){
                                            callback();
                                        }else{
                                            alert("Password tidak Valid");
                                        }
                                    })
                            }
                        } style={[styles.flexRow,thisStyle.buttons]}>
                        <Ant
                            name="lock"
                            color={warna.alizarin}
                            />
                        <Text style={[thisStyle.buttonTextStyle,{marginLeft:5}]}>
                            CEK PASSWORD
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            );
            this.setState({contentChangeData:content});
        },
        setItem:(options={label:'noLabel',icon:<Feather name="user"/>},callbackButtonClick,isSecure?:boolean)=>{
             const contentText = ()=>{
                 if(isSecure==undefined){
                     return( <TextInput
                      style={{ paddingVertical:15,
                          paddingHorizontal:10,
                          borderColor:warna.e3e3e3,
                          borderWidth:1,
                          borderRadius:1,}}
                      onChangeText={(text)=>{
                          this.setState({textEdit:text})
                      }}
                      placeholder={options.label}
                      />);
                     
                 }else{
                    return( <TextInput
                        style={{ paddingVertical:15,
                            paddingHorizontal:10,
                            borderColor:warna.e3e3e3,
                            borderWidth:1,
                            borderRadius:1,}}
                        onChangeText={(text)=>{
                            this.setState({textEdit:text})
                        }}
                        secureTextEntry={true}
                        placeholder={options.label}
                        />);                     
                 }
             }
            const content = (
             <View style={[styles.smallContainer,styles.flexRow,{padding:15}]}>
                 <View style={{flex:1}}>
                    <Text style={{fontWeight:'200'}}>{options.label}</Text>
                    
                    {contentText()}
                    <TouchableOpacity
                        style={[thisStyle.buttons,styles.flexRow]}
                        onPress={()=>{
                            this.handler.validatePass(
                                ()=>{
                                    callbackButtonClick()
                                }
                            
                        );}}
                        
                        >
                            {options.icon}
                            <Text style={[thisStyle.buttonTextStyle,{marginLeft:5}]}>
                                UBAH DATA
                            </Text>
                    </TouchableOpacity>
                 </View>
                
             </View>);
            this.setState({contentChangeData:content,isChangeData:true})
        }
    }
    componentDidMount(){
        this.setState({isChangeData:false})
    }
    render() {
        const {id,name,photo,email} = this.props
        const {isChangeData} = this.state
        return (
            <SafeAreaView style={[styles.appContainer,styles.bgNav]}>
                <StatusBar
                    barStyle="dark-content"/>
                <View style={[styles.navContainer,styles.flexRow,styles.lineSepa,{paddingHorizontal:15,alignItems:'center'}]}>
                    <View style={{flex:1}}>
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
                    <View style={{flex:1,alignItems:'center',alignContent:'center'}}>
                        <Text style={styles.navTextStyle}>Profil</Text>
                    </View>
                    <View style={{flex:1,alignItems:'flex-end'}}>
                        {this.state.isChangeData?(
                            <TouchableOpacity 
                                onPress={()=>{
                                    this.setState({contentChangeData:<View/>,isChangeData:false})
                                }}
                                style={{padding:5}}>
                                <Ant
                                    name="closecircleo"
                                    size={18}
                                    color={warna.alizarin}
                                    />
                            </TouchableOpacity>
                        ):null}
                    </View>
                </View>
                {!isChangeData ? (
                     <View style={styles.contentContainer}>
                     <TouchableOpacity 
                        onPress={()=>{
                            
                            this.handler.setItem({
                                label:'Masukkan Nama',
                                icon:<Feather name="user" color={warna.alizarin}/>},
                                ()=>{
                                    this.handler.postName();
                                })
                            
                        }}
                        style={[styles.flexRow,thisStyle.items,thisStyle.centeringRow ]}>
                         <Feather
                             name="user"
                             />
                         <View style={[styles.flexRow,thisStyle.spacingBeetwenContent,{flex:1,marginHorizontal:10}]}>
                             <Text style={{fontWeight:'300'}}>{ name }</Text>
                             <Text style={{fontWeight:'200',color:warna.draculaOrchid}}>Tap untuk ubah Nama</Text>
                         </View>
                     </TouchableOpacity>
 
                     <TouchableOpacity 
                        onPress={()=>{
                            this.handler.setItem({
                                label:'Masukkan Email',
                                icon:<Feather name="mail" color={warna.alizarin}/>},
                                ()=>{
                                    this.handler.postEmail();
                                })
                            
                        }}
                        style={[styles.flexRow,thisStyle.items,thisStyle.centeringRow ]}>
                         <Feather
                             name="mail"
                             />
                         <View style={[styles.flexRow,thisStyle.spacingBeetwenContent,{flex:1,marginHorizontal:10}]}>
                             <Text style={{fontWeight:'300'}}>{ email }</Text>
                             <Text style={{fontWeight:'200',color:warna.draculaOrchid}}>Tap untuk ubah Email</Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity 
                        onPress={()=>{
                            this.handler.setItem({
                                label:'Masukkan Password Baru',
                                icon:<Ant name="lock" color={warna.alizarin}/>},
                                ()=>{
                                    this.handler.postPassword();
                                },true)
                        }}
                        style={[styles.flexRow,thisStyle.items,thisStyle.centeringRow ]}>
                         <Ant
                             name="lock"
                             />
                         <View style={[styles.flexRow,thisStyle.spacingBeetwenContent,{flex:1,marginHorizontal:10}]}>
                             <Text style={{fontWeight:'300'}}>******</Text>
                             <Text style={{fontWeight:'200',color:warna.draculaOrchid}}>Tap untuk ubah Password</Text>
                         </View>
                     </TouchableOpacity>
                     <TouchableOpacity 
                        onPress={()=>{
                            this.handler.logout()
                        }}
                        style={[styles.flexRow,thisStyle.items,thisStyle.centeringRow ]}>
                         <MatCommunity
                             name="account-switch"
                             />
                         <View style={[styles.flexRow,thisStyle.spacingBeetwenContent,{flex:1,marginHorizontal:10}]}>
                             <Text style={{fontWeight:'300'}}>Ganti Akun</Text>
                             <Text style={{fontWeight:'200',color:warna.draculaOrchid}}>Log out dan Ganti Akun</Text>
                         </View>
                     </TouchableOpacity>
                 </View>
             
                    ):(<View style={styles.contentContainer}>
                        {this.state.contentChangeData}
                    </View>)}
                
            </SafeAreaView>
        )
    }
}
function mapStateToProps(state: MemberDataRedux = { id: 0, name: '', dev_id: device, email: '', remember_token: '' }) {
    return state;
}

function mapDispatchStateToProps(dispatch) {
    return {
        setMemberProps: (type:TypeUpdate,s) => dispatch({ type: type.typeName, state: s }),

    }
}
export default connect(mapStateToProps, mapDispatchStateToProps)(UbahDataProfile)

