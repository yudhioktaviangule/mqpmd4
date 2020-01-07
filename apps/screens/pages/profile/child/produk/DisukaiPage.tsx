import React from 'react'
import { Text, View, SafeAreaView, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native'
import { MemberDataRedux } from '../../../../../../reducer';
import { device, warna } from '../../../../../constants';
import { connect } from 'react-redux';
import { home } from '../../../Stylish';
import { Feather } from '../../../../../constants/Feather';
import { FlatList } from 'react-native-gesture-handler';
import { httpHeader } from '../../../../../service-function';
import { getRouterURLArray, getURLGambar } from '../../../../../constants/ConstantURLs';
import { sendHttpGET } from '../../../../../service-function/httpService';
import { Image } from 'react-native-elements';
import { formatCurrency } from '../../../../../functions/pipes';
import NavRouteBackFunction from '../../../../../service-function/NavRouteBackFunction';

const style = home
const getAvail = (state)=>{
    
    switch(state){
        case "NA":
            return "NOT AVAILABLE";
        default:
            return "AVAILABLE";
    }
}
const getItems = (items=[])=>{
    //console.log(items);
    let len = items.length;
    let isModTwoZero = len%2==0;
    let listData = items.map(data => {
        return{
            ...data,
            isZeroContent:false,
        }
    });
    if(! isModTwoZero ){
        listData.push({
            isZeroContent:true
        })
    }
    return listData;
}
class DisukaiPage extends React.Component<any> {
    state = {
        likedProducts:[],
        offset:0,
        cardHeight:0,
        maxLoad:0,
        isLoad:true,
        step:[],
        prevOffset:undefined,
    }
    handler = {
        createSteps:(count,callbacks?)=>{
            const steps = parseInt((count/10).toFixed(0));
            
            let step = [];
            if(steps > 0){
                for(let i=0;i<=steps;i++){
                    step.push(i*10);
                }
            }else{
                step = ["0"];
            }
            this.setState({step:step},()=>{
                
                
                callbacks()})
        },
        initialize:()=>{
            const {navigation} = this.props;
            const count = navigation.getParam("pages");
            this.handler.createSteps(count,()=>{
                this.setState({maxLoad:count,isLoad:false},()=>{
                   
                    this.handler.composeHttp(0)
                });

            }) 
        },
        composeHttp:(offset)=>{
            const { id,remember_token } = this.props
            const https = httpHeader(device,remember_token)
            const { completeUrl } = getRouterURLArray("products","liked")
            const { step,prevOffset } = this.state
            if(step[offset]!=undefined && prevOffset!=offset ){
                const  url = `${completeUrl}${id}/${step[offset]}`;
                
                sendHttpGET(url,https,(response)=>{
                    const { result } = response.data
                    let products = result
                    
                    //console.log('state.step',products);
                    this.setState({prevOffset:offset,likedProducts:this.state.likedProducts.length==0?products:this.state.likedProducts.concat(result),isLoad:true,offset:offset+1})
                })
            }
        },        
        renderFlat:(props)=>{
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
        
        renderData:()=>{},
    }
    cardHeight: number;
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
                            <Text style={[style.navTextStyle]}>Produk Disukai</Text>
                    </View>                   
                    <View style={{flex:1}}></View>                   
                </View>
                <View style={[style.contentContainer]}>
                    
                    <FlatList
                        data={getItems(this.state.likedProducts)}
                        renderItem={(item)=>{
                            return(<this.handler.renderFlat item={item.item} />)
                        }}
                        keyExtractor={(item,index)=>{
                            const itemIndex = `Likedproduct.${item.id}`
                            return itemIndex;
                        }}
                        numColumns={2}
                        onEndReached={()=>{
                            if(this.state.isLoad){
                                this.handler.composeHttp(this.state.offset);

                            }else{
                                console.log("PLEASE WAIT");
                            }
                        }}
                        onEndReachedThreshold={0}
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
export default connect(mapStateToProps, mapDispatchStateToProps)(DisukaiPage)

