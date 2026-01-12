import axios from "axios";
import { DiseasesIdentificationResponse } from "../interface/DiseasesIdentificationResponse.inteface";
import { SingleSpeciesIdentificationResponse } from "../interface/SingleSpeciesIdentificationResponse.interface";
import { VarietiesIdentificationResponse } from "../interface/VarietiesIdentificationResponse.interface";
import FormData from "form-data";

export class PlantNetService {

  private static async GetToken() {
    const { data } = await axios.get("https://plant-pied-nine.vercel.app/plant/key")
    return data
  }

  static async CheckHealthAPI(): Promise<boolean> {
    try {
      const { data } = await axios.get<{ status: string }>(
        "https://my-api.plantnet.org/v2/_status"
      )
      console.log("API response:", data)
      return data.status === "ok"
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("Axios error:", error.message)
        console.log("Status code:", error.response?.status)
      } else {
        console.log("Unknown error:", error)
      }
      return false
    }
  }


  static async CheckCount() {
    const date = new Date()
    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString().split('T')[0]
    console.log(today)
    const { data } = await axios.get<{
      day: string,
      quota: {
        identify: {
          count: number
          total: number
          remaining: number
        }
      }
    }>(`https://my-api.plantnet.org/v2/quota/daily?day=${today}&api-key=${await this.GetToken()}`)

    console.log(data)

    if (data.quota.identify.count >= data.quota.identify.total) {
      return false
    }

    return true
  }

  static async singleSpeciesIdentification(imageUri: string): Promise<Pick<SingleSpeciesIdentificationResponse, 'results'>> {
    try {
      const formData = new FormData();

      formData.append('images', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      formData.append('organs', 'auto');

      const response = await fetch(
        'https://my-api.plantnet.org/v2/identify/all' +
        `?api-key=${await this.GetToken()}` +
        '&nb-results=1' +
        '&include-related-images=false' +
        '&no-reject=false' +
        '&type=kt' +
        '&detailed=true' +
        '&lang=en',
        {
          method: 'POST',
          body: formData as any,
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.warn('PlantNet API returned an error:', response.status, text);
        return { results: [] };
      }

      const data: SingleSpeciesIdentificationResponse = await response.json();
      console.log('PlantNet response:', data.results);

      return { results: data.results };
    } catch (error) {
      console.error('Failed to identify species:', error);
      return { results: [] };
    }
  }

  static async DiseasesIdentification(
    imageUri: string
  ): Promise<Pick<DiseasesIdentificationResponse, 'results'>> {
    try {
      const formData = new FormData();

      formData.append('images', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      formData.append('organs', 'auto');

      const response = await fetch(
        'https://my-api.plantnet.org/v2/diseases/identify' +
        `?api-key=${await this.GetToken()}` +
        '&nb-results=5' +
        '&include-related-images=false' +
        '&no-reject=false' +
        '&lang=en',
        {
          method: 'POST',
          body: formData as any,
          headers: {
            Accept: 'application/json',
          },
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.warn(
          'PlantNet Diseases API returned an error:',
          response.status,
          text
        );
        // Возвращаем безопасный результат, если сервер вернул ошибку
        return { results: [] };
      }

      const data: DiseasesIdentificationResponse = await response.json();
      console.log('PlantNet Diseases response:', data.results);

      return { results: data.results };
    } catch (error) {
      console.error('Failed to identify disease:', error);
      return { results: [] };
    }
  }

  async VarietiesIdentification(
    imageUri: string,
  ): Promise<Pick<VarietiesIdentificationResponse, 'results'>> {
    try {
      const formData = new FormData();

      formData.append('images', {
        uri: imageUri,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      formData.append('organs', 'auto');

      const response = await fetch(
        'https://my-api.plantnet.org/v2/varieties/identify' +
        '?api-key=2b10cy7DbYHfjrh94iZ7iMgqu' +
        '&nb-results=5' +
        '&include-related-images=false' +
        '&no-reject=false' +
        '&lang=en',
        {
          method: 'POST',
          body: formData as any,
          headers: {
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data: VarietiesIdentificationResponse = await response.json();
      console.log('PlantNet response:', data.results);

      return { results: data.results };
    } catch (error) {
      console.log(error);
      return { results: [] };
    }
  }
}
