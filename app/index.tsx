import { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, ScrollView, Alert, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

type Albums = {
  id: number;
  title: string;
  description: string;
  category: string;
};

export default function Index() {
  const [albums, setAlbums] = useState<Albums[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        router.replace("/auth"); // Redirige vers la page de connexion
      } else {
        fetchAlbums();
      }
    };

    checkAuth();
  }, []);

  const fetchAlbums = () => {
    fetch("https://ada0-2a02-842a-32c2-d201-81e7-3df4-7841-dff2.ngrok-free.app/albums")
      .then((response) => response.json())
      .then((data) => {
        setAlbums(data);
        setLoading(false);
      })
      .catch((error) => console.error("Erreur :", error));
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    Alert.alert("Déconnecté");
    router.replace("/auth");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Albums créés</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          {albums.length > 0 ? (
            albums.map((album) => (
              <Text key={album.id} style={{ fontSize: 16, marginVertical: 5 }}>
                {album.title} - {album.description} - {album.category}
              </Text>
            ))
          ) : (
            <Text>Aucun album trouvé.</Text>
          )}
        </ScrollView>
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="Se déconnecter" onPress={handleLogout} />
      </View>
    </View>
  );
}
