import { KategoriModel } from "./CategoriesModel";
import { ProductPhotoModel } from "./ProductPhotosModel";

export interface ProductModel{
    id?:number,
    sku?:string,
    name?:string,
    price?:number,
    city_id?:number,
    weight?:number,
    description?:string,
    getCategory?:KategoriModel,
    getProductPhotos?:ProductPhotoModel[]
}