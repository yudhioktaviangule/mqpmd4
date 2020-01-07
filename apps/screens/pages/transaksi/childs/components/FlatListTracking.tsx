//import liraries
import React, { Component, Fragment } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { warna } from "../../../../../constants";
import { getRouterURLArray } from "../../../../../constants/ConstantURLs";
import { sendHttpGET } from "../../../../../service-function/httpService";
import { FontAwesome } from "../../../../../constants/FontAwesome";
import { getManifestsIDN } from "../../../../../service-function/ManifestoModels";
import { Feather } from "../../../../../constants/Feather";
import { home } from "../../../Stylish";

const styles = StyleSheet.create({
  topModal: { padding: 20, flexDirection: "row" },
  topModalCol: { flexDirection: "column" },
  container: {
    flex: 1
  }
});
const hm = home;
// create a component
class FlatListTracking extends Component<any> {
  state = {
    isModalVisible: false,
    indexClicked: 0,
    item: [
      {
        color: "#FFF",
        isSelected: false,
        tcolor: warna.alizarin
      }
    ],
    selectedWaybill: false,
    waiting: false,
    manifests: [],
    waybill: {
      name: "",
      waybill: ""
    },
    manifesto: []
  };
  handler = {
    renderItemWaybill: (item, index) => {
      let name_icon = index == 0 ? "circle" : "circle-o";
      return (
        <View style={{ flex: 1, padding: 10, flexDirection: "row" }}>
          <View
            style={{
              width: 32,
              justifyContent: "center"
            }}
          >
            <FontAwesome name={name_icon} size={14} color={warna.alizarin} />
          </View>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <Text style={{ color: warna.alizarin, fontWeight: "200" }}>
              {item.manifest_description}
            </Text>
            <Text style={{ color: warna.draculaOrchid, fontWeight: "200" }}>
              {item.manifest_date} {item.manifest_time}
            </Text>
          </View>
        </View>
      );
    },
    renderFlatPengiriman: () => {
      return (
        <View style={{ flex: 1, backgroundColor: warna.alizarin, padding: 10 }}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "white",
              borderRadius: 5,
              paddingVertical: 10,
              margin: 10
            }}
          >
            <View style={{ flex: 1, paddingLeft: 10 }}>
              <Text
                style={{
                  color: warna.alizarin,
                  fontSize: 18,
                  fontWeight: "500"
                }}
              >
                {this.state.waybill.name}
              </Text>
              <Text style={{ fontWeight: "100", fontSize: 15 }}>
                {this.state.waybill.waybill}
              </Text>
            </View>
            <View style={{ flex: 1, paddingRight: 10, alignItems: "flex-end" }}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({ selectedWaybill: false });
                }}
            
                style={{ padding: 10, backgroundColor: warna.alizarin }}
              >
                <Text style={{ color: "white" }}>Switch</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: "white",
              borderRadius: 5,
              paddingVertical: 10,
              margin: 10
            }}
          >
            <FlatList
              data={this.state.manifests}
              renderItem={item => {
                return this.handler.renderItemWaybill(item.item, item.index);
              }}
            />
          </View>
        </View>
      );
    },
    getPengiriman: (item: any) => {
      let subURL = "tracking";
      let prefix = "rajaongkir";
      let url = `${getRouterURLArray(prefix, subURL).completeUrl}${
        item.no_resi_pengiriman
      }`;
      sendHttpGET(url, this.props.header, response => {
        let result = response.data.result;
        let items = [];
        result.manifest.reverse().map(V => {
          items.push(V);
        });
        this.setState(
          {
            waybill: {
              name: item.products.name,
              waybill: item.no_resi_pengiriman
            },
            selectedWaybill: true,
            manifests: getManifestsIDN(items),
            waiting: false
          },
          () => {
            let { manifests } = this.state;
            // console.log(manifests,"manifests");
          }
        );
      });
    },
    renderItem: (item, index) => {
      return this.handler.renderItemWaybill(item, index);
    },
    setModalVisibility: (vis: boolean) => {
      this.setState({ isModalVisible: vis });
    }
  };
  componentDidMount() {
    let item = [];
    this.setState({ manifesto: this.props.manifesto });
  }
  render() {
    const { resi_jne } = this.props.trans;
    //console.log('this.props.data',this.props.data);
    return (
      <View
        style={{
          flex: 1,
          paddingRight: 10,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Modal visible={this.state.isModalVisible} animationType="slide">
          <SafeAreaView style={[hm.appContainer]}>
            <View
              style={[
                hm.navContainer,
                hm.fluidMore,
                hm.lineSepa,
                hm.flexRowCenter,
                { justifyContent: "space-between" }
              ]}
            >
              <Text style={[hm.titleTextStyle,hm.textRed]}>Tracking Pesanan</Text>
              <TouchableOpacity
                onPress={() => {
                  this.handler.setModalVisibility(false);
                }}
                style={{
                  paddingLeft: 45,
                  paddingVertical:10,
                }}
              >
                <Feather
                    name="x-circle"
                    size={20}
                    color={warna.alizarin}
                    />
              </TouchableOpacity>
            </View>
            <View style={[hm.contentContainer]}>
              
              {!this.state.waiting ? (
                !this.state.selectedWaybill ? (
                  <Fragment>
                    <View style={[hm.tinydivider]}></View>
                    <View style={[hm.smallContainer,hm.fluidMore,hm.lineSepa]}>
                      <Text style={hm.thinText}>
                        No. Resi JNE :{" "}
                        <Text style={{ color: warna.alizarin }}>
                          {resi_jne}
                        </Text>
                      </Text>
                    </View>
                    
                    <View style={[hm.smallContainer,hm.fluidMore,{flex:1}]}>
                      {<FlatList
                        data={this.state.manifesto}
                        renderItem={item => {
                          return this.handler.renderItemWaybill(
                            item.item,
                            item.index
                          );
                        }}
                        
                        keyExtractor={index => {
                          return index.toString();
                        }}
                      />}
                    </View>
                  </Fragment>
                ) : (
                  this.handler.renderFlatPengiriman()
                )
              ) : (
                <ActivityIndicator style={{ alignSelf: "center" }} />
              )}
            </View>
            
          </SafeAreaView>
        </Modal>
        <View style={{ flex: 1 }}>
          <Text>Status Pengiriman</Text>
          <Text style={{ fontWeight: "100", color: warna.alizarin }}>
            {resi_jne}
          </Text>
          <Text style={{ fontWeight: "100" }}>
            {this.props.manifesto[0].manifest_description.toUpperCase()}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => {
            this.handler.setModalVisibility(true);
          }}
          style={{
            alignSelf: "flex-end",
            backgroundColor: warna.alizarin,
            padding: 10,
            borderRadius: 5
          }}
        >
          <Text
            style={{
              color: warna.whitePolos,
              fontWeight: "500",
              alignSelf: "flex-end"
            }}
          >
            CEK
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// define your styles

//make this component available to the app
export default FlatListTracking;
