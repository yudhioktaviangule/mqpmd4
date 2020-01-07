import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { home as hm } from "../Stylish";
import { Feather } from "@expo/vector-icons";
import { warna } from "../../../constants";

const home = hm;
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
            if(props.navBackto!==undefined){
              
              props.navBackto();
            }else{

              if(params!==undefined){
                  if (params.navBack == undefined) {
                    navigation.goBack();
                  } else {
                    let param = params;
                    delete param.key;
                    delete param.id;
                    navigation.navigate(params.navBack, param);
                  }
  
              }else{
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
const RedNoBackButton = (props) => {
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
            if(props.navBackto!==undefined){
              
              props.navBackto();
            }else{

              if(params!==undefined){
                  if (params.navBack == undefined) {
                    navigation.goBack();
                  } else {
                    let param = params;
                    delete param.key;
                    delete param.id;
                    navigation.navigate(params.navBack, param);
                  }
  
              }else{
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
const whiteNoBackButton = (props) => {
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

export {RedBackButton,RedNoBackButton,whiteBackButton as WhiteBackButton,whiteNoBackButton as WhiteNoBackButton}
