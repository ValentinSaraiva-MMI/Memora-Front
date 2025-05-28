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
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        router.replace("/auth");
      } else {
        const parsedUser = JSON.parse(user);
        setUsername(parsedUser.pseudo);
        fetchAlbums();
      }
    };

    checkAuth();
  }, []);

  const fetchAlbums = () => {
    fetch("https://ff26-85-169-87-98.ngrok-free.app/albums")
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
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Bonjour {username}
      </Text>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Albums créés</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          {albums.length > 0 ? (
            albums.map((album) => (
              <View key={album.id} style={{ marginBottom: 10 }}>
                <Text style={{ fontSize: 16 }}>
                  {album.title} - {album.description} - {album.category}
                </Text>
                <Button
                  title="Voir l'album"
                  // @ts-ignore
                  onPress={() => router.push(`/album/${album.id}`)}
                />
              </View>
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
