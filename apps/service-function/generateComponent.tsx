import React, {Component} from 'react';
import { Image, Text, View,StyleSheet } from 'react-native';
var componentData:any;

const createComponentChild=(child,depth,childrenComponent?:any)=>{
    console.log("kedalaman",depth);
    let { componentType } = child;
    const { style } =child;
    const stylish = StyleSheet.create({
        style:style
    })
    let childrens = childrenComponent==undefined?null:childrenComponent;
    
    switch (componentType) {
        case "Image":
            childrens = React.createElement(Image,{style:stylish.style,source:child.source});
        case "Text":
            childrens = React.createElement(Text,{style:stylish.style},child.childs);
            break;
        case "View":
            if(child.childs!=undefined){
                let chld = child.childs;
                childrens = React.createElement(View,{style:stylish.style})
                childrens.childrens = chld.map(e=>{
                    return createComponentChild(chld,depth+1,childrens)
                })
            }
            break;
            
    }
    
    return childrens;
}

const generateView=(json:any)=>{
    const { style } =json;
    const stylish = StyleSheet.create({
        style:style
    })
    componentData = React.createElement(View,{style:stylish.style});
    componentData.children = json.childs.map(child=>{
        return createComponentChild(child,1);
    })
}
export const genView = (data)=>{
    generateView(data);
   // console.log(componentData);
    return componentData;
}