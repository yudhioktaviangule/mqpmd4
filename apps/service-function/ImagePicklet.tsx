import * as Permission from "expo-permissions"
import * as ImagePicker from 'expo-image-picker'
import  Constants  from 'expo-constants';
import  * as ImageManipulator  from 'expo-image-manipulator';


const askGranted = async()=>{
    const {status} = await Permission.askAsync(Permission.CAMERA_ROLL);
    if(status=='granted'){
        return true
    }else{
        return false
    }
}

const checkPermissionDevice= async()=>{
    if(Constants.platform.ios){
        const {status} =  await Permission.getAsync(Permission.CAMERA_ROLL);
        if(status=='granted'){
            return true
        }else{
         
            return await askGranted()
        }

    }else{
        return true
    }

}

const _pick = async(isNotBase64?)=>{
    let result:any = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        base64:isNotBase64==undefined ? true:false,
      });
    if(!result.cancelled){
        if(isNotBase64==undefined){
            return result;
        }else{
            return result.uri;
        }
    }
}

export const createImagePicklet = async(callback:(base64:string)=>void)=>{
    let permdata;
    permdata = await askGranted();

    if(permdata){
        let data = await _pick()
        callback(data['base64'])
    }
}
export const createImagePickletNo64 = async()=>{
    let permdata;
    permdata = await askGranted();

    if(permdata){
        return await _pick()
    }
}

interface IfaceResize{
    width:number,
    height:number
}
export const manipulateImage = async(callback:(result:string)=>void,resizeTo:IfaceResize)=>{
    const image = await createImagePickletNo64();
    
    const manipulate = await ImageManipulator.manipulateAsync(
        image['uri'],
        [{resize:{width:resizeTo.width,height: resizeTo.height}}],
        {base64:true}
        )
        console.log(manipulate,"manipulasi")
        callback(manipulate.base64)
}
