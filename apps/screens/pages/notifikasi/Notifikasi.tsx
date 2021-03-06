import React, { Component, Fragment } from "react";
import { Text, View, SafeAreaView } from "react-native";
import { connect } from "react-redux";
import { home, StyleSheet } from "../Stylish";
import { RedCurvedHeader, CurvedSvg } from "../componentsData/Header";
import ViewContent from "../componentsData/Content";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";

import { Badge } from "react-native-elements";
import { getNotificate, notifURL, CreateIcon, TheBadge } from "./NotificationModel";
import { httpHeader } from "../../../service-function/httpHeader";
import { device, warna } from "../../../constants";
import NavRouteBackFunction from "../../../service-function/NavRouteBackFunction";
import { WhiteLoading } from "../componentsData/LoadingComponent";
import FormatWaktu from '../../../service-function/formatWaktu';

const style = home;
class NotifikasiPage extends Component<any> {
  state = {
    notif: {
      approve: 0,
      dikirim: 0,
      checkout: 0,
      dikemas: 0,
      belumupload: 0
    },
    isLoading: true,
    listData: [
      {
        icon: "feather:shopping-cart",
        iconColor: "whitePolos",
        background: "alizarin",
        target: 22,
        type: "BelumCheckout",
        text: "lorem ipsum dolor sit amet",
        notifications_id: "fasd",
        targetType: "DetailProduct"
      }
    ]
  };
  header = httpHeader(device, this.props.remember_token);
  handler = {
    navigateNotifications: (target, component) => {
      const toRouter = component;

      let paramPage;
      if (toRouter === "DetailTransaksi") {
        paramPage = { id: target };
      } else if (toRouter === "Checkout") {
        paramPage = { penjualan_id: target };
      } else if (toRouter === "BuktiTrans") {
        paramPage = { transaksi: target };
      }
      const { navigation } = this.props;
      const { routeName } = navigation.state;
      const navback = NavRouteBackFunction(routeName, paramPage);
      navigation.navigate(toRouter, navback);
    },
    getBadge: props => {
      return (
        <Fragment>
          {TheBadge(props.notif_time)}
        </Fragment>
      )
    },
    readLastNotifications: props => {
      const { notif_time,icon, iconColor, targetType, text, background, target } = props;
      let icondatasplit = icon.split(":");
      
      
      return (
        <Fragment>
          <View style={[style.fluid, { borderRadius:5, paddingVertical: 16,backgroundColor:'white',marginVertical:5, }]}>
            <TouchableOpacity
              onPress={() => {
                this.handler.navigateNotifications(target, targetType);
              }}
              style={[style.flexRowCenter]}
            >
              <CreateIcon
                icon={icondatasplit}
                color={iconColor}
                bgcolor={background}
              />
              <View style={[{ flex: 1,paddingHorizontal:15 }]}>
                <Text style={[style.thinText, { flexWrap: "wrap" }]}>
                  {text}
                </Text>
                <this.handler.getBadge notif_time={notif_time}/>
              </View>
              <View style={{width:'20%'}}>
                
              </View>
            </TouchableOpacity>
          </View>
        </Fragment>
      );
    },
    createApps: () => {
      if (this.state.isLoading) {
        return (
          <Fragment>
            <WhiteLoading/>
          </Fragment>
        );
      }
      return (
        <View style={[style.appContainer, style.bgNavRed]}>
          <SafeAreaView style={[style.appContainer, style.bgNavRed]}>
            <RedCurvedHeader title="Notifikasi" {...this.props} />
            <ViewContent>
              <this.handler.createBody />
            </ViewContent>
          </SafeAreaView>
        </View>
      );
    },
    getNotificationLists: type => {
      const { id } = this.props;
      const url = notifURL({
        member_id: id,
        type: type,
        prefix: "notifications",
        child: "notif_by_type"
      });
      getNotificate({
        url: url,
        header: this.header,
        callbackFunc: response => {
          const { result } = response.data;
          this.setState({ listData: result });
        }
      });
    },
    createNotifTop: () => {
      return (
        <View
          style={[
            style.smallContainer,
            style.padding,
            style.flexRow,
            {
              borderRadius: 5,
              backgroundColor: "white",
              shadowColor: "#000",
              shadowOffset: {
                width: 5,
                height: 5
              },
              shadowRadius: 5,
              shadowOpacity: 0.05
            }
          ]}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              borderColor: "white",
              borderStyle: "solid",
              borderWidth: 1,
              borderRightColor: warna.e3e3e3,
              paddingHorizontal: 5,
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.handler.getNotificationLists("ApproveNotifikasi");
              }}
              style={{ paddingHorizontal: 2 }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={[style.thinText, { fontSize: 24 }]}>
                  {this.state.notif.approve}
                </Text>
                <Text
                  style={[style.thinText, { fontSize: 12, marginVertical: 4 }]}
                >
                  Verifikasi
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              borderColor: "white",
              borderStyle: "solid",
              borderWidth: 1,
              borderRightColor: warna.e3e3e3,
              paddingHorizontal: 5,
              alignItems: "center"
            }}
          >
            <TouchableOpacity
              onPress={() => {
                this.handler.getNotificationLists("KemasNotifikasi");
              }}
              style={{ paddingHorizontal: 2 }}
            >
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={[style.thinText, { fontSize: 24 }]}>
                  {this.state.notif.dikemas}
                </Text>
                <Text
                  style={[style.thinText, { fontSize: 12, marginVertical: 4 }]}
                >
                  Pengemasan
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",

