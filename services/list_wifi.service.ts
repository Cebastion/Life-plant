import axios from "axios";
import { IListWiFi, IListWiFiGet } from "../interface/listwifi.interface";

export class ListWiFiService {
  static async GetListWiFi() {
    const { data } = await axios.get<IListWiFiGet>("<URL>")
    return data
  }

  static async SaveListWiFi(list_wifi: IListWiFi[]) {
    const { data } = await axios.post("<URL>", list_wifi)
    return data
  }
}
