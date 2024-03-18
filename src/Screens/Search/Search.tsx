import { i18n, LocalizationKey } from "@/Localization";
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, Dimensions, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { HStack, Spinner, Heading, Toast } from "native-base";
import { User } from "@/Services";
import { themeVariables } from "@/Theme";
import { LinearGradient } from "expo-linear-gradient";
import { MainScreens } from "..";
import { unescape, upperCase } from "lodash";
// import { RouteProp } from '@react-navigation/native';
// type SearchStackParamList = {
//   SearchScreen: { query?: string };
//   // ... other screens ...
// };

export interface ISearchProps {
  onNavigate: (screen: MainScreens) => void;
  // route: RouteProp<SearchStackParamList, 'SearchScreen'>;
}

const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;
interface inforPobs {
  ten: string,
  hoatChatChinh: string,
  SDK: string,
  SQD: string,
  xuatSu: string,
  congTy: string,
  diaChiSX: string,
}
export function InforContainer({ infor }: { infor: inforPobs }) {
  return (
    <View style={styles.result_container}>
      <View style={styles.result_name}>
        <Text style={{ color: 'white', fontWeight: '500' }}>{infor.ten}</Text>
      </View>
      <View style={styles.result_infro}>
        <Text style={{ fontWeight: 'bold' }}>{infor.congTy}</Text>
        <View style={{ flexDirection: 'row', columnGap: 10 }}>
          <Text >SĐK: {infor.SDK}</Text>
          <Text>SQĐ: {infor.SQD}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold' }}>Main active ingredient </Text>
          <Text>{infor.hoatChatChinh}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold' }}>Address</Text>
          <Text>{infor.diaChiSX}</Text>
        </View>
        <View>
          <Text style={{ fontWeight: 'bold' }}>Origin</Text>
          <Text>{infor.xuatSu}</Text>
        </View>
      </View>
    </View>

  )
}

export const Search = (props: ISearchProps) => {
  const { onNavigate } = props;
  // const { route } = props;
  const [success, setSuccess] = useState(false);
  // const query = route.params?.query;
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<inforPobs[]>([]);

  async function handleSearch() {
    if (searchText === "") {
      alert('please enter medicines name');
    }
    setLoading(true);
    await fetch(`https://medifind-be.proudsea-d3f4859a.eastasia.azurecontainerapps.io/api/v1/drug/${searchText}`)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        setSuccess(true);
        setRes(searchText);
        setSearchHistory([searchText, ...searchHistory]);
        if (data.status === "success") {
          setSearchResult(data.data.result);
        } else {
          console.error("Error searching for medicine: Invalid response status");
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error searching for medicine:", error);
      });
  };
  function handleAgain() {
    setLoading(false);
    setSuccess(false);
    setSearchResult([]);
    setSearchText("");


  };


  const [res, setRes] = useState<string>("");
  const [searchHistory, setSearchHistory] = useState<string[]>(['Panadol Extra', 'Phospholugel', 'Cometrix']);
  return (
    <View style={styles.container}>
      <Text style={{ fontWeight: 'bold', fontSize: 24 }} >Search</Text>
      <View style={styles.searchContainer} >
        <Image source={success ? require('./images/SearchSucces.png') : require('./images/Search.png')} style={styles.iconSearch}></Image>
        <TextInput placeholder="Search medicines" value={searchText} onChangeText={setSearchText} style={success ? styles.textInputSucces : styles.textInput}></TextInput>
        <TouchableOpacity style={styles.btnSearch} onPress={handleSearch}>
          <Text>GO</Text>
        </TouchableOpacity>
      </View>
      {
        loading === false && success === false && (
          <View style={styles.historyContainer}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>Recently search</Text>
            <View>
              {
                searchHistory.map((el, index) =>
                  <Text style={{ color: '#ADADAD', fontWeight: 'bold' }} key={index}>{el}</Text>
                )
              }
            </View>
          </View>
        )
      }
      {
        success === true && (
          <View style={styles.historyContainer}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
              <View ><Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>{res}</Text></View>
              <TouchableOpacity onPress={handleAgain} >
                <Text style={{ color: '#ADADAD', fontWeight: 'bold' }}>Search again</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={{ marginBottom: 200 }}>
              {
                searchResult.map((el, index) => <InforContainer infor={el} key={index} />)
              }
            </ScrollView>

          </View>
        )
      }
      {
        loading === true && (
          <View>
            <Text>searching...</Text>
          </View>
        )
      }

    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
    alignItems: 'center'
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: width * 90 / 100,
    height: 70,
    alignItems: 'center',
    marginTop: 20
  },
  textInput: {
    backgroundColor: '#ADADAD',
    width: width * 75 / 100,
    height: 60,
    borderRadius: 10,
    paddingLeft: 55
  },
  textInputSucces: {
    backgroundColor: '#F5F5F5',
    width: width * 75 / 100,
    height: 60,
    borderRadius: 10,
    paddingLeft: 55
  }, iconSearch: {
    position: 'absolute',
    zIndex: 10000,
    left: 5
  },
  btnSearch: {
    backgroundColor: '#BDE0FE',
    height: 60,
    width: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  historyContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: width * 90 / 100,
    marginTop: 20
  },
  result_container: {
    width: width * 90 / 100,
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 20,
    borderColor: '#ADADAD',
    borderWidth: 1
  },
  result_name: {
    width: width * 90 / 100,
    backgroundColor: '#244EB9',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    height: 40,
    justifyContent: 'center',
    paddingLeft: 10
  },
  result_infro: {
    padding: 10,
    rowGap: 10
  }
});

