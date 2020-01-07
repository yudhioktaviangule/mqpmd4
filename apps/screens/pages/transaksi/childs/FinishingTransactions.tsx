import React, { Component } from 'react'
import { Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { home } from '../../Stylish'
import { warna, device } from '../../../../constants';
import { MemberDataRedux } from '../../../../../reducer';
import { connect } from 'react-redux';


const styles = home;
class FinishingTransactions extends Component<any> {
    render() {
        return (
            <SafeAreaView style={[home.appContainer,home.bgNav,{justifyContent:'center',alignItems:'center'}]}>
                <Text style={{fontSize:24,color:warna.whiteAlizarin,alignContent:'center'}}>
                    Terima Kasih sudah berbelanja                    
                </Text>
                <TouchableOpacity
                    style={{
                        paddingHorizontal:30,
                        backgroundColor:warna.whitePolos,
                        borderRadius:5,
                        borderColor:warna.alizarin,
                        borderWidth:0.7,
                        alignContent:'center',
                        paddingVertical:15,
                        marginVertical:20
                    }}
                    onPress={()=>{
                        const { navigation } = this.props;
                        navigation.navigate("TransaksiDepan");
                    }}
                    >
                        <Text style={{color:warna.alizarin}}>
                            Kembali
                        </Text>
                </TouchableOpacity>
            </SafeAreaView>
        )
    }
}

function mapStateToProps(state: MemberDataRedux = { id: 0, name: '', dev_id: device, email: '', remember_token: '' }) {
    return state;
}

function mapDispatchStateToProps(dispatch) {
    return {
        setMemberProps: (s) => dispatch({ type: 'SAVE_MEMBER', state: s }),

    }
}
export default connect(mapStateToProps, mapDispatchStateToProps)(FinishingTransactions)