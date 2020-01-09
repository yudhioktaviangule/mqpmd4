import React, { Component } from "react";
import {
  AsyncStorage,
  Text,
  View,
  StatusBar,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator
} from "react-native";
import { StyleLogin } from "./StyleLogin";
import { warna, device } from "../../constants";
import { getRouterURLArray } from "../../constants/ConstantURLs";
import { sendFreelyHttpPOST } from "../../service-function/httpService";
import { connect } from "react-redux";
import { httpHeader } from "../../service-function";
import { BatasWaktuModel } from "../BatasWaktu";

const styleLogin = StyleLogin;
class Login extends Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      user: "",
      pwd: "",
      isLoading: false
    };
  }

  setLoading(bol: boolean) {
    this.setState({ isLoading: bol });
  }

  render() {
    const { navigation } = this.props;
    const handleNavigationToRegisterPage = () => {
      let params = navigation.getParam("dev_id");
      navigation.navigate("Register", { dev_id: params, oldNav: "Login" });
    };
    const handleLogin = () => {
      let device_id = navigation.getParam("dev_id");
      let paramWeb = {
        email: this.state["user"],
        password: this.state["pwd"],
        dev_id: device_id
      };
      let url = getRouterURLArray("authLogin", "login").completeUrl;
      console.log("paramWEB", paramWeb);
      sendFreelyHttpPOST(
        url,
        paramWeb,
        response => {
          let { data } = response;
          if (data.result.login) {
            const member = data.result;
            const header = httpHeader(device, member.remember_token);
            const batasWaktu = BatasWaktuModel({
              member: member,
              httpHeader: header
            });
            batasWaktu.getBatasWaktuKeranjang(() => {
              batasWaktu.getBatasWaktuTransaksi(() => {
                this.props.setMemberProps(data.result);
                AsyncStorage.setItem(
                  "member",
                  JSON.stringify(response["data"].result)
                );
                navigation.navigate("Tabbed");
              });
            });
          } else {
            console.log(data);
            alert(data.pesan.msg);
          }
        },
        error => {
          console.log(error);
        }
      );
    };
    return (
      <View style={StyleLogin.container}>
        <StatusBar barStyle="light-content" />
        <View
          style={{
            width: "90%",
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 200,

            padding: 15
          }}
        >
          <KeyboardAvoidingView
            behavior="padding"
            style={{
              minHeight: 320,
              width: "90%",
              alignContent: "center",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <View
              style={{
                width: "75%",

                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                marginVertical: 15
              }}
            >
              <Image
                source={require("./../../assets/mqueen.png")}
                style={{
                  width: "90%",
                  marginHorizontal: "auto"
                }}
                resizeMode="contain"
              />
            </View>
            <View
              style={{
                width: "90%",
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center"
              }}
            >
              <View style={styleLogin.textInputContainer}>
                <TextInput
                  style={styleLogin.textInput}
                  placeholder="Email"
                  placeholderTextColor={warna.clouds}
                  onChangeText={text => {
                    this.setState({ user: text });
                  }}
                />
              </View>
              <View style={styleLogin.textInputContainer}>
                <TextInput
                  style={styleLogin.textInput}
                  placeholder="Password"
                  secureTextEntry={true}
                  placeholderTextColor={warna.clouds}
                  onChangeText={text => {
                    this.setState({ pwd: text });
                  }}
                />
              </View>

              <TouchableOpacity
                style={{
                  backgroundColor: warna.alizarin,
                  width: "100%",
                  padding: 20,
                  alignContent: "center",
                  alignItems: "center",
                  justifyContent: "center",
                  marginVertical: 15,
                  borderRadius: 5
                }}
                onPress={() => {
                  handleLogin();
                }}
              >
                <Text
                  style={{
                    color: warna.clouds
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  alignItems: "center",
                  marginVertical: 15,
                  flexDirection: "row"
                }}
              >
                <Text style={{ color: "#FFF" }}>Belum Punya Akun?</Text>
                <TouchableOpacity
                  onPress={e => {
                    handleNavigationToRegisterPage();
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "bold",
                      marginHorizontal: 5
                    }}
                  >
                    Daftar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchStateToProps(dispatch) {
  return {
    setMemberProps: st => dispatch({ type: "SAVE_MEMBER", state: st })
  };
}
export default connect(mapStateToProps, mapDispatchStateToProps)(Login);
