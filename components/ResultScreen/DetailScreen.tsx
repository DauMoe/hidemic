import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from 'react-native';
import { TokenContext } from "../GlobalContext";
import { AxiosHelper } from "../AxiosHelper";
import { DETAILS, LIS } from "../ApiUrl";
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import moment from "moment";
import { Table, Row, Rows } from 'react-native-table-component';
import Accordion from 'react-native-collapsible/Accordion';
import { PatientData } from ".";

const DetailHeader = styled(Text)`
  color: black;
  font-size: 24px;
  text-align: center;
  font-weight: 700;
`;

const DetailSub = styled(Text)`
  color: black;
  font-size: 14px;
  margin: 5px 0;
  text-align: center;
  font-style: italic;
`;

const LisHeader = styled(Text)`
  color: blue;
  font-weight: 900;
  font-size: 16px;;
`;

const TestName = styled(Text)`
  color: black;
  font-weight: 16px;
  font-weight: 800;
`;

const TestValue = styled(Text)`
  color: black;
  font-weight: 14px;
`;

const PatientInfo = ({patientData}) => {
  const InfoContainer = styled(View)`
    border-width: 1px;
    border-color: #167c74;
    padding: 10px;
    border-radius: 10px;
  `;

  const InfoWrapper = styled(View)`
    margin: 2px;
    display: flex;
    flex-direction: row;
  `;

  const InfoHeader = styled(Text)`
    font-weight: 700;
    font-size: 15px;
    color: black;
  `;

  const InfoContent = styled(Text)`
    font-size: 14px;
    color: black;
    padding-left: 10px;
  `;

  return(
    <View style={{marginTop: 20}}>
      <InfoContainer>
        <InfoWrapper>
          <InfoHeader>Tên bệnh nhân:</InfoHeader>
          <InfoContent>{patientData.patientName ? patientData.patientName : '<Không có thông tin>'}</InfoContent>
        </InfoWrapper>
        <InfoWrapper>
          <InfoHeader>Năm sinh:</InfoHeader>
          <InfoContent>{moment(patientData.patientBirth).format("DD/MM/YYYY")}</InfoContent>
        </InfoWrapper>
        <InfoWrapper>
          <InfoHeader>Giới tính:</InfoHeader>
          <InfoContent>{patientData.patientSex === 1 ? "nam" : "nữ"}</InfoContent>
        </InfoWrapper>
        <InfoWrapper>
          <InfoHeader>SĐT:</InfoHeader>
          <InfoContent>{patientData.phoneNumber ? patientData.phoneNumber : '<Không có thông tin>'}</InfoContent>
        </InfoWrapper>
        <InfoWrapper>
          <InfoHeader>Địa chỉ:</InfoHeader>
          <InfoContent>{patientData.patientAddress ? patientData.patientAddress : '<Không có thông tin>'}</InfoContent>
        </InfoWrapper>
      </InfoContainer>

      <InfoContainer style={{marginTop: 5}}>
        <InfoWrapper>
          <InfoHeader>Mã lần khám:</InfoHeader>
          <InfoContent>{patientData.patientCode ? patientData.patientCode : '<Không có thông tin>'}</InfoContent>
        </InfoWrapper>
        <InfoWrapper>
          <InfoHeader>Khoa/Phòng chỉ định:</InfoHeader>
          <InfoContent>{patientData.departmentName ? patientData.departmentName : '<Không có thông tin>'}</InfoContent>
        </InfoWrapper>
        <InfoWrapper>
          <InfoHeader>Bác sỹ chỉ định:</InfoHeader>
          <InfoContent>{patientData.doctorassignName ? patientData.doctorassignName : '<Không có thông tin>'}</InfoContent>
        </InfoWrapper>
        <InfoWrapper>
          <InfoHeader>Đối tượng:</InfoHeader>
          <InfoContent>{patientData.objecttypeName ? patientData.objecttypeName : '<Không có thông tin>'}</InfoContent>
        </InfoWrapper>
        <InfoWrapper>
          <InfoHeader>Chẩn đoán:</InfoHeader>
          <InfoContent>{patientData.diagnostic ? patientData.diagnostic : '<Không có thông tin>'}</InfoContent>
        </InfoWrapper>
      </InfoContainer>
    </View>
  )
}

