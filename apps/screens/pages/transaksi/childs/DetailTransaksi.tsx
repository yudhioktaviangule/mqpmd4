//import liraries
import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity
} from "react-native";

import { connect } from "react-redux";
import { DEVICE_DIMENSION } from "../../../../constants/device";
import { warna, device } from "../../../../constants";
import {
  getRouterURLArray,
  getURLGambar
} from "../../../../constants/ConstantURLs";
import { sendHttpGET } from "../../../../service-function/httpService";
import { httpHeader } from "../../../../service-function";
import { MemberDataRedux } from "../../../../../reducer";
import {
  isCanTracking,
  getStatusPembelian,
  getCaptionStatusTransaksi
} from "../../../../models/Trans";
import FormatWaktu from "../../../../service-function/formatWaktu";
import FlatListTracking from "./components/FlatListTracking";
import { formatCurrency } from "../../../../functions/pipes";
import { Feather } from "../../../../constants/Feather";
import { Ant } from "../../../../constants/AntIcon";

import Dash from "react-native-dash";
import LogTransaksi from "./components/LogTransaksi";
import ButtonSectionTransaction from "./components/ButtonSectionTransaction";
import { getManifestsIDN } from "../../../../service-function/ManifestoModels";
import {
  home as hom,
  DIMENSI_WIDTH as DIMWIDTH,
  DIMENSI_HEIGHT as DIMHEI,
  NAV_HEIGHT as NAV_HEI,
  NAV_HALF_HEIGHT as NAV_HALHEI
} from "../../Stylish";
import { WhiteLoading } from "../../componentsData/LoadingComponent";
const DIMENSI_WIDTH = DIMWIDTH;
const DIMENSI_HEIGHT = DIMHEI;
const NAV_HEIGHT = NAV_HEI;
const NAV_HALF_HEIGHT = NAV_HALHEI;
const home = hom;

interface stattrans {
  status_transaksi: string;
}
function getIconStatus(status: stattrans) {
  let icons = <View></View>;
  switch (status.status_transaksi) {
    case "buktibayar":
      icons = (
        <Ant
          size={14}
          style={{ marginRight: 10 }}
          name="camerao"
          color={warna.whitePolos}
        />
      );
      break;
    case "checkout":
      icons = (
        <Ant
          name="paperclip"
          color={warna.whitePolos}
          size={14}
          style={{ marginRight: 10 }}
        />
      );
      break;
    case "diterima":
      icons = (
        <Feather
          size={14}
          style={{ marginRight: 10 }}
          name="clipboard"
          color={warna.whitePolos}
        />
      );
      break;
    case "menunggu verifikasi":
      icons = (
        <Ant
          size={14}
          style={{ marginRight: 10 }}
          name="clockcircleo"
          color={warna.whitePolos}
        />
      );
      break;

    case "pengemasan":
      icons = (
        <Feather
          size={14}
          style={{ marginRight: 10 }}
          name="package"
          color={warna.whitePolos}
        />
      );
      break;
    case "pengiriman":
      icons = (
        <Feather
          size={14}
          style={{ marginRight: 10 }}
          name="truck"
          color={warna.whitePolos}
        />
      );
      break;
    case "pilihbank":
      icons = (
        <Ant
          size={14}
          style={{ marginRight: 10 }}
          name="paperclip"
          color={warna.whitePolos}
        />
      );
      break;

    case "selesai":
      icons = (
        <Feather
          size={14}
          style={{ marginRight: 10 }}
          name="check-circle"
          color={warna.whitePolos}
        />
      );
      break;

    case "telah diverifikasi":
      icons = (
        <Feather
          size={14}
          style={{ marginRight: 10 }}
          name="check-square"
          color={warna.whitePolos}
        />
      );
      break;

    default:
      icons = (
        <Feather
          size={14}
          style={{ marginRight: 10 }}
          name="archive"
          color={warna.whitePolos}
        />
      );
      break;
  }
  return icons;
}

