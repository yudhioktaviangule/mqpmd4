import React, { PureComponent } from 'react'
import { Text, View, Image, TouchableOpacity } from 'react-native'
import { getURLGambar } from '../../../../../constants/ConstantURLs';
import { warna } from '../../../../../constants';
import { formatCurrency } from '../../../../../functions/pipes';

export default class PureCompProduct extends PureComponent<any> {
    state = {
        __w:0,
        __h:0,
    }
    render() {
        let { item } = this.props
       // console.log('item',item);
        
       
        if(item.havePic){
            let prd = item;
            let foto = {
                uri: getURLGambar(prd.photo.foto)
            }
            return (
    
            <TouchableOpacity
                style={{flex:1,margin:3,backgroundColor:'white',borderWidth:0.7,borderColor:warna.e3e3e3}}
                onPress={()=>{
                    this.props.toProduct(prd.id)
                }}
                onLayout={(event) => {
                    var {height,width} = event.nativeEvent.layout;
                   
                  }}
                >
                <View
                     onLayout={(event) => {
                        var {width} = event.nativeEvent.layout;
                        this.setState({__w:width});
                      }}
                    style={{width:'100%',height:this.state.__w,backgroundColor:'grey'}}>
                    <Image
                        source={foto}
                        style={{width:null,height:null,flex:1}}
                        resizeMode="cover"
                        />
    
                </View>
                <View style={{padding:10,}}>
                    <Text style={{fontWeight:'500',fontSize:20,color:warna.draculaOrchid}}>{prd.name}</Text>
                    <Text style={{fontWeight:'300',fontSize:14,color:warna.alizarin}}>IDR. {formatCurrency(prd.price)}</Text>
                </View>
                
            </TouchableOpacity>          
            )
        }else{
            return (
                <View style={{flex:1,margin:3}}></View>
            )
        }
    }
}
