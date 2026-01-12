import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";

import Loading from "../components/Loading";
import { AppTheme } from "../interface/theme.interface";
import { PlantNetService } from "../services/plant_net.service";
import { DiseasesIdentificationResponse } from "../interface/DiseasesIdentificationResponse.inteface";

const Diseases = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [species, setSpecies] =
    useState<Pick<DiseasesIdentificationResponse, "results">>();

  const { colors } = useTheme() as AppTheme;
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  /* ------------------ animation ------------------ */
  useEffect(() => {
    if (species) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [species]);

  /* ------------------ buttons ------------------ */
  const ActionButton = ({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) => (
    <TouchableHighlight
      underlayColor={colors.primary}
      onPress={onPress}
      style={[styles.button, { backgroundColor: colors.backgroundCard }]}
    >
      <Text style={[styles.buttonText, { color: colors.text }]}>
        {title}
      </Text>
    </TouchableHighlight>
  );

  const LinkButton = ({
    title,
    onPress,
  }: {
    title: string;
    onPress: () => void;
  }) => (
    <TouchableHighlight
      underlayColor={colors.primary}
      onPress={onPress}
      style={[styles.linkButton, { borderColor: colors.primary }]}
    >
      <Text style={[styles.linkButtonText, { color: colors.primary }]}>
        {title}
      </Text>
    </TouchableHighlight>
  );

  /* ------------------ image pick ------------------ */
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Media library access is required.");
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

      const data = await PlantNetService.DiseasesIdentification(
        result.assets[0].uri
      ).finally(() => setLoading(false));

      if (!data || data.results.length === 0) {
        Alert.alert("Error", "Species not found");
        return;
      }

      setSpecies(data);
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Camera access is required.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setLoading(true);
      setImage(result.assets[0].uri);

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

      const data = await PlantNetService.DiseasesIdentification(
        result.assets[0].uri
      ).finally(() => setLoading(false));

      if (!data || data.results.length === 0) {
        Alert.alert("Error", "Species not found");
        return;
      }

      setSpecies(data);
    }
  };

  /* ------------------ loading ------------------ */
  if (loading) {
    return <Loading />;
  }

  /* ------------------ render ------------------ */
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.page }]}
    >
      {!species && (
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

      {species && (
        <Animated.View
          style={[
            styles.card,
            {
              backgroundColor: colors.backgroundCard,
              opacity: fadeAnim,
              flex: 1,
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
          <Text style={[styles.label, { color: colors.text }]}>
            Possible diseases
          </Text>

          <View style={{ flex: 1 }}>
            <FlatList
              data={species.results}
              scrollEnabled
              keyExtractor={(item) => item.name}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item, index }) => {
                const scientificName =
                  item.description?.split(" - ")[0] ?? item.name;

                return (
                  <Animated.View
                    style={[
                      styles.diseaseCard,
                      {
                        backgroundColor: colors.card,
                        transform: [
                          {
                            translateY: fadeAnim.interpolate({
                              inputRange: [0, 1],
                              outputRange: [20 + index * 6, 0],
                            }),
                          },
                        ],
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.diseaseCode,
                        { color: colors.primary },
                      ]}
                    >
                      {item.name}
                    </Text>

                    <Text
                      style={[
                        styles.diseaseDescription,
                        { color: colors.text },
                      ]}
                    >
                      {item.description}
                    </Text>

                    <View style={styles.linksRow}>
                      {(() => {
                        const scientificName = item.description.split(' - ')[0];

                        const urls: { title: string; url: string }[] = [
                          { title: "EPPO", url: `/web/eppo/${item.name}` }, // уже есть
                          {
                            title: "MycoBank",
                            url: `/web/mycobank/${item.name}`,
                          },
                          {
                            title: "IndexFungorum",
                            url: `/web/indexfungorum/${item.name}`,
                          },
                          {
                            title: "BugGuide",
                            url: `/web/bugguid/${item.name}`,
                          },
                        ];

                        return urls.map((link) => (
                          <LinkButton
                            key={link.title}
                            title={link.title}
                            onPress={() => router.push(link.url)}
                          />
                        ));
                      })()}
                    </View>
                  </Animated.View>
                );
              }}
            />
          </View>


          <ActionButton
            title="🔄 Identify another disease"
            onPress={() => {
              setSpecies(undefined);
              setImage(null);
            }}
          />
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default Diseases;

/* ------------------ styles ------------------ */
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
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: "100%",
    height: 240,
    borderRadius: 18,
    marginVertical: 20,
  },
  card: {
    padding: 16,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    opacity: 0.7,
  },

  /* disease item */
  diseaseCard: {
    padding: 14,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  diseaseCode: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.6,
  },
  diseaseDescription: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },

  /* links */
  linksRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 12,
  },
  linkButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
  },
  linkButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
});

