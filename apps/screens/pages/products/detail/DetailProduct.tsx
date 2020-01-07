//import liraries
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { MemberDataRedux } from "../../../../../RouterApp";
import { device, warna } from "../../../../constants";
import { connect } from "react-redux";
import { httpHeader } from "../../../../service-function/httpHeader";
import {
  getRouterURLArray,
  getURLGambar
} from "../../../../constants/ConstantURLs";
import { sendHttpGET } from "../../../../service-function/httpService";
import { Bubbles } from "react-native-loader";
import ImageSlideProduct from "./components/ImageSliderProduct";

import { DEVICE_DIMENSION } from "../../../../constants/device";
import { formatCurrency } from "../../../../functions/pipes";
import { Feather } from "../../../../constants/Feather";
import { FontAwesome } from "../../../../constants/FontAwesome";
import { Ionicon } from "../../../../constants/IonIcon";
import NavRouteBackFunction from "../../../../service-function/NavRouteBackFunction";
import { sendHTTPPOST } from "../../../../service-function/httpService";
import { Ant } from "../../../../constants/AntIcon";
import { Image } from "react-native-elements";
import { genView } from "../../../../service-function/generateComponent";
import { home } from "../../Stylish";
import { DarkLoading } from "../../componentsData/LoadingComponent";

interface HttpNeedHeader {
  dev_id: string;
  remember_token: string;
}

const DIMENSI = DEVICE_DIMENSION;
const HEADER_MIN_HEIGHT = 70;
const HEADER_MAX_HEIGHT = DIMENSI.width;

class DetailProduct extends React.Component<any> {
  state = {
    product_id: "0",
    isLoading: true,
    product: {
      id: "",
      name: "",
      price: 0,
      color: "",
      materials: "",
      wight: "",
      stock: "",
      colors: "",
      description: ""
    },
    isLiked: false,
    photos: [],
    city: {
      city_name: "",
      province: ""
    },
    category: {
      icon: "",
      kategori: "",
      id: 0
    },
    scrollY: new Animated.Value(0)
  };

  handler = {
    sendNavigationToChat: responseResult => {
      const res = responseResult;
      const { navigation } = this.props;
      const { product_id } = this.state;
      const { remember_token } = this.props;
      const headers = httpHeader(device, remember_token);
      const URL = `${
        getRouterURLArray("products", "product").completeUrl
      }${product_id}`;
      // console.log("myURL",URL);
      sendHttpGET(
        URL,
        headers,
        response => {
          const { result } = response.data;
          const { product } = result;
          const { foto } = result.photos;
          const loadPhoto = { uri: getURLGambar(foto) };
          const paramViewJSON = {
            link: `DetailProduct|${product.id}`,
            data: {
              photo: loadPhoto,
              captionPrimary: product.name,
              captionSecondary: product.price
            }
          };
          //   console.log('attachment',paramViewJSON);
          navigation.push("DetailChat", {
            admin: res,
            attachment: paramViewJSON
          });
        },
        responseError => {
          alert("something error:\nJaringan tidak menjangkau server");
        }
      );
    },
    getAdminOnline: () => {
      const { remember_token } = this.props;
      let urlcls = getRouterURLArray("chats", "select_admin").completeUrl;
      let headers: any;
      headers = httpHeader(device, remember_token);
      const url = `${urlcls}0`;
      sendHttpGET(url, headers, response => {
        let { data } = response;
        let { result } = data;
        this.handler.sendNavigationToChat(result);
      });
    },
    likeProduk: () => {
      let type = !this.state.isLiked ? "like" : "unlike";
      let product_id = this.state.product_id;
      let headers: HttpNeedHeader = {
        dev_id: device,
        remember_token: this.props.remember_token
      };
      let member_id = this.props.id;
      let url = getRouterURLArray("products", "like_product").completeUrl;
      url = `${url}${member_id}/${product_id}/${type}`;
      sendHttpGET(url, headers, response => {
        this.setState({ isLiked: type == "like" ? true : false });
      });
    }
  };

  navigationBack = () => {
    const { navigation } = this.props;
    //console.log("navigasi",navigation);
    let properti = navigation;
    let navback = properti.getParam("navBack");
    let proper: any;
    let param: any;
    switch (navback) {
      case "AllProduct":
        proper = { categories: properti.getParam("categories") };

        param = NavRouteBackFunction("Home", proper);

        properti.navigate(navback, param);
        break;

      default:
        const { params } = navigation.state;
        let parampampam = params;
        delete parampampam.key;
        delete parampampam.product_id;
        delete parampampam.navBack;
        console.log(parampampam);
        properti.navigate(navback, parampampam);
        break;
    }
  };

