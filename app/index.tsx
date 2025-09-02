import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword,sendPasswordResetEmail } from 'firebase/auth';
import {auth} from '../services/firebaseConfig'
import ThemeToggleButton from '../src/components/ThemeToggleButton';
import { useTheme } from '../src/context/ThemeContext';

export default function LoginScreen() {
  const{colors}=useTheme()

  // Estados para armazenar os valores digitados

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const router = useRouter()//Hook de navegação..

  const verificarUsuarioLogado = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem("@user")
      if (usuarioSalvo) {
        router.push('/HomeScreen')//Redireciona o usuário para tela de HomeScreen
      }

    } catch (error) {
      console.log("Erro ao verificar login", error)
    }
  }
  useEffect(() => {
    verificarUsuarioLogado()
  }, [])


  // Função para simular o envio do formulário
  const handleLogin = () => {
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    //backend do login
    signInWithEmailAndPassword(auth, email, senha)
      .then(async(userCredential) => {
        const user = userCredential.user;
        await AsyncStorage.setItem('@user',JSON.stringify(user))
        router.push('/HomeScreen')

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("Error",errorMessage)
        if(errorCode === 'auth/invalid-credential'){
          Alert.alert("Erro","Email ou senha digitados incorretamente.")
        }
        
      });
  };

  const esqueceuSenha = ()=>{
    if(!email){
      alert("Digite seu e-mail para recuperar a senha..")
      return
    }
    sendPasswordResetEmail(auth,email)
      .then(()=>{
        alert("Enviado e-mail de recuração de senha")
      })

      .catch((error)=>{
        console.log("Error:",error.message)
        alert("Erro ao enviar e-mail de recuperação")
      })
  }

  return (
    <View style={[styles.container,{backgroundColor:colors.background}]}>
      <Text style={[styles.titulo,{color:colors.text}]}>Realizar login</Text>


      {/* Campo Email */}
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        placeholderTextColor={colors.text}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      {/* Campo Senha */}
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor={colors.text}
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />

      {/* Botão */}
      <TouchableOpacity style={styles.botao} onPress={handleLogin}>
        <Text style={styles.textoBotao}>Login</Text>
      </TouchableOpacity>

      <ThemeToggleButton/>

      <Link href="CadastrarScreen" style={{ marginTop: 20, color:colors.text, marginLeft: 150 }}>Cadastre-se</Link>

      <Text style={{ marginTop: 20, color:colors.text, marginLeft: 130 }} onPress={esqueceuSenha}>Esqueceu a senha</Text>
    </View>
  );
}

// Estilização
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  botao: {
    backgroundColor: '#00B37E',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
