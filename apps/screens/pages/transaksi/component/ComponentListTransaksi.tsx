//import liraries
import React, { Component } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { DEVICE_DIMENSION } from "../../../../constants/device";
import { warna } from "../../../../constants";
import {
  getStatusPembelian,
  getCaptionStatusTransaksi
} from "../../../../models/Trans";
import { Ant } from "../../../../constants/AntIcon";
import { Feather } from "../../../../constants/Feather";
const DIMENSI_WIDTH = DEVICE_DIMENSION.width;
const DIMENSI_HEIGHT = DEVICE_DIMENSION.height;
function getIconStatusTransaksi(status) {
  switch (status.status_transaksi) {
    case "checkout":
      return <Ant name="paperclip" color={warna.alizarin} />;
    case "pilihbank":
      return <Ant size={18} name="paperclip" color={warna.alizarin} />;
    case "buktibayar":
      return <Ant size={18} name="camerao" color={warna.alizarin} />;
    case "menunggu verifikasi":
      return <Ant size={18} name="clockcircleo" color={warna.orange} />;
    case "telah diverifikasi":
      return <Feather size={18} name="check-square" color={warna.orange} />;
    case "pengemasan":
      return <Feather size={18} name="package" color={warna.orange} />;
    case "pengiriman":
      return <Feather size={18} name="truck" color={warna.belizeHole} />;
    case "diterima":
      return <Feather size={18} name="clipboard" color={warna.belizeHole} />;
    case "selesai":
      return <Feather size={18} name="check-circle" color={warna.belizeHole} />;
  }
}

class ComponentListTransaksi extends Component<any> {
  state = {
    isLoading: false,
    headerHttp: {},
    member_id: "0",
    transactions: []
  };
  handlers = {
    renderFlatList: (item, index) => {
      let statbeli = item.status_transaksi;
      let icon = getIconStatusTransaksi({ status_transaksi: statbeli });
      return (
        <TouchableWithoutFeedback
          onPress={() => {
            this.props.handlerClickItem(item.id);
          }}
          style={{
            marginVertical: 2,
            borderRadius: 5,
            borderColor: warna.e3e3e3,
            borderWidth: 0.7,
            flexDirection: "row",
            paddingVertical: 15,
            backgroundColor: index % 2 == 0 ? "white" : warna.whiteTurqoa
          }}
        >
          <View
            style={{
              padding: 5,
              width: 48,
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            {icon}
          </View>
          <View
            style={{
              padding: 5,
              flex: 1
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                textTransform: "capitalize"
              }}
            >
              {getCaptionStatusTransaksi({ status_transaksi: statbeli })}
            </Text>
            <Text style={{ fontWeight: "100", paddingVertical: 5 }}>
              Pesanan dengan No{" "}
              <Text style={{ color: warna.alizarin }}>{item.invoice}</Text>{" "}
              {getStatusPembelian({ status_transaksi: statbeli })}.
            </Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }
  };
  componentDidMount() {}
  render() {
    //console.log(this.props.data)
    return (
      <FlatList
        data={this.props.data}
        renderItem={item => {
          //console.log(item.item);
          return this.handlers.renderFlatList(item.item, item.index);
        }}
        keyExtractor={index => {
          return index.toString();
        }}
      />
    );
  }
}

// define your styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF"
  }
});

//make this component available to the app
export default ComponentListTransaksi;
