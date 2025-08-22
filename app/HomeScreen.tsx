import { Text,Button,Alert,StyleSheet, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import ItemLoja from "../components/itemLoja";
import { useEffect, useState } from "react";
import {auth} from '../services/firebaseConfig'
import { deleteUser } from "firebase/auth";
import { collection,addDoc,db,getDocs } from "../services/firebaseConfig";


export default function HomeScreen(){
    const[nomeProduto,setNomeProduto]=useState('')
    const router = useRouter()//Hook de navegação

   

    const buscarProdutos = async()=>{
        try{
            const querySnapshot = await getDocs(collection(db,'items'));
            const items:any = []//Cria um array para acumular os dados

            querySnapshot.forEach((doc)=>{
                items.push({
                    ...doc.data(),
                    id:doc.id
                })
            })
            console.log("Item carregados:",items)
        }catch(e){
            console.log("Error ao buscar os items")
        }
    }

    useEffect(()=>{
        buscarProdutos()
    },[])
  

    const salvarProduto = async()=>{
        try{
            const docRef = await addDoc(collection(db,'items'),{
                nomeProduto:nomeProduto,
                isChecked:false
            })
            console.log("Documento criado com o ID:",docRef.id)
            setNomeProduto('')//Limpa o TextInput do nome do produto
        }catch(e){
            console.log("Error ao criar o documento.")
        }
    }

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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
                style={styles.container}
                behavior={Platform.OS === 'ios'?'padding':'height'} //no ios utiliza o padding, no android é o utilizado height
                keyboardVerticalOffset={10}//Desloca o conteúdo verticalmente para 10 pixel
            >
            
            <Text>Seja bem-vindo - Você está logado!!</Text>
            <Button title="Realizar logoff" onPress={realizarLogoff}/>
            <Button title="Excluir Conta" color='red' onPress={excluirConta}/>
            <Button title="Alterar Senha" color='orange' onPress={()=>router.push('/AlterarSenhaScreen')}/>
            
            <TextInput 
                placeholder="Digite o nome do produto"
                style={styles.input}
                value={nomeProduto}
                onChangeText={(value)=>setNomeProduto(value)}
                onSubmitEditing={salvarProduto}
            />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    input:{
        backgroundColor:'lightgray',
        padding:15,
        fontSize:15,
        width:'90%',
        alignSelf:'center',
        borderRadius:10,
        marginTop:'auto'
    }
})