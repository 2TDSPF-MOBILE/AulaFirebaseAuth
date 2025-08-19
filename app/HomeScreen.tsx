import { Text,Button,Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import {auth} from '../services/firebaseConfig'
import { deleteUser } from "firebase/auth";


export default function HomeScreen(){
    const router = useRouter()//Hook de navegação

    const excluirConta = ()=>{
        Alert.alert("CONFIRMAR EXCLUSÃO","Tem certeza que deseja excluir a conta? Esta ação não poderá ser desfeita.",
            [
                {text:"Cancelar",style:'cancel'},
                {text:"Excluir",style:'destructive',
                    onPress:async()=>{
                        try{
                            const user = auth.currentUser
                            if(user){
                                await deleteUser(user)
                                await AsyncStorage.removeItem('@user')
                                Alert.alert("Conta Excluída","Conta excluída com sucesso.")
                                router.push('/')
                            }else{
                                Alert.alert("Erro","Nenhum usuário logado")
                            }
                        }catch(error){
                            Alert.alert("Erro","Não possível excluir a conta.")
                        }
                    }
                }
            ],{cancelable:true}//Permite cancelar o alerta
        )
    }

    const realizarLogoff = async()=>{
        await AsyncStorage.removeItem('@user')
        router.replace('/')//Navega para o index(login)
    }

    return(
        <SafeAreaView>
            <Text>Seja bem-vindo - Você está logado!!</Text>
            <Button title="Realizar logoff" onPress={realizarLogoff}/>
            <Button title="Excluir Conta" color='red' onPress={excluirConta}/>
            <Button title="Alterar Senha" color='orange' onPress={()=>router.push('/AlterarSenhaScreen')}/>
        </SafeAreaView>
    )
}