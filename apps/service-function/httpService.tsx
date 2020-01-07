
import axios from 'axios/';
export interface serverResponses{
    sendInfo:{
        type:string,
        q:any,
        _func:string
    },
    result:any,
    pesan:{
        msg:string,
        code:number
    }
}
export interface ResponseTransformation
    {   data:serverResponses
    }

var kata = ``;
export function sendHTTPPOST(url, param, header, callback,callbackErr?) {
    kata = `POST[HEADER] TO ${url}`;
    console.log(kata);
    axios({
        headers:header,
        method:'post',
        url:url,
        data:param

    }).then(response => {
        
        setTimeout(() => {
           let rsp:ResponseTransformation = response
           rsp.data = response.data
            callback(rsp);
        }, 1000)
    }).catch(error=>{
        callbackErr();
    });
}
export function sendFreelyHttpGET(url, callback,callbackErr?) {
    kata = `GET TO ${url}`;
    console.log(kata);
    axios.get(url).then(response => {
        setTimeout(() => {
           let rsp:ResponseTransformation = response
           rsp.data = response.data
            callback(rsp);
        }, 1000)
    }).catch(error=>{
        callbackErr(error);
    })
}

export function sendFreelyHttpPOST(url, param, callback,callbackErr?) {
    kata = `POST TO ${url}`;
    console.log(kata);
    axios.post(url, param,{headers:{
        'Content-Type':'application/json'
    }}).then(response => {
        setTimeout(() => {
           let rsp:ResponseTransformation = response
           rsp.data = response.data
            callback(rsp);
        }, 1000)
    }).catch(error=>{
        callbackErr(error);
    })
}




export function sendHttpGET(url, header, callback,callbackErr?) {
    kata = `GET[HEADER] TO ${url}`;
    console.log(kata);
    axios({
        headers:header,
        method:'get',
        url:url
    }).then(response => {
        setTimeout(() => {
           let rsp:ResponseTransformation = response
           rsp.data = response.data
            callback(rsp);
        }, 1000)
    }).catch(error=>{
        if(callbackErr!=undefined){
            callbackErr(error);
        }else{
            console.log(error)
        }
    })
}
