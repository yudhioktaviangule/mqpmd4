import React, { Component } from 'react'
import { Text, View,Image } from 'react-native'
import { warna } from '../../../constants';
import { formatCurrency } from '../../../functions/pipes';

export default class NewProductLayout extends Component<{
    name:string,
    price:number,
    photo:string,
    cities:string,
}> {
    render() {
        const pelops = this.props;
        var images = {
            uri:pelops.photo,
        }
        
        return (
            <View style={{ marginHorizontal:5,width: 240, height: 240,borderColor:'#dddd',borderWidth:0.5,backgroundColor:'white' }}>
                <View style={{ flex: 2 }}>
                    <Image 
                        style={{ width: null, height: null, flex: 1, resizeMode: 'cover' }} 
                        source={images} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 10 }}>{pelops.name}</Text>
                    <Text style={{ marginLeft: 10 }}>{formatCurrency(pelops.price)}</Text>
                    <Text style={{ marginLeft: 10,fontSize:10,color:warna.alizarin }}>{pelops.cities}</Text>
                </View>
            </View>


        )
    }
}
