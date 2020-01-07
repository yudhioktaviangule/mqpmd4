import React from 'react'
import { Text, View, TouchableOpacity } from 'react-native'
import { MemberDataRedux } from '../../../../../RouterApp';
import { device } from '../../../../constants';
import { connect } from 'react-redux';
import { Feather } from '../../../../constants/Feather';
import { DEVICE_DIMENSION } from '../../../../constants/device';

const DIMENSI = DEVICE_DIMENSION;
class PilihBank extends React.Component<any> {
    state={
        isLoadingBank:false
    }
    render() {
        return (
          
            <View style={{
                marginHorizontal:10,
                flexDirection:'row',
            }}>
                <View style={{width:10,justifyContent:'center',alignItems:'center'}}>
                    <Feather
                        size={10}
                        name="credit-card"  
                        />
                </View>
                <View style={{
                    flex:1,
                    marginLeft:10,
                    flexDirection:'row'
                    }}>
                    <View style={
                        {
                            flex:1,
                            justifyContent:'center'
                        }
                    }>
                        <Text style={{fontWeight:'600'}}>Cara Pembayaran</Text>
                    </View>
                    <View style={{flex:1}}>
                        <TouchableOpacity style={{flex:1}}
                            onPress={()=>{}}
                        >
                            <View style={{
                                flex:1,
                                flexDirection:'row',
                                justifyContent:'flex-end'
                            }}>
                                <Text style={{fontWeight:'200',marginHorizontal:10}}>Pilih Cara Pembayaran</Text>
                                <Feather
                                    name="chevron-right"
                                    size={14}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
          
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
export default connect(mapStateToProps, mapDispatchStateToProps)(PilihBank)
