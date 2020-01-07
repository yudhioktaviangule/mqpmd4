export interface Kota{
    id:number,
    province_id:number,
    city_id:number,
    province:string,
    city_name:string,
}

export interface ProductPhoto{
    id:number,
    product_id:number,
    foto:string
}

export interface Kategori{
    id:number,
    kategori:string,
    icon:string,
}

export interface ProductOnePhoto{
    id:string,
    sku:string,
    name:string,
    price:number,
    stock:string,
    colors:string,
    material:string,
    weight:number,
    description:string,
    city:Kota,
    photo:ProductPhoto,
    kategori:Kategori,

}



