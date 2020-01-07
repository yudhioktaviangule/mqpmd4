import React from 'react'
import {Feather,Ant} from "./RouterModule"
import {warna} from "./RouterModule"
import {Provider,store,MemberDataRedux} from "./RouterModule"
import {createAppContainer,createSwitchNavigator,createMaterialBottomTabNavigator,createStackNavigator} from "./RouterModule"

import {
    Login,
    Register,
    Splash,
    Home,
    Keranjang,
    AllProduct,
    DetailProduct,
    CheckoutPage,
    BuktiTransfer,
    TransaksiPage,
    DetailTransaksiPage,
    ListChat,
    DetailChat,
    FinishingTransactions,
    ProfileData,
    UbahDataProfile,
    ByProfileListTransaksi,
    DisukaiPage,
    TerakhirDilihat,
    UploadPhotoProfile
} from './RouterModule'


const HomeStack = createStackNavigator({
  Home:{
    screen:Home
  },
  AllProduct:{screen:AllProduct},
  DetailProduct:{
    screen:DetailProduct,
    
  },  
},
  {
    headerMode:'none',
    navigationOptions:{
      headerVisible:false
    },
  }
)

HomeStack.navigationOptions = ({navigation})=>{
  let tabBarVisible = true;
  let indeks = navigation.state.index 
  if(indeks > 1){
    tabBarVisible = false
  }
  return {tabBarVisible,}
}

const KeranjangStack = createStackNavigator({
  Keranjang:{
    screen:Keranjang,
    navigationOptions:{
      title:"Keranjang"
    }
  },
  
  Checkout:{
    screen:CheckoutPage,
    navigationOptions:{
      title:"Checkout",
    }
  },
  
  
  BuktiTrans:{
    screen:BuktiTransfer,
    navigationOptions:{
      title:"Bukti Transfer",
    }
  },
},{
  headerMode:'none',
  initialRouteName:'Keranjang'
});
const ChatsRoute = createStackNavigator({
  'Chat':{screen:ListChat},
  DetailChat:{screen:DetailChat}

},{
  initialRouteName:"Chat",
  headerMode:'none'})
ChatsRoute.navigationOptions=({navigation})=>{
  let tabBarVisible = true;
 
  if(navigation.state.index>0){
    tabBarVisible = false
  }
  return {tabBarVisible}
}

const ProfileStack = createStackNavigator({
  'ProfileIndex':{screen:ProfileData},
  'UbahDataProfile':{screen:UbahDataProfile},
  'ByProfileListTransaksi':{screen:ByProfileListTransaksi},
  "DisukaiPage":{screen:DisukaiPage},
  "TerakhirDilihat":{screen:TerakhirDilihat},
  "UploadProfile":{screen:UploadPhotoProfile},
},{
  initialRouteName:"ProfileIndex",
  headerMode:'none'
})

const TransaksiStack = createStackNavigator({
  TransaksiDepan:TransaksiPage,
  DetailTransaksi:DetailTransaksiPage,
  'Finishing':FinishingTransactions,
},{
  headerMode:'none',
  initialRouteName:'TransaksiDepan'
})
TransaksiStack.navigationOptions=({navigation})=>{
  let tabBarVisible = true;
  let { routes } = navigation.state;
  let router = routes[navigation.state.index];
  
  const {routeName} = router;
  if(routeName=="Finishing"){
    tabBarVisible = false
  }
  return {tabBarVisible} 
}
KeranjangStack.navigationOptions = ({navigation})=>{
  let tabBarVisible = true;
 
  if(navigation.state.index>0){
    tabBarVisible = false
  }
  return {tabBarVisible}
}

const appTabbedNavigator = createMaterialBottomTabNavigator({
  HomeApp:{
    screen:HomeStack,
    navigationOptions:{
      tabBarOnPress:({navigation})=>{
       // console.log(navigation.state.routeName);
        navigation.navigate("Home");
      },
      tabBarLabel:"Home",
      tabBarIcon:({tintColor})=>(
        <Ant
          name='home'
          color={tintColor}
          size={20}
          style={{fontWeight:'100'}}
        />
      )
    }
  },
  KeranjangTab:{
    screen:KeranjangStack,
    navigationOptions:{
      tabBarOnPress:({navigation})=>{
     //   console.log(navigation.state.routeName);
        navigation.navigate("Keranjang");
      },
      tabBarLabel:"Keranjang",
      tabBarIcon:({tintColor})=>(
        <Feather
          name="shopping-cart"
          color={tintColor}
          size={20}
          style={{fontWeight:'100'}}
        />
      )
    }
  },
  Notifikasi:{
    screen:TransaksiStack,
    navigationOptions:{
      tabBarOnPress:({navigation})=>{
        // console.log(navigation.state.routeName);
         navigation.navigate("TransaksiDepan");
       },
      tabBarLabel:"Pembayaran",
      tabBarIcon:({tintColor})=>(
        <Ant
          name="form"
          color={tintColor}
          size={20}
          style={{fontWeight:'100'}}
        />
      )
    }
  },
  Pesan:{
    screen:ChatsRoute,
    navigationOptions:{
      tabBarLabel:"Pesan",
      tabBarIcon:({tintColor})=>(
        <Feather
          name="message-circle"
          color={tintColor}
          size={20}
          style={{fontWeight:'100'}}
        />
      )
    }
  },
  Akun:{
    screen:ProfileStack,
    navigationOptions:{
      tabBarOnPress:({navigation})=>{
        // console.log(navigation.state.routeName);
         navigation.navigate("ProfileIndex");
       },
      tabBarLabel:"Akunku",
      tabBarIcon:({tintColor})=>(
        <Feather
          name="user"
          color={tintColor}
          size={20}
          style={{fontWeight:'100'}}
        />
      )
    }
  },

},{
  initialRouteName:'HomeApp',
  activeColor:warna.alizarin,
  inactiveColor:warna.draculaOrchid,
  labeled:true,
  barStyle:{backgroundColor:'#fff'},
  navigationOptions: ({ navigation }) => ({
    onTabPress: (scene) => {
     // console.log( scene.route);
    
    },
  }),
  
    
});

const appRouteList = createSwitchNavigator({
    Splash:Splash,
    Login:Login,
    Register:Register,
    Tabbed:appTabbedNavigator,

    
},{
    initialRouteName:"Splash"
});
const Kontener =createAppContainer(appRouteList);

export {MemberDataRedux}
export default class RouterApp extends React.Component<{
  device_id:string
}> {
  state ={
    equ:'',
    
  }
    constructor(props) {
      super(props)

    };
  

     render() {
        
        return (
            <Provider store={store}>
              <Kontener/>
            </Provider>
        )
    }
}
