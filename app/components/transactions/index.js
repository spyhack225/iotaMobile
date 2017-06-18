import React from "react";
import styled from "styled-components/native";
import {
  FlatList,
  View,
  TextInput,
  Text,
  Dimensions,
  TouchableOpacity,
  Modal,
  Clipboard,
  Image,
  RefreshControl
} from "react-native";
import Iota, { Valid } from "../../libs/iota";
import { formatAmount, getDate } from "../../libs/utils";

import Transaction from "./modal";

export default class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      account: false,
      loading: true,
      item: [],
      modalVisible: false
    };
  }
  componentWillReceiveProps(props) {
    const loading = props.loading ? true : false;
    this.setState({ loading: loading, account: props.account });
  }

  componentWillMount() {
    this.setState({
      account: this.props.account,
      loading: false
    });
  }

  setModalVisible = item => {
    if (item) {
      this.setState({ item: item, modalVisible: true });
    } else {
      this.setState({ item: false, modalVisible: false });
    }
  };

  copy = address => {
    Clipboard.setString(address);
    alert("Copied to clip board");
  };

  _onRefresh = () => {
    this.setState({ loading: true });
    this.props.screenProps.getWallet();
    console.log("Pull to Refresh Actioned");
  };

  render() {
    var { item, account, loading, refreshing } = this.state;
    return (
      <Wrapper>
        <FlatList
          data={
            !account
              ? []
              : account.transfers.sort(
                  (a, b) => b[0].timestamp - a[0].timestamp
                )
          }
          refreshing={this.state.loading}
          onRefresh={() =>
            <RefreshControl
              refreshing={this.state.loading}
              onRefresh={this._onRefresh()}
            />}
          keyExtractor={(item, index) => index}
          renderItem={({ item, index }) =>
            <Item
              key={index}
              width={width}
              onPress={() => this.setModalVisible(item)}
            >
              <Row>
                <Header {...item[0]}>
                  {formatAmount(item[0].value, "bal")}
                  {" "}
                  <Unit>{formatAmount(item[0].value, "unit")}</Unit>
                </Header>
                {account.addresses.some(addy => addy === item[0].address)
                  ? <Row center>
                      <Text>Recieved</Text>

                      <Image
                        source={require("../../assets/recieved.png")}
                        style={{ width: 30, height: 30, marginLeft: 10 }}
                      />
                    </Row>
                  : <Row center>
                      <Text>Sent</Text>

                      <Image
                        source={require("../../assets/icons8-logout_rounded_filled.png")}
                        style={{ width: 30, height: 30, marginLeft: 10 }}
                      />
                    </Row>}

              </Row>
              <Row>
                <Text>
                  {item[0].persistence ? "Confirmed" : "Pending"}
                </Text>
                <Text>
                  {getDate(item[0].timestamp)}
                </Text>
              </Row>
            </Item>}
        />
        <Transaction
          item={item}
          modalVisible={this.state.modalVisible}
          setModalVisible={this.setModalVisible}
        />
      </Wrapper>
    );
  }
}
const { height, width } = Dimensions.get("window");

const Wrapper = styled.View`
  flex: 1;
`;
const Item = styled.TouchableOpacity`
    width: ${props => props.width + "px"};
    padding: 5% 10%;
    margin-bottom: 5px;
    background: white;
`;

const Row = styled.View`
    display: flex;
    flex-direction: row;
    align-items: ${props => (props.center ? "center" : "flex-start")};
    justify-content: space-between;
    background: white;
`;

const Header = styled.Text`
    font-size: 30px;
    margin-bottom: 10px;
`;

const Unit = styled.Text`
    font-size: 26px;
`;
