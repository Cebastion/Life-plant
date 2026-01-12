import React, { useEffect, useRef, useState } from "react";
import { Alert, Animated, Easing, FlatList, Image, StyleSheet, Text, TouchableHighlight, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { PlantNetService } from "../services/plant_net.service";
import { SingleSpeciesIdentificationResponse } from "../interface/SingleSpeciesIdentificationResponse.interface";
import Loading from "../components/Loading";
import { useTheme } from "@react-navigation/native";
import { AppTheme } from "../interface/theme.interface";
import { useRouter } from "expo-router";



const Species = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [Species, setSpecies] = useState<Pick<SingleSpeciesIdentificationResponse, 'results'>>();
  const { colors } = useTheme() as AppTheme;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    if (Species) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [Species]);

  const ActionButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
    <TouchableHighlight
      underlayColor={colors.primary}
      onPress={onPress}
      style={[styles.button, { backgroundColor: colors.backgroundCard }]}
    >
      <Text style={[styles.buttonText, { color: colors.text }]}>{title}</Text>
    </TouchableHighlight>
  );

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the media library is required.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      setImage(result.assets[0].uri);

      const image = result.assets[0];

      const isHealth = await PlantNetService.CheckHealthAPI()
      console.log(isHealth)

      if (!isHealth) {
        Alert.alert("Error", "API is not available");
        return;
      }

      const isCount = await PlantNetService.CheckCount()
      console.log(isCount)

      if (!isCount) {
        Alert.alert("Error", "You have exceeded the number of requests per day. Please try again tomorrow.");
        return;
      }

      const data = await PlantNetService.singleSpeciesIdentification(image.uri).finally(() => {
        setLoading(false);
      });

      if (!data || data.results.length === 0) {
        Alert.alert("Error", "Species not found");
        return;
      }

      setSpecies(data);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert('Permission required', 'Permission to access the camera is required.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      setImage(result.assets[0].uri);

      const image = result.assets[0];

      const isHealth = await PlantNetService.CheckHealthAPI()

      if (!isHealth) {
        Alert.alert("Error", "API is not available");
        return;
      }

      const isCount = await PlantNetService.CheckCount()

      if (!isCount) {
        Alert.alert("Error", "You have exceeded the number of requests per day. Please try again tomorrow.");
        return;
      }

      const data = await PlantNetService.singleSpeciesIdentification(image.uri).finally(() => {
        setLoading(false);
      });

      if (!data || data.results.length === 0) {
        Alert.alert("Error", "Species not found");
        return;
      }

      setSpecies(data);
    }
  };

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.page }]}>
      {!Species && (
        <View style={styles.actions}>
          <ActionButton title="📁 Choose image" onPress={pickImage} />
          <ActionButton title="📷 Take photo" onPress={takePhoto} />
        </View>
      )}

      {image && (
        <Animated.Image
          source={{ uri: image }}
          style={[
            styles.image,
            {
              opacity: fadeAnim,
            },
          ]}
        />
      )}

      {Species && (
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.backgroundCard,
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>
            {Species.results[0].species.scientificName}
          </Text>

          <Text style={[styles.subtitle, { color: colors.primary }]}>
            {Species.results[0].species.family.scientificName}
          </Text>

          <Text style={[styles.label, { color: colors.text }]}>Common names</Text>

          <FlatList
            data={Species.results[0].species.commonNames}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Text style={[styles.commonName, { color: colors.text }]}>{item}</Text>
            )}
          />

          <View style={styles.links}>
            <ActionButton title="🌍 Open in GBIF" onPress={() => router.push(`web/gbif/${Species.results[0].gbif.id}`)} />
            <ActionButton title="🌿 Open in POWO" onPress={() => router.push(`web/powo/${Species.results[0].powo.id}`)} />
          </View>

          <ActionButton title="🔄 Identify another plant" onPress={() => setSpecies(undefined)} />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default Species;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  actions: {
    gap: 12,
    marginTop: 40,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  image: {
    width: '100%',
    height: 240,
    borderRadius: 18,
    marginVertical: 20,
  },
  card: {
    padding: 16,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    opacity: 0.7,
  },
  commonName: {
    fontSize: 14,
    marginBottom: 4,
  },
  links: {
    marginTop: 16,
    gap: 10,
  },
});

