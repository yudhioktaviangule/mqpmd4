import React, { Component } from "react";
import  { View,Text }  from "react-native";
import { home } from "../Stylish";


const style = home;


const ViewContent=(props)=>{
    return(
        <View style={[style.bgContent,style.contentContainer]}>
            {props.children}
        </View>
    );
}
export default ViewContent;