//import liraries
import React, { Component } from 'react';
import { Image,View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { MemberDataRedux } from '../../../../../reducer';
import { device } from '../../../../constants';
import { connect } from 'react-redux';
import { getURLGambar } from '../../../../constants/ConstantURLs';
import { DEVICE_DIMENSION } from '../../../../constants/device';
import NavRouteBackFunction from '../../../../service-function/NavRouteBackFunction';


const dimension = DEVICE_DIMENSION

interface KatData{
    icon: string,
    id: number,
    kategori: string,
    isEmptyValue?: boolean,
}
const numcols = 2
const formatData=(datas = [],colNumber)=>{
    let len = datas.length
    let xdata:KatData[]=[]
    let blank:KatData={
        id:9999999,
        icon:'kat/default.png',
        kategori:'none',
        isEmptyValue:true
    }
    if(len>0){
        datas.map((V,K)=>{
           // console.log(V==undefined)
            if(V!=undefined){
                xdata.push({
                    id:V.id,
                    icon:V.icon,
                    kategori:V.kategori,
                    isEmptyValue:false
                })

            }
        })
        
        const numFullRows = Math.floor(len/colNumber);
        let numLastElement = 0
        while(numLastElement !== numFullRows && numFullRows !== 0){
            xdata.push({
                id:blank.id,
                icon:blank.icon,
                kategori:blank.kategori,
                isEmptyValue:true,
            });
            numLastElement++;
        }
        return xdata;
    
    }
    else{
        return [];
    }
}
// create a component
class FlatlistKategori extends Component<any> {
    state = {
        categories: [],
        dimension: { width: 0, height: 0 }
    }
    handlers = {
        itemClickHandler:(item)=>{
            let param = NavRouteBackFunction('Home',{categories:item})
            this.props.handleClickItem(param);
        },
        flatListClick: (id) => { },
        renderItem: (item) => {
            let foto = {uri:getURLGambar(item.icon)};
            return (
                !item.isEmptyValue ?
                <TouchableOpacity style={{
                    backgroundColor:"#FFF",
                    margin:1,
                    flex:1,
                    height:dimension.height*0.20,
                }}
                onPress={()=>{
                    this.handlers.itemClickHandler(item)
                }}
                >
                    <Image 
                        style={{   
                            justifyContent: 'center',
                            alignItems: 'center',
                            width:'100%',
                            height:'100%',
                        }} 
                        source={foto} />
                    <View style={{
                        position:'absolute',
                        bottom:0,
                        paddingVertical:10,
                        width:'100%',
                        backgroundColor:"rgba(0,0,0,0.5)",
                        paddingHorizontal:10,
                        }}>
                        <Text style={{fontSize:16,fontWeight:'600',color:"white"}}>{item.kategori}</Text>
                    </View>
                </TouchableOpacity>
                :                <View style={{
                    backgroundColor:"transparent",
                    margin:1,
                    flex:1,
                    height:dimension.height*0.2,
                }}>
                    
                </View>
            )
        },

    }
    componentDidMount(){
        //console.log(this.props);
        let data = this.props.data
        let xdata = formatData(data,numcols);
        this.setState({categories:xdata},()=>{
           // console.log('independeng',this.state.categories);
            
        })
    }
    render() {
        
        return (
            <View style={{paddingHorizontal:2}}>
                <FlatList
                    numColumns={numcols}
                    data={ this.state.categories }
                    renderItem={(item) => { return this.handlers.renderItem(item.item) }}
                    keyExtractor={(item,index) => { return  "kateg-"+item.id }}
                    ListFooterComponent={<View style={{ height: 100 }}></View>}
                    
                />
            </View>
            
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',

    },
});
function mapStateToProps(state: MemberDataRedux = { id: 0, name: '', dev_id: device, email: '', remember_token: '' }) {
    return state;
}

function mapDispatchStateToProps(dispatch) {
    return {
        setMemberProps: (s) => dispatch({ type: 'SAVE_MEMBER', state: s }),
        resetTransaksi: () => dispatch({ type: 'REFRESH_TRANSAKSI', state: {} }),

    }
}
export default connect(mapStateToProps, mapDispatchStateToProps)(FlatlistKategori)
