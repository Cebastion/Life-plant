import axios from "axios";
import { IListWiFi, IListWiFiGet } from "../interface/listwifi.interface";

export class ListWiFiService {
  static async GetListWiFi() {
    const { data } = await axios.get<IListWiFiGet>("https://plant-pied-nine.vercel.app/setting")
    return data
  }

  static async SaveListWiFi(list_wifi: IListWiFi[]) {
    const { data } = await axios.post("https://plant-pied-nine.vercel.app/plant", list_wifi)
    return data
  }
}
