// app/album/[id].tsx
import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Button, Alert } from "react-native";

export default function AlbumPage() {
    const { id } = useLocalSearchParams();

    const handleAddContent = () => {
        Alert.alert("Ajouter un contenu dans l'album " + id);
        // Ici on pourra gérer l'ajout d'image/vidéo/audio
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                Détails de l'album {id}
            </Text>
            <Button title="Ajouter un contenu" onPress={handleAddContent} />
        </View>
    );
}