// create a component
class DetailTransaksiPage extends Component<any> {
  state = {
    statusIcon: <View></View>,
    isLoading: false,
    transactions: {
      resi_jne: "",
      member: {
        name: ""
      },
      alamat: {
        alamat: "",
        telepon: ""
      },
      id: "",
      bank: {
        id: 0,
        namabank: "",
        iconbank: "default.png"
      },
      jumlah_pembayaran: 0,
      biaya_pengiriman: 0,
      invoice: "",
      status_transaksi: "checkout",
      updated_at: "2019-01-01",
      detail: [
        {
          products: {
            id: "",
            name: "",
            photo: {
              foto: "default.png"
            }
          }
        }
      ]
    },
    tracking: false,
    pilihbank: false,
    status: "",
    manifesto: [],
    isDelivered: false
  };
  handler = {
    setFinishing: () => {
      const { id } = this.state.transactions;
      const { completeUrl } = getRouterURLArray("transaksi", "set_state");
      const url = `${completeUrl}${id}/selesai`;
      sendHttpGET(url, this.handler.createHeader(), response => {
        const { navigation } = this.props;
        navigation.push("Finishing");
      });
    },
    composeDeliveredStatus: () => {
      const { id } = this.state.transactions;
      const { completeUrl } = getRouterURLArray("transaksi", "set_state");
      const url = `${completeUrl}${id}/diterima`;
      sendHttpGET(url, this.handler.createHeader(), response => {
        const { result } = response.data;
        console.log(result);
        this.setState({ status: "diterima" }, () => {
          let trans = this.state.transactions;
          trans.status_transaksi = "diterima";
          this.setState({ transaction: trans });
        });
      });
    },
    gotoChat: () => {
      this.handler.getAdminList();
    },
    getAdminList: () => {
      const { remember_token } = this.props;
      let { completeUrl } = getRouterURLArray("chats", "select_admin");
      let headers: any;
      headers = httpHeader(device, remember_token);
      const url = `${completeUrl}0`;
      sendHttpGET(url, headers, response => {
        let { result } = response.data;
        this.handler.createChatAttachment(result);
      });
    },
    createChatAttachment: res => {
      const { id } = this.state.transactions;
      const { invoice } = this.state.transactions;
      const link = `DetailTransaksi|${id}`;
      const captionPrimary = `Invoice No. ${invoice}`;
      const captionSecondary = `${invoice}`;
      const { navigation } = this.props;
      const param = {
        attachment: {
          link: link,
          data: {
            captionPrimary: captionPrimary,
            captionSecondary: captionSecondary,
            photo: ""
          }
        },
        admin: res
      };

      navigation.push("DetailChat", param);
    },
    getTrackingList: () => {
      let URL = getRouterURLArray("rajaongkir", "tracking").completeUrl;
      let { resi_jne } = this.state.transactions;
      URL = `${URL}${resi_jne}`;
      sendHttpGET(
        URL,
        httpHeader(device, this.props.remember_token),
        response => {
          const { data } = response;
          const { result } = data;
          const { delivered } = result;
          const { manifest: manifest } = result;
          let manifesto = [];
          manifesto = manifest;
          manifesto = getManifestsIDN(manifesto.reverse());
          if (delivered && this.state.status != "diterima") {
            if (this.state.status !== "selesai") {
              this.handler.composeDeliveredStatus();
            }
          }
          this.setState({
            isDelivered: delivered,
            isLoading: false,
            manifesto: manifesto
          });
        }
      );
    },
    navigate: (to, param) => {
      this.props.navigation.navigate(to, param);
    },
    getPhoto: (subdir: string, photo: string) => {
      return getURLGambar(`${subdir}/${photo}`);
    },
    getTracking: detail_product_id => {},
    createHeader: () => {
      return httpHeader(device, this.props.remember_token);
    },
    composeHttp: () => {
      let id = this.props.navigation.getParam("id");
      let header = this.handler.createHeader();
      let url = getRouterURLArray("transaksi", "get_trans").completeUrl;
      url = `${url}${id}`;
      //console.log("URL:",url);
      sendHttpGET(url, header, response => {
        let result = response.data.result;
        let { status_transaksi } = result;
        const st: string = status_transaksi;
        // console.log(result);
        this.setState(
          {
            tracking: isCanTracking({ status_transaksi: status_transaksi }),
            transactions: result,
            status: status_transaksi,
            statusIcon: getIconStatus({ status_transaksi: st }),
            pilihbank: st == "checkout" ? false : true
          },
          () => {
            if (this.state.tracking) {
              this.handler.getTrackingList();
            } else {
              this.setState({ isLoading: false });
            }
          }
        );
      });
    },
    loadComponent: () => {
      const { status_transaksi } = this.state.transactions;
      // console.log(status_transaksi);
      return (
        <View style={[home.contentContainer]}>
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
                  <Feather name="arrow-left" size={20} color={warna.alizarin} />
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
              <Text style={[home.navTextStyle, { alignContent: "center" }]}>
                Rincian Pembelian
              </Text>
            </View>
            <View style={{ flex: 1 }}></View>
          </View>
          <ScrollView style={{ height: DIMENSI_HEIGHT }}>
            <View
              style={[
                home.smallContainer,
                home.flexRow,
                home.bgTurq,
                { paddingHorizontal: 10 }
              ]}
            >
              {this.state.statusIcon}
              <View style={{ flex: 1 }}>
                <Text style={[home.titleTextStyle, home.textWhite]}>
                  {getCaptionStatusTransaksi({
                    status_transaksi: this.state.status
                  })}
                </Text>
                <Text style={[home.thinText, home.textWhite]}>
                  {getStatusPembelian({ status_transaksi: status_transaksi })}
                </Text>

                <Text style={[home.boldText, home.textWhite]}>
                  {new FormatWaktu().getWaktu(
                    this.state.transactions.updated_at
                  )}
                </Text>
              </View>
            </View>

            <View
              style={[
                home.smallContainer,
                home.flexRow,
                { justifyContent: "space-between", padding: 10 }
              ]}
            >
              <Ant
                name="enviromento"
                style={{ marginRight: 10 }}
                size={14}
                color={warna.alizarin}
              />
              <View style={{ flex: 1 }}>
                <View style={{ paddingBottom: 10 }}>
                  <Text style={[home.titleTextStyle]}>Alamat Pengiriman</Text>
                </View>
                <View>
                  <Text style={{ fontWeight: "300" }}>
                    {this.state.transactions.member.name}
                  </Text>
                  <Text style={{ fontWeight: "300" }}>
                    {this.state.transactions.alamat.alamat}
                  </Text>
                  <Text style={{ fontWeight: "300" }}>
                    {this.state.transactions.alamat.telepon}
                  </Text>
                  {this.state.tracking ? (
                    <View style={{ paddingTop: 5 }}>
                      <Dash
                        dashGap={5}
                        dashLength={5}
                        dashThickness={0.7}
                        dashColor={warna.e3e3e3}
                      />
                      <View style={{ paddingTop: 10 }}>
                        <FlatListTracking
                          manifesto={this.state.manifesto}
                          data={this.state.transactions.detail}
                          trans={this.state.transactions}
                        />
                      </View>
                    </View>
                  ) : null}
                </View>
              </View>
            </View>

            <View style={home.tinydivider}></View>

            <View style={[home.smallContainer, home.flexRow, { padding: 10 }]}>
              <Ant
                name="form"
                color={warna.alizarin}
                style={{ marginRight: 10 }}
                size={14}
              />
              <View style={{ flex: 1 }}>
                <View style={[{ paddingBottom: 10 }, home.lineSepa]}>
                  <Text style={[home.titleTextStyle]}>
                    Informasi Pembayaran
                  </Text>
                </View>
                <View
                  style={[
                    home.flexRow,
                    {
                      paddingTop: 10,
                      flex: 1,
                      justifyContent: "space-between",
                      paddingRight: 10
                    }
                  ]}
                >
                  <Text>Subtotal Pembayaran</Text>
                  {this.state.pilihbank ? (
                    <Text>
                      {formatCurrency(
                        this.state.transactions.jumlah_pembayaran
                      )}
                    </Text>
                  ) : (
                    <Text>Belum Melakukan Checkout</Text>
                  )}
                </View>
                <View
                  style={[
                    home.flexRow,
                    {
                      paddingTop: 10,
                      flex: 1,
                      justifyContent: "space-between",
                      paddingRight: 10
                    }
                  ]}
                >
                  <Text>Biaya Pengiriman</Text>
                  {this.state.pilihbank ? (
                    <Text>
                      {formatCurrency(this.state.transactions.biaya_pengiriman)}
                    </Text>
                  ) : (
                    <Text>Belum Melakukan Checkout</Text>
                  )}
                </View>
                <View
                  style={[
                    home.flexRow,
                    {
                      paddingTop: 10,
                      flex: 1,
                      justifyContent: "space-between",
                      paddingRight: 10
                    }
                  ]}
                >
                  <Text>Kode Unik</Text>
                  {this.state.pilihbank ? (
                    <Text>
                      {formatCurrency(this.state.transactions["unik"])}
                    </Text>
                  ) : (
                    <Text>Belum Melakukan Checkout</Text>
                  )}
                </View>
                <View
                  style={[
                    home.flexRow,
                    {
                      paddingTop: 10,
                      flex: 1,
                      justifyContent: "space-between",
                      paddingRight: 10
                    }
                  ]}
                >
                  <Text>Total Pembayaran</Text>
                  {this.state.pilihbank ? (
                    <Text style={{ color: warna.alizarin, fontWeight: "500" }}>
                      IDR.{" "}
                      {formatCurrency(
                        this.state.transactions.jumlah_pembayaran +
                          this.state.transactions.biaya_pengiriman +
                          parseInt(this.state.transactions["unik"])
                      )}
                    </Text>
                  ) : (
                    <Text>Belum Melakukan Checkout</Text>
                  )}
                </View>
              </View>
            </View>
            <View style={home.tinydivider}></View>

            <View
              style={[
                home.lineSepa,
                home.smallContainer,
                home.flexRow,
                { justifyContent: "space-between", padding: 10 }
              ]}
            >
              <Feather
                name="paperclip"
                style={{ marginRight: 10 }}
                size={14}
                color={warna.alizarin}
              />
              <View style={{ flex: 1 }}>
                <View style={{ paddingBottom: 10 }}>
                  <Text style={[home.titleTextStyle]}>Metode Pembayaran</Text>
                </View>
                <View>
                  {this.state.pilihbank ? (
                    <Text>
                      Transfer Bank{" "}
                      {this.state.transactions.bank.namabank.toUpperCase()}
                    </Text>
                  ) : (
                    <Text>Anda Belum melakukan Checkout</Text>
                  )}
                </View>
              </View>
            </View>

            <View
              style={[
                home.smallContainer,
                home.flexRow,
                { justifyContent: "space-between", padding: 10 }
              ]}
            >
              <Feather
                name="credit-card"
                style={{ marginRight: 10 }}
                size={14}
                color={warna.alizarin}
              />
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    paddingBottom: 10,
                    flexDirection: "row",
                    justifyContent: "space-between"
                  }}
                >
                  <Text style={[home.titleTextStyle]}>No. Pesanan</Text>
                  <Text style={[home.thinText, { textTransform: "uppercase" }]}>
                    {this.state.transactions.invoice}
                  </Text>
                </View>
                <View>
                  <LogTransaksi data={this.state.transactions} />
                </View>
              </View>
            </View>
            <View style={home.tinydivider}></View>
            <View style={[home.smallContainer, home.flexRow, { padding: 10 }]}>
              <ButtonSectionTransaction
                transaksi={this.state.transactions}
                navHandler={(to, param) => {
                  this.handler.navigate(to, param);
                }}
                navigateToChat={() => {
                  this.handler.gotoChat();
                }}
                navigateToSelesai={() => {
                  this.handler.setFinishing();
                }}
              />
            </View>
          </ScrollView>
        </View>
      );
    }
  };
  componentDidMount() {
    const x = () => {
      this.setState({ isLoading: true }, () => {
        this.handler.composeHttp();
      });
    };

    const { navigation } = this.props;
    const thisRoute = navigation.state.routeName;
    navigation.addListener("willFocus", payload => {
      if (payload.state.routeName == thisRoute) {
        x();
      }
    });
  }
  render() {
    return (
      <SafeAreaView style={home.appContainer}>
        {this.state.isLoading ? <WhiteLoading /> : this.handler.loadComponent()}
      </SafeAreaView>
    );
  }
}

function mapStateToProps(
  state: MemberDataRedux = {
    id: 0,
    name: "",
    dev_id: device,
    email: "",
    remember_token: ""
  }
) {
  return state;
}

function mapDispatchStateToProps(dispatch) {
  return {
    setMemberProps: s => dispatch({ type: "SAVE_MEMBER", state: s })
  };
}
export default connect(
  mapStateToProps,
  mapDispatchStateToProps
)(DetailTransaksiPage);
