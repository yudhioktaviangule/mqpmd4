import React, { Component, Fragment } from "react";
import { Text, View, SafeAreaView, ActivityIndicator } from "react-native";
import { connect } from "react-redux";
import { home } from "../Stylish";
import { RedNoBackButton } from "../componentsData/Header";
import ViewContent from "../componentsData/Content";
import { TouchableOpacity, FlatList } from "react-native-gesture-handler";
import { Feather } from "../../../../RouterModule";
import { Badge } from "react-native-elements";
import { getNotificate, notifURL, CreateIcon } from './NotificationModel';
import { httpHeader } from '../../../service-function/httpHeader';
import { device, warna } from "../../../constants";
import NavRouteBackFunction from "../../../service-function/NavRouteBackFunction";

const style = home;
class NotifikasiPage extends Component<any> {
  state = {
    notif:{
        approve:0,
        dikirim:0,
        checkout:0,
        dikemas:0,
        belumupload:0,
    },
    isLoading:true,
    listData:[{
        icon:"feather:shopping-cart",
        iconColor:"whitePolos",
        background:"alizarin",
        target:22,
        type:"BelumCheckout",
        text:"lorem ipsum dolor sit amet",
        notifications_id:'fasd',
        targetType:'DetailProduct',
    }],
  };
  header = httpHeader(device,this.props.remember_token);
  handler = {
    navigateNotifications:(target,component)=>{
        const toRouter = component

        let paramPage;
        if(toRouter==="DetailTransaksi"){
            paramPage={id:target}
        }else if(toRouter === "Checkout"){
            paramPage={penjualan_id:target}
        }else if(toRouter==="BuktiTrans"){
            paramPage={transaksi:target}
        }
        const {navigation} = this.props
        const {routeName} = navigation.state
        const navback = NavRouteBackFunction(routeName,paramPage)
        navigation.navigate(toRouter,navback)

    },
    readLastNotifications:(props)=>{
        const {icon,iconColor,targetType,text,background,target}= props;
        let icondatasplit = icon.split(":");
        //console.log('dafuq');
        return(
            <Fragment>
                <View style={[style.fluid,{paddingVertical:8}]}>
                    <TouchableOpacity 
                        onPress={()=>{
                          
                            this.handler.navigateNotifications(target,targetType);
                        }}
                        style={[style.flexRowCenter]}>
                        <CreateIcon
                            icon = {icondatasplit}
                            color={iconColor}
                            bgcolor={background}
                            />
                        <View style={[style.fluid,{flex:1}]}>
                            <Text style={[style.thinText,{flexWrap:'wrap'}]}>
                                {text}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </Fragment>
        )
    },
    createApps: () => {
        
      return (
        <View style={[style.appContainer, style.bgNavRed]}>
          <SafeAreaView style={[style.appContainer, style.bgNavRed]}>
            <RedNoBackButton title="Notifikasi" {...this.props} />
            <ViewContent>
              <this.handler.createBody />
              
            </ViewContent>
          </SafeAreaView>
        </View>
      );
    },
    getNotificationLists:(type)=>{
        const { id } = this.props;
        const url = notifURL({member_id:id,type:type,prefix:"notifications","child":"notif_by_type"});
        getNotificate({url:url,header:this.header,callbackFunc:(response)=>{
            const {result}  = response.data;
            this.setState({listData:result}); 
        }})
    },
    createNotifTop: () => {
      return (
        <Fragment>
          <TouchableOpacity
          onPress={()=>{
              this.handler.getNotificationLists("Checkout");
          }}
            style={[
              style.fluid,
              style.flexRowCenter,
              style.smallContainer,
              style.lineSepa
            ]}
          >
            <Feather name="shopping-cart" />
            <Text style={[style.fluid]}>Belum Checkout</Text>
            {this.state.notif.checkout > 0 ? (
              <Badge status="error" value={this.state.notif.checkout} />
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=>{
                this.handler.getNotificationLists("buktibayar");
            }}          
            style={[
              style.fluid,
              style.flexRowCenter,
              style.lineSepa,
              style.smallContainer
            ]}
          >
            <Feather name="shopping-cart" />
            <Text style={[style.fluid]}>Belum Upload Bukti Transfer</Text>
            {this.state.notif.belumupload > 0 ? (
              <Badge status="error" value={this.state.notif.belumupload} />
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=>{
                this.handler.getNotificationLists("ApproveNotifikasi");
            }}           
            style={[
              style.fluid,
              style.flexRowCenter,
              style.lineSepa,
              style.smallContainer
            ]}
          >
            <Feather name="shopping-cart" />
            <Text style={[style.fluid]}>Pembayaran Pesanan Diverifikasi</Text>
            {this.state.notif.approve > 0 ? (
              <Badge status="error" value={this.state.notif.approve} />
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=>{
                this.handler.getNotificationLists("KemasNotifikasi");
            }}              
            style={[style.fluid,style.lineSepa, style.flexRowCenter, style.smallContainer]}
          >
            <Feather name="shopping-cart" />
            <Text style={[style.fluid]}>Pesanan Dikemas</Text>
            {this.state.notif.dikemas > 0 ? (
              <Badge status="error" value={this.state.notif.dikemas} />
            ) : null}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={()=>{
                this.handler.getNotificationLists("DikirimNotifikasi");
            }}            
            style={[style.fluid, style.flexRowCenter, style.smallContainer]}
          >
            <Feather name="shopping-cart" />
            <Text style={[style.fluid]}>Pesanan Dikirimkan</Text>
            {this.state.notif.dikirim > 0 ? (
              <Badge status="error" value={this.state.notif.dikirim} />
            ) : null}
          </TouchableOpacity>
        </Fragment>
      );
    },
    renderFlatList:()=>{
        return <FlatList
                    data={this.state.listData}
                    renderItem={(item)=>{ //console.log(item.item);
                        return <this.handler.readLastNotifications {...item.item}/>}}
                    keyExtractor={(item,index)=>{
                        return `notifikasi-add-${index}`;
                    }}
                    ItemSeparatorComponent={()=>{return (<View style={[style.line]}></View>)}}
                    contentContainerStyle={{paddingTop:5}}
                    showsVerticalScrollIndicator={false}
                    />
    },
    createBody: () => {
        if(this.state.isLoading){
            return(
            <Fragment>
                <View style={{flex:1,justifyContent:'center',alignItems:'center',alignContent:'center'}}>
                    <ActivityIndicator/>
                </View>
            </Fragment>
            )
        }
      return (
        <Fragment>
          <View style={[style.tinydivider]}></View>
          <View style={[style.lineSepa]}>
            <this.handler.createNotifTop />
          </View>
          <View style={[style.tinydivider]}></View>
          <View style={[style.lineSepa,style.fluid,style.smallContainer,{flex:1}]}>
              <View style={[style.lineSepa,style.flexRowCenter]}>
                <Feather name="bell" style={[{paddingBottom:10}]}/><Text style={[style.fluid,style.titleTextStyle,{paddingBottom:10}]}>Notifikasi Terakhir</Text>
              </View>
              <this.handler.renderFlatList/>
          </View>
        </Fragment>
      );
    },
    callbackFunctionAfterGetCount:(response)=>{
        const { result } = response.data;
        const {approve,dikirim,checkout,dikemas,belumupload} = result;
        this.setState({
            notif:{
                approve:approve,
                dikirim:dikirim,
                checkout:checkout,
                dikemas:dikemas,
                belumupload:belumupload,
            },
        },()=>{
            const id = this.props.id;
            const url =notifURL({"member_id":id,prefix:"notifications",child:'notif_all',type:null})
            getNotificate({url:url,header:this.header,callbackFunc:(response)=>{
                const { result } = response.data;
              //  console.log(result);
                this.setState({listData:result,isLoading:false})
            }})
        })
    },
    initialize: () => {
        const {id} = this.props
        this.setState({isLoading:true},()=>{
            this.props.updateNotification(false)
            const url = notifURL({member_id:id,type:null,prefix:"notifications",child:"notif_by_member"})
            getNotificate({url:url,header:this.header,callbackFunc:(response)=>{this.handler.callbackFunctionAfterGetCount(response)}})
        })
    }
  };
  componentDidMount() {
    const navigation = this.props.navigation;
    const thisRoute = navigation.state.routeName;
    navigation.addListener("willFocus", payload => {
      if (payload.state.routeName == thisRoute) {
        this.setState({ loadComponent: false }, () => {
          this.handler.initialize();
        });
      }
    });
  }
  render() {
    return <this.handler.createApps />;
  }
}

const mapStateToProps = state => {
  return state;
};

const mapDispatchToProps = dispatch =>{return{
    updateNotification:(notificationValue)=>{
        dispatch({ type: "UPDATE_NOTIFICATION", state: notificationValue })
    }
}};

export default connect(mapStateToProps,mapDispatchToProps)(NotifikasiPage);