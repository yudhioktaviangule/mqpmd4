import { DEVICE_DIMENSION } from "../../constants/device";

import { warna } from "../../constants";
import { StyleSheet } from "react-native";
export {StyleSheet}; 
export const DIMENSI_WIDTH = DEVICE_DIMENSION.width;
export const DIMENSI_HEIGHT = DEVICE_DIMENSION.height;
export const NAV_HEIGHT = DIMENSI_HEIGHT * 0.15;
export const NAV_HALF_HEIGHT = NAV_HEIGHT / 2;
export const home = StyleSheet.create({
    
    line:{
        height:1,
        marginVertical:5,
        borderColor:warna.e3e3e3,
        borderWidth:0.7
    },
    fluid:{
        paddingHorizontal:10,
    },
    fluidMore:{
        paddingHorizontal:15,
    },
    inputBoxStyle:{
        paddingHorizontal:10,
        height:30,

    },
    textRed:{
        color:warna.alizarin
    },
    smalldivider: {
        backgroundColor: warna.clouds,
        height: 24,
    },
    tinydivider: {
        backgroundColor: warna.clouds,
        height: 8,
    },

    lineSepa: {
        borderBottomColor: warna.e3e3e3,
        borderBottomWidth: 0.7,

    },
    appContainer: {
        flex: 1
    },
    contentContainer: {
        flex: 1,
        width: DIMENSI_WIDTH
    },

    smallContainer: {
        paddingVertical: 20,
    },

    navContainer: {
        minHeight: NAV_HEIGHT / 2,
        paddingHorizontal:10
    },
    bgNav: {
        backgroundColor: warna.whitePolos,
    },
    bgNavRed: {
        backgroundColor: warna.alizarin,
    },
    bgTurq: {
        backgroundColor: warna.turquise,
    },
    bgContent: {
        backgroundColor: warna.whiteLynx
    },
    nav: {
        alignContent: 'center',
        alignItems: 'center'
    },
    
    flexRow: {
        flexDirection: 'row'
    },

    flexRowCenter: {
        flexDirection: 'row',
        alignItems:'center',
    },
    titleContents: {
        flex: 1,
        paddingVertical: 10,
        justifyContent: "center",
        alignItems: 'center'
    },
    titleTextStyle: {

        fontWeight: '600',
        textTransform: 'capitalize',
    },
    navTextStyle: {
        fontSize: 18,
        fontWeight: '500',
        textTransform: 'capitalize',
    },
    softTopBorder: {
        borderTopColor: warna.e3e3e3,
        borderTopWidth: 0.7,
    },
    padding: {
        padding: 10,
    }, flex2: {
        flex: 2
    },
    thinText: {
        fontWeight: '200'
    },
    boldText: {
        fontWeight: '500'
    },
    textWhite: {
        color: warna.whitePolos,
    },


})