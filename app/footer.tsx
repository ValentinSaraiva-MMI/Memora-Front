import { useRouter } from "expo-router";
import { View, Text, Button } from "react-native";

export default function Footer() {

    const router = useRouter();
    return (
        <View
            style={{
                height: 50,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-around",
                backgroundColor: "#EFEFF0",
                borderTopWidth: 1,
                borderTopColor: "#e0e0e0",
            }}
        >
            <Button title="Home" onPress={() => router.push("/")} />
            <Button title="Profil" onPress={() => router.push("/profil")} />

        </View>
    );
}



