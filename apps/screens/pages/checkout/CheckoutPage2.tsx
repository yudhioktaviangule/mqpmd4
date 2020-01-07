import React from 'react'
import { Text, View, SafeAreaView, StyleSheet, StatusBar, Image, TouchableOpacity, Modal } from 'react-native'
import { MemberDataRedux } from '../../../../RouterApp';
import { device, warna } from '../../../constants';
import { connect } from 'react-redux';
import { httpHeader } from '../../../service-function';
import { getRouterURLArray, getURLGambar } from '../../../constants/ConstantURLs';
import { sendHttpGET, sendHTTPPOST } from '../../../service-function/httpService';
import { DEVICE_DIMENSION } from '../../../constants/device';
import { HeaderMannaQueenInterface } from '../../../service-function/headerInterface';
import { Feather } from '../../../constants/Feather';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { Bubbles } from 'react-native-loader';
import { formatCurrency } from '../../../functions/pipes';
import { Input, Button } from 'react-native-elements';
import ListKotaCheckout from './components/ListKotaCheckout';
import { validateDataState } from '../../../service-function/validasi';
import Dash from "react-native-dash";
import PilihBank from './components/PilihBank';
import { getOngkir } from '../../../service-function/rajaongkir';
import { Transaksi } from '../../../models/Trans';
const DIMENSI = DEVICE_DIMENSION;

class CheckoutPage extends React.Component<any> {
    state = {
        service:"",
        banks: {
            isVisible: false,
            rekening: '0',
            atasnama: '',
            bank: 0,
            namaBank:'Pilih',
        },
        nmkota: 'pilih',
        totalPembayaran: 0,
        kodeUnik: 0,
        kotaView: <View></View>,
        pilihKotaChevron: 'chevron-right',
        ongkir: 0,
        isLoading: false,
        isReadyAlamat: true,
        isCanCheckout: false,
        products: [],
        alamatMembers: [],
        alamatMemberObj: {
            city: {
                city_name: '',
                province: '',
                city_id: '0',
            },
            telepon: '',
            alamat: '',
            id: 0,
        },
        pengiriman: {
            lists: {
                cost:{
                    value:0,
                },
                service:'',
            },
            totalPrice: 0,
        },
        alamat: {
            city_id: 0,
            alamat: '',
            telepon: '',
            member_id: 0
        },
        transaksi: {},
        transUpdate: {
            alamat_pengiriman_id: 0,
            id: 0,
        }
    }
    header: HeaderMannaQueenInterface;
    handerBank = {
        setAtasNama: (text) => {
            let data = this.state.banks;
            this.setState({
                banks: {
                    ...data,
                    atasnama: text
                }
            })
        },
        setNoRek: (text) => {
            let data = this.state.banks;
            this.setState({
                banks: {
                    ...data,
                    rekening: text
                }
            })
        },
        setBank: (text: number,nama:string, callbacks) => {
            let data = this.state.banks;
            this.setState({
                banks: {
                    ...data,
                    bank: text,
                    namaBank:nama
                }
            }, () => { callbacks() })
        },


    };

    setModalBankVisibility(visibility: boolean) {
        let banks = this.state.banks;
        this.setState({
            banks: {
                ...banks,
                isVisible: visibility,
            }
        });
    }

    getHttpHeader() {
        return httpHeader(device, this.props.remember_token)
    }

    getAlamatMember() {
        let member_id = this.props.id;
        let url = getRouterURLArray("members", 'alamat').completeUrl;
        url = `${url}${member_id}`;
        sendHttpGET(url, this.header, (response) => {
            let alamat = response.data.result;
            //console.log(alamat);
            if (alamat.length < 1) {
                this.setState({
                    alamat: {
                        ...this.state.alamat,
                        member_id: this.props.id
                    },
                    isReadyAlamat: false, isLoading: false
                }, () => {
                    let url = getRouterURLArray('transaksi', 'get_trans').completeUrl
                    this.getProducts(url);
                })
            } else {
                this.setState({ alamatMembers: alamat, alamatMemberObj: alamat[0] }, () => {
                    let url = getRouterURLArray('transaksi', 'get_trans').completeUrl
                    this.getProducts(url);
                });

            }
        })
    }
    getProducts(url) {

        let penjualan_id = this.props.navigation.getParam("penjualan_id")
        let urls = `${url}${penjualan_id}`
        sendHttpGET(urls, this.header, (respon) => {
            const response = respon.data.result;

            this.setState({ kodeUnik: response.unik, products: response.detail, isLoading: false, transaksi: response }, () => {
                getOngkir(this.state.products, this.header, {
                    courier: "jne",
                    destination: parseInt(this.state.alamatMemberObj.city.city_id)
                }, (response) => {
                    
                    this.setState({ pengiriman: { lists: response.result } }, () => {
                        let totalPengiriman = this.state.pengiriman.lists.cost.value;
                        let serv = this.state.pengiriman.lists.service;
                       
                        this.setState({ service:serv,ongkir: totalPengiriman }, () => {
                            let kodeunik:number = parseInt(this.state.kodeUnik.toString()); 
                            let tharga:number = (this.getTotalHarga()+this.state.ongkir).valueOf()
                            tharga+=kodeunik;
                           this.setState({ totalPembayaran: tharga })
                        })
                    })
                });
            });

        })
    }
    callbackProduct(response) {
    }

