const keys =[
    {
        index:0,
        key:"DELIVERED",
        value:'Paket Diterima oleh ',
        related:' TO ',
    },
    {
        index:1,
        key:"WITH DELIVERY COURIER",
        value:'Paket akan diantarkan ke alamat penerima ',
        related:null,
    },
    {
        index:2,
        key:"RECEIVED",
        value:'Paket telah sampai di ',
        related:' AT '
    },
    {
        index:3,
        key:"DEPARTED",
        value:'Paket akan dikirim dari ',
        related:' FROM ',
    },
    {
        index:4,
        key:"RECEIVED BY",
        value:'Paket telah diterima oleh ',
        related:' AT '
    },
    {
        index:5,
        key:"PROCESSED",
        value:'Paket akan diproses oleh ',
        related:' AT '
    },
    {
        index:5,
        key:"PICKED UP",
        value:'Paket akan dikirimkan oleh ',
        related:' BY '
    },

    

];

function translate(word){
    //console.log(word);
    let wordTranslate       = "";
    let explodeRelatedParam = "";
    let explodString = [];
    for(let key in keys){
        let v = keys[key];
        if(word.indexOf(v.key)>-1){
            wordTranslate = v.value
            explodeRelatedParam = v.related
        }
    }
    
    explodString = explodeRelatedParam==null ? ["",""] : word.split(explodeRelatedParam);
    wordTranslate+=`${explodString[1]}`;
    return wordTranslate;
}

export function getManifestsIDN(itema){
    let items = [];
    console.log('manifest',itema);
    itema.map((V,K)=>{
        items.push({
            manifest_description:translate(V.manifest_description),
            manifest_date:V.manifest_date,
            manifest_time:V.manifest_time,
        })
    })
    return items
}