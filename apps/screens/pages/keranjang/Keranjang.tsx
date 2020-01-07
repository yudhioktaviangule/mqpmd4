import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableWithoutFeedback
} from "react-native";
import { warna, device } from "../../../constants";
import { Bubbles } from "react-native-loader";
import { httpHeader } from "../../../service-function/httpHeader";
import { MemberDataRedux } from "../../../../RouterApp";
import { connect } from "react-redux";
import { sendHTTPPOST } from "../../../service-function";
import {
  getRouterURLArray,
  getURLGambar
} from "../../../constants/ConstantURLs";
import { sendHttpGET } from "../../../service-function/httpService";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import { DEVICE_DIMENSION } from "../../../constants/device";
import { formatCurrency } from "../../../functions/pipes";
import { CheckBox } from "react-native-elements";
import { Feather } from "../../../constants/Feather";
import { serviceNotifications } from "../notifikasi/NotificationModel";
import { DarkLoading } from "../componentsData/LoadingComponent";
const dimensi = DEVICE_DIMENSION;
const NAV_HEIGHT = 0.15 * dimensi.height;
const NAV_MIN_HEIGHT = 0.3 * NAV_HEIGHT;

const home = StyleSheet.create({
  textRed: {
    color: warna.alizarin
  },
  smalldivider: {
    backgroundColor: warna.clouds,
    height: 24
  },
  tinydivider: {
    backgroundColor: warna.clouds,
    height: 8
  },

  lineSepa: {
    borderBottomColor: warna.e3e3e3,
    borderBottomWidth: 0.7
  },
  appContainer: {
    flex: 1
  },
  contentContainer: {
    flex: 1,
    width: dimensi.width
  },

  smallContainer: {
    paddingVertical: 20
  },

  navContainer: {
    minHeight: NAV_HEIGHT / 2
  },
  bgNav: {
    backgroundColor: warna.alizarin
  },
  bgTurq: {
    backgroundColor: warna.turquise
  },
  bgContent: {
    backgroundColor: warna.whiteLynx
  },
  nav: {
    alignContent: "center",
    alignItems: "center"
  },
  flexRow: {
    flexDirection: "row"
  },
  titleContents: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  titleTextStyle: {
    fontWeight: "600",
    textTransform: "capitalize"
  },
  navTextStyle: {
    fontSize: 18,
    fontWeight: "500",
    textTransform: "capitalize"
  },
  softTopBorder: {
    borderTopColor: warna.e3e3e3,
    borderTopWidth: 0.7
  },
  padding: {
    padding: 10
  },
  flex2: {
    flex: 2
  },
  thinText: {
    fontWeight: "200"
  },
  boldText: {
    fontWeight: "500"
  },
  textWhite: {
    color: warna.whitePolos
  }
});
class Keranjang extends React.Component<any> {
  state = {
    listKeranjang: [],
    isLoading: true,
    totalHarga: 0,
    keranjang: [],
    canSave: false
  };
  tharga: number = 0;
  httpHeader = httpHeader(device, this.props.remember_token);
  componentDidMount() {
    const navigation = this.props.navigation;
    const thisRoute = navigation.state.routeName;
    navigation.addListener("willFocus", payload => {
      if (payload.state.routeName == thisRoute) this.composeHttp();
    });
  }
  composeHttp() {
    this.setState({ isLoading: true }, () => {
      const nava = this.props;
      //console.log(nava);
      let header = httpHeader(device, nava.remember_token);
      let partUrl = {
        base: getRouterURLArray("keranjang", "keranjang").completeUrl,
        param: { member_id: this.props.id }
      };
      let url = `${partUrl.base}${partUrl.param.member_id}`;
      sendHttpGET(url, header, response => {
        this.setState({ listKeranjang: response.data.result }, () => {
          this.setState({ isLoading: false }, ()=>{
            this.cekTotalHarga()
            const {id,remember_token} = this.props;
            serviceNotifications(id,remember_token,(notificationValue)=>{
                this.props.updateNotification(notificationValue)
            })
          });
        });
      });
    });
  }

