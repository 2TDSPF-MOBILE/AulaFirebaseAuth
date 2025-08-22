import { StyleSheet,View,Text,Pressable } from "react-native";
import {Octicons, MaterialIcons} from '@expo/vector-icons'

export default function ItemLoja(){
    return(
        <View style={styles.container}>
            <Pressable>
                <Octicons name="check-circle" color='black' size={24}/>
            </Pressable>
            <Text style={styles.title}>Mouse Gamer</Text>
            <Pressable>
                <MaterialIcons name='delete' color='black' size={24}/>
            </Pressable>
        </View>
    )
}
const styles = StyleSheet.create({
    container:{
        backgroundColor:'lightgray',
        flexDirection:'row',
        alignItems:'center',
        width:'90%',
        padding:10,
        alignSelf:'center',
        borderRadius:10,
        marginTop:10
    },
    title:{
        flex:1,
        marginLeft:10,
        fontSize:17,
        fontWeight:500
    }
})