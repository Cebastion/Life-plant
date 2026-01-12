import { Text, View } from "react-native"
import ModalAddWiFi from "../components/ModalAddWiFi"
import { useState } from "react";
import AddCircle from "../components/AddCircle";
import WiFiBlock from "../components/WiFiBlock";
import { useGetListWiFiQuery } from "../store/slice/list_wifi.slice";

const List_Wifi = () => {
  const [isModalVisible, setModalVisible] = useState(false);
  const { data: ListWifi } = useGetListWiFiQuery()

  console.log(ListWifi)

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <View style={{ position: "relative", paddingTop: 16 }}>
      {ListWifi?.WiFis.map((wifi, index) => (
        <WiFiBlock key={index} ssid={wifi.ssid} password={wifi.password} />
      ))}
      <ModalAddWiFi visible={isModalVisible} onClose={toggleModal} />
      <AddCircle Function={toggleModal} />
    </View>
  )
}

export default List_Wifi
