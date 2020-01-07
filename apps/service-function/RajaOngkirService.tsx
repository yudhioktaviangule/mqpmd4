import { sendHTTPPOST } from "./httpService";

export interface RajaOngkirIface{
    origin:string,
    destination:string,
    weight:number,
    courier:string
}
const TOKEN = `85bb38ef2391164caaf72ff9e004c544`;
const options = {
    "method": "POST",
    "hostname": "api.rajaongkir.com",
    "port": null,
    "path": "/basic/cost",
    "headers": {
      "key": TOKEN,
      "content-type": "application/x-www-form-urlencoded"
    }
  };
export function createRequestStringify(request:RajaOngkirIface):string{
    return JSON.stringify(request);
}
export const headerOngkir = {
    
        "key": TOKEN,
        "Content-Type": "application/x-www-form-urlencoded"       
    
}