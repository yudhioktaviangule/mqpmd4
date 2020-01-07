import { Feather } from "../constants/Feather";
import { Ant } from "../constants/AntIcon";
import { warna } from "../constants";
import { HeaderMannaQueenInterface } from "../service-function/headerInterface";

export interface Transaksi{
    id?:number,
    alamat_pengiriman_id?:number,
    invoice?:string,
    status_transaksi?:'checkout'|"pilihbank"|'buktibayar'|'menunggu verifikasi'|'telah diverifikasi'|'pengemasan'|'pengiriman'|'diterima'|'selesai'|'batal',
    jumlah_pembayaran?:number,
    biaya_pengiriman?:number,
    pot_ongkir?:number,
    pot_diskon?:number,
    pot_cashback?:number,
    bank?:string,
    rekening?:string,
    atasnama?:string,
    unik?:string,
    bukti_bayar?:string,
    _method?:"put"|"delete"
}

export interface TransaksiKey{
    keys:"_method"|"id"|"alamat_pengiriman_id"|"invoice"|"jumlah_pembayaran"|"biaya_pengiriman"|"bank"|"atasnama"|"rekening"|"unik"|"bukti_bayar"
}

export interface StatPembelianIface{
    status_transaksi:'checkout'|"pilihbank"|'buktibayar'|'menunggu verifikasi'|'telah diverifikasi'|'pengemasan'|'pengiriman'|'diterima'|'selesai'|'batal',
}
export function isCanTracking(stat:StatPembelianIface){
    let st = stat.status_transaksi;
    if(st=="pengiriman"||st=="diterima"||st=="selesai"){
        return true
    }else{
        return false
    }
}
export function getStatusPembelian(status:any){
    switch (status.status_transaksi) {
        case "checkout":
            return "Pembeli melakukan Checkout";
        case "pilihbank":
            return "Pembeli memasukkan data alamat dan data Rekening";
        case "buktibayar":
            return "Pembeli akan melakukan Pembayaran";
        case "menunggu verifikasi":
            return "Proses pembayaran selesai. Pembeli menunggu verifikasi";
        case "telah diverifikasi":
            return "Proses pembayaran telah diverifikasi. Pesanan akan diproses dan dikirim";
        case "pengemasan":
            return "Pesanan telah diproses";
        case "pengiriman":
            return "Pesanan telah dikirim";
        case "diterima":
            return "Pesanan telah diterima";
        case "selesai":
            return "Pembeli telah menyelesaikan transaksi";
   
    }

}

export function getCaptionStatusTransaksi(status){
    switch (status.status_transaksi) {
        case "checkout":
            return "Butuh Checkout";
        case "pilihbank":
            return (
                <Ant
                            size={18}
                        name="paperclip"
                    color={warna.alizarin}                    
                    />
                );
        case "buktibayar":
            return "Butuh Bukti Pembayaran";
        case "menunggu verifikasi":
            return "Menunggu Verifikasi";
        case "telah diverifikasi":
            return "Telah Diverifikasi";
        case "pengemasan":
            return "Pesanan Dikemas";
        case "pengiriman":
            return "Pesanan Dikirim";
        case "diterima":
            return "Pesanan Diterima";
        case "selesai":
            return "Pesanan Selesai";
   
    }
    
}