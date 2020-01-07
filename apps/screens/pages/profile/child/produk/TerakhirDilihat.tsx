import React, { Component } from 'react'
import { Text, View, StatusBar, SafeAreaView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native'
import { MemberDataRedux } from '../../../../../../reducer';
import { device, warna } from '../../../../../constants';
import { connect } from 'react-redux';
import { home } from '../../../Stylish';
import { Feather } from '../../../../../constants/Feather';
import { getRouterURLArray, getURLGambar } from '../../../../../constants/ConstantURLs';
import { httpHeader } from '../../../../../service-function';
import { sendHttpGET } from '../../../../../service-function/httpService';
import { Image } from 'react-native-elements';
import { formatCurrency } from '../../../../../functions/pipes';
import NavRouteBackFunction from '../../../../../service-function/NavRouteBackFunction';
const getAvail = (state)=>{
    
    switch(state){
        case "NA":
            return "NOT AVAILABLE";
        default:
            return "AVAILABLE";
    }
}

const style=home;
const getItems = (items=[])=>{
    //console.log(items);
    let len = items.length;
    let isModTwoZero = len%2==0;
    let listData = items.map(data => {
        let lists = {
            ...data,
            isZeroContent:false,
        }
       // console.log(lists);
        return lists
    });
    if(! isModTwoZero ){
        listData.push({
            isZeroContent:true
        })
    }
    return listData;
}
class TerakhirDilihat extends Component<any> {
    state={
        products:[],
        steps:[],
        offset:0,
        lastOffset:null,  
        isLoading:false,  
        stillLoadMoreData:true,
    }
    
    member={
        id:this.props.id,
        remember_token:this.props.remember_token,   
    }
    handler={
        createStep:(callback?)=>{
            const { completeUrl } = getRouterURLArray('products',"dikunjungi");
            const url = `${completeUrl}${this.member.id}`
            const headers = httpHeader(device,this.member.remember_token) 
            sendHttpGET(url,headers,(rsp)=>{
                const { count } = rsp.data.result;
                const stepData = parseInt((count/10).toFixed());
                let arrayData = [];
                if(count>10){
                    for(let i=0;i<=stepData;i++){
                        arrayData.push(i*10);
                    }
                }else{
                    arrayData = ["0"];
                }

                this.setState({steps:arrayData},()=>{
                    callback();
                })

            })
        },
        initialize:()=>{
            this.handler.createStep(()=>{
                
                    this.handler.composeHttp(this.state.offset)
                
            });
        },
        composeHttp:(offset)=>{
            const {steps,lastOffset,products,isLoading}=this.state;
            if(!isLoading){
                this.setState({isLoading:true},()=>{
                    if(lastOffset!=offset && steps[offset]!=undefined){
                            const {completeUrl} = getRouterURLArray("products","dikunjungi")
                            const headers = httpHeader(device,this.member.remember_token) 
                            const url = `${completeUrl}${this.member.id}/${steps[offset]}`
                            sendHttpGET(url,headers,(response)=>{
                                const { result } = response.data;
                                let product = products.length < 1 ? result : products.concat(result);
                                this.setState({lastOffset:offset,offset:offset+1,products:product,isLoading:false});
                            })
                        
                    }else{
                        setTimeout(()=>{
                            this.setState({isLoading:false})
                        },5000)
                    }
                })
            }
        },
        renderProduct:(props)=>{
           // console.log(props.data);
            const {item}= props
            let prd;
            if(!item.isZeroContent){
                prd = item.product; 
                const { id,foto,isAvailable } = prd;
                const loadPhoto = getURLGambar(foto);
                
                return(
                <TouchableOpacity 
                    onPress={()=>{
                        const {navigation} = this.props
                        if(isAvailable=="NA"){
                            alert("Produk tidak tersedia lagi")
                        }else{
                            const page = navigation.getParam("pages")
                            const navbackparams = NavRouteBackFunction(navigation.state.routeName,{pages:page,product_id:id});
                            navigation.push("DetailProduct",navbackparams)
                        }
                    }}
                    style={{
                        flex:1,
                        height:240,
                        borderRadius:4,
                        borderColor:warna.e3e3e3,
                        borderWidth:0.7,
                        
                        marginHorizontal:2,
                        marginVertical:5,
                    }}>
    
                    <View 
                        style={{flex:2}}>
                        <Image
                            source={{uri:loadPhoto}}
                            style={{
                                width:'100%',
                                height:'100%',
                                resizeMode:'cover'
                            }}
                            />
                    </View>
                    <View style={{flex:1,paddingHorizontal:10,justifyContent:'center'}}>
                        <Text  style={{fontWeight:'200',fontSize:18}}>
                            {prd.name}
                        </Text>
                        <Text  style={{fontWeight:'200',fontSize:14,color:warna.alizarin}}>
                            IDR. {formatCurrency(prd.price)}
                        </Text>
                        
                        <Text style={{
                            fontWeight:'200',
                            fontSize:14,
                            color:isAvailable=="NA" ? warna.alizarin : warna.greenSea,
                            borderColor:isAvailable=="NA" ? warna.alizarin : warna.greenSea,
                            borderWidth:0.7,
                            paddingVertical:4,
                            marginTop:5,
                            alignContent:'center',
                            alignItems:'center',
                            textAlign:'center'
                            }}>
                            {getAvail(isAvailable)}
                        </Text>
                        
                    </View>
                </TouchableOpacity>
                )

            }else{
                return(<View style={{
                    flex:1,
                   
                }}>
                </View>
                )                
            }
        },
    }
    componentDidMount(){
        const {navigation} = this.props;
        const thisRoute = navigation.state.routeName;
        navigation.addListener("willFocus",payload=>{
            if( payload.state.routeName == thisRoute){
                this.handler.initialize();
            }
        })        
    }
    render() {
        return (
            <SafeAreaView style={style.appContainer}>
                <StatusBar
                    barStyle="dark-content" />
                <View style={[style.navContainer,style.flexRow,style.lineSepa]}>
                    <View style={{flex:1,justifyContent:'center'}}>
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
                    <View style={{
                        flex:1,
                        justifyContent:"center",
                        alignItems:"center",
                        alignContent:"center"
                        }}>
                            <Text style={[style.navTextStyle]}>Terakhir Dilihat</Text>
                    </View>                   
                    <View style={{flex:1}}></View>                   
                </View>
                <View style={[style.contentContainer]}>
                                     <FlatList
                        data={getItems(this.state.products)}
                        renderItem={(items)=>{
                            const { item } = items;
                            return <this.handler.renderProduct item={item}/>;
                        }}
                        numColumns={2}
                        onEndReached={()=>{
                            console.log('re');
                            if(!this.state.isLoading){
                                this.handler.composeHttp(this.state.offset);

                            }else{
                                console.log("PLEASE WAIT");
                            }
                        }}
                        ListFooterComponent={this.state.isLoading?<ActivityIndicator style={{alignSelf:'center'}}/>:<View style={{padding:60}}></View>}
                        onEndReachedThreshold={0}                        
                        keyExtractor={(item,index)=>{
                            const keys = "abcdefghij1234567890";
                            const splits = keys.split("");
                            const lenRand = splits.length-1;
                            const jumlahPerulangan = 30;
                            let arrdata = [];
                            for(let o=0;o<jumlahPerulangan;o++){
                                const rand = parseInt((Math.random()*lenRand).toFixed());
                                if(o%5==0&&o!=0){
                                    arrdata.push("-");
                                }
                                arrdata.push(splits[rand]);
                            }
                            const d = `${arrdata.join("")}-${item.id}`;
                            //console.log(d);
                            return d;
                        }}
                        />

                </View>
            </SafeAreaView>
        )
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
export default connect(mapStateToProps, mapDispatchStateToProps)(TerakhirDilihat)

