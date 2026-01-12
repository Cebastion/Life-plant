import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const WebSite = () => {
  const { name } = useLocalSearchParams<{ name: string }>();

  return (
    <WebView
      style={styles.container}
      source={{ uri: `https://gd.eppo.int/taxon/${name}` }}
    />
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});



export default WebSite
