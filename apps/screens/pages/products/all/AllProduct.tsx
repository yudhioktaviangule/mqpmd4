import React from 'react'
import { View, StyleSheet, SafeAreaView, FlatList, Text, ActivityIndicator, StatusBar } from 'react-native'
import { MemberDataRedux } from '../../../../../RouterApp';
import { device, DEVICE_DIMENSION } from '../../../../constants/device';
import { connect } from 'react-redux';

import { warna } from '../../../../constants';

import { httpHeader } from '../../../../service-function';

import { getURLGambar, getRouterURLArray } from '../../../../constants/ConstantURLs';


import { Avatar } from 'react-native-elements';
import { sendHttpGET } from '../../../../service-function/httpService';
import PureCompProduct from './component/PureCompProduct';
import NavRouteBackFunction from '../../../../service-function/NavRouteBackFunction';
import { WhiteLoading } from '../../componentsData/LoadingComponent';


const DIMENSI_WIDTH = DEVICE_DIMENSION.width;
const DIMENSI_HEIGHT = DEVICE_DIMENSION.height;
const NAV_HEIGHT = DIMENSI_HEIGHT * 0.15;
const NAV_HALF_HEIGHT = NAV_HEIGHT / 2;
const ICON_TOP = NAV_HEIGHT - NAV_HALF_HEIGHT;


interface HttpNeedHeader {
    dev_id: string,
    remember_token: string
}
const searchTerm = (items)=>{
   let xdata = items.filter(xItem=>{
        if(xItem.havePic){
            return xItem;
        }
    })
    return xdata;
};
const numcols = 2;
const getBlankSpot=(item)=>{
    let items = [];
    
    item.map(d=>{
        items.push({...d,havePic:true})
    })
    const length = item.length;
    const floorRow = numcols%length==0;
    if(!floorRow) items.push({id:0,name:'blank',havePic:false})
    return items;
}
class AllProduct extends React.Component<any> {
    lastURL = "";
    state = {
        auth: {
            "Content-Type": "application/json",
            device_id: device,
            authCode: "",
        },
        products: [],
        title: "",
        offset: 0,
        isCanLoadMore: true,
        isLoading: false,
        isLoadingMore: false,
        urls: '',
        kategori: {
            kategori: 'Products',
            icon: 'kat/default.png',
            id: 0
        },
        maxlen:0,
        
    }

    handlers = {
        createHeader: () => {
            let id = device;
            let auth = this.props.remember_token
            this.setState({
                auth: {
                    authCode: httpHeader(id, auth).authCode
                }
            }, () => this.setState({ isLoading: true },this.handlers.compose))
        },
        componentHasMounted: () => {
            this.handlers.createHeader();
            
        },
        compose:()=>{
            if(this.state.isCanLoadMore){
                let header = this.state.auth;
                let url = getRouterURLArray("products","product_by_categories").completeUrl;
                url = `${url}${this.state.kategori.id}/${this.state.offset}`
                console.log("len",this.state.products.length);
                if(url!=this.lastURL){
                    this.lastURL = url
                    sendHttpGET(url,header,(resp)=>{
                        let { offset,products } = this.state;
                        let productsarr = [];
                        let { result }  = resp.data;
                        let { product } = result;
                        let { maxlen }  = result;
                        let newOffset = result.offset; 
        
                        if(offset < 1){
                            productsarr = product;
                        }else{
                            productsarr = products.concat(product)
                        }
                        this.setState({isLoadingMore:false,offset:newOffset, maxlen:maxlen,isCanLoadMore:maxlen>newOffset,products:productsarr,isLoading:false})
                    })
                }
            }
        },
        loadMoreProduct:()=>{
            if(this.state.offset < this.state.maxlen && !this.state.isLoadingMore){
                this.setState({isLoadingMore:true},this.handlers.compose)
            }
        },
        initialize:()=>{
            this.setState({ isCanLoadMore:true,isLoading: true, kategori: this.props.navigation.getParam("categories") }, this.handlers.componentHasMounted);
        }
    }
    componentDidMount() {
        const {navigation} = this.props
        const thisRoute = navigation.state.routeName;
        navigation.addListener("willFocus",payload=>{
            if( payload.state.routeName == thisRoute){
                this.handlers.initialize();
            }
        })        
    }
    render() {

        return (
            <View style={[styles.appContainer, styles.bgNav]}>
                {this.state.isLoading ? (
                    <WhiteLoading/>
                ):(
                    <SafeAreaView style={[styles.appContainer]}>
                        <StatusBar
                            barStyle="light-content"/>
                    <View style={[styles.navContainer, styles.smallContainer, styles.bgNav, styles.nav]}>
                        <Avatar
                            rounded
                            source={{ uri: getURLGambar(this.state.kategori.icon) }}
                            size={"large"}
                            containerStyle={{
                                position: 'absolute',
                                borderColor: 'white',
                                borderWidth: 1,
                                zIndex: 999,
                                bottom: ICON_TOP / 3
                            }}
                        />
                        <View style={{
                            width: DIMENSI_WIDTH,
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            height: ICON_TOP,
                            backgroundColor: 'white'
                        }}>

                        </View>
                    </View>
                    <View style={[styles.bgContent, styles.contentContainer]}>
                        {(this.state.isLoading ?
                            null :
                            <View style={{flex:1,flexDirection:'row',padding:3}}>
                                <FlatList
                                    data = {getBlankSpot(this.state.products)}
                                    renderItem={(item)=>{
                                       // console.log(item.item,"items");
                                        return(<PureCompProduct
                                                    item={item.item}
                                                    toProduct={(id)=>{
                                                        const params = NavRouteBackFunction("AllProduct", {
                                                            categories: this.state.kategori,
                                                            product_id: id
                                                        })
                                                        const {navigation} = this.props
                                                        navigation.navigate("DetailProduct",params);
                                                        
                                                    }}
                                                    
                                                    />)
                                    }}
                                    keyExtractor={(V,I)=>{
                                        return `${V.id}I${I}`;
                                    }}
                                    numColumns={numcols}
                                    onEndReached={this.handlers.loadMoreProduct}
                                    
                                    onEndReachedThreshold={0}
                                    ListFooterComponent={()=>{
                                        if(this.state.isLoadingMore){
                                            return (<View style={{paddingVertical:20}}>
                                                <ActivityIndicator/>
                                            </View>)
                                        }else{
                                            return (<View style={{height:60}}></View>)
                                        }
                                    }}
                                    />
                            </View>
                        )}
                    </View>
                </SafeAreaView>
                    
                )}

            </View>
        )
    }
}
const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        backgroundColor:warna.alizarin

    },
    rows: {
        flexDirection: 'row',
    },
    contentContainer: {
        flex: 1,
        backgroundColor:'white'
    },

    smallContainer: {
        paddingVertical: 30,
    },

    navContainer: {

        minHeight: NAV_HEIGHT
    },
    bgNav: {
        backgroundColor: warna.alizarin,
    },
    bgContent: {
        backgroundColor: 'white'
    },
    nav: {
        alignContent: 'center',
        alignItems: 'center'
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
export default connect(mapStateToProps, mapDispatchStateToProps)(AllProduct)