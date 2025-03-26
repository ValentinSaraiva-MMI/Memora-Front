import { Text, View, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Profil() {
    const router = useRouter();

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text>Edit app/profil.tsx to edit this screen.</Text>
            <Button title="Go to Home" onPress={() => router.push("/")} />
        </View>
    );
}