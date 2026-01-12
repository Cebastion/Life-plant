export interface IListWiFi {
  ssid: string;
  password: string;
}

export interface IListWiFiGet {
  WiFis: IListWiFi[],
  length: number
}
