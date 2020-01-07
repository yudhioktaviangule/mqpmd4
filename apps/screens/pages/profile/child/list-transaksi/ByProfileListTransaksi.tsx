//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,SafeAreaView, StatusBar, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { home } from '../../../Stylish';
import { connect } from 'react-redux';
import { MemberDataRedux } from '../../../../../../reducer';
import { device, warna } from '../../../../../constants';
import { StatPembelianIface, getCaptionStatusTransaksi } from '../../../../../models/Trans';
import { Feather } from '@expo/vector-icons';
import { httpHeader } from '../../../../../service-function';
import { getRouterURLArray, getURLGambar } from '../../../../../constants/ConstantURLs';
import { sendHttpGET } from '../../../../../service-function/httpService';
import { Image } from 'react-native';
import { formatCurrency } from '../../../../../functions/pipes';
import NavRouteBackFunction from '../../../../../service-function/NavRouteBackFunction';



const styles = home;
const TransStates:StatPembelianIface[] = [
    {status_transaksi:"checkout"},
    {status_transaksi:"menunggu verifikasi"},
    {status_transaksi:"telah diverifikasi"},
    {status_transaksi:"pengemasan"},
    {status_transaksi:"pengiriman"},
    {status_transaksi:"diterima"},
    {status_transaksi:"selesai"}
];
const navs=StyleSheet.create({
    navLeftContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'flex-start',
        
    },
    navMidContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        
    },
    navRightContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'flex-end',
        
    },
});

const cards=StyleSheet.create({
    base:{
        backgroundColor:warna.whitePolos,
        padding:10,
        
        alignContent:'center',
        alignItems:'center',
        justifyContent:'center',
        margin:5,
        shadowColor:warna.e3e3e3,
        shadowOpacity:0.2,
        
        shadowOffset:{width:0,height:5}
    },
    round:{
        borderRadius:10,
    },
    withBorders:{
        borderWidth:0.7,
        borderColor:warna.e3e3e3
    }

});

