import { HeaderMannaQueenInterface } from "./headerInterface"

export function httpHeader(device_id,authCode){
    let data:HeaderMannaQueenInterface;
    data = {
        "Content-Type":'application/json',
        "device_id":device_id,
        "authCode":authCode
    }
    return data
}