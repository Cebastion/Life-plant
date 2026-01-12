import { WebView } from 'react-native-webview';
import { StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const WebSite = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <WebView
      style={styles.container}
      source={{ uri: `https://powo.science.kew.org/taxon/urn:lsid:ipni.org:names:${id}` }}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export default WebSite
