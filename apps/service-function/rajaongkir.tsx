import { sendHTTPPOST } from "./httpService";
import { getRouterURLArray } from '../constants/ConstantURLs';

export interface RajaOngkirRequest{
    courier:"jne"|"jne",
    destination:number,
    origin?:number,
    weight?:number,
    product?:any,
}
export function getOngkir(products,headers,destinate:RajaOngkirRequest,callbacks){
    let lists = products;
    let data:RajaOngkirRequest;
    let weight = 0;
    let cities;
    let productions=[];
    lists.map(item=>{
        let prd = item.products 
        weight = weight+prd.weight
        productions.push({id:prd.id,name:prd.name})
        cities = prd.cities_id
    })
    data = ({
        product:productions,
        origin:cities,
        destination:destinate.destination,
        courier:'jne',
        weight:weight,
    })
    //console.log("datas",data);
    const url = getRouterURLArray('rajaongkir',"cek_ongkir").completeUrl
    sendHTTPPOST(url,{'posts':[data]},headers,(response)=>{
        //console.log(response.data);
        callbacks(response.data)
    },(err)=>{
        console.log(err)
    })
    


}