    componentDidMount() {
        this.setState({
            transaksiUpdate: {
                ...this.state.transUpdate,
                id: this.props.penjualan_id
            },
            isLoading: true
        }, () => {
            this.header = this.getHttpHeader();
            this.getAlamatMember();
        })
    }
    render() {
        return (
            !this.state.isLoading ?
                this.renderComponent()
                :
                <View style={styles.darkContainer}>
                    <Bubbles
                        size={10}
                        color={warna.clouds}
                    />
                </View>

        )
    }
    renderComponent() {
        return (
            this.state.isReadyAlamat ?
                <SafeAreaView style={styles.container}>
                    <StatusBar
                        barStyle="dark-content"
                        backgroundColor={warna.whiteLynx}
                    />
                    <View style={styles.nav} >
                        <Text style={{
                            fontSize: 24,
                            color: warna.alizarin,
                        }}>
                            Checkout
                        </Text>
                    </View>

                    <ScrollView style={styles.content}>
                        <View >
                            <View style={styles.containerAlamat}>
                                <View style={{ width: 32, height: 32, justifyContent: 'flex-start', alignContent: 'center', alignItems: 'center' }}>
                                    <Feather
                                        name="map-pin"
                                        size={10}
                                        color={warna.draculaOrchid}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>

                                    <Text style={{
                                        fontWeight: '600',
                                        marginBottom: 5
                                    }}>Alamat Pengiriman</Text>
                                    <Text style={{
                                        fontWeight: '300',
                                    }}>{this.state.alamatMemberObj.alamat}</Text>
                                    <Text style={{
                                        fontWeight: '300',
                                    }}>{this.state.alamatMemberObj.telepon}</Text>
                                    <Text style={{
                                        fontWeight: '300',
                                    }}>{this.state.alamatMemberObj.city.city_name}, {this.state.alamatMemberObj.city.province}</Text>
                                </View>
                            </View>

                            <View style={{backgroundColor: warna.silver}}></View>
                            {/* section daftar product */}
                            <View style={[styles.containerFlatList]}>
                                <FlatList
                                    data={this.state.products}
                                    renderItem={(item) => { return this.getProductsPenjualan(item) }}
                                    keyExtractor={(item, index) => { return index.toString() }}
                                    contentContainerStyle={
                                        styles.daftarproduct
                                    }
                                    />
                            </View>

                            {/* data bank */}
                            <TouchableOpacity style={[pesanan.container,{
                                    borderBottomColor:warna.e3e3e3,
                                    borderBottomWidth:1,
                                    }]}
                                    onPress={() => {
                                        this.setModalBankVisibility(true);
                                    }}>
                                    <Modal
                                        visible={this.state.banks.isVisible}
                                        animationType="slide"
                                        animated
                                        onDismiss={()=>{
                                            console.log("BANKS OK")
                                        }}

                                    >
                                        <PilihBank
                                            setVisibility={(params) => {
                                                this.setModalBankVisibility(params)
                                            }}
                                            bankHandlerSetBank={(id,nama, callbacks) => {
                                                this.handerBank.setBank(parseInt(id),nama, callbacks)
                                            }}
                                            bankHandlerSetNorek={(string) => {
                                                this.handerBank.setNoRek(string)
                                            }}
                                            bankHandlerSetAN={(string) => {
                                                this.handerBank.setAtasNama(string)
                                            }}
                                        />
                                    </Modal>
                                    <View style={{paddingHorizontal: 10}}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',

                                            }}>
                                            <Text style={{
                                                
                                            }}>
                                                Pilih Bank
                                            </Text>
                                            <View style={{
                                                alignItems: 'center',
                                                flexDirection: 'row',
                                                justifyContent:'flex-end'
                                                }}>
                                                <Text>{this.state.banks.namaBank}</Text>
                                                <Feather
                                                    size={18}
                                                    name="chevron-right"
                                                />
                                            </View>
                                        </View>
                                    </View>

