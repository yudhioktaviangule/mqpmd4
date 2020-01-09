import React, { Component, Fragment } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { home as hm, NAV_HEIGHT, DIMENSI_WIDTH, StyleSheet } from "../Stylish";
import { Feather } from "@expo/vector-icons";
import { warna } from "../../../constants";
import Svg, { Path } from "react-native-svg";

const home = hm;
const height = NAV_HEIGHT/2;
const width = DIMENSI_WIDTH;
const RedBackButton = props => {
  return (
    <View
      style={[
        home.smallContainer,
        home.flexRow,
        { padding: 10, justifyContent: "center" },
        home.lineSepa
      ]}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          alignContent: "center"
        }}
      >
        <TouchableOpacity
          onPress={() => {
            const { navigation } = props;
            const { params } = navigation.state;
            if (props.navBackto !== undefined) {
              props.navBackto();
            } else {
              if (params !== undefined) {
                if (params.navBack == undefined) {
                  navigation.goBack();
                } else {
                  let param = params;
                  delete param.key;
                  delete param.id;
                  navigation.navigate(params.navBack, param);
                }
              } else {
                navigation.goBack();
              }
            }
          }}
        >
          <View>
            <Feather name="arrow-left" size={20} color={warna.whitePolos} />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <Text
          style={[
            home.navTextStyle,
            { alignContent: "center", color: "white" }
          ]}
        >
          {props.title}
        </Text>
      </View>
      <View style={{ flex: 1 }}></View>
    </View>
  );
};
const RedNoBackButton = props => {
  return (
    <View
      style={[
        home.smallContainer,
        home.flexRow,
        { padding: 10, justifyContent: "center" },
        home.lineSepa
      ]}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <Text
          style={[
            home.navTextStyle,
            { alignContent: "center", color: "white" }
          ]}
        >
          {props.title}
        </Text>
      </View>
    </View>
 
 );
};
const whiteBackButton = props => {
  return (
    <View
      style={[
        home.smallContainer,
        home.flexRow,
        { padding: 10, justifyContent: "center" },
        home.lineSepa
      ]}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          alignContent: "center"
        }}
      >
        <TouchableOpacity
          onPress={() => {
            const { navigation } = props;
            const { params } = navigation.state;
            if (props.navBackto !== undefined) {
              props.navBackto();
            } else {
              if (params !== undefined) {
                if (params.navBack == undefined) {
                  navigation.goBack();
                } else {
                  let param = params;
                  delete param.key;
                  delete param.id;
                  navigation.navigate(params.navBack, param);
                }
              } else {
                navigation.goBack();
              }
            }
          }}
        >
          <View>
            <Feather name="arrow-left" size={20} color={warna.alizarin} />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <Text
          style={[
            home.navTextStyle,
            { alignContent: "center", color: warna.alizarin }
          ]}
        >
          {props.title}
        </Text>
      </View>
      <View style={{ flex: 1 }}></View>
    </View>
  );
};
const whiteNoBackButton = props => {
  return (
    <View
      style={[
        home.smallContainer,
        home.flexRow,
        { padding: 10, justifyContent: "center" },
        home.lineSepa
      ]}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center"
        }}
      >
        <Text
          style={[
            home.navTextStyle,
            { alignContent: "center", color: warna.alizarin }
          ]}
        >
          {props.title}
        </Text>
      </View>
    </View>
  );
};
const RedCurvedHeader = props => {

  return (
    <Fragment>
   <View
      style={[
        home.smallContainer,
        home.flexRow,
        { padding: 10, justifyContent: "center" },
        
      ]}
    >

      <View
        style={{
          width: "90%",
          justifyContent: "flex-end",
          alignItems: "flex-start",
          alignContent: "center"
        }}
      >
        <Text
          style={[
            home.navTextStyle,
            { alignContent: "center", color: "white" }
          ]}
        >
          {props.title}
        </Text>
      </View>
    </View>
       
    </Fragment>
  );
};
const CurvedSvg = (props)=>{
  const curve_d = `M 0 0 q ${width/2} 30 ${width} 0 z`;
  const vboxProps = `0 0 ${width} ${height}`;
  return (
    <Fragment>
      <View style={[StyleSheet.absoluteFill,{top:props.top,zIndex:0}]}>
        <Svg width={width} height={height} viewBox={vboxProps}>
          <Path
            d={curve_d}
            fill={props.fill}
            />
        </Svg>
      </View>

    </Fragment>
  );
}
export {
  CurvedSvg,
  RedCurvedHeader,
  RedBackButton,
  RedNoBackButton,
  whiteBackButton as WhiteBackButton,
  whiteNoBackButton as WhiteNoBackButton
};
