import { Text, View, Button } from "react-native";
import { useRouter } from "expo-router";
import Footer from "./compoments/footer";

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
        }}
      >

        TEST BRANCH footer

      </Text>


      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  )
}
