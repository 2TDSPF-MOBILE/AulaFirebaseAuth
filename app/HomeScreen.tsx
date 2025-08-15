import { Text,Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";


export default function HomeScreen(){
    const router = useRouter()//Hook de navegação

    const realizarLogoff = async()=>{
        await AsyncStorage.removeItem('@user')
        router.replace('/')//Navega para o index(login)
    }

    return(
        <SafeAreaView>
            <Text>Seja bem-vindo - Você está logado!!</Text>
            <Button title="Realizar logoff" onPress={realizarLogoff}/>
        </SafeAreaView>
    )
}