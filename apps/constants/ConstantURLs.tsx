export interface prefixSearcher{
    prefix:string,
    childKey:number,
    completeUrl:string
}
const ngrok = {
    api:"http://192.168.1.2:8080/",
    gbr:'http://192.168.1.2:8081/'
};

export const base_url = {
    
    base:ngrok.api,
    foto:ngrok.gbr,
    prefixLists:[
        {
            prefixName:'authLogin/',
            childs:[
                {childName:'login/'},
                {childName:'logout/'}
            ]
        },
        {
            prefixName:'keranjang/',
            childs:[
                {childName:'keranjang/'},
                
                
            ]
        },
        {
            prefixName:'transaksi/',
            childs:[
                {childName:'checkout/'},
                {childName:'get_trans/'},
                {childName:'transaksi/'},
                {childName:'set_state/'},
                {childName:'trans_by_member/'},
                {childName:'trans_by_state/'},
            ]
        },
        {
            prefixName:"categories/",
            childs:[
                {childName:'category/'},
            ]
        },
        {
            prefixName:"device/",
            childs:[
                {childName:'cekdvs/'},]            
            },
        {
            prefixName:"members/",
            childs:[
                {childName:'member/'},
                {childName:'alamat/'},
                {childName:'check_pass/'},
                {childName:'upload_profile_photo/'},
                {childName:'get_kota/'},
                {childName:'get_province/'},
                {childName:'member_point/'},
                
            ]            
        },
        {
            prefixName:"alamat_pengiriman/",
            childs:[
                {childName:'alamat/'},                
            ]            
        },
        {
            prefixName:"chats/",
            childs:[
                {childName:'get_admin_group_chat/'},                
                {childName:'select_admin/'},                
                {childName:'send_chat/'},                
                {childName:'get_chat/'},                
            ]            
        },
        {
            prefixName:"expo/",
            childs:[
                {childName:'register/'},                
            ]            
        },
        {
            prefixName:"notifications/",
            childs:[
                {childName:'notif_by_type/'},                
                {childName:'notif_by_member/'},                
                {childName:'notif_all/'},                
            ]            
        },
        {
            prefixName:"products/",
            childs:[
                {childName:'getfiveproducts/'},
                {childName:'product_by_categories/'},
                {childName:'product/'},
                {childName:'like_product/'},
                {childName:'liked/'},
                {childName:'dikunjungi/'},

            ]            
        },
        
        {
            prefixName:"rajaongkir/",
            childs:[
                {childName:'cek_ongkir/'},
                {childName:'tracking/'},
                
            ]            
        },
        {
            prefixName:"bank/",
            childs:[
                {childName:'bank/'},
                
            ]            
        },
        {
            prefixName:"batas_waktu/",
            childs:[
                {childName:'keranjang/'},
                {childName:'transaksi/'},
                
            ]            
        },
    ],
    picDirList:[
        {picName:"kat/"},
        {picName:"product/"},
        {picName:"member/"},
        {picName:"member/"},
    ]
};


export function getRouterURLArray(prefixName,childName):prefixSearcher{
    let prefixSearch:prefixSearcher ={
        prefix:"",
        childKey:0,
        completeUrl:""
    };
    base_url.prefixLists.map((V,K)=>{
   
        if(V.prefixName==`${prefixName}/`){
            prefixSearch.prefix = V.prefixName;
            V.childs.map((V1,K1)=>{
                var pm = `childDicari = ${childName} childSekarang = ${V1.childName}. ? ${(V1.childName==childName)} prefix ditemukan = ${V.prefixName}. child index ke-${K1}`;
        
                if(V1.childName==`${childName}/`){
                    prefixSearch.childKey=K1;
                    prefixSearch.completeUrl = `${base_url.base}${prefixSearch.prefix}${V1.childName}`
                }
            });
        }
    });
    return prefixSearch
}

export function getURLGambar(image){
    return `${base_url.foto}${image}`;
}