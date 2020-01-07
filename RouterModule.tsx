
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'

import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import { Provider } from 'react-redux';
import { store, MemberDataRedux } from './reducer';

import { warna } from './apps/constants';
import { Feather } from './apps/constants/Feather';
import { Ant } from './apps/constants/AntIcon';

import ListChat from './apps/screens/pages/chat/ListChat';
import DetailChat from './apps/screens/pages/chat/detail/DetailChat';
import FinishingTransactions from './apps/screens/pages/transaksi/childs/FinishingTransactions';
import ProfileData from './apps/screens/pages/profile/ProfileData';
import UbahDataProfile from './apps/screens/pages/profile/child/ubah-profile/UbahDataProfile';
import ByProfileListTransaksi from './apps/screens/pages/profile/child/list-transaksi/ByProfileListTransaksi';
import { Login,Register } from "./apps/screens/login/";
import {Splash} from './apps/screens/splash/';
import {Home} from './apps/screens/pages/';
import {Keranjang} from './apps/screens/pages/';
import AllProduct from './apps/screens/pages/products/all/AllProduct';
import DetailProduct from './apps/screens/pages/products/detail/DetailProduct';
import CheckoutPage from './apps/screens/pages/checkout/CheckoutPage';
import BuktiTransfer from './apps/screens/pages/checkout/subpage/BuktiTransfer';
import TransaksiPage from './apps/screens/pages/transaksi/Transaksi';
import DetailTransaksiPage from './apps/screens/pages/transaksi/childs/DetailTransaksi';

import DisukaiPage from './apps/screens/pages/profile/child/produk/DisukaiPage'
import TerakhirDilihat from './apps/screens/pages/profile/child/produk/TerakhirDilihat'
import UploadPhotoProfile from './apps/screens/pages/profile/child/upload-photo/UploadPhotoProfile'
import NotifikasiPage from './apps/screens/pages/notifikasi/Notifikasi';
import PointMember from './apps/screens/pages/profile/child/point-members/PointMember';

export {Feather,Ant}
export {warna}
export {Provider,store,MemberDataRedux}
export {createBottomTabNavigator,createAppContainer,createSwitchNavigator,createMaterialBottomTabNavigator,createStackNavigator};
export {
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
    UploadPhotoProfile,
    NotifikasiPage,
    PointMember
}