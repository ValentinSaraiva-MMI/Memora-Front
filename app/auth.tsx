// app/auth.tsx
import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Auth() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "register">("login");
    const [pseudo, setPseudo] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const toggleMode = () => {
        setMode((prev) => (prev === "login" ? "register" : "login"));
    };

    const handleAuth = async () => {
        if (mode === "register" && (!pseudo || !email || !password)) {
            return Alert.alert("Tous les champs sont requis.");
        }
        if (mode === "login" && (!email || !password)) {
            return Alert.alert("Email et mot de passe requis.");
        }

        const endpoint = mode === "login" ? "/login" : "/register";
        const url = "https://2990-85-169-87-98.ngrok-free.app" + endpoint;

        const payload = mode === "login" ? { email, password } : { pseudo, email, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                await AsyncStorage.setItem("user", JSON.stringify(data.user));
                Alert.alert("Succès", data.message);
                router.replace("/");
            } else {
                Alert.alert("Erreur", data?.error || "Erreur de connexion.");
            }
        } catch (error) {
            Alert.alert("Erreur", "Impossible de contacter le serveur.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                {mode === "login" ? "Connexion" : "Inscription"}
            </Text>

            {mode === "register" && (
                <>
                    <Text style={styles.label}>Pseudo</Text>
                    <TextInput
                        placeholder="Entrez votre pseudo"
                        value={pseudo}
                        onChangeText={setPseudo}
                        style={styles.input}
                    />
                </>
            )}

            <Text style={styles.label}>Email</Text>
            <TextInput
                placeholder="Entrez votre email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                style={styles.input}
                autoCapitalize="none"
            />

            <Text style={styles.label}>Mot de passe</Text>
            <TextInput
                placeholder="Entrez votre mot de passe"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
            />

            <View style={{ marginTop: 20 }}>
                <Button
                    title={mode === "login" ? "Se connecter" : "S'inscrire"}
                    onPress={handleAuth}
                />
            </View>

            <Text style={styles.switchText}>
                {mode === "login"
                    ? "Pas encore de compte ?"
                    : "Déjà inscrit ?"}
            </Text>
            <Button
                title={mode === "login" ? "Créer un compte" : "Se connecter"}
                onPress={toggleMode}
                color="#888"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 30,
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 30,
        textAlign: "center",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginTop: 5,
        marginBottom: 10,
    },
    switchText: {
        marginTop: 20,
        marginBottom: 5,
        textAlign: "center",
        color: "#888",
    },
});