                            </TouchableOpacity>    
                            {/* biaya pengiriman */}
                            <View style={styles.biayaPengiriman}>
                                <View style={{marginHorizontal: 10,flexDirection:'row' }}>
                                    <Feather
                                        name="truck"
                                        size={10}
                                        color={warna.greenSea}
                                        />
                                    <View style={{paddingHorizontal:10,flex:1,}}>
                                        <View style={{
                                            paddingBottom:10,
                            
                                        }}>
                                            <Text style={{
                                                fontWeight: '500',
                                                color: warna.greenSea
                                            
                                            }}>Informasi Pengiriman</Text>
                                        </View>
                                        <Dash
                                            dashGap={3}
                                            dashLength={5}
                                            dashThickness={0.7}
                                            dashColor={warna.greenSea}
                                        />
                                        {this.pengirimanFooterComponent()}

                                    </View>
                                    
                                </View>
                            </View>
                            {/* section total harga */}                            
                            <View style={pesanan.container}>

                                <View style={{
                                    flexDirection: 'row',
                                    marginHorizontal: 20,
                                    justifyContent: 'space-between'
                                }}>
                                    <View style={{

                                        flex: 1,

                                        justifyContent: 'center'
                                    }}>
                                        <Text>
                                            Total Harga ({this.state.products.length} produk)
                                        </Text>

