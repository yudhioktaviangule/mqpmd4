import React, { Component } from 'react'
import { Text, View, StyleSheet } from 'react-native'
import { FlatList } from 'react-native-gesture-handler';
import { getRouterURLArray } from '../constants/ConstantURLs';
import { sendFreelyHttpGET } from '../service-function/httpService';


const appx = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
        
    }
})
export default class TestFlat extends Component {
    state = {
        datas:[],
        offset:0,
        canLoading:true
    }
 
    handlers = {
        compose:()=>{
            if(this.state.canLoading){
                let kat=4;
                let url = getRouterURLArray('products', 'product_by_categories').completeUrl
                url=`${url}${kat}/`+this.state.offset
                //console.log(url);
                sendFreelyHttpGET(url,(resp)=>{
                    let data = resp.data.result;
                    let datax = resp.data.result;
                   // console.log(data);
                    data = this.state.datas.concat(data.product);
                    this.setState({datas:data,offset:this.state.offset+10,canLoading:(datax.maxlen>datax.offset)},()=>{
                        console.log(this.state.canLoading);
                    })
                })
            }
        },
        cmpMount:()=>{
            this.handlers.compose();
        },
        more:()=>{
            this.handlers.compose();
        }
    }
    componentDidMount(){
        this.setState({canLoading:true},this.handlers.cmpMount)
        
    }
    render() {
        return (
            <View style={appx.container}>
                <View style={{
                    height:400,
                }}>
                    <FlatList
                        numColumns={3}
                        data={this.state.datas}
                        renderItem={(item)=>{
                            return (
                                <View style={{paddingVertical:60,flex:1,margin:1}}>
                                    <Text>{item.item.sku}</Text>
                                </View>
                            );
                        }}
                        keyExtractor={(index)=>{return index.toString()}}
                        onEndReached={this.handlers.more}
                        onEndReachedThreshold={5}                        />
                </View>
            </View>
        )
    }
}

