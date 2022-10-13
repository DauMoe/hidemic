import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { Dimensions, ScrollView, Text, TouchableHighlight, View } from "react-native";
import { DETAILS, DETALLS } from "../ApiUrl";
import { AxiosHelper } from "../AxiosHelper";
import { TokenContext } from "../GlobalContext";
import styled from 'styled-components/native';
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { CHANGE_PASSWORD_SCREEN, DETAIL_SCREEN, LOGIN_SCREEN } from "../Constant";
import { StyledComponents } from "../LoginScreen";
import { ClearToken } from "../SqlLiteHelper";

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

const ResultScreen: React.FC = () => {
  const { width, height }         = Dimensions.get("window");
  const { authorized, setToken }  = useContext(TokenContext);
  const [result, setResult]       = useState([]);
  const navigation                = useNavigation();

  useEffect(() => {
    AxiosHelper(DETALLS, "get", {
      headers: {
        'Authorization': `Bearer ${authorized.token}`
      }
    })
      .then(r => {
        const responseData = r.data.data;
        setResult(responseData.tests);
      })
      .catch(e => {
        console.error("RESULT:", e.message);
      })
  }, []);

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
      <ResultHeader>Kết quả xét nghiệm bệnh nhân</ResultHeader>
      <ScrollView style={{height: '100%', width: '100%', flex: 1}}>
        <View style={{marginTop: 20}}>
          {result.map((item: PatientData, index: number) => {
            return(
              <InfoContainer key={index}>
                <InfoWrapper>
                  <InfoHeader>Tên bệnh nhân:</InfoHeader>
                  <InfoContent>{item.patientName ? item.patientName : '<Không có thông tin>'}</InfoContent>
                </InfoWrapper>
                <InfoWrapper>
                  <InfoHeader>Ngày khám:</InfoHeader>
                  <InfoContent>{moment(item.inputDate).format("DD/MM/YYYY HH:mm:ss")}</InfoContent>
                </InfoWrapper>
                <InfoWrapper>
                  <InfoHeader>Mã khám:</InfoHeader>
                  <InfoContent>{item.patientCode ? item.patientCode : '<Không có thông tin>'}</InfoContent>
                </InfoWrapper>
                <InfoWrapper>
                  <InfoHeader>Đơn vị chỉ định:</InfoHeader>
                  <InfoContent>{item.departmentName ? item.departmentName : '<Không có thông tin>'}</InfoContent>
                </InfoWrapper>
                <InfoWrapper>
                  <InfoHeader>Bác sỹ chuẩn đoán:</InfoHeader>
                  <InfoContent>{item.doctorassignName ? item.doctorassignName : '<Không có thông tin>'}</InfoContent>
                </InfoWrapper>
                <InfoWrapper>
                  <InfoHeader>Đối tượng:</InfoHeader>
                  <InfoContent>{item.objecttypeName ? item.objecttypeName : '<Không có thông tin>'}</InfoContent>
                </InfoWrapper>
                <InfoWrapper>
                  <TouchableHighlight
                    activeOpacity={0.6}
                    underlayColor="#ffffff"
                    onPress={_ => GetDetail(item.patientInfoId)}
                  >
                    <View style={{
                      backgroundColor: '#0474b4',
                      padding: 12,
                      borderRadius: 10
                    }}>
                      <Text style={{
                        color: 'white',
                        fontSize: 15,
                        textAlign: 'center'
                      }}>Chi tiết</Text>
                    </View>
                  </TouchableHighlight>
                </InfoWrapper>
              </InfoContainer>
            )
          })}
        </View>
      </ScrollView>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#ffffff"
        onPress={Go2ChangePassword}
      >
        <View style={{
          backgroundColor: '#00bd9d',
          padding: 12,
          borderRadius: 10
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
          backgroundColor: '#af0075',
          padding: 12,
          borderRadius: 10
        }}>
          <Text style={{
            color: 'white',
            fontSize: 15,
            textAlign: 'center'
          }}>Đăng xuất</Text>
        </View>
      </TouchableHighlight>
    </ResultWrapper>
  )
}

// export default ResultScreen;

export default React.memo(ResultScreen, (prevProps, nextProps) => {
  return false;
});