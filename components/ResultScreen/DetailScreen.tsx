import { useNavigation, useRoute } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import { Dimensions, ActivityIndicator, TouchableOpacity, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Text } from 'react-native';
import { TokenContext } from "../GlobalContext";
import { AxiosHelper } from "../AxiosHelper";
import { DETAILS, LIS } from "../ApiUrl";
import styled from 'styled-components/native';
import { ScrollView } from 'react-native';
import moment from "moment";
import { Table, Row, Rows, Cell, TableWrapper } from 'react-native-table-component';
import Accordion from 'react-native-collapsible/Accordion';
import { PatientData } from ".";
import RangeValues from "./DetectHigherValue";

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
    padding: 5px;
    border-radius: 10px;
  `;

  const InfoWrapper = styled(View)`
    margin: 2px;
    display: flex;
    flex-direction: row;
  `;

  const InfoHeader = styled(Text)`
    font-weight: 700;
    font-size: 12px;
    color: black;
  `;

  const InfoContent = styled(Text)`
    font-size: 12px;
    color: black;
    padding-left: 10px;
  `;

  return(
    <View>
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

const _TABLE_HEADER = {
  item: ['TÊN XÉT NGHIỆM', 'KẾT QUẢ', 'ĐƠN VỊ', 'GIÁ TRỊ THAM CHIẾU', 'THIẾT BỊ'],
  widthArr: [250, 100, 100, 100, 100]
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { backgroundColor: '#ffffff' },
  headText: { margin: 3, color: '#000', fontWeight: '900', paddingLeft: 10 },
  testNameWrapper: {backgroundColor: '#dddddd'},
  testNameText: { color: 'blue', margin: 6, fontWeight: '900', paddingLeft: 10 },
  text: { margin: 10, color: '#000', paddingLeft: 10 },
  dataWrapper: { marginTop: -1 },
  row: { backgroundColor: '#ffffff', flexDirection: 'row' }
});

const DetailScreen = () => {
  const { width, height }         = Dimensions.get("window");
  const navigation                = useNavigation();
  const route                     = useRoute();
  const { patientId }             = route.params;
  const { authorized, setToken }  = useContext(TokenContext);
  const [loading, setLoading]     = useState(true);
  const [lisData, setLis]         = useState({
    profile : {},
    lis: []
  });

  useEffect(() => {
    const controller1 = new AbortController();
    const controller2 = new AbortController();
    const profile = AxiosHelper(`${DETAILS}/${patientId}`, "get", {
      headers: {
        'Authorization': `Bearer ${authorized.token}`
      },
      signal: controller1.signal
    });
    const lis = AxiosHelper(`${LIS}/${patientId}`, "get", {
      headers: {
        'Authorization': `Bearer ${authorized.token}`
      },
      signal: controller1.signal
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
              childrens   : [[_item.testName, _item.result, _item.measureUnit, _item.normalLevel, _item.deviceName]]
            })
          } else {
            _lisData[_index].childrens.push([_item.testName, _item.result, _item.measureUnit, _item.normalLevel, _item.deviceName]);
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
      .finally(() => {
        setLoading(false);
      });
      return(() => {
        controller1.abort();
        controller2.abort();
      })
  }, []);

  if (loading) {
    return(
      <View style={{
        height: height,
        width: width,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>
    )
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
      <PatientInfo patientData={lisData.profile}/>
      <ScrollView style={{height: '100%', width: '100%', flex: 1, paddingTop: 10}} horizontal>
        <View>
          <Table borderStyle={{borderWidth: 1, borderColor: '#868686'}}>
            <Row data={_TABLE_HEADER.item} widthArr={_TABLE_HEADER.widthArr} style={styles.head} textStyle={styles.headText}/>
          </Table>
          <ScrollView style={styles.dataWrapper}>
            <Table borderStyle={{borderWidth: 1, borderColor: '#868686'}}>
              {
                lisData.lis.map((item, index) => (
                  <React.Fragment>
                    <Row
                      key={"_HEADER_" + index}
                      data={[item.testtypeName]}
                      style={styles.testNameWrapper}
                      textStyle={styles.testNameText}
                    />
                    
                    {item.childrens.map((rowData, rowIndex) => {
                      const mode = RangeValues(rowData);
                      return(
                        <TableWrapper key={"_ROW_" + rowIndex} style={styles.row}>
                          {
                            rowData.map((cellData, cellIndex) => {
                              return(
                                <Cell key={"_CELL_" + cellIndex} data={cellData} textStyle={{...styles.text, color: (cellIndex === 1 && mode === 'H') ? 'red' : (cellIndex === 1 && mode === 'L') ? 'blue' : 'black'}} style={{borderWidth: 1, borderColor: 'black', width: _TABLE_HEADER.widthArr[cellIndex]}}/>
                              );
                            })
                          }
                        </TableWrapper>
                      )
                    })}
                  </React.Fragment>
                ))
              }
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  )
}

export default DetailScreen;