

export default class FormatWaktu{
    public getWaktu(waktu){
        const moment = require('moment-timezone');
        let momen = moment(waktu,'YYYY-MM-DD hh:mm:ss');
        return momen.tz("Asia/Jakarta").format('DD MMMM YYYY hh:mm').toString();
    }
    public getHumanize(waktu){
        const moment = require('moment/min/moment-with-locales');
        moment.locale('id');
        let momeng= moment(waktu,'YYYY-MM-DD hh:mm:ss');
        return momeng.fromNow();
    }
}