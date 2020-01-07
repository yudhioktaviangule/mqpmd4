import Constants from 'expo-constants';
import { Dimensions } from 'react-native';

var devIDS = Constants.deviceId;
var merkName = Constants.deviceName;
var dev = devIDS.replace(/-/g,'');
var merk = merkName.replace(/ /g,'');

export interface DeviceDimensionIface{
    width:number,
    height:number
}
export const device = `${dev}${merk}`;

export const DEVICE_DIMENSION:DeviceDimensionIface = {
    width:Dimensions.get('window').width,
    height:Dimensions.get('window').height
}

