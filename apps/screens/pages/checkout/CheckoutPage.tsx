import React, { Component } from "react";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import { home } from "../Stylish";
import { Feather } from "@expo/vector-icons";
import { warna, device } from "../../../constants";
import RegisCompAlamat from "./components/staticRegisterAlamat";
import { httpHeader, sendHTTPPOST } from "../../../service-function";
import { getRouterURLArray } from "../../../constants/ConstantURLs";
import { sendHttpGET } from "../../../service-function/httpService";
import { getOngkir } from "../../../service-function/rajaongkir";
import { formatCurrency } from "../../../functions/pipes";
import { FlatList } from "react-native-gesture-handler";
import {
  DetailTransaksiCards,
  DetailPembayaranCards
} from "./components/staticDetailTrans";
import { Ant } from "../../../constants/AntIcon";
import StaticPilihBank from "./components/staticPilihBank";
import { Transaksi } from "../../../models/Trans";

const ScView = ScrollView;
const style = home;
const styles = StyleSheet.create({
  contPadding: {
    paddingHorizontal: 10
  },
  iconWidth: {
    width: 24,
    height: 24
  }
});

const getTotalHarga = (produk = []) => {
  let harg = 0;
  produk.map(item => {
    harg += item.harga * item.qty;
  });
  return harg;
};