class ByProfileListTransaksi extends Component<any> {
    li=0;
    state={
        member:{id:0,name:''},
        trans_state:[],
        backCardStateColor:[],
        keyword:"default",
        transactions:[],
        isLoading:false
    };
    handler = {
        renderFlatlistDetailTransaksi:(render,index)=>{
            const {foto} = render;
         
            return(
            <View
                style={{flex:1,flexDirection:'row',marginBottom:5,alignItems:'center',justifyContent:'flex-start'}}>
                        <Image
                            source={{uri:getURLGambar(foto)}}
                            style={{width:48,height:48,resizeMode:'cover',marginRight:5}}
                        />

                    <View style={{flex:1,marginLeft:5,justifyContent:'space-between',flexDirection:'row'}}>
                        <Text>{render.name}</Text>
                        <Text style={{color:warna.alizarin}}>
                            {formatCurrency(render.harga)}
                        </Text>

                    </View>
                
            </View>);
        },
        renderFlatTrans:(item,index)=>{
            const { id,detail,jumlah_pembayaran,biaya_pengiriman,pot_diskon,pot_cashback,pot_ongkir } = item;
            const pembayaran  = jumlah_pembayaran+biaya_pengiriman-pot_diskon-pot_cashback-pot_ongkir;
            this.li++;
            return (
                <TouchableOpacity 
                    onPress={
                        ()=>{
                            const { navigation } = this.props;
                            const {params,routeName} = navigation.state;
                            
                            let routeback = NavRouteBackFunction(routeName,{id:id})
                            navigation.navigate("DetailTransaksi",routeback);
                        }
                    }
                    style={{flexDirection:'row',flex:1}}>
                    <View style={{paddingHorizontal:15,paddingVertical:10,flex:1}}>
                        <View style={[{paddingVertical:5,flexDirection:'row',flex:1},styles.lineSepa]}>
                            <View style={{flex:1,flexDirection:'row',alignItems:'center'}}>
                                <Feather name="shopping-cart"/>
                                <Text style={{textTransform:"uppercase",fontWeight:'200',marginLeft:8}}>{item.invoice}</Text>
                            </View>
                            <View style={{flex:1,flexDirection:'row',justifyContent:'flex-end',alignItems:'center'}}>
                                <Text style={{color:warna.alizarin}}>{getCaptionStatusTransaksi({status_transaksi:item.status_transaksi})}</Text>
                            </View>
                        </View>
                        <View style={[{paddingVertical:5},styles.lineSepa]}>
                            <FlatList
                                data={detail}
                                renderItem={(detail)=>{
                                    return this.handler.renderFlatlistDetailTransaksi(detail.item,detail.index);
                                }}
                                keyExtractor={(item,index)=>{
                                    const id = item['id'];
                                    const idx = `__detail${id}_index_${(index+1)}`;
                                    //console.log(idx);
                                    return idx}
                                }

                                scrollEnabled={false}
                                />
                        </View>
                        <View style={{paddingVertical:5,flexDirection:'row',flex:1}}>
                            <View style={{width:'70%',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                                <Text style={{
                                    fontWeight:'200',
                                    fontSize:12
                                }}>
                                    {detail.length} item
                                </Text>
                                <Text>Total Pembayaran:</Text>
                            </View>
                            <View style={{flex:1,justifyContent:'center',alignItems:'flex-end'}}>
                                <Text style={{color:warna.alizarin,marginLeft:10}}>
                                    {formatCurrency(pembayaran)}
                                </Text>
                            </View>
                            
                        </View>

                    </View>
                </TouchableOpacity>
            );
        },
        getTransByKeyword:()=>{
            const { keyword } = this.state
            let splitter  = keyword.split(" ")
            let params  = splitter.length > 1 ?  splitter.join("_"): splitter[0];
            const { remember_token,id } = this.props
            const header = httpHeader(device,remember_token)
            const { completeUrl } = getRouterURLArray("transaksi","trans_by_state");
            const url = `${completeUrl}${params}/${id}`
            sendHttpGET(url,header,(response)=>{
                const {result} = response.data;
                this.setState({transactions:result,isLoading:false});
            })
        },
        initialize:()=>{
            let back = [];
            TransStates.map((v,i)=>{
                let color = "";
                let texCol = "";
                if(i==0){
                    color = warna.alizarin
                    texCol = warna.whitePolos
                }else{
                    color = warna.whitePolos
                    texCol=warna.draculaOrchid
                }
                back.push({back:color,text:texCol});
            })
            const member = {
                member:{
                    id:this.props.id,
                    name:this.props.name
                }}
            this.setState({member:member,backCardStateColor:back},()=>{
                const states = TransStates.map(V=>{
                    return V.status_transaksi
                });
                this.setState({trans_state:states,isLoading:true},()=>{
                    this.handler.getTransByKeyword()
                });
            })
        },
        renderNav:()=>{
            
            return(
                <View style={[styles.navContainer,styles.lineSepa,styles.flexRow]}>
                    <View style={[navs.navLeftContainer]}>
                        <TouchableOpacity
                            style={{flex:1,paddingRight:25,justifyContent:'center'}}
                            onPress={()=>{
                                const { navigation } = this.props
                                navigation.goBack();
                            }}>
                            <Feather
                                name="arrow-left"
                                size={20}
                                />
                        </TouchableOpacity>
                    </View>
                    <View style={[navs.navMidContainer]}>
                        <Text style={[styles.navTextStyle]}>
                            Transaksi
                        </Text>
                    </View>
                    <View style={navs.navRightContainer}>

                    </View>
                </View>
            );
        },
        renderStatus:(render,indeks?)=>{
        
     
            const xomp = (
                <TouchableOpacity 
                    onPress={()=>{
                       let colors = this.state.backCardStateColor;
                      // console.log(colors);
                       let backs = colors.map((v)=>{
                           return {back:"#FFF",text:warna.draculaOrchid};
                       })
                       backs[indeks]={back:warna.alizarin,text:'#FFF'};
                       this.setState({isLoading:true,transactions:[],backCardStateColor:backs,keyword:render},()=>{
                           this.handler.getTransByKeyword();
                       })
                    }}
                    style={[cards.base,cards.round,cards.withBorders,{backgroundColor:this.state.backCardStateColor[indeks]['back']}]}>
                    <Text style={{fontWeight:'200',alignContent:"center",textTransform:"capitalize",color:this.state.backCardStateColor[indeks]['text']}}>
                        {getCaptionStatusTransaksi({status_transaksi:render})}
                    </Text>
                </TouchableOpacity>
            )
            
            return xomp;
        },
        renderContent:()=>{
            
            return (
                <View style={styles.contentContainer}>
                    <View style={[styles.bgContent,styles.lineSepa,styles.smallContainer]}>
                        <FlatList
                            data = {this.state.trans_state}
                            horizontal={true}
                            renderItem={(items)=>{
                                
                                return this.handler.renderStatus(items.item,items.index);
                            }}
                            refreshing={true}
                            extraData={this.state}
                            keyExtractor={(index)=>{
                                return "atas"+index
                            }}
                            showsHorizontalScrollIndicator={false}
                            />
                    </View>
                    <View style={{flex:1,paddingBottom:10}}>
                        {this.state.isLoading ? (
                            <View style={{flex:1,justifyContent:'center',alignContent:"center",alignItems:'center'}}>
                                <ActivityIndicator/>
                            </View>
                        ):(
                            <FlatList
                                refreshing={true}
                                extraData={this.state}
                                data={this.state.transactions}
                                renderItem={(data)=>{
                                    const { item,index } = data;
                                    return this.handler.renderFlatTrans(item,index)
                                }}
                                keyExtractor={(item,index)=>{
                                    return `trans-id-${item['id']}`;
                                }}
                                ItemSeparatorComponent={()=>(
                                    <View style={{width:'100%',height:'5%',backgroundColor:warna.whiteLynx}}></View>
                                )}
                                contentContainerStyle={{paddingBottom:200}}
                            />
                        )}
                        
                    </View>
                </View>
            );
        }
    }
    componentDidMount(){
        const {navigation} = this.props
        const thisRoute = navigation.state.routeName
        navigation.addListener("willFocus",payload=>{
            if( payload.state.routeName == thisRoute){
                this.handler.initialize();
            }
        })        
    }
    render() {
        return (
            <SafeAreaView style={styles.appContainer}>
                <StatusBar
                    barStyle="dark-content"
                    />
                {this.handler.renderNav()}
                {this.handler.renderContent()}
            </SafeAreaView>
        );
    }
}


function mapStateToProps(state: MemberDataRedux = { id: 0, name: '', dev_id: device, email: '', remember_token: '' }) {
    return state;
}

function mapDispatchStateToProps(dispatch) {
    return {
        setMemberProps: (s) => dispatch({ type: 'SAVE_MEMBER', state: s }),

    }
}
export default connect(mapStateToProps, mapDispatchStateToProps)(ByProfileListTransaksi)