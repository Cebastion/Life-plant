import axios from "axios";
import { IPlant } from "../interface/plant.interface";

export class PlantService {
  static async GetPlantData() {
    const { data } = await axios.get<IPlant>("https://plant-pied-nine.vercel.app/plant")
    return data
  }
}
