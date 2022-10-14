import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { DETAILS, DETALLS } from "../ApiUrl";
import { AxiosHelper } from "../AxiosHelper";
import { TokenContext } from "../GlobalContext";
import styled from 'styled-components/native';
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { CHANGE_PASSWORD_SCREEN, DETAIL_SCREEN, LOGIN_SCREEN } from "../Constant";
import { StyledComponents } from "../LoginScreen";
import { ClearToken } from "../SqlLiteHelper";
import { Table, Row } from 'react-native-table-component';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ResultWrapper = styled(View)`
  padding: 20px;
  height: ${(props: StyledComponents) => props.height}px;
  display: flex;
`;

const ResultHeader = styled(Text)`
  color: black;
  font-weight: 900;
  font-size: 20px;
`;

const InfoContainer = styled(View)`
  border-width: 1px;
  border-color: #167c74;
  padding: 10px;
  border-radius: 10px;
  margin: 10px 0;
`;

const InfoWrapper = styled(View)`
  margin: 10px;
`;

const InfoHeader = styled(Text)`
  font-weight: 700;
  font-size: 17px;
  color: black;
`;

const InfoContent = styled(Text)`
  font-size: 18px;
  color: black;
  padding-left: 10px;
`;

const _TABLE_HEADER = {
  item: ['Họ và tên', 'Ngày khám', 'Mã khám', 'Đơn vị chỉ định', 'Bác sĩ chuẩn đoán', 'Đối tượng'],
  widthArr: [150, 150, 100, 150, 150, 150]
};

export type PatientData = {
  barcode: string | null;
  branchCode: string | null;
  createBy: string | null;
  createDate: Date | null;
  departmentName: string;
  diagnostic: string;
  doctorassignName: string;
  hisPatientId: number;
  identifyNumber: string;
  inputDate: Date
  lisPatientId: number
  modifyBy: string | null
  modifyDate: Date | null
  numberCard: number
  objecttypeName: string
  patientAddress: string
  patientBirth: Date
  patientCode: number
  patientEmail: string
  patientInfoId: number
  patientName: string
  patientOffice: string | null
  patientSex: number
  phoneNumber: string
  smsSent: number
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { backgroundColor: '#ffffff' },
  text: { margin: 6, color: '#000' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
});

const ResultScreen: React.FC = () => {
  const { width, height }         = Dimensions.get("window");
  const { authorized, setToken }  = useContext(TokenContext);
  const [result, setResult]       = useState<any[][]>([]);
  const [rawData, setRaw]         = useState([]);
  const [showMenu, setShow]       = useState(false);
  const navigation                = useNavigation();

  useEffect(() => {
    AxiosHelper(DETALLS, "get", {
      headers: {
        'Authorization': `Bearer ${authorized.token}`
      }
    })
      .then(r => {
        const responseData = r.data.data;
        setRaw(responseData)
        let _result = [];
        for (const _item of responseData.tests) {
          _result.push([_item.patientName, moment(_item.inputDate).format("DD/MM/YYYY HH:mm:ss"), _item.patientCode, _item.departmentName, _item.doctorassignName, _item.objecttypeName]);
        }
        setResult(_result);
      })
      .catch(e => {
        __DEV__ ? console.error("RESULT:", e.message) : undefined;
      })
  }, []);

  const TriggerMenu = () => {
    setShow(!showMenu);
  }

  const Logout = () => {
    ClearToken()
      .catch(e => {
        console.log("LOGOUT:", e.message)
      })
      .finally(() => {
        navigation.reset({
          index: 0,
          routes: [{name: LOGIN_SCREEN}]
        });
      });
  }

  const Go2ChangePassword = () => {
    navigation.navigate(CHANGE_PASSWORD_SCREEN);
  }

  const GetDetail = (patientId: number) => {
    navigation.navigate(DETAIL_SCREEN, {
      patientId: patientId
    });
  }

  return(
    <ResultWrapper height={height}>
      <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginBottom: 20}}>
        <TouchableHighlight
          style={{marginTop: 5, flexDirection:'row', flexWrap:'wrap'}}
          activeOpacity={0.6}
          underlayColor="#ffffff"
          onPress={TriggerMenu}
        >
          <View style={{
            backgroundColor: '#39f',
            padding: 5,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 5,
            display: 'flex',
            flexDirection: 'row'
          }}>
            <Icon name="account" size={20} color="#ffffff" />
            <Text style={{
              marginLeft: 5,
              color: 'white',
              fontSize: 15,
              textAlign: 'center'
            }}>{authorized.fullname}</Text>
          </View>
        </TouchableHighlight>
        {showMenu && (
          <View style={{
            position: 'absolute',
            padding: 10,
            right: 5,
            top: 40,
            backgroundColor: '#dddddd',
            borderRadius: 5,
            zIndex: 99999
          }}>
            <TouchableHighlight
              activeOpacity={0.6}
              underlayColor="#ffffff"
              onPress={Go2ChangePassword}
            >
              <View style={{
                backgroundColor: '#00bd9d',
                padding: 5,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 5
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 15,
                  textAlign: 'center'
                }}>Đổi mật khẩu</Text>
              </View>
            </TouchableHighlight>
            <TouchableHighlight
              style={{marginTop: 5}}
              activeOpacity={0.6}
              underlayColor="#ffffff"
              onPress={Logout}
            >
              <View style={{
                backgroundColor: '#00bd9d',
                padding: 5,
                paddingLeft: 10,
                paddingRight: 10,
                borderRadius: 5
              }}>
                <Text style={{
                  color: 'white',
                  fontSize: 15,
                  textAlign: 'center'
                }}>Đăng xuất</Text>
              </View>
            </TouchableHighlight>
          </View>
        )}
      </View>
      <ResultHeader>Kết quả xét nghiệm bệnh nhân</ResultHeader>
      <ScrollView style={{height: '100%', width: '100%', flex: 1}} horizontal>
        <View>
          <Table borderStyle={{borderWidth: 1, borderColor: '#868686'}}>
            <Row data={_TABLE_HEADER.item} widthArr={_TABLE_HEADER.widthArr} style={styles.head} textStyle={styles.text}/>
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#868686'}}>
              {
                result.map((item, index) => (
                  <Row
                    onPress={() => GetDetail(rawData.tests[index].patientInfoId)}
                    key={index}
                    data={item}
                    widthArr={_TABLE_HEADER.widthArr}
                    style={{...styles.row, backgroundColor: index%2 ? '#ffffff' : undefined}}
                    textStyle={styles.text}
                  />
                ))
              }
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </ResultWrapper>
  )
}

// export default ResultScreen;

export default React.memo(ResultScreen, (prevProps, nextProps) => {
  return false;
});