  componentDidMount() {
    let { navigation } = this.props;
    let product_id = navigation.getParam("product_id");
    this.setState(
      { product_id: product_id, isLoading: true },
      this.loadDetailProduct
    );
  }
  loadDetailProduct = () => {
    let id = this.state.product_id;
    let headers: HttpNeedHeader = {
      dev_id: device,
      remember_token: this.props.remember_token
    };
    let headHttp = httpHeader(headers.dev_id, headers.remember_token);
    let url = getRouterURLArray("products", "product").completeUrl;
    url = `${url}${id}/${this.props.id}`;
    sendHttpGET(url, headHttp, response => {
      let data = response.data;

      this.handleResponse(data.result);
    });
  };
  handleResponse(data) {
    // console.log(data);
    const { isLiked } = data.product;

    this.setState(
      {
        isLiked: isLiked,
        product: data.product,
        photos: data.photos,
        city: data.city,
        category: data.category
      },
      this.loadComponentPicture
    );
  }

  loadComponentPicture = () => {
    this.setState({ isLoading: false });
  };

  addKeranjangHandler(callbacks) {
    let product_id = this.state.product_id;
    let member_id = this.props.id;
    let auth = this.props.remember_token;
    let keranjangURL = getRouterURLArray("keranjang", "keranjang");
    let completeURL = `${keranjangURL.completeUrl}${member_id}/${product_id}/1`;
    sendHTTPPOST(
      completeURL,
      {},
      httpHeader(device, auth),
      response => {
        callbacks(response);
      },
      err => {
        console.log(`ERROR ON ${completeURL}`, err);
      }
    );
  }

