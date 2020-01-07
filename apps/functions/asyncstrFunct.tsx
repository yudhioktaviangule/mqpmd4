import { AsyncStorage } from "react-native";


export function setAsyncStorageMember(jsonData){
    let jsonStringi = JSON.stringify(jsonData);
    AsyncStorage.setItem("member",jsonStringi)
}
export const getAsyncStorage = async (name)=>{
    try{
        let value = await AsyncStorage.getItem(name);
        if(value!==null){
            return JSON.parse(value);
        }else{
            return {
                "data":null
            }
        }
    }catch(error){
        return {
            "data":`ERROR_GET_ASYNC_STORAGE ${error}`
        }
        
    }

}

