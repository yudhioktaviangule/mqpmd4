//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { httpHeader } from '../../../../service-function/httpHeader';
import { device } from '../../../../constants';
import { sendFreelyHttpGET } from '../../../../service-function/httpService';
import { getRouterURLArray } from '../../../../constants/ConstantURLs';
import { TouchableOpacity } from 'react-native-gesture-handler';


class ListKotaCheckout extends Component<any> {
    state = {
        listKota: []
    }
    headers;

    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.headers = httpHeader(device, this.props.auth);
        let url = getRouterURLArray('members', 'get_kota').completeUrl;
        sendFreelyHttpGET(url, (response) => {
            this.setState({ listKota: response.data.result });
        }, (error) => { console.log('err', error) })
    }

    render() {
        return (
            <FlatList
                data={this.state.listKota}
                renderItem={(item) => { return this.renderKota(item.item) }}
                keyExtractor={(v, k) => {
                    return k.toString()
                }}
            />
        );
    }
    renderKota(item) {
        return (
            <TouchableOpacity 
                onPress={()=>{this.props.aksi(item.city_id,item.city_name)}}
                style={{ width: '100%', marginHorizontal: 10 }}>
                <View style={{ marginVertical: 10, borderBottomWidth: 1 }}>
                    <Text style={{
                        marginVertical: 5,
                        fontWeight: '600'
                    }}>
                        {item.city_name}
                    </Text>
                    <Text style={{
                        marginVertical: 5,
                        fontWeight: '300'
                    }}>
                        {item.province}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}


//make this component available to the app
export default ListKotaCheckout;
