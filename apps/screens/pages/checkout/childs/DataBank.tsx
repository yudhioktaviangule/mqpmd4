import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { MemberDataRedux } from '../../../../../RouterApp';
import { device } from '../../../../constants';

import { connect } from 'react-redux';

 class DataBank extends Component {
    render() {
        return (
            <View>
                <Text> textInComponent </Text>
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
export default connect(mapStateToProps, mapDispatchStateToProps)(DataBank)