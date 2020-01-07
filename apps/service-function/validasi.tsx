export function validateDataState(objState){
    let validate = true
    Object.keys(objState).map((key)=>{
        if(objState[key]==''){
            validate = false
        }
    })
    return validate
}