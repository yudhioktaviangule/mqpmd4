import React, { Component } from "react";
import { View,Image } from "react-native";
import { Pulse } from "react-native-loader";
import { home } from "../Stylish";
import { warna } from "../../../constants";
import { getURLGambar } from "../../../constants/ConstantURLs";

const style = home;
const WhiteLoading = (props) => {
  const gambar = getURLGambar("assets/assetwhite.png");

  return (
    <View
      style={[
        style.appContainer,
        {
          backgroundColor: warna.whitePolos,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center"
        }
      ]}
    >
        {props.children}
      <Image style={{ height: 64, width: 64,marginBottom:10 }} source={{ uri: gambar }} />
      <Pulse size={6} color={warna.alizarin} />
    </View>
  );
};

const DarkLoading = (props) => {
  const gambar = getURLGambar("assets/assetblack.png");

  return (
    <View
      style={[
        style.appContainer,
        {
          backgroundColor: warna.draculaOrchid,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center"
        }
      ]}
    >
        {props.children}
      <Image style={{ height: 64, width: 64,marginBottom:10 }} source={{ uri: gambar }} />
      <Pulse size={6} color={warna.whitePolos} />
    </View>
  );
};


export {WhiteLoading,DarkLoading};