                                    </View>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'flex-end',
                                    }}>
                                        <Text style={{
                                            fontWeight: '600',
                                            fontSize: 18,
                                            color: warna.alizarin
                                        }}>
                                            {formatCurrency(this.getTotalHarga())}
                                        </Text>
                                    </View>
                                </View>


                            </View>

                            <View style={styles.midSeparator}>

                            </View>
                
                            {/* data pembayaran */}
                            <View style={pesanan.container}>
                                <View style={{
                                    paddingHorizontal: 40
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',

                                    }}>
                                        <Text>
                                            Subtotal Harga
                                        </Text>
                                        <Text>
                                            {formatCurrency(this.getTotalHarga())}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{
                                    paddingHorizontal: 40
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',

                                    }}>
                                        <View style={{ flex: 1 }}>
                                            <Text >
                                                Biaya Pengiriman
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignItems: 'flex-end',
                                            }}
                                        >
                                            <Text>
                                                {formatCurrency(this.state.ongkir)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                <View style={{
                                    paddingHorizontal: 40
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',

                                    }}>
                                        <View style={{ flex: 1 }}>
                                            <Text >
                                                Kode Unik
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flex: 1,
                                                alignItems: 'flex-end',
                                                borderBottomColor: warna.e3e3e3,
                                                borderBottomWidth: 1,
                                                paddingBottom: 5,
                                            }}
                                        >
                                            <Text style={{
                                                borderBottomWidth: 0.7,
                                                borderBottomColor: warna.draculaOrchid
                                            }}>
                                                {formatCurrency(this.state.kodeUnik)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>



                                <View style={{
                                    paddingHorizontal: 40,
                                    paddingVertical: 10
                                }}>
                                    <View style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',

                                    }}>
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: '600',

                                        }}>
                                            Total Pembayaran
                                        </Text>
                                        <Text style={{
                                            fontSize: 18,
                                            fontWeight: '600',
                                            color: warna.alizarin
                                        }}>
                                            {formatCurrency(this.state.totalPembayaran)}
                                        </Text>
                                    </View>
                                </View>
                            </View>



                    </View>

                </ScrollView>
                    <View style={[pesanan.containerLarge, { borderTopWidth: 0.7, borderTopColor: warna.e3e3e3 }]}>
                        <View style={{
                            flexDirection: 'row',
                        }}>
                            <View style={{
                                paddingVertical: 10,
                                width: "60%"
                            }}>
                                <View style={{
                                    marginHorizontal: 10,
                                    justifyContent: 'center',
                                    alignItems: 'flex-end'
                                }}>
                                    <Text style={{
                                        fontSize: 20,
                                        color: warna.silver
                                    }}>
                                        Total Pembayaran
                                    </Text>
                                    <Text style={{
                                        fontSize: 20,
                                        color: warna.alizarin
                                    }}>
                                        IDR. {formatCurrency(this.state.totalPembayaran)}
                                    </Text>
                                </View>
                            </View>
                            <TouchableOpacity style={{
                                justifyContent: 'center',
                                alignContent: 'center',
                                alignItems: 'center',
                                width: '40%',
                                backgroundColor: warna.alizarin,
                                paddingVertical: 10,
                            }}
                                onPress={() => {
                                    if (this.state.totalPembayaran > 0) {
                                        this.navigateToDataBank();
                                    }
                                }}
                            >
                                <Text style={{ color: 'white' }}>Selanjutnya</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
                :
                this.registerAlamat()
        )
    }
    navigateToDataBank() {
        let id: string = this.props.navigation.getParam("penjualan_id")
        if(this.state.banks.bank !== 0){

            let paramWeb: Transaksi = {
                alamat_pengiriman_id: this.state.alamatMemberObj.id,
                biaya_pengiriman    : this.state.ongkir,
                bank                : this.state.banks.bank.toString(),
                atasnama            : this.state.banks.atasnama,
                rekening            : this.state.banks.rekening,
                status_transaksi    : "buktibayar",
                _method: "put"
            }
            let url = getRouterURLArray("transaksi", "transaksi").completeUrl
            url = `${url}${id}`;
           // console.log(url, paramWeb);
    
            sendHTTPPOST(url, paramWeb, this.header, (response) => {
                //console.log(response.data);
              //  alert("under construct data bank page");
              let id: string = this.props.navigation.getParam("penjualan_id")
                this.props.navigation.navigate("BuktiTrans",{transaksi:{id:id}});
            });
        }else{
            alert("Silahkan Pilih Metode Pembayaran Terlebih Dahulu");

        }
    }
    pengirimanFooterComponent() {
        let render = (
        <View style={{paddingVertical:10}}>
            <View style={{
                
                paddingVertical: 5,

            }}>
                <Text>{this.state.service}</Text>
            </View>
            <View style={{
                
                paddingVertical: 5,
                flexDirection: 'row',
                justifyContent: 'space-between'
            }}>

                <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                }}>
                    Total Biaya Pengiriman
                </Text>

                <Text style={{
                    fontSize: 18,
                    fontWeight: '500',
                    textAlign: 'right',
                    color: warna.alizarin
                }}>
                    {formatCurrency(this.state.ongkir)}
                </Text>
            </View>

        </View>
        );

        return render;

    }
    createOngkir(item: any) {
        let render = (
            <View style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                flexDirection: 'row'
            }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text>{item.name}</Text>
                    <Text style={{ fontWeight: '200', fontSize: 10 }}>Product dikirimkan dari {`${item.origin.city_name}, ${item.origin.province}`}</Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <Text style={{ fontWeight: '600', color: warna.alizarin }}>{formatCurrency(item.cost.value)}</Text>
                </View>
            </View>
        )
        return render
    }
    getTotalHarga() {

        let harg = 0;
        this.state.products.map(item => {
            harg += item.harga * item.qty;
        })
        return harg;
    }
    registerAlamat() {
        return (
            <SafeAreaView style={styles.content}>
                <View style={styles.nav} >
                    <StatusBar
                        barStyle="default"
                    />
                    <Text style={{

                        fontSize: 24,
                        color: warna.draculaOrchid,
                    }}>
                        Register Alamat
                </Text>
                </View>
                <View style={{
                    margin: 5, borderBottomColor: warna.e3e3e3,
                    borderBottomWidth: 0.6
                }}>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: 20,
                            marginHorizontal: 15,
                        }}
                        onPress={() => {
                            this.getKota();
                        }}
                    >
                        <Text>Pilih Kota</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ marginHorizontal: 4 }}>
                                {this.state.nmkota}
                            </Text>
                            <Feather
                                name={this.state.pilihKotaChevron}
                                size={10}
                            />

                        </View>
                    </TouchableOpacity>
                    <View>
                        {this.state.kotaView}
                    </View>

                    <View style={{ marginVertical: 10 }}>

                        <Input
                            placeholder="Masukkan Alamat"
                            onChangeText={(text) => {
                                this.setState({
                                    alamat: {
                                        ...this.state.alamat,
                                        alamat: text
                                    }
                                })
                            }}
                        />
                    </View>
                    <View style={{ marginVertical: 10 }}>
                        <Input
                            placeholder="Masukkan Telepon"
                            dataDetectorTypes="phoneNumber"
                            onChangeText={(text) => {
                                this.setState({
                                    alamat: {
                                        ...this.state.alamat,
                                        telepon: text
                                    }
                                })
                            }}
                        />

                    </View>
                    <View style={{ marginVertical: 10 }}>
                        <Button
                            onPress={() => {
                                this.simpanAlamat();
                            }}
                            title="Simpan Alamat"
                            type="outline"
                        />

                    </View>
                </View>
            </SafeAreaView>);
    }
    simpanAlamat() {
        let alamat = this.state.alamat;
        let valid = validateDataState(alamat);
        if (valid) {
            //console.log(alamat);
            let header = this.getHttpHeader();
            let url = getRouterURLArray("alamat_pengiriman", "alamat").completeUrl;
            this.setState({ isLoading: true }, () => {
                sendHTTPPOST(url, alamat, header, (resp) => {
                    let data = resp.data.result;
                    this.setState({ alamatMemberObj: data, isReadyAlamat: !this.state.isReadyAlamat, isLoading: !this.state.isLoading }, () => {
                        let url = getRouterURLArray('transaksi', 'get_trans').completeUrl
                        this.getProducts(url);
                    })
                },
                    (err) => {
                        console.log("something error", err);
                    }
                )
            })

        }
    }
    getKota() {
        this.setState({ pilihKotaChevron: 'chevron-down', kotaView: <ListKotaCheckout aksi={(id, nmkota) => { this.setkota(id, nmkota) }} auth={this.props.remember_token} /> });
    }
    setkota(id: any, nmkota: string) {

        this.setState({ pilihKotaChevron: 'chevron-right', nmkota: nmkota, alamat: { ...this.state.alamat, city_id: id }, kotaView: null })

    }
    getProductsPenjualan(item) {
        let product = item.item.products
        let foto: any = getURLGambar(product.photo.foto);
        foto = {
            uri: foto
        }

        //console.log(foto);
        return (
            <View style={styles.renderItemContainer}>
                <View style={{
                    width: '100%',
                    flexDirection: 'row',
                    paddingVertical:5,
                    paddingHorizontal: 15,
                    
                }}>
                    <View style={{ width: 32, height: 32 }}>
                        <Image source={foto} style={{ width: 32, height: 32, resizeMode: 'cover' }} />
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', marginHorizontal: 10 }}>
                        <Text style={{ fontSize: 12 }}>{product.name}</Text>
                        <Text style={{ fontSize: 14, color: warna.alizarin }}>{formatCurrency(product.price)}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    renderItemContainer:{
        
        paddingVertical: 1,
        marginHorizontal: 15,
        },
    daftarproduct:{
        backgroundColor:warna.e3e3e3,
        paddingVertical:5,
    },
    midSeparator: {
        backgroundColor: warna.e3e3e3,
        height: 5,
    },
    biayaPengiriman: {
        paddingVertical: 10,
        width: DIMENSI.width,
        backgroundColor: warna.whiteTurqoa,
        borderBottomColor:warna.e3e3e3,
        borderBottomWidth:0.7
    },
    content: {
        width: DIMENSI.width,

        flex: 1,
    },
    containerAlamat: {
        borderBottomWidth: 0.7,
        borderBottomColor: warna.e3e3e3,
        borderStyle: "dashed",
        flexDirection: 'row',
        paddingTop: 10,
    },

    containerFlatList: {
        borderStyle: "dashed",
        flexDirection: 'row',
        paddingTop: 15,
        
    },
    nav: {
        height: DIMENSI.height * 0.10,
        backgroundColor: 'white',
        width: DIMENSI.width,
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: warna.clouds


    },
    container: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center'
    },
    darkContainer: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: warna.draculaOrchid
    },

});

const pesanan = StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    containerLarge: {
        paddingVertical: 0,
    },
    smallContainer: {
        paddingVertical: 10,
    }
});

function mapStateToProps(state: MemberDataRedux = { id: 0, name: '', dev_id: device, email: '', remember_token: '' }) {
    return state;
}

function mapDispatchStateToProps(dispatch) {
    return {
        setMemberProps: (s) => dispatch({ type: 'SAVE_MEMBER', state: s }),

    }
}
export default connect(mapStateToProps, mapDispatchStateToProps)(CheckoutPage)
