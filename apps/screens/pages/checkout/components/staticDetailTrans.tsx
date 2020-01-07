import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { Image } from 'react-native-elements'
import { home } from '../../Stylish'
import { getURLGambar } from '../../../../constants/ConstantURLs'
import { formatCurrency } from '../../../../functions/pipes'


const style=home


const DetailTransaksiCards = (props)=>{
    const { toRender } = props
    const { harga,products } = toRender
    const { photo,name,price } = products
    let { foto } = photo
    foto = getURLGambar(foto);
    return(
        <View style={[home.flexRowCenter,{flex:1}]}>
            <Image
                source={{uri:foto}}
                style={{width:32,height:32,marginRight:10}}
                />
            <View style={[style.flexRow,{flex:1,justifyContent:'space-between'}]}>
                <Text style={style.thinText}>{ name }</Text>
                <Text style={style.thinText}>{ formatCurrency(price) }</Text>

            </View>
        </View>
    )
}

const DetailPembayaranCards = (props)=>{
    const { toRender } = props
    console.log(toRender)
    const {caption,price} = toRender;
    return(
        <View style={[home.flexRowCenter,{paddingVertical:3,flex:1,justifyContent:'space-between'}]}>
                <Text style={style.thinText}>{ caption }</Text>
                <Text style={style.thinText}>{ formatCurrency(price) }</Text>
        </View>
    )
}


export {DetailTransaksiCards,DetailPembayaranCards};