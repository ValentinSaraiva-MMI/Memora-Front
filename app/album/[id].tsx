import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Button, Alert, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";

type Media = {
    id: number;
    type: string;
    url: string;
    description: string;
};

export default function AlbumPage() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [medias, setMedias] = useState<Media[]>([]);
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetch(`https://2990-85-169-87-98.ngrok-free.app/albums/${id}/media`)
            .then((res) => res.json())
            .then((data) => setMedias(data))
            .catch((err) => console.error("Erreur :", err));
    }, [id]);

    const handlePickMedia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: false,
            quality: 1,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            const mediaType = asset.type === "video" ? "video" : "image";
            const mediaUrl = asset.uri;

            fetch(`https://2990-85-169-87-98.ngrok-free.app/albums/${id}/media`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: mediaType, url: mediaUrl, description }),
            })
                .then((res) => res.json())
                .then((data) => {
                    Alert.alert("Média ajouté !");
                    setMedias((prev) => [...prev, data.media]);
                    setDescription("");
                })
                .catch((err) => console.error("Erreur ajout média :", err));
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
                Contenus de l'album {id}
            </Text>

            <ScrollView style={{ marginBottom: 20 }}>
                {medias.length > 0 ? (
                    medias.map((media) => (
                        <View key={media.id} style={{ marginBottom: 10 }}>
                            <Text>Type : {media.type}</Text>
                            {media.type === "image" && (
                                <Image source={{ uri: media.url }} style={{ width: 200, height: 200 }} />
                            )}
                            <Text>URL : {media.url}</Text>
                            {media.description ? <Text>Description : {media.description}</Text> : null}
                        </View>
                    ))
                ) : (
                    <Text>Aucun média trouvé.</Text>
                )}
            </ScrollView>

            <TextInput
                placeholder="Description (optionnelle)"
                value={description}
                onChangeText={setDescription}
                style={{ borderBottomWidth: 1, marginBottom: 10 }}
            />

            <Button title="Choisir un média dans la galerie" onPress={handlePickMedia} />

            <View style={{ marginTop: 20 }}>
                <Button title="Retour aux albums" onPress={() => router.replace("/")} />
            </View>
        </View>
    );
}
