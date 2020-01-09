import React, { Fragment } from "react";

import { getRouterURLArray } from "../../../constants/ConstantURLs";

import { sendHttpGET } from "../../../service-function/httpService";
import { Feather, warna } from "../../../../RouterModule";
import { httpHeader } from "../../../service-function";
import { device } from "../../../constants";
import { Avatar, Badge, Text } from "react-native-elements";
import FormatWaktu from '../../../service-function/formatWaktu';
import { home } from "../Stylish";


const stel = home;
const waktu = new FormatWaktu();

const CreateIcon = props => {
  const { icon, color, bgcolor } = props;
  return (
    <Fragment>
      <Avatar
        rounded
        icon={{ name: icon[1], type: icon[0] }}
        overlayContainerStyle={{ backgroundColor: warna[bgcolor] }}
      />
    </Fragment>
  );
};

const notifURL = (
  options = { member_id: 0, type: null, prefix: "", child: "" }
) => {
  const { completeUrl } = getRouterURLArray(options.prefix, options.child);
  if (options.type === null) {
    return `${completeUrl}${options.member_id}`;
  } else {
    return `${completeUrl}${options.type}/${options.member_id}`;
  }
};

const getBadge = (notif_time) => {
 // console.log(`'${waktu.getWaktu(notif_time).toLowerCase()}'`);
  const waktuStr = waktu.getHumanize(notif_time)
  const isNotNotif = waktuStr.toLowerCase() === 'invalid date' ? false : true
  const valueAction = isNotNotif ?  waktuStr : 'Baru saja'
  const badgeType =  isNotNotif ? "primary" : 'warning'
  switch(badgeType){
    case "primary":
      return (
        <Text style={[stel.thinText,{fontSize:12,marginVertical:4, color:warna.belizeHole}]}>
          {valueAction}
        </Text>
      ) 
      
    }

    return (
      <Text style={[stel.thinText,{fontSize:12,marginVertical:4, color:warna.alizarin}]}>
        {valueAction}
      </Text>
    )
}

function getNotificate(
  options = { url: "", header: {}, callbackFunc: undefined }
) {
  sendHttpGET(options.url, options.header, options.callbackFunc);
}

function getType(options = { url: "", header: {}, callbackFunc: undefined }) {
  sendHttpGET(options.url, options.header, options.callbackFunc);
}

const serviceNotifications = (id, remember_token, callback) => {
  const header = httpHeader(device, remember_token);
  const url = notifURL({
    member_id: id,
    type: null,
    prefix: "notifications",
    child: "notif_by_member"
  });
  getNotificate({
    url: url,
    header: header,
    callbackFunc: response => {
      const {
        approve,
        dikirim,
        checkout,
        dikemas,
        belumupload
      } = response.data.result;
      const totalNotif = approve + dikirim + checkout + dikemas + belumupload;
      if (totalNotif > 0) {
        callback(true);
      } else {
        callback(false);
      }
    }
  });
};
export { getBadge as TheBadge,serviceNotifications, CreateIcon, getNotificate, notifURL, getType };
