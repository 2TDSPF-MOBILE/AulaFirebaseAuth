import { StyleSheet, View, Text, Pressable } from "react-native";
import { Octicons, MaterialIcons } from '@expo/vector-icons'
import { useEffect, useState } from "react";
import {doc,updateDoc,db, deleteDoc} from '../services/firebaseConfig'

export default function ItemLoja(props: any) {
    const [isChecked, setIsChecked] = useState(props.isChecked)

    const updateIsChecked = async()=>{
        const produtoRef = doc(db,'items',props.id)

        //Realizando a atualização no documento
        await updateDoc(produtoRef,{
            isChecked:isChecked
        })
    }

    const deleteProduto = async ()=>{
        await deleteDoc(doc(db, 'items', props.id));
    }

    useEffect(()=>{
        updateIsChecked()
    },[isChecked])
    return (
        <View style={styles.container}>
            <Pressable onPress={() => setIsChecked(!isChecked)}>
                {isChecked ? (
                    <Octicons name="check-circle-fill" color='black' size={24} />
                ) : (
                    <Octicons name="check-circle" color='black' size={24} />
                )}

            </Pressable>
            <Text style={styles.title}>{props.nomeProduto}</Text>
            <Pressable onPress={deleteProduto}>
                <MaterialIcons name='delete' color='black' size={24} />
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'lightgray',
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        padding: 10,
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 10
    },
    title: {
        flex: 1,
        marginLeft: 10,
        fontSize: 17,
        fontWeight: 500
    }
})