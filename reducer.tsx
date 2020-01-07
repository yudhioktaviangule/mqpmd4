import { createStore } from "redux";

export interface MemberDataRedux{
    id:number,
    name:string,
    email:string,
    dev_id:string,
    photo?:string,
    remember_token:string,
    expoToken?:any,
    
}

const initialState = {
    
        id:0,
        name:'',
        email:'',
        photo:'noPhoto',
        dev_id:'',
        remember_token:'',
        __transaksi:{
            __pilihBank:{
                id:'0'
            }
        },
        expo:{},
        notification:false
};

const reducer = (state = initialState,action)=>{
    let tp = action.type;
    let rdc = state;
    //console.log("state awal",rdc);
    let setate = action.state;
    switch(tp){
        case 'SAVE_MEMBER':
            
            rdc = {
                ...rdc,
                id:setate.id,
                email:setate.email,
                dev_id:setate.dev_id,
                name:setate.name,
                photo:setate.photo==undefined?"noPhoto":setate.photo,
                remember_token:setate.remember_token,
            }
            //console.log(rdc);
            return rdc;
        case 'SAVE_EXPO':
                rdc = {
                    ...rdc,
                    expo:setate,
                }
                //console.log(rdc);
                return rdc;
        case 'CHANGE_NAME':
                rdc = {
                    ...rdc,
                    name:setate.name,
                }
                //console.log(rdc);
                return rdc;
        case 'CHANGE_EMAIL':
                rdc = {
                    ...rdc,
                    email:setate.email,
                }
        case 'UPDATE_NOTIFICATION':
                rdc = {
                    ...rdc,
                    notification:setate,
                }
        case 'CHANGE_PHOTO':
                rdc = {
                    ...rdc,
                    photo:setate.photo,
                }
                return rdc;
        case 'DELETE':
                rdc = initialState
                return rdc;

    
    }
    return state;
}
export const store = createStore(reducer);
export interface TypeUpdate {typeName:"CHANGE_NAME"|"CHANGE_EMAIL"|"CHANGE_PHOTO"|"DELETE"}