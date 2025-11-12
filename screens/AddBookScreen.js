import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

const API_URL = "http://192.168.0.12:3000"; // coloqar o IP do seu PC

export default function AddBookScreen({ navigation }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [condition, setCondition] = useState("");
  const [distance, setDistance] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Escolher foto (galeria)
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Tirar foto (câmera)
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (permission.status !== "granted") {
      Alert.alert("Permissão necessária", "Permita acesso à câmera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Enviar pro backend
  const handleSubmit = async () => {
    if (!title || !subject || !condition || !image) {
      Alert.alert("Preencha tudo!", "Inclua título, assunto, condição e uma imagem.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subject", subject);
    formData.append("condition", condition);
    formData.append("distance", distance);
    formData.append("image", {
      uri: image,
      name: "book.jpg",
      type: "image/jpeg",
    });

    try {
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert("Sucesso", "Livro enviado com sucesso!");
        navigation.goBack();
      } else {
        Alert.alert("Erro", result.error || "Erro ao enviar livro");
      }
    } catch (error) {
      console.error("Erro:", error);
      Alert.alert("Erro", "Falha ao conectar com o servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Adicionar Livro</Text>

      <TextInput
        style={styles.input}
        placeholder="Título"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Assunto"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={styles.input}
        placeholder="Condição (novo, usado, etc.)"
        value={condition}
        onChangeText={setCondition}
      />
      <TextInput
        style={styles.input}
        placeholder="Distância (km)"
        keyboardType="numeric"
        value={distance}
        onChangeText={setDistance}
      />

      {image && <Image source={{ uri: image }} style={styles.image} />}

      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Escolher Foto</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={takePhoto}>
          <Text style={styles.buttonText}>Tirar Foto</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.submit, loading && { backgroundColor: "#aaa" }]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? "Enviando..." : "Enviar Livro"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 8,
    width: "48%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  submit: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});