  render() {
    const animationHeader = this.state.scrollY.interpolate({
      inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
      outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
      extrapolate: "clamp"
    });
    return this.state.isLoading == false ? (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <SafeAreaView style={{ position: "relative" }}>
          <View style={styles.listContainer}>
            <View
              style={[
                otStyle.navContainer,
                otStyle.flexRow,
                {
                  backgroundColor: "rgba(0,0,0,0.0)",
                  position: "absolute",
                  top: 0,
                  zIndex: 999
                }
              ]}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: "rgba(0,0,0,0.0)",
                  justifyContent: "center",
                  alignItems: "flex-start"
                }}
              >
                <TouchableOpacity
                  style={{
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    paddingRight: 35
                  }}
                  onPress={() => {
                    this.navigationBack();
                  }}
                >
                  <Feather name="arrow-left" size={20} color={warna.alizarin} />
                </TouchableOpacity>
              </View>
            </View>
            <ScrollView scrollEventThrottle={16} horizontal={false}>
              <View style={styles.innerContainer}>
                <ImageSlideProduct
                  style={{ position: "absolute" }}
                  anihead={animationHeader}
                  photos={this.state.photos}
                />
                <View style={styles.itemPaddingWSpace}>
                  <View
                    style={{
                      flexDirection: "row"
                    }}
                  >
                    <View
                      style={{
                        width: DIMENSI.width * 0.7
                      }}
                    >
                      <Text style={styles.textName}>
                        {this.state.product.name}
                      </Text>
                      <Text style={styles.textPrice}>
                        IDR. {formatCurrency(this.state.product.price)}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        width: DIMENSI.width * 0.3,
                        alignContent: "center",
                        alignItems: "flex-end",
                        justifyContent: "center"
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          padding: 3
                        }}
                        onPress={() => {
                          this.handler.likeProduk();
                        }}
                      >
                        <Ant
                          name={this.state.isLiked ? "heart" : "hearto"}
                          size={24}
                          color={warna.alizarin}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={styles.itemPadding}>
                  <View style={{ marginTop: 10, marginBottom: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                      <FontAwesome name="external-link" size={14} />
                      <View style={{ marginLeft: 5 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700"
                          }}
                        >
                          KATEGORI
                        </Text>

                        <Text
                          style={{
                            marginTop: 5,
                            color: warna.draculaOrchid,
                            fontWeight: "200"
                          }}
                        >
                          {this.state.category.kategori}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={{ marginTop: 10, marginBottom: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                      <FontAwesome name="external-link" size={14} />
                      <View style={{ marginLeft: 5 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700"
                          }}
                        >
                          MATERIAL
                        </Text>

                        <Text
                          style={{
                            marginTop: 5,
                            color: warna.draculaOrchid,
                            fontWeight: "200"
                          }}
                        >
                          {this.state.product.materials}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ marginTop: 10, marginBottom: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                      <Ionicon name="ios-color-palette" size={14} />
                      <View style={{ marginLeft: 5 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700"
                          }}
                        >
                          WARNA
                        </Text>

                        <Text
                          style={{
                            marginTop: 5,
                            color: warna.draculaOrchid,
                            fontWeight: "200"
                          }}
                        >
                          {this.state.product.colors}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ marginTop: 10, marginBottom: 10 }}>
                    <View style={{ flexDirection: "row" }}>
                      <Feather name="maximize" size={14} />
                      <View style={{ marginLeft: 5 }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: "700"
                          }}
                        >
                          DESKRIPSI PRODUK
                        </Text>

                        <Text
                          style={{
                            marginTop: 5,
                            color: warna.draculaOrchid,
                            fontWeight: "200"
                          }}
                        >
                          {this.state.product.description}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            
            </ScrollView>
            <View
                style={{
                  backgroundColor: warna.whiteLynx,
                  justifyContent: "center",
                  height: 60,
                  position:'absolute',
                  bottom:0,
                  flexDirection: "row",
                  width: "100%"
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 60,
                    borderRightColor: warna.clouds,
                    borderRightWidth: 0.3,
                    backgroundColor: warna.blueNight,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center"
                  }}
                  onPress={() => {
                    this.handler.getAdminOnline();
                  }}
                >
                  <Feather name="message-circle" size={18} color={"#FFF"} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.addKeranjangHandler((response) => {
                        const {pesan,result,sendInfo} = response.data;
                      alert(pesan.msg);
                      //this.navigationBack();
                    });
                  }}
                  style={{
                    flex:1,
                    borderRightColor: warna.clouds,
                    borderRightWidth: 0.3,
                    backgroundColor: warna.blueNight,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection:'row',
                  }}
                >
                  <Feather name="shopping-cart" size={18} color={"#FFF"} />
                  <Text style={{color:'white',marginLeft:10,fontSize:12}}>
                        TAMBAH KE KERANJANG
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.addKeranjangHandler(() => {
                      this.props.navigation.navigate("Keranjang");
                    });
                  }}
                  style={{
                    flex: 1,
                    
                    backgroundColor: warna.turquise,
                    justifyContent: "center",
                    alignContent: "center",
                    alignItems: "center",
                    flexDirection:'row',
                  }}
                >
                    <Ant name="Safety" size={18} color={"#FFF"} />
                  <Text style={{ color: "white",marginLeft:10 }}>BELI SEKARANG</Text>
                </TouchableOpacity>
              </View>
            
                       
          </View>
        </SafeAreaView>
      </View>
    ) : (
      <DarkLoading/>
    );
  }
}
//other syu
const otStyle = home;
// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,

    alignItems: "center",
    backgroundColor: warna.whiteLynx
  },
  darkContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: warna.draculaOrchid
  },
  containerHeader: {
    marginLeft: 15
  },
  textHeader: {
    color: warna.alizarin,
    fontSize: 24
  },
  navHeader: {
    height: 80,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0)",
    alignContent: "center",
    justifyContent: "center"
  },
  listContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white"
  },
  innerContainer: {
    flex: 1,
    width: DIMENSI.width,
    paddingBottom:80,
  },
  itemPadding: {
    paddingHorizontal: 10,
    borderBottomColor: warna.e3e3e3,
    borderBottomWidth: 0.5
  },
  itemPaddingDark: {
    paddingHorizontal: 10,
    backgroundColor: warna.pinkGlamour
  },
  itemPaddingWSpace: {
    paddingHorizontal: 10,
    borderBottomColor: warna.e3e3e3,
    borderTopColor: warna.e3e3e3,
    borderTopWidth: 0.5,
    borderBottomWidth: 3
  },
  textName: {
    fontWeight: "300",
    fontSize: 24,
    color: warna.alizarin,
    marginTop: 10,
    marginBottom: 2
  },
  textPrice: {
    fontWeight: "300",
    fontSize: 20,
    color: warna.draculaOrchid,
    marginTop: 2,
    marginBottom: 10
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
    setMemberProps: s => dispatch({ type: "SAVE_MEMBER", state: s })
  };
}
export default connect(mapStateToProps, mapDispatchStateToProps)(DetailProduct);
