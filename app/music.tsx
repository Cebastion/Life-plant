import { ScrollView, View } from "react-native"
import { musics } from "../const/music";
import MusicBlock from "../components/MusicBlock";
import { SafeAreaView } from "react-native-safe-area-context";

const Music = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        <View style={{ flexDirection: "column", gap: 5 }}>
          {musics.map((music, index) => (
            <MusicBlock key={index} music={music} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Music
