import moment from 'moment-timezone';


export default class FormatWaktu{
    public getWaktu(waktu){
        let momen = moment(waktu,'YYYY-MM-DD hh:mm:ss');
        return momen.tz("Asia/Jakarta").format('DD MMMM YYYY hh:mm');
    }
}