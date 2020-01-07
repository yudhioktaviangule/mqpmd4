import React, { Component } from 'react'
import { View,Text, TouchableOpacity } from 'react-native'
import { warna } from '../../../../../constants'
import { Feather } from '../../../../../constants/Feather'
import { createImagePicklet } from '../../../../../service-function/ImagePicklet'
import { Image } from 'react-native-elements';

export class UploadBukti extends Component<any> {
    state={
        image:{
            uri:'',
            imageLoaded:false
        }
    }
    render() {
        return (
            <View style={{flex:1,flexDirection:'row'}}>
                <View style={{flex:1,justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                    <View style={{paddingVertical:10}}>
                        <Text style={{fontWeight:'600'}}>
                            Upload bukti Transfer
                        </Text>
                    </View>
                    <View style={{width:'100%',alignContent:'center'}}>
                        <TouchableOpacity style={{
                            width:128,
                            height:128,
                            borderColor:warna.alizarin,
                            borderStyle:'dashed',
                            borderWidth:0.7,
                            justifyContent:'center',
                            alignSelf:'center',
                            alignItems:'center'
            
                            }}
                            onPress={()=>{
                                createImagePicklet((img:string)=>{
                                    this.setState({image:{imageLoaded:true,uri:`data:image/png;base64,${img}`}},()=>{
                                        this.props.setAvailableSaveButton(true,this.state.image.uri)
                                        
                                    })
                                });
                            }}>
                                <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                                    {
                                        this.state.image.imageLoaded ?
                                        (<View style={{width:128,height:128}}>
                                            <Image
                                                source={{uri:this.state.image.uri}}
                                                style={{width:128,height:128,resizeMode:'cover'}}
                                                />
                                        </View>):(
                                            <View style={{justifyContent:'center',alignItems:'center'}}>
                                                <Feather
                                                    name="camera"
                                                    size={20}
                                                    color={warna.alizarin}
                                                />
                                                <Text style={{color:warna.alizarin,fontWeight:'100',textAlign:'center'}}>BUKTI TRANSFER</Text>
                                            </View>
                                        )
                                    }
                                    
                                </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}

export default UploadBukti
