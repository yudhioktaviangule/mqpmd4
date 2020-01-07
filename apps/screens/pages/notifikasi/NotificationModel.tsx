import React, { Fragment } from "react";

import { getRouterURLArray } from "../../../constants/ConstantURLs";

import { sendHttpGET } from "../../../service-function/httpService";
import { Feather, warna } from "../../../../RouterModule";
import { httpHeader } from "../../../service-function";
import { device } from "../../../constants";


const CreateIcon = (props) => {
    const {icon, color, bgcolor} = props;
  return (
    <Fragment>
      <Feather
        name={icon[1]}
        size={24}
        color={warna[color]}
        style={{backgroundColor: warna[bgcolor],padding:10 }}
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

function getNotificate(
  options = { url: "", header: {}, callbackFunc: undefined }
) {
  sendHttpGET(options.url, options.header, options.callbackFunc);
}


function getType(options = { url: "", header: {}, callbackFunc: undefined }) {
  sendHttpGET(options.url, options.header, options.callbackFunc);
}


const serviceNotifications = (id,remember_token,callback)=>{
    const header = httpHeader(device,remember_token)
    const url = notifURL({member_id:id,type:null,prefix:"notifications",child:"notif_by_member"});
    getNotificate({url:url,header:header,callbackFunc:(response)=>{
      const {
        approve,
        dikirim,
        checkout,
        dikemas,
        belumupload
      } = response.data.result;
      const totalNotif = approve + dikirim + checkout + dikemas + belumupload;
      if(totalNotif>0){
        callback(true);
      }else{
        callback(false);

      }
    }})
}
export {serviceNotifications,CreateIcon, getNotificate, notifURL, getType };
