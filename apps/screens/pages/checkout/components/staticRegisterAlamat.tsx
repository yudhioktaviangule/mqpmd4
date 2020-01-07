import React, { Component, useState, Fragment } from "react";
import { Text, View, TextInput } from "react-native";
import { home } from "../../Stylish";
import { Feather } from "@expo/vector-icons";
import { Ant, warna } from "../../../../../RouterModule";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import { httpHeader } from "../../../../service-function";
import { device } from "../../../../constants";
import { getRouterURLArray } from "../../../../constants/ConstantURLs";
import {
  sendFreelyHttpGET,
  sendHttpGET
} from "../../../../service-function/httpService";

const style = home;

class RegisCompAlamat extends Component<any> {
  state = {
    listData: [],
    province_id: 0,
    province_Text: "Pilih Kota",
    city_text: "",
    city_id: 0,
    isPilih: false,
    alamat: "",
    telepon:'',
  };
  header = httpHeader(device, this.props.remember_token);
  handler = {
    getCities: prov_id => {
      const { completeUrl } = getRouterURLArray("members", "get_kota");
      const url = `${completeUrl}${prov_id}`;
      sendHttpGET(url, this.header, response => {
        const { result } = response.data;
        this.setState({ listData: result });
      });
    },
    validasi:()=>{
        if(this.state.city_id===0||this.state.alamat===''||this.state.telepon===''){
            return false
        }else{
            return true
        }
    },
    getProv: () => {
      let url = getRouterURLArray("members", "get_province").completeUrl;
      sendHttpGET(
        url,
        this.header,
        response => {
          this.setState({ listData: response.data.result });
        },
        error => {
          console.log("err", error);
        }
      );
    },
    renderFlat: props => {
      const { item } = props;
      if (item.isCity) {
        return (
          <TouchableOpacity
            onPress={() => {
              this.setState(
                {
                  province_Text:
                  `${item.city_name}, ${this.state.province_Text}`,
                  city_text: item.type + " " + item.city_name,
                  city_id: item.city_id,
                  isPilih: false,
                  listData: []
                },
                () => {
                  this.handler.getProv();
                }
              );
            }}
            style={[style.padding, style.lineSepa]}
          >
            <Text style={[style.titleTextStyle, { paddingVertical: 10 }]}>
              {item.type} {item.city_name}
            </Text>
            <Text style={[style.thinText]}>Tap Untuk Memilih</Text>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            onPress={() => {
              this.setState(
                {
                  province_Text: item.province,
                  province_id: item.province_id,
                  listData: []
                },
                () => {
                  this.handler.getCities(item.province_id);
                }
              );
            }}
            style={[style.padding, style.lineSepa]}
          >
            <Text style={[style.titleTextStyle, { paddingVertical: 10 }]}>
              {item.province}
            </Text>
            <Text style={[style.thinText]}>Tap Untuk Memilih</Text>
          </TouchableOpacity>
        );
      }
    },
    contentData: () => {
      if (this.state.isPilih) {
        return (
          <FlatList
            refreshing={true}
            extraData={this.state}
            data={this.state.listData}
            renderItem={item => <this.handler.renderFlat {...item} />}
            keyExtractor={index => {
              return index;
            }}
          />
        );
      } else {
        return (
          <Fragment>
            <View style={[style.flexRowCenter, style.smallContainer]}>
              <Feather name="map-pin" size={14} />

              <TextInput
                style={[style.inputBoxStyle, style.lineSepa, { flex: 1 }]}
                placeholder="Masukkan Alamat"
                onChangeText={(text)=>{
                    this.setState({alamat:text})
                }}
              />
            </View>
            <View style={[style.flexRowCenter, style.smallContainer]}>
              <Feather name="map-pin" size={14} />
              <TouchableOpacity
                onPress={() => {
                  this.setState({ isPilih: true });
                }}
                style={[style.inputBoxStyle, style.lineSepa, { flex: 1 }]}
              >
                <Text>{this.state.province_Text}</Text>
              </TouchableOpacity>
            </View>

            <View style={[style.flexRowCenter, style.smallContainer]}>
              <Ant name="contacts" size={14} />
              <Text style={{paddingHorizontal:10}}>+62</Text>
              <TextInput
                style={[style.inputBoxStyle, style.lineSepa, { flex: 1 }]}
                placeholder="Masukkan Telepon"
                keyboardType="phone-pad"
                onChangeText={(text)=>{
                    this.setState({telepon:"0"+text})
                }}
              />
            </View>
            <TouchableOpacity
              style={{
                alignItems: "center",
                paddingVertical: 10,
                borderWidth: 1,
                borderColor: warna.alizarin,
                borderRadius: 5
              }}
              onPress={()=>{
                  if(this.handler.validasi()){
                    this.props.clickHandler({city_id:this.state.city_id,alamat:this.state.alamat,telepon:this.state.telepon})
                  }else{
                      alert("Silahkan Lengkapi data sebelum melakukan Checkout")
                  }
              }}
            >
              <Text style={[style.textRed, { textTransform: "capitalize" }]}>
                Register Alamat
              </Text>
            </TouchableOpacity>
          </Fragment>
        );
      }
    }
  };
  componentDidMount() {
    this.handler.getProv();
  }
  render() {
    return (
      <View style={[style.smallContainer, ]}>
        <View style={[style.smallContainer,style.lineSepa,{ paddingHorizontal: 10 }]}>
          <Text style={[style.titleTextStyle]}>Register Alamat Pengiriman</Text>
        </View>
        <View style={[style.smallContainer,style.lineSepa,{ paddingHorizontal: 10 }]}>
          <this.handler.contentData  />

        </View>
      </View>
    );
  }
}

export default RegisCompAlamat;
