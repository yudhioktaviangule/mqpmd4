import React, { Component } from 'react'
import { Text, View,FlatList } from 'react-native'
import FormatWaktu from '../../../../../service-function/formatWaktu';
interface LogTrans{
    id:number,
    description:string,
    created_at:string,
}
export default class LogTransaksi extends Component<any> {
    state = {
        data:[],
    }
    handler = {
        renderItem:(item)=>{
            return(
                <View style={{flexDirection:'row',flex:1,justifyContent:'space-between'}}>
                    <Text>{item.description}</Text>
                    <Text>{new FormatWaktu().getWaktu(item.created_at)}</Text>
                </View>
            );
        },
        composeData:(response)=>{
            let {logs} = response;
            console.log(logs,"the logs here");
            if(logs!=undefined){
                this.setState({data:logs});
            }
        }
    }
    componentDidMount(){
        this.handler.composeData(this.props.data)
    }
    render() {
        
        return <FlatList
                    data={this.state.data}
                    renderItem={(item)=>{
                        return this.handler.renderItem(item.item)
                    }}
                    keyExtractor={index=>{return index;}}
                    />
    }
}
