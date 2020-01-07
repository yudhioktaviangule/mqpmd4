import React from 'react'
import { SafeAreaView, View, TextInput, StatusBar, TouchableOpacity, ScrollView, Text } from 'react-native'

import { globalStyles, navbar } from '../globalContainerStyles';

import { warna, device } from '../../../constants';
import Icon from 'react-native-vector-icons/Feather';
import CategoryContainer from './CategoryContainer';
import { getRouterURLArray, getURLGambar } from '../../../constants/ConstantURLs';
import { sendHttpGET } from '../../../service-function/httpService';
import { httpHeader } from '../../../service-function';
import { ProductOnePhoto, Kategori } from './interfaces';
import NewProductLayout from './NewProductLayout';
import { connect } from 'react-redux';
import { MemberDataRedux } from '../../../../RouterApp';
import NavRouteBackFunction from '../../../service-function/NavRouteBackFunction';

interface HttpNeedHeader {
    dev_id: string,
    remember_token: string
}
class Home extends React.Component<any> {
    konten: any
    state = {
        hasLoadedCategory: false,
        categories: (<Text></Text>),
        newProducts: (<Text></Text>),
    }
    kntn: any;

    getCategories(headers) {
        //console.log("Home render line 40",prop.dev_id);
        let url = getRouterURLArray("categories", "category")
        sendHttpGET(url.completeUrl, headers, (response) => {
            let data: Kategori[] = response.data.result;

            this.kntn = data.map(item => {
                let uriGambar = getURLGambar(item.icon);
                this.setState({ hasLoadedCategory: true })
                return (
                    <TouchableOpacity onPress={() => {
                        this.navigateToListProductPages(item)
                    }} key={`kat${item.id}`} style={{ marginHorizontal: 5 }}>
                        <CategoryContainer key={item.id} nama={item.kategori} icon={uriGambar} />
                    </TouchableOpacity>

                )
            });

            this.setState({ categories: this.kntn });
        })

    }
    navigateToListProductPages(item: Kategori) {
        let param = NavRouteBackFunction("Home", { categories: item });
        this.props.navigation.navigate('AllProduct', param);
    }

    getProducts(headers) {
        let url = getRouterURLArray("products", "getfiveproducts").completeUrl;
        sendHttpGET(url, headers, (response) => {
            let data: ProductOnePhoto[] = response.data.result;
            this.kntn = data.map(e => {
                let photos = getURLGambar(e.photo.foto);
                return (
                    <TouchableOpacity key={`product.${e.id}`} onPress={()=>{
                        this.navigateDetailProduct(e.id);
                    }}>
                        <NewProductLayout
                            
                            cities={e.city.city_name}
                            name={e.name}
                            photo={photos}
                            price={e.price} />
                    </TouchableOpacity>
                )
            })
            this.setState({ newProducts: this.kntn });
        })
    }
    navigateDetailProduct(id: string) {
        let param = NavRouteBackFunction("Home",{
            product_id:id
        })
   //     console.log('id',param);
        this.props.navigation.navigate('DetailProduct', param);
    }

    componentDidMount() {
        const navigation = this.props.navigation;
        const thisRoute = navigation.state.routeName;
        navigation.addListener('willFocus',payload=>{
            if( payload.state.routeName == thisRoute){
                const xheader: HttpNeedHeader = {
                    dev_id: this.props.dev_id,
                    remember_token: this.props.remember_token
                };
                let headers = httpHeader(xheader.dev_id, xheader.remember_token);
        
                this.getCategories(headers);
                this.getProducts(headers);

            }
        })
    }

    shouldComponentUpdate(nextProp, nextState) {
        if (this.state.hasLoadedCategory) {
            return true;
        }
        return false;
    }
    render() {
        const { navigation } = this.props;
        return (
            <View style={globalStyles.container}>
                <StatusBar
                    barStyle="light-content"
                />
                <SafeAreaView style={navbar.black}>
                    <View style={{
                        marginHorizontal: 20,
                        flex: 1,
                        marginVertical: 20,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <View
                            style={
                                {
                                    borderRadius: 2, backgroundColor: 'white', flexDirection: 'row', flex: 2, marginHorizontal: 10
                                }
                            }
                        >
                            <Icon name="search" style={{ padding: 10 }} size={12} />
                            <TextInput
                                style={
                                    {
                                        padding: 10,
                                        flexGrow: 1,
                                        fontSize: 12
                                    }
                                }
                                placeholder="search"
                            />
                        </View>

                    </View>
                </SafeAreaView>
                <SafeAreaView>

                    <ScrollView scrollEventThrottle={16}>
                        <View style={{
                            paddingTop: 5,
                            paddingLeft: 5,
                            paddingRight: 5,
                            paddingBottom: 20,
                            flex: 1,
                            marginTop: 10,
                            marginBottom: 10,
                            marginHorizontal: 10
                        }}>
                            <View style={{ margin: 10 }}>
                                <Text style={{ fontSize: 18, marginVertical: 5 }}>Kategori Produk</Text>
                            </View>
                            <ScrollView style={{ marginHorizontal: 10 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                {this.state.categories}
                            </ScrollView>
                        </View>


                        <View style={{
                            backgroundColor: 'white',
                            padding: 10,
                            flex: 1,
                            marginVertical: 10,
                            marginHorizontal: 10
                        }}>
                            <View style={{ margin: 10 }}>
                                <Text style={{ fontSize: 18, marginVertical: 5 }}>Produk Terbaru</Text>
                            </View>
                            <ScrollView style={{ marginHorizontal: 10 }}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                {this.state.newProducts}

                            </ScrollView>
                        </View>


                    </ScrollView>

                </SafeAreaView>

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
        resetTransaksi: () => dispatch({ type: 'REFRESH_TRANSAKSI', state: {} }),

    }
}
export default connect(mapStateToProps, mapDispatchStateToProps)(Home)

