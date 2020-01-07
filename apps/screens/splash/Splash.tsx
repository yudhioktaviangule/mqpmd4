import React, { Component } from "react";
import { View, StatusBar, Image } from "react-native";

import { device, warna } from "../../constants";
import { splashxstyle } from "./SplashStyle";
import { Bubbles } from "react-native-loader";
import { getRouterURLArray } from "../../constants/ConstantURLs";
import {
  sendFreelyHttpGET,
  sendFreelyHttpPOST
} from "../../service-function/httpService";

import { connect } from "react-redux";
import { MemberDataRedux } from "../../../RouterApp";
import registerPush from "../../push/notifikasi";
import { notifURL, getNotificate } from "../pages/notifikasi/NotificationModel";
import { httpHeader } from "../../service-function";
import { Pulse } from "../../customComponent/animationLoader";
import { DarkLoading } from "../pages/componentsData/LoadingComponent";
const styles = splashxstyle;
const dvID = device;

class Splash extends Component<any, any> {
  callbackFunctionAfterGetCount = response => {
    const {
      approve,
      dikirim,
      checkout,
      dikemas,
      belumupload
    } = response.data.result;
    const totalNotif = approve + dikirim + checkout + dikemas + belumupload;
    if (totalNotif > 0) {
      this.props.setNotifProps(true);
    } else {
      this.props.setNotifProps(false);
    }
  };
  checkNotifications = (member: MemberDataRedux) => {
    const url = notifURL({
      member_id: member.id,
      prefix: "notifications",
      child: "notif_by_member",
      type: null
    });
    getNotificate({
      url: url,
      header: httpHeader(dvID, member.remember_token),
      callbackFunc: response => {
        this.callbackFunctionAfterGetCount(response);
      }
    });
  };
  componentDidMount() {
    let devurl = getRouterURLArray("device", "cekdvs");
    let url = `${devurl.completeUrl}?id=${dvID}`;

    sendFreelyHttpGET(
      url,
      response => {
        const memberModel: MemberDataRedux = response.data.result.member;

        if (response.data.result.withoutLogin) {
          if (response.data.pesan.code == 200) {
            this.checkNotifications(memberModel);
            // console.log("skipping",response.data);
            this.props.setMemberProps(memberModel);
            registerPush(token => {
              console.log(token);

              let id = memberModel.id;
              const RFSHREDER = getRouterURLArray("expo", "register");
              sendFreelyHttpGET(
                `${RFSHREDER.completeUrl}?id=${id}&token=${token}`,
                response => {
                  this.props.navigation.navigate("Tabbed");
                },
                err => {
                  console.log(err);
                }
              );
            });
          } else {
            setTimeout(() => {
              this.props.navigation.navigate("Login", {
                dev_id: dvID
              });
            }, 3000);
          }
        } else {
          console.log("goto login");
          setTimeout(() => {
            this.props.navigation.navigate("Login", {
              dev_id: dvID
            });
          }, 3000);
        }
      },
      () => {
        alert("Tidak dapat menjangkau Server");
      }
    );
  }

  render() {
    
    return (
      <DarkLoading>
        <StatusBar
          barStyle="light-content"/>
      </DarkLoading>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchStateToProps(dispatch) {
  return {
    setMemberProps: st => dispatch({ type: "SAVE_MEMBER", state: st }),
    setNotifProps: st => dispatch({ type: "UPDATE_NOTIFICATION", state: st })
  };
}
export default connect(mapStateToProps, mapDispatchStateToProps)(Splash);
