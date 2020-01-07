import React from 'react'
import { Text, View, TouchableOpacity, FlatList, SafeAreaView, StyleSheet } from 'react-native'
import { MemberDataRedux } from '../../../../../RouterApp';
import { device, warna } from '../../../../constants';
import { connect } from 'react-redux';


import { getRouterURLArray, getURLGambar } from '../../../../constants/ConstantURLs';
import { httpHeader } from '../../../../service-function';
import { sendHttpGET } from '../../../../service-function/httpService';
import { Avatar, Input } from 'react-native-elements';


class PilihBank extends React.Component<any> {
    state = {
        titleType:'Pilih Data Bank',
        atasnama:'',
        rekening:'',
        isBankSelected: false,
        isCanUnload: false,
        handlers: {

            visibilityOff: () => { }
        },
        lists: []
    }

    handlers = {
        getHeaders: () => {
            let dev = device;
            let remember = this.props.remember_token
            return httpHeader(dev, remember)
        },
        getBanks: () => {
            let url = getRouterURLArray("bank", "bank").completeUrl;
            let header = this.handlers.getHeaders();
            sendHttpGET(url, header, (response) => {
                let data = response.data.result;
                this.setState({ lists: data })
            })
        },
        onClickBank: (id,nama) => {
            this.props.bankHandlerSetBank(id,nama, () => {
                this.setState({ isBankSelected: true,titleType:"Nomor Rekening / Atas Nama" })
            });
        },
        renderBank: (item) => {
            let iconbank = getURLGambar(item.iconbank);
            return (<View
                style={{
                    flex: 1,
                    paddingHorizontal: 10,

                    justifyContent: 'flex-start'
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        this.handlers.onClickBank(item.id,item.namabank);
                    }}
                >
                    <View style={{
                        flexDirection: 'row',
                        paddingVertical: 10,
                        alignItems: 'center'
                    }}

                    >

                        <View
                            style={{
                                flex: 1,
                                flexDirection: 'row',
                                alignItems: 'center'
                            }}
                        >
                            <Avatar
                                size="small"
                                source={{ uri: iconbank }}
                            />
                            <View style={{ marginHorizontal: 5 }}>
                                <Text style={{ fontSize: 18, fontWeight: '600' }}>Bank {item.namabank}</Text>
                                <Text style={{ fontSize: 14, fontWeight: '300' }}>{item.atasnama}</Text>

                            </View>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ fontSize: 20, fontWeight: '600' }}> {item.norek}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>)
        },
        renderInputan: () => { 
            return (
                <View>
                    <View style={styles.formGroup}>
                        <Input
                            onChangeText={(text)=>{
                                this.setState({
                                    atasnama:text
                                },()=>{
                                    this.props.bankHandlerSetAN(text)
                                })
                            }}
                            placeholder="Atas Nama Rekening"
                            placeholderTextColor={warna.silver}
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <Input
                            onChangeText={(text)=>{
                                this.setState({rekening:text},()=>{

                                    this.props.bankHandlerSetNorek(text)
                                })
                            }}
                            placeholder="No. Rekening"
                            placeholderTextColor={warna.silver}
                            keyboardType="number-pad"
                        />
                    </View>
                    <View style={styles.formGroup}>
                        <TouchableOpacity
                            onPress={()=>{
                                if(this.state.atasnama===''||this.state.rekening===''){
                                    alert("isi nama dan nomor rekening")
                                }else{
                                    this.props.setVisibility(false)
                                }
                            }}
                        >
                            <View style={{
                                padding:10,
                                backgroundColor:warna.alizarin,
                                alignItems:'center',
                                justifyContent:'center'
                            }}>
                                <Text style={{
                                    color:'white'
                                }}>
                                    KIRIM
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            ) 
        },

    }
    componentDidMount() {
        this.setState({
            handlers: {

                visibilityOff: () => { this.props.setVisibility(false) }
            },
            isCanUnload: true,
        }, () => {
            this.handlers.getBanks()
        })
    }
    render() {
        return (
            <SafeAreaView
                style={{
                    flex: 1,
                    justifyContent: 'center',

                }}>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingHorizontal: 10,
                        borderBottomColor: warna.silver,
                        borderBottomWidth: 0.7,

                    }}>
                    <View style={{ flex: 1, justifyContent: 'center', }}>
                        <Text style={{ fontWeight: '600', fontSize: 24 }}>
                            {this.state.titleType}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        paddingHorizontal: 10,
                        paddingVertical: 10,
                        flex: 1,
                    }}>
                    {!this.state.isBankSelected ?
                        (
                            <FlatList
                                data={this.state.lists}
                                renderItem={(item) => {
                                    return this.handlers.renderBank(item.item)
                                }}
                                keyExtractor={(index) => { return index }}
                                ListFooterComponent={(<View style={{ height: 200 }}></View>)} />

                        ) : this.handlers.renderInputan()
                    }
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    formGroup:{
        paddingVertical:5,
    }
})

function mapStateToProps(state: MemberDataRedux = { id: 0, name: '', dev_id: device, email: '', remember_token: '' }) {
    return state;
}

function mapDispatchStateToProps(dispatch) {
    return {
        setMemberProps: (s) => dispatch({ type: 'SAVE_MEMBER', state: s }),

    }
}
export default connect(mapStateToProps, mapDispatchStateToProps)(PilihBank)
