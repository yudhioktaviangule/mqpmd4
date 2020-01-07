import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'

export default class CategoryContainer extends Component<any> {
    constructor(props) {
      super(props)
    
      this.state = {
         
      };
    };
    
    render() {
        const  pelops  = this.props;
      //  console.log(pelops);
        const images = {uri:pelops.icon}
        return (
            <View style={{ width: 128, height: 128,borderColor:'#dddd',borderWidth:0.5,backgroundColor:'white' }}>
                <View style={{ flex: 2 }}>
                    <Image style={{ width: null, height: null, flex: 1, resizeMode: 'cover' }} source={images} />
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 10 }}>{pelops.nama}</Text>
                </View>
            </View>


        )
    }
}
