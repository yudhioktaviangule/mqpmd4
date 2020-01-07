//import liraries
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { warna } from '../../../../../constants';

// create a component
class DetailProductFooter extends React.Component {
    render() {
        return (
            <View style={styles.container}>
                <Text>appRouteList</Text>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: warna.whiteLynx,
    },
});

//make this component available to the app
export default DetailProductFooter;