class CheckoutPage extends Component<any> {
  state = {
    bank: {
      isSelecting: false,
      selected: false,
      namaBank: "Tap Untuk Memilih Metode Pembayaran",
      bank: 0,
      atasnama: "",
      rekening: ""
    },
    subtotalProduk: 0,
    ongkir: 0,
    totalPembayaran: 0,
    pengiriman: {
      lists: {
        cost: {
          value: 0
        },
        service: ""
      },
      totalPrice: 0
    },
    service: "",
    isLoading: false,
    isReadyAlamat: false,
    isReadyAlamats: false,
    kodeUnik: 0,
    products: [],
    transaksi: {},
    alamat: {
      city_id: 0,
      alamat: "",
      member_id: 0,
      telepon: ""
    },
    alamatMembers: {},
    alamatMemberObj: {
      city: {
        city_name: "",
        province: "",
        city_id: "0"
      },
      telepon: "",
      alamat: "",
      id: 0
    },
    rincianPembayaran: []
  };
  header = {};
  handler = {
    updateTransaksi: () => {
      this.setState({ isLoading: true }, () => {
        let id: string = this.props.navigation.getParam("penjualan_id");
        if (this.state.bank.bank !== 0) {
          let paramWeb: Transaksi = {
            alamat_pengiriman_id: this.state.alamatMemberObj.id,
            biaya_pengiriman: this.state.ongkir,
            bank: this.state.bank.bank.toString(),
            atasnama: this.state.bank.atasnama,
            rekening: this.state.bank.rekening,
            status_transaksi: "buktibayar",
            _method: "put"
          };
          let url = getRouterURLArray("transaksi", "transaksi").completeUrl;
          url = `${url}${id}`;
          sendHTTPPOST(url, paramWeb, this.header, response => {
            let id: string = this.props.navigation.getParam("penjualan_id");
            this.props.navigation.navigate("BuktiTrans", {
              transaksi: { id: id }
            });
          });
        } else {
          this.setState({ isLoading: false }, () => {
            alert("Silahkan Pilih Metode Pembayaran Terlebih Dahulu");
          });
        }
      });
    },
    getProducts: () => {
      const { navigation } = this.props;
      const { completeUrl } = getRouterURLArray("transaksi", "get_trans");
      const penjualan_id = navigation.getParam("penjualan_id");
      const url = `${completeUrl}${penjualan_id}`;
      sendHttpGET(url, this.header, response => {
        const { result } = response.data;
        const { unik, detail } = result;
        this.setState(
          { kodeUnik: unik, products: detail, transaksi: result },
          () => {
            getOngkir(
              this.state.products,
              this.header,
              {
                courier: "jne",
                destination: parseInt(this.state.alamatMemberObj.city.city_id)
              },
              response => {
                const { result } = response;
                this.setState(
                  {
                    pengiriman: {
                      lists: result
                    }
                  },
                  () => {
                    let totalPengiriman = this.state.pengiriman.lists.cost
                      .value;
                    let serv = this.state.pengiriman.lists.service;
                    this.setState(
                      { service: serv, ongkir: totalPengiriman },
                      () => {
                        let kodeunik: number = parseInt(
                          this.state.kodeUnik.toString()
                        );
                        const stotalproduk = getTotalHarga(this.state.products);
                        let tharga: number = (
                          stotalproduk + this.state.ongkir
                        ).valueOf();
                        tharga += kodeunik;

                        this.setState(
                          {
                            subtotalProduk: stotalproduk,
                            totalPembayaran: tharga,
                            isLoading: false
                          },
                          () => {
                            let totalArr = [
                              {
                                caption: "Subtotal Produk",
                                price: this.state.subtotalProduk
                              },
                              {
                                caption: "Biaya Pengiriman",
                                price: this.state.ongkir
                              },
                              {
                                caption: "Kode Unik",
                                price: this.state.kodeUnik
                              }
                            ];
                            this.setState({ rincianPembayaran: totalArr });
                          }
                        );
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    },
    getAlamatMember: member_id => {
      const { completeUrl } = getRouterURLArray("members", "alamat");
      const url = `${completeUrl}${member_id}`;
      sendHttpGET(url, this.header, response => {
        const { result } = response.data;
        const alamat = result;
        if (alamat.length < 1) {
          this.setState(
            {
              alamat: {
                city_id: 0,
                telepon: "",
                alamat: "",
                member_id: this.props.id
              },
              isReadyAlamat: false,
              isLoading: false
            },
            () => {
              this.handler.getProducts();
            }
          );
        } else {
          this.setState(
            {
              isReadyAlamat: true,
              alamat: alamat[0],
              alamatMembers: alamat,
              alamatMemberObj: alamat[0]
            },
            () => {
              this.handler.getProducts();
            }
          );
        }
      });
    },
    createAlamatPengiriman: alamat => {
      this.setState({ alamat: { ...alamat, member_id: this.props.id } }, () => {
        const { alamat } = this.state;
        const { completeUrl } = getRouterURLArray(
          "alamat_pengiriman",
          "alamat"
        );
        sendHTTPPOST(completeUrl, alamat, this.header, response => {
          const { result } = response.data;
          this.setState({ memberAlamatObj: result, isReadyAlamat: true });
        });
      });
    },
    createNav: () => {
      return (
        <View
          style={[
            home.smallContainer,
            home.flexRow,
            { padding: 10, justifyContent: "center" },
            home.lineSepa
          ]}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "flex-start",
              alignContent: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                const { navigation } = this.props;
                const { params } = navigation.state;
                if (params.navBack == undefined) {
                  navigation.goBack();
                } else {
                  let param = params;
                  delete param.key;
                  delete param.id;
                  navigation.navigate(params.navBack, param);
                }
              }}
            >
              <View>
                <Feather name="arrow-left" size={20} color={warna.whitePolos} />
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center"
            }}
          >
            <Text
              style={[
                home.navTextStyle,
                { alignContent: "center", color: "white" }
              ]}
            >
              Checkout
            </Text>
          </View>
          <View style={{ flex: 1 }}></View>
        </View>
      );
    },
    createContent: () => {
      if (this.state.isLoading) {
        return (
          <View
            style={[
              style.contentContainer,
              style.bgContent,
              { justifyContent: "center", alignItems: "center" }
            ]}
          >
            <ActivityIndicator />
          </View>
        );
      } else {
        if (this.state.bank.isSelecting) {
          return (
            <StaticPilihBank
              clickReturn={() => {
                this.setState({
                  bank: { ...this.state.bank, isSelecting: false }
                });
              }}
              setBank={bank => {
                this.setState({ bank: bank });
              }}
              {...this.props}
            />
          );
        } else if (this.state.isReadyAlamat) {
          return (
            <ScView style={[style.contentContainer, style.bgContent]}>
              <View style={[style.tinydivider]}></View>
              <this.handler.createAlamat />
              <this.handler.renderContentPengiriman />
              <View style={[style.tinydivider]}></View>
              <this.handler.renderContentFlatProduk />
              <View style={[style.tinydivider]}></View>
              <this.handler.renderRincianBeli />
              <View style={[style.tinydivider]}></View>
              <this.handler.renderBank />
              <View style={[style.tinydivider]}></View>
              <this.handler.renderTombolBawah />
            </ScView>
          );
        } else {
          return (
            <View style={[style.contentContainer, style.bgContent]}>
              <RegisCompAlamat
                {...this.props}
                clickHandler={alamat => {
                  this.handler.createAlamatPengiriman(alamat);
                }}
              />
            </View>
          );
        }
      }
    },

    createAlamat: () => {
      return (
        <View style={[style.smallContainer, style.lineSepa]}>
          <View
            style={[
              style.flexRow,
              { alignItems: "flex-start", paddingHorizontal: 10 }
            ]}
          >
            <Feather name="map-pin" color={warna.alizarin} />
            <View style={[styles.contPadding, { flex: 1 }]}>
              <Text
                style={[
                  style.titleTextStyle,
                  style.textRed,
                  { marginBottom: 5 }
                ]}
              >
                Alamat Pengiriman
              </Text>
              <Text style={{ fontWeight: "200" }}>
                {this.state.alamat.alamat}
              </Text>
              <Text style={{ fontWeight: "200" }}>
                {this.state.alamat.telepon}
              </Text>
            </View>
          </View>
        </View>
      );
    },
    renderBank: () => {
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({ bank: { ...this.state.bank, isSelecting: true } });
          }}
          style={[style.smallContainer, style.lineSepa]}
        >
          <View
            style={[
              style.flexRow,
              { alignItems: "flex-start", paddingHorizontal: 10 }
            ]}
          >
            <Feather name="paperclip" color={warna.alizarin} />
            <View style={[styles.contPadding, { flex: 1 }]}>
              <Text
                style={[
                  style.titleTextStyle,
                  style.textRed,
                  { marginBottom: 5 }
                ]}
              >
                Metode Pembayaran
              </Text>

              <Text style={{ fontWeight: "200" }}>
                {this.state.bank.namaBank}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    },

    renderContentPengiriman: () => {
      return (
        <View style={[style.smallContainer, style.lineSepa]}>
          <View
            style={[
              style.flexRow,
              { alignItems: "flex-start", paddingHorizontal: 10 }
            ]}
          >
            <Feather name="truck" color={warna.alizarin} />
            <View style={[styles.contPadding, { flex: 1 }]}>
              <Text
                style={[
                  style.titleTextStyle,
                  style.textRed,
                  { marginBottom: 5 }
                ]}
              >
                Opsi Pengiriman
              </Text>
              <Text style={{ fontWeight: "200" }}>{this.state.service}</Text>
              <View
                style={[style.flexRow, { justifyContent: "space-between" }]}
              >
                <Text style={{ fontWeight: "200" }}>Biaya Pengiriman</Text>
                <Text style={[{ color: warna.alizarin }]}>
                  {formatCurrency(this.state.ongkir)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    },

    renderContentFlatProduk: () => {
      return (
        <View style={[style.smallContainer, style.lineSepa]}>
          <View
            style={[
              style.flexRow,
              { alignItems: "flex-start", paddingHorizontal: 10 }
            ]}
          >
            <Feather name="clipboard" color={warna.alizarin} />
            <View style={[styles.contPadding, { flex: 1 }]}>
              <View
                style={[{ paddingBottom: 5, marginBottom: 10 }, style.lineSepa]}
              >
                <Text style={[style.titleTextStyle, style.textRed]}>
                  Rincian Pesanan
                </Text>
              </View>
              <FlatList
                data={this.state.products}
                renderItem={item => {
                  return <DetailTransaksiCards toRender={item.item} />;
                }}
                style={[style.lineSepa, { paddingBottom: 5 }]}
                keyExtractor={(item, index) => {
                  return "mrdk" + item.id;
                }}
              />
              <View
                style={[
                  ,
                  style.flexRow,
                  { paddingTop: 15, justifyContent: "space-between" }
                ]}
              >
                <Text>Sub Total ({this.state.products.length} Produk)</Text>

                <Text style={{ color: warna.alizarin }}>
                  {formatCurrency(this.state.subtotalProduk)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    },

    renderRincianBeli: () => {
      return (
        <View style={[style.smallContainer, style.lineSepa]}>
          <View
            style={[
              style.flexRow,
              { alignItems: "flex-start", paddingHorizontal: 10 }
            ]}
          >
            <Ant name="creditcard" color={warna.alizarin} />
            <View style={[styles.contPadding, { flex: 1 }]}>
              <View style={[{ paddingBottom: 5, marginBottom: 10 }]}>
                <Text style={[style.titleTextStyle, style.textRed]}>
                  Rincian Pembayaran
                </Text>
              </View>
              <FlatList
                data={this.state.rincianPembayaran}
                renderItem={item => {
                  return <DetailPembayaranCards toRender={item.item} />;
                }}
                keyExtractor={(item, index) => {
                  return "mrdm" + index;
                }}
              />
              <View
                style={[
                  style.flexRow,
                  { paddingTop: 15, justifyContent: "space-between" }
                ]}
              >
                <Text>Total Pembayaran</Text>

                <Text style={{ color: warna.alizarin }}>
                  {formatCurrency(this.state.totalPembayaran)}
                </Text>
              </View>
            </View>
          </View>
        </View>
      );
    },

    renderTombolBawah: () => {
      return (
        <View
          style={[
            style.smallContainer,
            style.flexRow,
            style.fluid,
            {
              flex: 1,
              paddingBottom: 30,
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center"
            }
          ]}
        >
          <TouchableOpacity
            onPress={() => {
              this.handler.updateTransaksi();
            }}
            style={[
              {
                borderRadius: 5,
                paddingVertical: 10,
                borderColor: warna.alizarin,
                borderWidth: 1,
                flex: 1,
                alignContent: "center",
                alignItems: "center",
                justifyContent: "center"
              }
            ]}
          >
            <Text
              style={[
                style.textRed,
                {
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}
            >
              BAYAR SEKARANG
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  componentDidMount() {
    const { remember_token, id } = this.props;
    this.header = httpHeader(device, remember_token);
    this.setState(
      { bank: { isSelecting: false, ...this.state.bank }, isLoading: true },
      () => {
        this.handler.getAlamatMember(id);
      }
    );
  }
  render() {
    return (
      <View style={[style.appContainer, style.bgNavRed]}>
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={[style.appContainer]}>
          <this.handler.createNav />
          <this.handler.createContent />
        </SafeAreaView>
      </View>
    );
  }
}
const mapStateToProps = state => {
  return state;
};
export default connect(mapStateToProps)(CheckoutPage);