  render() {
    return this.state.isLoading
      ? this.loadingComponent()
      : this.keranjangKomponent();
  }
  renderNav = () => {
    return (
      <View style={[home.smallContainer, home.nav, home.bgNav]}>
        <Text style={[home.textWhite, home.navTextStyle]}>Keranjang</Text>
      </View>
    );
  };
  renderIfNullContent = () => {
    return (
      <View
        style={[
          home.appContainer,
          home.bgContent,
          {
            alignItems: "center",
            justifyContent: "center"
          }
        ]}
      >
        <Text style={{ fontWeight: "200" }}>
          Tidak ada Item Dalam Keranjang
        </Text>
      </View>
    );
  };
  renderContent = () => {
    return (
      <View style={[home.appContainer, home.bgContent]}>
        {this.state.listKeranjang.length > 0
          ? this.renderItemIfNotNull()
          : this.renderIfNullContent()}
      </View>
    );
  };
  renderItemIfNotNull = () => {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ padding: 10, backgroundColor: warna.whiteLynx }}>
          {this.flatListData()}
        </View>
        <View
          style={[
            home.flexRow,
            home.lineSepa,
            {
              backgroundColor: "white",
              paddingHorizontal: 10,
              paddingVertical: 20,
              alignItems: "center",
              position: "absolute",
              bottom: 0
            }
          ]}
        >
          <View
            style={{
              flex: 2,
              marginHorizontal: 5,
              alignItems: "flex-start",
              alignContent: "flex-start"
            }}
          >
            <Text
              style={[
                home.boldText,
                { marginBottom: 5, fontSize: 16, color: warna.draculaOrchid }
              ]}
            >
              Jumlah Pembayaran
            </Text>
            <Text style={[home.textRed, { fontSize: 20 }]}>
              IDR. {formatCurrency(this.state.totalHarga)}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              marginHorizontal: 5,
              justifyContent: "center",
              alignContent: "center"
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: warna.whitePolos,
                padding: 10,
                borderColor: warna.alizarin,
                borderWidth: 1,
                borderRadius: 3,
                alignContent: "center",
                alignItems: "center"
              }}
              onPress={() => {
                let canSave = this.checkUncheckedList(this.state.listKeranjang);
                if (canSave) {
                  this.saveToPenjualan();
                } else {
                  alert("Tidak ada item yang dipilih");
                }
              }}
            >
              <Text style={{ color: warna.alizarin, fontWeight: "500" }}>
                Checkout
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };
  keranjangKomponent() {
    return (
      <SafeAreaView style={[home.appContainer, home.bgNav]}>
        <StatusBar barStyle="light-content" />
        {this.renderNav()}
        {this.renderContent()}
      </SafeAreaView>
    );
  }
  flatListData = () => {
    return (
      <FlatList
        data={this.state.listKeranjang}
        renderItem={item => {
          return this.componentListKeranjang(item);
        }}
        keyExtractor={(v, k) => {
          return k.toString();
        }}
        ListFooterComponent={<View style={{ height: 200 }}></View>}
        contentContainerStyle={{ paddingHorizontal: 5 }}
      />
    );
  };
  checkUncheckedList(listKeranjang: any[]) {
    let isCanSave: boolean = false;
    let i: number = 0;
    listKeranjang.map(keranjang => {
      i = keranjang.checked ? i + 1 : i;
    });
    isCanSave = i > 0 ? true : false;
    return isCanSave;
  }
  saveToPenjualan() {
    const navigation = this.props.navigation;
    let arrayIDKeranjang = [];
    this.state.listKeranjang.map((v, k) => {
      if (v.checked) {
        arrayIDKeranjang.push(v.id);
      }
    });
    let urlComp = getRouterURLArray("transaksi", "checkout").completeUrl;
    let param = {
      keranjang_id: arrayIDKeranjang,
      alamat_pengiriman_id: 0
    };
    console.log(param);

    // console.log(urlComp,param);
    sendHTTPPOST(
      urlComp,
      param,
      this.httpHeader,
      response => {
        let id = response.data.result.id;
        navigation.navigate("Checkout", { penjualan_id: id });
      },
      err => {
        //   console.log(err)
      }
    );
  }

  componentListKeranjang(item) {
    //   console.log(item)
    let itm = item.item;
    this.tharga += itm.qty * itm.products.price;

    const foto = { uri: getURLGambar(itm.products.photos.foto) };
    return (
      <TouchableOpacity
        style={{
          width: dimensi.width,
          paddingVertical: 5,
          alignContent: "flex-start",
          alignItems: "flex-start"
        }}
        onPress={() => {
          this.determineState(item.index);
        }}
      >
        <View
          style={{
            justifyContent: "center",
            marginHorizontal: 3,
            flexDirection: "row"
          }}
        >
          <View
            style={{
              height: 64,
              width: 32,
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center"
            }}
          >
            {this.state.listKeranjang[item.index].checked ? (
              <Feather name="check" size={24} color={warna.alizarin} />
            ) : null}
          </View>
          <View style={{ marginHorizontal: 3, width: 64, height: 64 }}>
            <Image
              source={foto}
              style={{
                flex: 1,
                width: null,
                height: null,
                resizeMode: "cover"
              }}
            />
          </View>
          <View
            style={{ marginHorizontal: 3, flex: 1, justifyContent: "center" }}
          >
            <Text style={{ fontWeight: "500", marginVertical: 1 }}>
              {itm.products.name}
            </Text>
            <Text
              style={{ fontWeight: "300", fontSize: 10, marginVertical: 1 }}
            >
              Warna : {itm.products.colors}
            </Text>
            <Text
              style={{
                fontWeight: "300",
                marginVertical: 1,
                color: warna.alizarin
              }}
            >
              IDR. {formatCurrency(itm.products.price)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  determineState(index: any) {
    var stateCopy = Object.assign({}, this.state);
    stateCopy.listKeranjang = stateCopy.listKeranjang.slice();
    stateCopy.listKeranjang[index] = Object.assign(
      {},
      stateCopy.listKeranjang[index]
    );
    stateCopy.listKeranjang[index].checked = !stateCopy.listKeranjang[index]
      .checked;
    this.setState(stateCopy, this.cekTotalHarga);
  }
  cekTotalHarga() {
    let totalHarga = 0;
    this.state.listKeranjang.map((v, k) => {
      if (v.checked) {
        totalHarga += v.qty * v.products.price;
      }
    });
    this.setState({ totalHarga: totalHarga });
  }

  loadingComponent() {
    return (
      <DarkLoading/>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: "#FFF"
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    backgroundColor: warna.alizarin
  },
  nav: {
    minHeight: 80,
    backgroundColor: warna.alizarin,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 10,
    paddingLeft: 10
  },
  dark: {
    backgroundColor: warna.draculaOrchid
  }
});

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
    setMemberProps: s => dispatch({ type: "SAVE_MEMBER", state: s }),
    updateNotification: st => dispatch({ type: "UPDATE_NOTIFICATION", state: st })
  };
}
export default connect(mapStateToProps, mapDispatchStateToProps)(Keranjang);
