import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import axios  from 'axios';
import logo from './assets/icon.png';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState();
  const [user, setUser] = useState('');

  const handleLogin = async () => {
    if (email === '') {
      Alert.alert('Warning', 'El email es obligatorio');
      return;
    }

    if (password === '') {
      Alert.alert('Warning', 'El password es obligatorio');
      return;
    }

    const sUrl = 'http://infra.hybrido.studio:3030/auth';

    try {
      setLoading(true);
      const oResponse = await axios.post(sUrl, {
        email: email,
        password: password,
        strategy: 'local',
      });
  
      if (oResponse.status === 201) {
        if (oResponse.data) {
          const { accessToken, user } = oResponse.data;
          setToken(accessToken);
          setUser(user);
          setEmail('');
          setPassword('');
        }
      } else {
        Alert.alert('Warning', 'Error al iniciar sesion');
      }
    } catch (e) {
      console.log(e);
      Alert.alert('Error', JSON.stringify(e.response?.data));
    }
    setLoading(false);
  };
 
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20, color: "blue" }}>Bienvenido!</Text>
      {token ? (
        <View>
          <Text>{user.full_name}</Text>
          <Text>{user.email}</Text>
        </View>
      ) : (
        <>
          <View>
            <Image source={logo} style={{ width: 200, height: 200 }} />
            <Text>App de prueba para expo</Text>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              autoCapitalize="none"
              placeholder="Email"
              onChangeText={text => {
                setEmail(text);
              }}
              style={styles.input}
              value={email}
            />
            <TextInput
              onChangeText={text => setPassword(text)}
              placeholder="Password"
              secureTextEntry
              style={styles.input}
              value={password}
            />
            <TouchableOpacity onPress={handleLogin} style={styles.button}>
              {loading ? (
                <ActivityIndicator size={45} />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
          </View>
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: "blue",
    justifyContent: "center",
    height: 40,
    width: 150,
  },
  buttonText: {
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 40,
    marginHorizontal: 100,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 12,
    marginVertical: 10,
    paddingHorizontal: 10,
    height: 40,
    width: 250,
  },
  inputContainer: {
    flex: 0,
    alignItems: "center",
    marginBottom: 50,
  },
});
