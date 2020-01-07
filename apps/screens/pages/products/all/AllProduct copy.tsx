import React from 'react'
import { Text,ActivityIndicator, View, StatusBar, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, FlatList } from 'react-native'
import { MemberDataRedux } from '../../../../../RouterApp';
import { device, DEVICE_DIMENSION } from '../../../../constants/device';
import { connect } from 'react-redux';

import { warna } from '../../../../constants';
import { Feather } from '../../../../constants/Feather';
import { httpHeader } from '../../../../service-function';
import ThumbnailProduct from '../ThumbnailProduct';
import { getRouterURLArray } from '../../../../constants/ConstantURLs';
import { sendHttpGET } from '../../../../service-function/httpService';
import NavRouteBackFunction from '../../../../service-function/NavRouteBackFunction';
import { Bubbles } from 'react-native-loader';


interface HttpNeedHeader {
    dev_id: string,
    remember_token: string
}
class AllProduct extends React.Component<any> {
    state = {
        products: [],
        title: "",
        offset: 0,
        isCanLoadMore: true,
        isLoading:false,
        urls:'',
        kategori:{},
    }


    redirectBack() {
        let navback = this.props.navigation.getParam('navBack');
        this.props.navigation.navigate(navback);
    }

    productMapToArrayState = (data,ofset) => {
        this.setState({ products: this.state.products.concat(data) },()=>{
           // console.log(this.state)
                this.setState({ offset: ofset,isLoading:false })
            
        })
    }

    getProducts = (url, headerConfig) => {
        sendHttpGET(url, headerConfig, (res) => {
            let product = res.data.result.product;
            this.productMapToArrayState(res.data.result.product,res.data.result.offset);
            if(product.length==0){
                this.setState({isCanLoadMore:false});
            }
            
        }, (err) => { alert(err) })
    }
    composeHttp = () => {
        if (this.state.isCanLoadMore) {

            const xHeader: HttpNeedHeader = {
                dev_id: device,
                remember_token: this.props.remember_token
            }
            let pr = this.props;
            let kategori = pr.navigation.getParam('categories');
            

            this.setState({ 
                kategori:kategori,
                title: kategori.kategori},()=>{
                
                let header = httpHeader(xHeader.dev_id, xHeader.remember_token)
                let url = getRouterURLArray('products', 'product_by_categories').completeUrl
                
                url = `${url}${kategori.id}/${this.state.offset}`
                if(url!=this.state.urls){
                    this.setState({urls:url},()=>{
                        this.getProducts(url, header)
                    });
                }
            })
        }
    }

    handleMore = () => {
        this.composeHttp();
    };
    renderBottom=()=>{
        return (
            this.state.isLoading ?
            <View style={{marginTop:10,alignItems:'center'}}>
                <ActivityIndicator size="large"/>
            </View>:<View style={{height:(DEVICE_DIMENSION.width/2)}}></View>

        )
    }

    redirectDetailProduct=(id:string)=>{
        const params = NavRouteBackFunction("AllProduct",{
            categories:this.state.kategori,
            product_id:id
        })
        this.props.navigation.navigate("DetailProduct",params);
    }
    componentDidMount() {
        this.setState({isLoading:true},this.composeHttp);
        
    }
    render() {
        const vprost = this.props

        return (
            this.state.isLoading==false ?
            <View>

                <SafeAreaView style={{ height: 80, backgroundColor: warna.whiteLynx, justifyContent: 'center' }}>
                    <StatusBar
                        barStyle="dark-content"
                    />
                    <TouchableOpacity
                        onPress={
                            () => {
                                this.redirectBack();
                            }
                        }
                        style={{
                            paddingHorizontal: 15,
                            flexDirection: 'row'
                        }}
                    >
                        <Feather
                            name="chevron-left"
                            size={24}
                            color={warna.alizarin}
                        />
                        <Text style={{ color: warna.alizarin, fontSize: 24, marginLeft: 5 }}>{this.state.title}</Text>
                    </TouchableOpacity>
                </SafeAreaView>
                <SafeAreaView style={{ marginTop: 10 }}>
                    <FlatList
                        numColumns={2}
                        data={this.state.products}
                        renderItem={({ item }) => {
                            return <ThumbnailProduct
                                clickEvent={()=>{
                                    this.redirectDetailProduct(item.id);
                                }}
                                product={item} />
                        }}
                        keyExtractor={(item, index) => { return index.toString() }}
                        onEndReached={this.handleMore}
                        onEndReachedThreshold={0}
                        ListFooterComponent={this.renderBottom}
                    />
                </SafeAreaView>
            </View>:
            <View style={{flex:1,backgroundColor:warna.draculaOrchid,justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                <Bubbles
                    size={15}
                    color={warna.clouds}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: warna.clouds
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