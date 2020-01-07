import React, { Component } from 'react'
import { Text, View, Image,TouchableOpacity } from 'react-native'
import { warna } from '../../../constants'
import { connect } from 'react-redux';
import { MemberDataRedux } from '../../../../RouterApp';
import { device } from '../../../constants/device';
import { formatCurrency } from '../../../functions/pipes';
import { getURLGambar } from '../../../constants/ConstantURLs';



export default class ThumbnailProduct extends React.Component<any> {

    
    render() {
        const myProp  = this.props
        const foto    = getURLGambar(myProp.product.photo.foto); 
        return (
            <TouchableOpacity style={{
                height: 240,
                width: '50%',
                backgroundColor:warna.whiteLynx,
                borderColor:warna.e3e3e3,
                borderWidth:0.5,
                marginVertical:1,
                marginHorizontal:1

                }} 
                onPress={()=>{
                    this.props.clickEvent();
                }}
            >
                <View style={{
                    flex: 2
                }}>
                    <Image
                        source={{ uri: `${foto}` }}
                        style={{ width: null, height: null, flex: 1, resizeMode: 'cover' }}
                    />
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{justifyContent: 'center',marginHorizontal:10,position:'relative',marginBottom:5,flex:1}}>
                        <Text style={{fontSize:16,color:warna.electro}}>{myProp.product.name}</Text>
                        <Text style={{fontSize:18,color:warna.alizarin}}>IDR. {formatCurrency(myProp.product.price)}</Text>
                        <Text style={{fontSize:10,color:warna.peterRiver,top:null,bottom:3,position:'absolute'}}>{`${myProp.product.city.type} ${myProp.product.city.city_name}, ${myProp.product.city.province}`}</Text>
                    </View>
                </View>
            
            </TouchableOpacity>
        )
    }
}

