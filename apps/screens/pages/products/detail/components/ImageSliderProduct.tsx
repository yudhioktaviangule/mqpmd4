//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Animated } from 'react-native';
import { DEVICE_DIMENSION } from '../../../../../constants/device';
import { warna } from '../../../../../constants';
import { getURLGambar } from '../../../../../constants/ConstantURLs';

const DEVICE_DIM = DEVICE_DIMENSION

class ImageSlideProduct extends React.Component<any> {
    state = {
        selectedIndex: 0,
        pics: [],
        
    }
    constructor(props) {
        super(props)
    };
    componentDidMount() {
        let photos = [];

        this.props.photos.map((v) => {
            let urlFoto = getURLGambar(v.path);
            photos.push({ uri: urlFoto })
        });
        this.setState({ pics: photos })

    }
    render() {
        return (
            <Animated.View style={{
                width:DEVICE_DIM.width,
                height:this.props.anihead,
                
                }}>
                <View style={{ width: '100%', height: '100%' }}>
                    <ScrollView horizontal pagingEnabled>
                        {this.state.pics.map((value,kunci)=>{
                            return (<Image source={value} key={kunci} style={styles.imageContent}/>)
                        })}
                    </ScrollView>

                </View>
            </Animated.View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        width: DEVICE_DIM.width,
        height: DEVICE_DIM.width,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: warna.whiteLynx,
        flexDirection: 'row'
    },
    imageContent: {
        width: DEVICE_DIM.width,
        height: DEVICE_DIM.width,
        resizeMode: 'cover',
        
    }
});

//make this component available to the app
export default ImageSlideProduct;
