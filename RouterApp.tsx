import React from "react";
import { Feather, Ant, PointMember } from "./RouterModule";
import { warna } from "./RouterModule";
import { withBadge, Icon } from "react-native-elements";
import { MemberDataRedux } from "./RouterModule";
import {
  createAppContainer,
  createSwitchNavigator,
  createStackNavigator,
  createBottomTabNavigator
} from "./RouterModule";

import { connect } from 'react-redux';
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
  NotifikasiPage,
  UploadPhotoProfile
} from "./RouterModule";


const HomeStack = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    AllProduct: { screen: AllProduct },
    DetailProduct: {
      screen: DetailProduct
    }
  },
  {
    headerMode: "none",
    navigationOptions: {
      headerVisible: false
    }
  }
);

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let indeks = navigation.state.index;
  if (indeks > 1) {
    tabBarVisible = false;
  }
  return { tabBarVisible };
};

const KeranjangStack = createStackNavigator(
  {
    Keranjang: {
      screen: Keranjang,
      navigationOptions: {
        title: "Keranjang"
      }
    },

    Checkout: {
      screen: CheckoutPage,
      navigationOptions: {
        title: "Checkout"
      }
    },

    BuktiTrans: {
      screen: BuktiTransfer,
      navigationOptions: {
        title: "Bukti Transfer"
      }
    }
  },
  {
    headerMode: "none",
    initialRouteName: "Keranjang"
  }
);
const ChatsRoute = createStackNavigator(
  {
    Chat: { screen: ListChat },
    DetailChat: { screen: DetailChat }
  },
  {
    initialRouteName: "Chat",
    headerMode: "none"
  }
);
ChatsRoute.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return { tabBarVisible };
};

const ProfileStack = createStackNavigator(
  {
    ProfileIndex: { screen: ProfileData },
    UbahDataProfile: { screen: UbahDataProfile },
    ByProfileListTransaksi: { screen: ByProfileListTransaksi },
    DisukaiPage: { screen: DisukaiPage },
    TerakhirDilihat: { screen: TerakhirDilihat },
    UploadProfile: { screen: UploadPhotoProfile },
    PointMember: { screen: PointMember },
  },
  {
    initialRouteName: "ProfileIndex",
    headerMode: "none"
  }
);

const TransaksiStack = createStackNavigator(
  {
    TransaksiDepan: TransaksiPage,
    DetailTransaksi: DetailTransaksiPage,
    Finishing: FinishingTransactions
  },
  {
    headerMode: "none",
    initialRouteName: "TransaksiDepan"
  }
);
TransaksiStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  let { routes } = navigation.state;
  let router = routes[navigation.state.index];

  const { routeName } = router;
  if (routeName == "Finishing") {
    tabBarVisible = false;
  }
  return { tabBarVisible };
};
KeranjangStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;

  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return { tabBarVisible };
};

const NotificationStack = createStackNavigator({
  'NotifPage': NotifikasiPage,
  Chat: { screen: ListChat },
  DetailChat: { screen: DetailChat },
  
}, {
  initialRouteName: 'NotifPage',
  headerMode: 'none',
})
let stores = "ad";
const appTabbedNavigator = createBottomTabNavigator(
    {
      HomeApp: {
        screen: HomeStack,
        navigationOptions: {
          tabBarOnPress: ({ navigation }) => {
  
            navigation.navigate("Home");
          },
          tabBarLabel: "Home",
          tabBarIcon: ({ tintColor }) => (
            <Ant
              name="home"
              color={tintColor}
              size={20}
              style={{ fontWeight: "100" }}
            />
          )
        }
      },
      KeranjangTab: {
        screen: KeranjangStack,
        navigationOptions: {
          tabBarOnPress: ({ navigation }) => {
            //   console.log(navigation.state.routeName);
            navigation.navigate("Keranjang");
          },
          tabBarLabel: "Keranjang",
          tabBarIcon: ({ tintColor }) => (
            <Feather
              name="shopping-cart"
              color={tintColor}
              size={20}
              style={{ fontWeight: "100" }}
            />
          )
        }
      },
      Pembayaran: {
        screen: TransaksiStack,
        navigationOptions: {
          tabBarOnPress: ({ navigation }) => {
            // console.log(navigation.state.routeName);
            navigation.navigate("TransaksiDepan");
          },
          tabBarLabel: "Pembayaran",
          tabBarIcon: ({ tintColor }) => (
            <Ant
              name="form"
              color={tintColor}
              size={20}
              style={{ fontWeight: "100" }}
            />
          )
        }
      },
      Notifikasi: {
        screen: NotificationStack,
        navigationOptions: ({screenProps})=>({
          tabBarLabel: "Notifikasi",
          tabBarIcon: ({ tintColor }) => {
           // console.log('stores',stores)
            if(stores){

              const BadgeIcon = withBadge("new")(Icon)
              return (<BadgeIcon
                        type="feather"
                        name="bell"
                        color={tintColor}
                        size={20}
                        style={{ fontWeight: "100" }}
                        />)
            }else{
                return (
                <Feather
                  name="bell"
                  color={tintColor}
                  size={20}
                  style={{ fontWeight: "100" }}
    
                />
              )
              
            }
        }
        })
      },
      Akun: {
        screen: ProfileStack,
        navigationOptions: {
          tabBarOnPress: ({ navigation }) => {
            
            navigation.navigate("ProfileIndex");
          },
          tabBarLabel: "Profile",
          tabBarIcon: ({ tintColor }) => (
            <Feather
              name="user"
              color={tintColor}
              size={20}
              style={{ fontWeight: "100" }}
            />
          )
        }
      }
    },
    {
      initialRouteName: "HomeApp",
      tabBarOptions: {
        activeTintColor: warna.alizarin,
  
      },
      navigationOptions: ({ navigation }) => ({
        onTabPress: scene => {
         
        }
      })
    }
  );
 

const appRouteList = createSwitchNavigator(
  {
    Splash: Splash,
    Login: Login,
    Register: Register,
    
    Tabbed: {
      screen:appTabbedNavigator
    }
  },
  {
    initialRouteName: "Splash"
  }
)
const Kontener = createAppContainer(appRouteList);


export { MemberDataRedux };
class RouterApp extends React.Component<any> {
  initConainer(){}
  state = {
    equ: "",
    
  };
  constructor(props) {
    super(props);
  }
  
  render() {
    setInterval(()=>{
      stores=this.props.notification
    },500)
    
    return (
        <Kontener/>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

function mapDispatchStateToProps(dispatch) {
  return {
    setMemberProps: st => dispatch({ type: "SAVE_MEMBER", state: st }),
    setNotifProps: st => dispatch({ type: "UPDATE_NOTIFICATION", state: st })
  };
}
export default connect(mapStateToProps, mapDispatchStateToProps)(RouterApp);