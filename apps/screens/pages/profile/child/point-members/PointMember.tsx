import React, { Component, Fragment } from 'react'
import { Text, View, SafeAreaView, StatusBar, FlatList } from 'react-native'
import { home } from '../../../Stylish'
import { connect } from 'react-redux';
import { WhiteBackButton } from '../../../componentsData/Header';
import ViewContent from '../../../componentsData/Content';
import { Feather } from '@expo/vector-icons';
import { warna, device } from '../../../../../constants';
import { formatCurrency } from '../../../../../functions/pipes';
import { WhiteLoading } from '../../../componentsData/LoadingComponent';
import { getRouterURLArray } from '../../../../../constants/ConstantURLs';
import { sendHttpGET } from '../../../../../service-function/httpService';
import { httpHeader } from '../../../../../service-function/httpHeader';

const style = home
class PointMember extends Component<any> {
    state = {
        isLoading:false,
        poin:0,
        historis:[],
        historiData:[],
    }
    header={}


    
    handlers={
        renderTop:()=>{
            return(
                <WhiteBackButton
                    {...this.props}
                    title="Poin mannaQueen"/>
            );
        },
        renderContent:()=>{
            return (
                <Fragment>

                    <StatusBar
                    barStyle="dark-content"/>
                <this.handlers.renderTop/>
                <ViewContent>
                    {!this.state.isLoading?(<Fragment>
                        <View style={[style.smallContainer,style.flexRow,style.fluid,{backgroundColor:'white'}]}>
                            <Feather
                                name="credit-card"
                                color={warna.alizarin}
                                />
                            <View style={[{flex:1},style.fluid]}>
                                <View style={{paddingBottom:5}}>
                                    <Text style={[style.boldText,style.textRed]}>
                                        Jumlah Poin
                                    </Text>                                        
                                </View>
                                <Text style={[style.thinText]}>
                                    {formatCurrency(this.state.poin)}
                                </Text>
                            </View>
                        </View>
                       
                        <View style={[style.tinydivider]}></View>
                        
                        <View style={[style.smallContainer,style.flexRow,style.fluid,{backgroundColor:'white'}]}>
                            <Feather
                                name="list"
                                color={warna.alizarin}
                                />
                            <View style={[{flex:1},style.fluid]}>
                                <View style={{paddingBottom:5}}>
                                    <Text style={[style.boldText,style.textRed]}>
                                        Histori
                                    </Text>                                        
                                </View>
                                <View>
                                    <FlatList 
                                        data={this.state.historis}
                                        renderItem={(item)=>{
                                            return (
                                                <View style={[style.flexRowCenter,style.padding]}>
                                                    <View style={{flex:1}}>
                                                        <Text style={[style.boldText]}>
                                                            {item.item.created_at}
                                                        </Text>
                                                        <Text style={[style.thinText]}>
                                                            {item.item.description}
                                                        </Text>
                                                    </View>
                                                    <View style={{flex:1,alignItems:'flex-end'}}>
                                                        <Text style={[style.boldText,style.textRed]}>
                                                            {formatCurrency(item.item.saldo)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            )
                                        }}
                                        keyExtractor={(index)=>{
                                            return index
                                        }}
                                    />
                                </View>
                            </View>
                        </View>
                       
                    </Fragment>):<WhiteLoading/>}
                        
                        
                    
 
                </ViewContent>
                            
                
                </Fragment>
                        );
        },

        getSumPoints:()=>{
            const {id} = this.props;
            const {completeUrl} = getRouterURLArray('members','member_point');
            const URL = `${completeUrl}${id}`;
            sendHttpGET(URL,this.header,(response)=>{
                const {result} = response.data
                this.setState({poin:result.point,isLoading:false})
            })

        },
        initialize:() => {
            const {id} = this.props;
            const {completeUrl} = getRouterURLArray('members','member_point');
            const URL = `${completeUrl}?member_id=${id}`
            sendHttpGET(URL,this.header,(response)=>{
                const {result}= response.data
                let hasil = result.map((v,k)=>{
                    try{
                        let parser = JSON.parse(v.description);
                        return {
                            ...v,
                            description:parser.description
                        }
                    }catch(e){
                        
                        return {...v,description:v.description}
                    }
                })
                this.setState({historiData:result,historis:hasil},()=>{
                    this.handlers.getSumPoints();
                })
            })
        }
    }
    constructor(props) {
        super(props);
        this.header = httpHeader(device,this.props.remember_token);
    }    
    componentDidMount(){
        this.setState({isLoading:true},()=>{
            this.handlers.initialize();
        })
    }
    render() {
        
        return (
            <View style={[style.appContainer]}>
                <SafeAreaView style={[style.appContainer]}>
                    <this.handlers.renderContent/>
                </SafeAreaView>
            </View>
        )
    }
}

const mapStateToProps = state => {
    return state
};

export default connect(mapStateToProps)(PointMember)