              paddingHorizontal: 5,
              alignItems: "center"
            }}
          >
            <TouchableOpacity 
                          onPress={()=>{
                            this.handler.getNotificationLists("DikirimNotifikasi");
                        }}   
              style={{ paddingHorizontal: 2 }}>
              <View
                style={{
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <Text style={[style.thinText, { fontSize: 24 }]}>
                  {this.state.notif.dikirim}
                </Text>
                <Text
                  style={[style.thinText, { fontSize: 12, marginVertical: 4 }]}
                >
                  Pengiriman
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    },
    renderFlatList: () => {
      return (
        <FlatList
          data={this.state.listData}
          renderItem={item => {
            //console.log(item.item);
            return <this.handler.readLastNotifications {...item.item} />;
          }}
          keyExtractor={(item, index) => {
            return `notifikasi-add-${index}`;
          }}
       
          contentContainerStyle={{ paddingTop: 5 }}
          showsVerticalScrollIndicator={false}
        />
      );
    },
    createBody: () => {
      return (
        <Fragment>
          <View
            style={[{ backgroundColor: warna.alizarin, height: 40 }]}
          ></View>
          <CurvedSvg fill={warna.alizarin} top={40} />
          <View
            style={[
              StyleSheet.absoluteFillObject,
              {
                width: "90%",
                left: "5%",
                paddingHorizontal: 10
              }
            ]}
          >
            <this.handler.createNotifTop/>
            <this.handler.renderFlatList/>
          </View>
        </Fragment>
      );
     
    },
    callbackFunctionAfterGetCount: response => {
      const { result } = response.data;
      const { approve, dikirim, checkout, dikemas, belumupload } = result;
      this.setState(
        {
          notif: {
            approve: approve,
            dikirim: dikirim,
            checkout: checkout,
            dikemas: dikemas,
            belumupload: belumupload
          }
        },
        () => {
          const id = this.props.id;
          const url = notifURL({
            member_id: id,
            prefix: "notifications",
            child: "notif_all",
            type: null
          });
          getNotificate({
            url: url,
            header: this.header,
            callbackFunc: response => {
              const { result } = response.data;
              //  console.log(result);
              this.setState({ listData: result, isLoading: false });
            }
          });
        }
      );
    },
    initialize: () => {
      const { id } = this.props;
      this.setState({ isLoading: true }, () => {
        this.props.updateNotification(false);
        const url = notifURL({
          member_id: id,
          type: null,
          prefix: "notifications",
          child: "notif_by_member"
        });
        getNotificate({
          url: url,
          header: this.header,
          callbackFunc: response => {
            this.handler.callbackFunctionAfterGetCount(response);
          }
        });
      });
    }
  };
  componentDidMount() {
    const navigation = this.props.navigation;
    const thisRoute = navigation.state.routeName;
    navigation.addListener("willFocus", payload => {
      if (payload.state.routeName == thisRoute) {
        this.setState({ loadComponent: false }, () => {
          this.handler.initialize();
        });
      }
    });
  }
  render() {
    return <this.handler.createApps />;
  }
}

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch => {
  return {
    updateNotification: notificationValue => {
      dispatch({ type: "UPDATE_NOTIFICATION", state: notificationValue });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotifikasiPage);
