import React, { PureComponent } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { warna } from "../../../../../constants";
import { Feather } from "../../../../../constants/Feather";
import { Ant } from "../../../../../constants/AntIcon";

export default class ButtonSectionTransaction extends PureComponent<any> {
  render() {
    const { status_transaksi } = this.props.transaksi;
    const { id } = this.props.transaksi;

    return (
      <View style={[styles.container, styles.row]}>
        {status_transaksi != "selesai" ? (
          <TouchableOpacity
            onPress={() => {
              this.props.navigateToChat();
            }}
            style={[styles.container, styles.button, { margin: 1 }]}
          >
            <View
              style={[
                styles.row,
                {
                  flex: 1,
                  padding: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}
            >
              <Feather name="message-circle" color={warna.alizarin} />
              <Text style={{ color: warna.alizarin, marginLeft: 5 }}>
                Hubungi Kami
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {status_transaksi == "checkout" ? (
          <TouchableOpacity
            onPress={() => {
              this.props.navHandler("Checkout", { penjualan_id: id });
            }}
            style={[styles.container, styles.button, { margin: 1 }]}
          >
            <View
              style={[
                styles.row,
                {
                  flex: 1,
                  padding: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}
            >
              <Ant name="paperclip" color={warna.alizarin} />
              <Text style={{ color: warna.alizarin, marginLeft: 5 }}>
                Checkout Sekarang
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {status_transaksi == "buktibayar" ? (
          <TouchableOpacity
            onPress={() => {
              this.props.navHandler("BuktiTrans", { transaksi: { id: id } });
            }}
            style={[styles.container, styles.button, { margin: 1 }]}
          >
            <View
              style={[
                styles.row,
                {
                  flex: 1,
                  padding: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}
            >
              <Ant name="form" color={warna.alizarin} />
              <Text style={{ color: warna.alizarin, marginLeft: 5 }}>
                Upload Bukti Pembayaran
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {status_transaksi == "menunggu verifikasi" ? (
          <TouchableOpacity
            style={[styles.container, styles.button, { margin: 1 }]}
          >
            <View
              style={[
                styles.row,
                {
                  flex: 1,
                  padding: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}
            >
              <Feather name="bell" color={warna.alizarin} />
              <Text style={{ color: warna.alizarin, marginLeft: 5 }}>
                Saya sudah Membayar
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}

        {status_transaksi == "diterima" ? (
          <TouchableOpacity
            onPress={() => {
              this.props.navigateToSelesai();
            }}
            style={[styles.container, styles.button, { margin: 1 }]}
          >
            <View
              style={[
                styles.row,
                {
                  flex: 1,
                  padding: 10,
                  alignItems: "center",
                  justifyContent: "center"
                }
              ]}
            >
              <Feather name="check-circle" color={warna.alizarin} />
              <Text style={{ color: warna.alizarin, marginLeft: 5 }}>
                Selesaikan Pemesanan
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    borderColor: warna.alizarin,
    borderWidth: 1
  },
  container: {
    flex: 1
  },
  row: {
    flexDirection: "row"
  }
});
