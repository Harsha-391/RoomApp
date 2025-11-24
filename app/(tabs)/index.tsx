import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Material Options with Reference Images
const MATERIALS = [
  { id: 'marble', name: 'Carrara Marble', uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8d/Carrara_Marble.jpg/220px-Carrara_Marble.jpg' },
  { id: 'wood', name: 'Dark Oak Wood', uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Hardwood_floor.jpg/220px-Hardwood_floor.jpg' },
  { id: 'tiles', name: 'Mosaic Tiles', uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Mosaic_tiles.jpg/220px-Mosaic_tiles.jpg' },
];

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);

  // YOUR BACKEND URL (Keep this one if it was working, or switch to Render if Vercel times out)
  const API_URL = "https://room-backend-6p31hpidd-jabbamaster00-2310s-projects.vercel.app/generate-room";

  // 1. Function to Handle Selection (Camera vs Gallery)
  const handlePickImage = () => {
    Alert.alert(
      "Upload Room Photo",
      "Choose an option",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: openGallery },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "You need to allow camera access.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5, // Keep low to speed up upload
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  const openGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setResult(null);
    }
  };

  // 2. Send to Backend
  const generateRoom = async () => {
    if (!image) {
      Alert.alert("Missing Image", "Please pick an image first.");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      // @ts-ignore
      formData.append('image', {
        uri: image,
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
      formData.append('material', selectedMaterial.name);

      console.log("Sending to AI...");

      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // BETTER ERROR HANDLING
      if (!response.ok) {
        // Try to read the error text from the server
        const errorText = await response.text(); 
        console.log("Server Error:", errorText);
        throw new Error(`Server said: ${response.status} ${errorText}`);
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setResult(reader.result as string);
        setLoading(false);
      };

    } catch (error: any) {
      console.error(error);
      setLoading(false);
      // Show the REAL error on the phone screen
      Alert.alert("Generation Failed", error.message || "Unknown error");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Room Visualizer AI</Text>

      {/* Main Image Area */}
      <TouchableOpacity onPress={handlePickImage} style={styles.imageContainer}>
        {result ? (
          <Image source={{ uri: result }} style={styles.image} />
        ) : image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>+ Tap to add photo</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Material Selector */}
      <Text style={styles.subHeader}>Choose New Floor:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.materialList}>
        {MATERIALS.map((mat) => (
          <TouchableOpacity 
            key={mat.id} 
            onPress={() => setSelectedMaterial(mat)}
            style={[styles.materialCard, selectedMaterial.id === mat.id && styles.selectedCard]}
          >
            <Image source={{ uri: mat.uri }} style={styles.materialImage} />
            <Text style={styles.materialName}>{mat.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Generate Button */}
      <View style={styles.footer}>
        {loading ? (
          <ActivityIndicator size="large" color="#2196F3" />
        ) : (
          <TouchableOpacity style={styles.generateButton} onPress={generateRoom}>
            <Text style={styles.generateText}>✨ Visualize Room</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f5f5f5', alignItems: 'center', paddingTop: 50, paddingBottom: 40 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  imageContainer: {
    width: '90%', height: 250, backgroundColor: '#e0e0e0', borderRadius: 15,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20, overflow: 'hidden',
    borderWidth: 2, borderColor: '#ddd'
  },
  image: { width: '100%', height: '100%' },
  placeholder: { alignItems: 'center' },
  placeholderText: { color: '#666', fontSize: 16 },
  subHeader: { alignSelf: 'flex-start', marginLeft: '5%', fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#444' },
  materialList: { maxHeight: 130, marginBottom: 20 },
  materialCard: { width: 100, alignItems: 'center', marginRight: 10, padding: 5, borderRadius: 10, backgroundColor: '#fff' },
  selectedCard: { borderWidth: 2, borderColor: '#2196F3', backgroundColor: '#E3F2FD' },
  materialImage: { width: 80, height: 80, borderRadius: 10, marginBottom: 5 },
  materialName: { fontSize: 12, textAlign: 'center', color: '#333' },
  footer: { width: '90%' },
  generateButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 10, alignItems: 'center' },
  generateText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});