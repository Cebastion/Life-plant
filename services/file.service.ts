import * as FileSystem from 'expo-file-system/legacy';
import { SettingsState } from '../interface/SettingState.interface';
import { IConfigPlant } from '../interface/configPlant.interface';

export class FileService {

  static async SavePhoto(uri: string) {
    try {
      const dir = FileSystem.documentDirectory + "images/"

      const dirInfo = await FileSystem.getInfoAsync(dir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      }

      const fileName = (uri as string).split('/').pop();
      const dest = dir + fileName;

      await FileSystem.copyAsync({
        from: uri as string,
        to: dest
      });

      console.log('Saved to:', dest);
      return dest;
    } catch (e) {
      console.log('Save error:', e);
    }
  }

  static async SaveConfig(config: SettingsState) {
    console.log(config);
    const dir = FileSystem.documentDirectory + "config/"

    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }

    const FileName = "config.json";
    const dest = dir + FileName;
    const file = await FileSystem.writeAsStringAsync(dest, JSON.stringify(config));

  }

  static async ReadConfig(): Promise<SettingsState> {
    const dir = FileSystem.documentDirectory + "config/"

    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      console.log('Directory does not exist');
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      const FileName = "config.json";
      const dest = dir + FileName;
      await FileSystem.writeAsStringAsync(dest, JSON.stringify({}));
      return {} as SettingsState;
    }

    const files = await FileSystem.readDirectoryAsync(dir);
    const fileRead = await FileSystem.readAsStringAsync(dir + files[0]);

    return JSON.parse(fileRead);
  }

  static async getFiles(): Promise<IConfigPlant> {
    const dir = FileSystem.documentDirectory + "data/";

    const info = await FileSystem.getInfoAsync(dir);
    if (!info.exists) {
      console.log('Directory does not exist');
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
      const FileName = "plant.json";
      const dest = dir + FileName;
      await FileSystem.writeAsStringAsync(dest, JSON.stringify({}));
      return {} as IConfigPlant;
    }

    const files = await FileSystem.readDirectoryAsync(dir);
    const file = await FileSystem.readAsStringAsync(dir + files[0]);
    return JSON.parse(file) as IConfigPlant;
  }
}
