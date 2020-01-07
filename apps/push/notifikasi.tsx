import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import { device } from "../constants";
import { getRouterURLArray } from "../constants/ConstantURLs";
import { Vibration } from "react-native";

const URL = getRouterURLArray("push_token", "register").completeUrl;
export function vib(PATTERN) {
  Vibration.vibrate(PATTERN);
}
export default function registerPush(callback: any,notGrantCallback?) {
  Permissions.getAsync(Permissions.NOTIFICATIONS).then(
    ({ status: existingStatus }) => {
      let finalStatus = existingStatus;

      if (existingStatus != "granted") {
        Permissions.askAsync(Permissions.NOTIFICATIONS).then(({ status }) => {
          console.log("not granted");
          finalStatus = status;
          if (finalStatus !== "granted") {
            console.log("not granted");
            if(notGrantCallback===undefined){
              alert("Silahkan Izinkan Aplikasi untuk mengelola Notifikasi Anda")
            }else{
              notGrantCallback({notGrant:'Notification'})
            }
            return;
          } else {
            Notifications.getExpoPushTokenAsync().then(token => {
              callback(token);
            });
          }
        });
      } else {
        Notifications.getExpoPushTokenAsync()
          .then(token => {
            callback(token);
          })
          .catch(reespn => {
            console.log(reespn);
          });
      }
    }
  );
}
