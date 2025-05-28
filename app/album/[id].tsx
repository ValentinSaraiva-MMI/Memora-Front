import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TextInput, Button, Alert, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Video, ResizeMode } from "expo-av";
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
        <View style={styles.container}>
            <Text style={styles.title}>Contenus de l'album {id}</Text>

            <ScrollView contentContainerStyle={styles.scroll}>
                {medias.length > 0 ? (
                    medias.map((media) => (
                        <View key={media.id} style={styles.card}>
                            {media.type === "image" && (
                                <Image source={{ uri: media.url }} style={styles.media} />
                            )}

                            {media.type === "video" && (
                                <Video
                                    source={{ uri: media.url }}
                                    style={styles.media}
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                    shouldPlay={false}
                                />
                            )}

                            <Text style={styles.description}>{media.description}</Text>
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
                style={styles.input}
            />

            <TouchableOpacity style={styles.button} onPress={handlePickMedia}>
                <Text style={styles.buttonText}>Ajouter un contenu</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: "#ccc", marginTop: 10 }]} onPress={() => router.replace("/")}>
                <Text style={styles.buttonText}>Retour aux albums</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9F9F9",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    scroll: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 10,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    media: {
        width: "100%",
        height: 200,
        borderRadius: 8,
    },
    description: {
        marginTop: 5,
        fontStyle: "italic",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginTop: 10,
        marginBottom: 10,
    },
    button: {
        backgroundColor: "#3B82F6",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