const DetailScreen = () => {
  const { width, height }         = Dimensions.get("window");
  const navigation                = useNavigation();
  const route                     = useRoute();
  const { patientId }             = route.params;
  const { authorized, setToken }  = useContext(TokenContext);
  const [lisData, setLis]         = useState({
    profile : {},
    lis: []
  });
  const [activeSec, setActive] = useState([]);

  useEffect(() => {
    const profile = AxiosHelper(`${DETAILS}/${patientId}`, "get", {
      headers: {
        'Authorization': `Bearer ${authorized.token}`
      }
    });
    const lis = AxiosHelper(`${LIS}/${patientId}`, "get", {
      headers: {
        'Authorization': `Bearer ${authorized.token}`
      }
    });
    
    Promise.all([profile, lis])
      .then(r => {
        const patientData = r[0].data.data.patientInfo;
        const listData    = r[1].data.data;

        const listTesttypeName = [], _lisData:any[] = [];
        for(const _item of listData) {
          const _index = listTesttypeName.indexOf(_item.testtypeName);
          if (_index === -1) {
            listTesttypeName.push(_item.testtypeName);
            _lisData.push({
              testtypeName: _item.testtypeName,
              childrens   : [_item]
            })
          } else {
            _lisData[_index].childrens.push(_item);
          }
        }
        setLis({
          profile: patientData,
          lis: _lisData
        })
      })
      .catch(e => {
        if (e.message) {
          console.error("DETAIL:", e.message);
        } else {
          console.error("DETAIL:", e.response);
        }
      })
  }, []);

  const _renderSectionTitle = (section: any) => {
    return (
      <View>
        <LisHeader>{section.testtypeName}</LisHeader>
      </View>
    );
  }

  const _renderSectionContent = (section: any) => {
    const content = section.childrens;
    return (
      <View>
        {content.map((item: any, index: number) => {
          return(
            <View key={"_TEST_" + index} style={{marginLeft: 7}}>
              <TestName>- {item.testName}</TestName>
              <View style={{marginLeft: 18}}>
                <TestValue>Kết quả: {item.result}</TestValue>
                <TestValue>Đơn vị: {item.measureUnit}</TestValue>
                <TestValue>Giá trị tham chiếu: {item.normalLevel}</TestValue>
                <TestValue>Thiết bị: {item.deviceName ? item.deviceName : '<Không có thông tin>'}</TestValue>
              </View>
            </View>
          );
        })}
      </View>
    );
  }

  const _updateSection = (activeSection: any) => {
    setActive(activeSection);
  }

  return(
    <View style={{padding: 20, display: 'flex', height: height}}>
      <View style={{marginBottom: 20}}>
        <View style={{position: "absolute", top: 10, left: 10, zIndex: 9999}}>
          <TouchableOpacity onPress={_ => {navigation.canGoBack() ? navigation.goBack() : undefined}}>
            <Icon name="caret-left" size={30} color="#3d3d3d"/>
          </TouchableOpacity>
        </View>
        <DetailHeader>Kết quả xét nghiệm</DetailHeader>
        <DetailSub>Ngày {moment(lisData.profile.inputDate).format("DD/MM/YYYY HH:mm:ss")}</DetailSub>
      </View>
      <ScrollView style={{flex: 5}}>
        <PatientInfo patientData={lisData.profile}/>
        <Accordion
          sections={lisData.lis}
          activeSections={activeSec}
          renderHeader={_renderSectionTitle}
          renderContent={_renderSectionContent}
          onChange={_updateSection}
        />
      </ScrollView>
    </View>
  )
}

export default DetailScreen;