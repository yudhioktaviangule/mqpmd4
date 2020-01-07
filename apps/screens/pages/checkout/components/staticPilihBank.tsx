import React, { Component, Fragment } from "react";
import { Text, View, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { home } from "../../Stylish";
import { Feather } from "../../../../../RouterModule";
import { warna, device } from "../../../../constants";
import { httpHeader } from "../../../../service-function";
import {
  getRouterURLArray,
  getURLGambar
} from "../../../../constants/ConstantURLs";
import { sendHttpGET } from "../../../../service-function/httpService";
import { FlatList } from "react-native-gesture-handler";
import { Avatar } from "react-native-elements";

const style = home;

class StaticPilihBank extends Component<any> {
  header = httpHeader(device, this.props.remember_token);
  state = {
    topText: "Pilih Metode Pembayaran",
    lists: [],
    selecting: false,
    bank_id: 0,
    atasnama:'',
    rekening:'',
    stillLoading:true,
    bankName:'',
  };
  handlers = {
    renderPilihanBank: props => {
      const { iconbank, namabank, atasnama, id } = props;
      let foto = getURLGambar(iconbank);
      return (
        <TouchableOpacity
          onPress={() => {
            this.setState({
              topText: "Informasi Nomor Rekening Pembeli",
              selecting: false,
              bank_id: id,
              bankName:'Transfer Bank '+namabank
            });
          }}
          style={[style.flexRowCenter]}
        >
          <Avatar size="small" source={{ uri: foto }} />
          <View style={[{ flex: 1,marginLeft:10 }]}>
            <Text style={[style.titleTextStyle]}>{namabank}</Text>
            <Text style={[style.thinText]}>{atasnama}</Text>
          </View>
        </TouchableOpacity>
      );
    },
    renderFlatBank: () => {
      if (this.state.selecting) {
        return (
          <FlatList
            data={this.state.lists}
            renderItem={item => {
              return <this.handlers.renderPilihanBank {...item.item} />;
            }}
            keyExtractor={item => {
              return "itmels-" + item.id;
            }}
          />
        );
      } else {
        return (
          <Fragment>
            <View style={[style.smallContainer]}>
              <TextInput
                style={[style.inputBoxStyle,style.lineSepa]}
                placeholder="Atas Nama Rekening Pembeli"
                onChangeText={(text)=>{
                    this.setState({atasnama:text})
                }}

              />
            </View>
            <View style={[style.smallContainer]}>
              <TextInput
                style={[style.inputBoxStyle,style.lineSepa]}
                placeholder="Nomor Rekening Pembeli"
                keyboardType="number-pad"
                onChangeText={(text)=>{
                    this.setState({rekening:text})
                }}
              />
            </View>
            
            <View style={[style.smallContainer,style.flexRowCenter]}>
              <TouchableOpacity 
                onPress={()=>{
                    this.props.setBank({
                        bank:this.state.bank_id,
                        atasnama:this.state.atasnama,
                        rekening:this.state.rekening,
                        namaBank:this.state.bankName,
                        isSelecting:false,
                    })
                }}
                style={[{borderRadius:5,flex:1,borderColor:warna.alizarin,borderWidth:1},style.padding]}>
                  <Text style={[style.textRed,{alignItems:'center',alignContent:'center',alignSelf:'center'}]}>KIRIM</Text>
              </TouchableOpacity>
            </View>

          </Fragment>
        );
      }
    },
    getBanks: () => {
      const { completeUrl } = getRouterURLArray("bank", "bank");

      sendHttpGET(completeUrl, this.header, response => {
        let data = response.data.result;
        this.setState({ lists: data, selecting: true,stillLoading:false });
      });
    }
  };

  componentDidMount() {
      this.setState({stillLoading:true},()=>{
          this.handlers.getBanks();
      })
  }
  render() {
    if(this.state.stillLoading){
        return(
        <View style={[style.appContainer,style.bgContent,{justifyContent:'center',alignContent:'center',alignItems:'center'}]}>
            <ActivityIndicator/>
        </View>
        )
    }else{
        return (
          <View style={[style.appContainer, style.bgContent]}>
            <View
              style={[
                style.flexRow,
                style.smallContainer,
                style.fluidMore,
                style.lineSepa,
                { justifyContent: "space-between" }
              ]}
            >
              <Text style={[style.titleTextStyle]}>{this.state.topText}</Text>
              <TouchableOpacity
                onPress={() => {
                  this.props.clickReturn();
                }}
                style={{ paddingLeft: 20 }}
              >
                <Feather name="x-circle" color={warna.alizarin} size={20} />
              </TouchableOpacity>
            </View>
            <View style={[style.smallContainer, style.fluidMore]}>
              <this.handlers.renderFlatBank />
            </View>
          </View>
        );

    }
  }
}

export default StaticPilihBank;
