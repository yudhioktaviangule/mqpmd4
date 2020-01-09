import { getRouterURLArray } from "../constants/ConstantURLs";
import { sendHttpGET } from "../service-function/httpService";

class BatasWaktu {
  options = {
    member: {
      id: 0,
      name: ""
    },
    httpHeader: {
    }
  };
  constructor(
    options = {
      member: {
        id: 0,
        name: ""
      },
      httpHeader: {}
    }
  ) {
    this.options = options;
  }
  public getBatasWaktuKeranjang(callback) {
        const {member,httpHeader} = this.options;
        const {completeUrl} = getRouterURLArray("batas_waktu","keranjang");
        const url = `${completeUrl}${member.id}`;
        sendHttpGET(url,httpHeader,(response)=>{
            callback(response)
        })
  }
  public getBatasWaktuTransaksi(callback){
    const {member,httpHeader} = this.options;
    const {completeUrl} = getRouterURLArray("batas_waktu","transaksi");
    const url = `${completeUrl}${member.id}`;
    sendHttpGET(url,httpHeader,(response)=>{
        callback(response)
    })
  }
}

function BatasWaktuModel(options = {
    member: {
      id: 0,
      name: ""
    },
    httpHeader: {}
  } ) {
      return new BatasWaktu(options)
  }


export {BatasWaktuModel};