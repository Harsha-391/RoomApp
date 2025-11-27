import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Material Options with Reference Images
const MATERIALS = [
  { id: 'marble', name: 'Carrara Marble', uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExIWFhUXFxcXGBgXFxcYFxgaHRgYFxoXGhcYHSggGholGxcXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDQ0NDw0NDisZFRkyLTctKysrKysrKysrKysrKysrKystKysrKysrKysrKysrKysrKysrKysrKysrKysrK//AABEIAOEA4QMBIgACEQEDEQH/xAAaAAACAwEBAAAAAAAAAAAAAAACAwABBAUH/8QAOhAAAQMDAgQEBQQBAgYDAQAAAQACEQMhMUFRBBJhcSKBkaETscHR8AUy4fFSFEIjM1NigrI0c5IV/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAH/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwD0ulMTM7hZeIaQbCQ7PQ7rSHQJ0idz2UqmRI0v36KoGmywIEHVCHxNyOk67D5oaLQ64nG/r9FVRhtcHHpv3QPeNyjnCCnTAubneBIGyLkBAnyhQKc2TI317KuEEF283To0XF/VuPND/inAIYRmZIg9CLqjvOEhZWVpkEFpzfB7FHS4gESJhCXF0kDBIvqopzgCl/DmRa+d1TGBwzKYGR/SBTGwMnsjDBmFbmGUNCfcoGMbGLLJxlLXAmZ2MLUXxNj5IDUBB07g+6DBTccOz7eiMVWvlpOOviAOqbxFPEXAx0WdrYMnaFUC2iWOAB6ycHzxK3OqTF7W7/mFjc4QWkds26ynUaJBgxfDumgPVBqc3X8IRNOZ8kFNwAg6eiSQ4PzY+3ZQa+b6JfxIcRBwDMWjvuFVOpkHKMCT5IF1BB5hg5+hS+FkOLdM/IT9FRBALQ4WxP1SnAiIBDwZGxE+Ido+io3PF1k4rh/DYcwmSJvH17LWHSFQKDlfEpf5n88lF0fiDcKIJw9z0EQNrX91oKRSPjIMY2WgqKx0WctTSCDj1+fzT3NE3HZKDGsvN5kyb9k7mmCNfsiKmCBFj81bGxqoW+oUDsyipPRcn9UYSQ0tBZILmuvIkGQOi7IKzcWyQDMEGQfoiM3DsLJbMjLSSMbW0GJWs1YEwY6XSKBdcGAYmCMXMJ1SnDfzHkgnDEieYRJnM5ub95WlIcHdI85VhxsPdFMKXMOiDf2VVgYz091YYQLZ6oClQjTKXUzIzCYDKAAzQemiQ1kgh47RotJfe1yLEBU83jQjPUIOY29nCIkGyJ1afC46yDrY/nqn1KM+f9yFja0Y2sDnP1VRvF2wTfQ7nrG6y/6kyGuhjuuD5pX+oLeVobzNJhxMSzrGokpv6hTENcbgTe9rZ75yoHkO9r/fqn06hMDVYaYhkFwMRcHM7bDpstFJ4t7FAfMSS3lIJv0kddUVRhMXuMH6Kc/MRbGSgaXQSZAcbdL2PRUNY/bz6IycWWalIztc+dk9jt1BfwxsrVz0UQDUyCJ2V1HYvBQubeT2S3mSQdPkimPaIIdrrqh4ccrQDgDPb8lUHAg6487ZCVWNoBjwkXnsiNpAMoCQCNihoOkAzkBXXAt3RUotIlFWbLSCJkXSqktg6DKupxQABFwUBcObCcwJVvbDSBmDCQzihzCxHNYd1oeLIITI3ULbaIKDIaBsIOfqmNKgTUEo2ut5IagM9NUFISI2VF1ADAN7zH1TGe6F3kFKdMXIFz7qAX5tmRKPiAIDv8b97Rdcn9b/AFKrS/5fDveTgtu0HYgXWj9DdXdT/wCPkgEaHxTLSNCEG5oNy0DzSa9IEbT5hPoOt1wdpCpwuMayD9FRySyDBB27/wAJfxnsAhpLZxNxnzXQ4rhjEg2jVc343iuf4VQym9jjzRymZMR5zbEC+y1/E1tFoOkJTKIs5jgD2tfSFlq1SyWimSCZjbePb1Qdnh6wPcfnmERqjxNiLY0v12XM4WrJAbIdynwkRqJg4/tbWVwTByOigGpTlkevW3yTKLtHWIi+hRESLbZUNxb86KglFm+Ez/FRQawLGds9ElrZIcAADHy1QkS0GCO/XXKPhKktgzIN/p7IqcPSsRYbepS2sJc5oi0TI6aea1C10HL4iZz9kC6UjwiwGPzv80VbmkRvF8Yz9PNT4f8AxAdIcPO32WgIMdRjnj93LyuH7dYIJBnIiyrhaQaSJ5pJN9NIEfNFwsgvaR4ZkHvmfNXQo2toTP8ACDP+p0xy+G5bD2tGvKbha/8AU+EGDcTAFwmMPmIQvpmeYHAxf82QAXkHEzpt+D5IviXiDe86Dud0NOuHDWZFtR+SipNN+aJkgEajTz+ygp94HkenVDEdSPdMLN/6VYPcZ7IAqOuAWnyxjJ6Jnw/zZSo5rbkgdzCOo8RM2wgost+ZVlsx0RFIr1XNBLWyRpugKk6GkDIP581bxN+ixh5tIA5hc82DraN1qpOtB7qgwYHT57LmcfwkXBz+XK3sqyeWDA1ix6IoBkFthb+Qg4/A8RBLTt4bfVdHmaYM9OxWbiuB5TIwbxr3B3QUXlrhN2mwKqHt4eOa/NqIsR1HVJcXGCQZyHjw+R2W7Qm8JNZxa5vhs7WdcgEblQFSfjlInUHf6SjbU55gQbgza/5qs/E0/CalPI0i4+vkgc/wkus4Aut7jsqMPxP+75q0yH7H1Yog6jTLgNBNusqFnK4Ea273/pR1qjSRob6aJ3OInrZRQvqAZ3E+ZhU8kSdhISeIkteA4tMWIEkbGCN0FB7wM8zIEE/umfEDofJBoq1MOFhI801jxPdA17ajSWkEGRI0I76yqpGbzMT66+8oFubLgJIHiJg5vZM4ckFwIiCIO8jKAM8QfcQC0jSJmfL5FMD+koDc331UbcI/khm/VQcrjuIaxvO48hLuVoP7jeAOUZ+y61N0i+Uipw7HODnAEtMtJ0TGDInVA2Eup9kpld0wQmAyIwgqvSa4eJocJkSPyEhv6fTaWlojlmBJi+ZGq0h84xv9lVSYjVFGUMGZV0nyJV1GkgwYO+URmfTtG+vuiJgHoJClejOSRG2DeVOHc0gQQ4Yka+ioKi8En6qqvEBkzpc9AqAwPyRZEARzQJ2G/n1QStTlojSIJ3/nHmsdajrflgyNjuF0ThA0WuehGpQY6FUlsOvpfY/wthNsaLHxfDQ3wWkRGe350RcPVkBpd4t9D5ICeIPXBWeOcOY8CRgjUYkD6Le5k5Was2SYFwc2t1PRAnmOw9B9lE34rv8AEKKo0PZYjzQ0njlGOkpxuUl7IBEW0Hf+VFUR4gekoKNWRBEDvbdNdTjlImwjySjShxOljG6BnDUy0RAg/wCIi/X2ujoiHOxv80TRM7fOyycQyoPifDjn5Ry82CRob7fNBoNZpc6nPiiY3BSeDuwOE4AjtZGxhkGBz+GZkxaDy7K6LYLmjHNzetyPWUDXRbp/SIEHTCEtuNrqi6D0UBlJ4oODXGm0F0WBtJ0lOOyAl0x5oFskzJEi1iM77gdOiTQr+ItAmDBJcM9ALrWHXKyu4dpeH4dJiNbRfyQO4Sra4gmewviU+VTWxZAYmOiKW1pAN/zdOpOkXshgzpB9QhY081nyBMiB88oiVzfN5EfVDVpmA1nhkOuBgxt3MqqVLEH/AHEk67wnvJ5mxGoPp/CBFKiQxoc6XCJde53hMvk9PsnKnuQYJqfGPjmnFgAP3bTkxHutVN2mo32wqbTg2AyTAGZMqw4k9Ntu6ouqIM6awsnFcFq2dCRvGq6HkkvdAxIjdAj/AFEtE+c6aJhAsRfr0SHUQQHsuRnrHTEoqPEDlLtMRqDtCB3MNwokwf8Apn0H3UQaaR7+forqAHuPW4REIeUXtlATThZq7hcQbA4+/YoqbQwENGBMfb0UriRbJ9+6AeErGILYECDa/wDMBNg2ItO+23uswB5R/k2x6xafMJxq+GRuEDQfFHT6rJxPClzj4uXmjAm7ehEHRag+8+SFuQLnJn5KAuWBJJMe9tlna7mc6RDRYgg369lscsoeS+CLET0gGI7yUDPiRmwtB747XRM5oIMSD6j7/ZC1loNxrKhN9gOvsghNwdDb7JnLiEtk4cZkeqKkwDB9TPzQG1w+iXXabEZBmZ/JCpjvE8dQfUfwmOqDGqKzOe4OvY6DQo6VUcxMQCFPiNdY5EH7HrhDTcecyBGARra8hEMqNvINiPVBw4dt4cgzfJt2+6XV4gOEAZdyjvmbaWK1NdIsQgJxQ1gYtEyM7Tf2VPp/tvgz7EfVM1QUSgFXxRBuPJElieb/ALUDQ/pEJNSkCHNP7XTH1H1TGmbY+qEtsb+ePNUYOApmk9zSZBMjWBAz5grdWpatF9Rif5S6EETmbk/mifTePZBk5XbH0Ci03UQHGuyKEE36EImH7IKqNkZhJ4YG7ToYHZaCLJTmf7vVBHMuD5eX9oCyZA3juPumVmh1r75hRh1Qc6pTeXh3M8AEeERBvrquicQl1jHiOMH1yqpk3E29SenRA0OnZC1sEnUwANAqpFpJvcZ3HSEbmG147aqAXA2kx2+6ni6QDfqIt5zZHA7q0C3NuhoPMkOAnI6jsmQhqU8HUTB+aKIN8RO4HtKJ9x9ko1PcgXTKjbZjqggaMwFHNyPMKzhQYQZKpIc1oAuSXG3hsQDHU29U6o3kuIHfCHh6odJtOoBntKXxbgPFzADBk2ESfmiHUOKbUEscHDBLTgpl0qhRa39rQBmwjOqa4ehQR7rW3VUxAjPdBQMk3mLQmPJGAgVXBIsSLEdVVRlhLiY8vkmOm4ti3dLc/R8ZgXmQbCfNUXQmBPvnpPkrrCwxm9pkbKxVseiXEQSIvPY6XQaIGyivmCiAS8JVI+J15BuPqqbxbCS0OHMDBGYOylelzAi4kESDBvqEDQIxhW02XG/ROG4mn8QV3io3/a6b9ojsu00IKpH5fwgd4bzaVdPJV1YcCN/7QLrtDgWnDgl0QAAMEe/XzTKVKxDt1dWkOXaMFA8pVVkkE6afVWHzE2KJ5QJbZxvm6fTFkttNsgwJjKYbKARM6R7oZiZwiLrx0lWQis9QAtk6H5Gx7pzHSIP8FLfI9UbHDB2QJpV/+I5hBgAESLHOD9E0mQYORZU2lymxJ2B0VOYAIaIzbugY1ogLHxfDMdd4kAze400/Mrbg9/mhAtuUGMNeQSKkEkcsj9oGhGoN1pL7xe0Ta19jhEGxPefqrDukSiI/dUQb67brP+oVKg5RTAJ5hN48M3hC3i3fEcDSIa3DwZBxaPzCo0STdFVaINrws/BcbTqg8pJjcEH0KN3NFrTa8G39IHkW6wgaCR4tr7Kg6YvuIUBO46eu6Avg/wDcfUKK5/PwKICaBtlUTa6CnvgHSNU16AXNkKB8eSqnMDmidYmPdHAQLa330V1G/wB7IXuLeuyY82QU3RQjPUKwFCEGaq8NB5rR4vS6KjV5uhjHlogfQDi4HWD2j8907mkWyEEY0AA7fhTagkWWem4yQT5fWdQVbLEzj5IDtM62v2TA5CSB2UABuoAe4OJA0In5+aFzCIIOqIMh3f8ALJoKKEVgSOv2Ueye8ELLxtXlaSGlxbcAZOqy/pP6r8QOcWGmA6Bza9cIjoseRnLYnr1/NkbyIMJXIHNPVNqEQQTFkFAXne3oTolUKR5Yd1tPVPdtKVBDjGDGff2QG0Qqa0Se90fLrKEugoKa2MAAaIabCCZdIJkWHhtgfNMdgqj+1UZ61QC/K4y6BAJg72wOqdECETWqObKALqIuVRAQco6Tgx1VwqpuQW5oNjdW0Qhc6CNt0aCnNlBzaIws7rPkG8QQgfUNkjhhUPN8QNF/CWkmRuZx2TSEYcgACDPSEFNoCbCUw3I2+uEBPZNxkfkJdOpzRFp3TS6D0Wf4PjJucEDsNOqB4o2iVTTodMK2Pub/AHRPCgIgHTshDbGIBRMPqhD4sc6dUCKokbHXfZRtHQ6HXB1n13VBxk6AT1kfS6c18yPMdQgjWGM+yTT4htQkNcCWRzRNpHzTKvNflImDAItOl0PCsfyzULec55QQB0uZPdA3n3VVH4dlC5wJ5ZvEjExiVBSgEG+oxbogel1AMKqb9CbonugTE/NBbcKp+ax/6gGo9lw4AaEW3BNjrZOpVdJGY7KhxKo5QtdNwD8kDqIN73jX8hBo5gosf/8AOp/4+5+6iB9R/sox3TMoDxDP2lwBOhIB6WTG7bIJUe0ZIR82uiRxFEOsUAZf9/hzBGm06BAb68tJaDN4tYn7JLqbuYeLQeV509FqrNEDZLqeG8E9Rcjy1CCU6UF0kmTI6WxG33RMZBsM7W9lVKqDBGOxTSggKRxji0cw0z1C0ApVZrdYvIzEoBJkC4INwRp3umOx5ZWegAHwMXtsbfwtVVBm4umS0EHxCDtOkHora+QL3tMz5rRy6FZa1OCBBjQzhQauW+VVQCZKpr7wRBHv1R1Lg2QZ6ImTocdlDZviu5skRt/SqlMDtYJhdIG+s7aoJLSQdYtfTsjBSntAIPLMa6hHUeBdANQCQdcD7JnsVBCjboF1sDefVNY+3VVUpgx0KXSs4t0OECax1cBa4zf8AR8h5bAbqqtLN+w22ThKoukfCJz7KPcYtCqmLBR7hYHWyCSopyDZUgtzQcgGN0RVAFQ3UCajiLi8ZTyMEJTHgz0sjo3aL/yqDccKgbpfxgIbrMWE/wBJNao8ugNEbz0t7oNZiZQmxlZeL4cvAAcW75v6EJTP05wxWqAbWPoTJCDouss/F8KKjOV+bEEZBGCExtPlEX7zJ9VVDiWPkNcHRYxugHmA1E+idMhLdoLwZ391GtjJJ9AoCpuJHUK6o5hEeaAOvjKgqmRLT5EH1wgGk8Fxacj8CxDj3tqGm5hLRfnAJEbO27roP5Ta4Om6z1OYtMiJtIvm2qCUgBEXEmPNaeWy53As+GCxxnxEtJAA3iy6EeLXHl/aCmkmQci0/Iq2G1vzop8S8XxjVJpNdJJ8IJBjJmIM9wAgcwSJGTdL4JgDTDSL66nEx5J4KuUAVibQJuJvEDf+FKrCS0jQz7R9URaiQJL5AOLnOmQiboel1ULHQqeID/bBjNjax2VG1uEUqly+JbxBfAdFM4c0DnadnB0hw9FB0eZ2w9T9lFn+FV/6jf8A8qINbUDnaLLw5eCGcgDRYHmnzvdaHyY0vdAus74bbNc6+G3KnCViRJaRJxqE5zgbIiVRnq04u23i5jrOhlNLBMxc6/JLp+KZx+SpTcAIgi+pmeqBuRqrDIwoxyFtSZ6IA4skgcuZV8IPDJABO2vmrDBzc0mYjJj0xKub2wgYqKBA6YEHvbIUBOz2Rtcl8wzuMqqRkzNo/CgGsT8QDllsXM67R7yhqSQYdHL5jXdaUmqBBDsExbVFLc+TyvHp+dlKUggc0tMxvpbqnFuNY+iyf6NpL7nmkOFzqNBPWED+I5paRAM32j8stNU2sufTceVvxMgTzag6gj8+qLg6ribuBbyxi/NJ8U7ERboiNd5nSEReIlZ2VyHeKIJAbGcXkeSLiWzEdC7sLoB479Up0G89V3K2cwT8k3hOLZVYHsMgjUEHzBwkcRw9OqC17Q9oIkG+LhPZDQALDRBb8SMxMbwlu4VrrkZynB1x2KGo0x4YDusx7IAp1DzkObA0M5tft/asWd0P5KlegXgeKLGYz3ByEtlQjkDhe4mRFsHrKDRKikjZUgulkqj9VFEGR/729/utgVKKi2YXP/V/+U5Uog18L+xvYKN+qiiAzhLaooga3KV/tPYqlFBHfs8kdJRRAwJdT9ze/wB1FEULcu7/AECyN/8Akj/6x9VaiIfxmB5/NY+G18//AGUURW5v7vJXWw7sfkooiB4TLv8Ax/8AUInKlEDaendMUUQRiyfrX/K/8mfMKKIOYooog//Z' },
  { id: 'wood', name: 'Dark Oak Wood', uri: 'data:image/jpeg;base64,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' },
  { id: 'tiles', name: 'Mosaic Tiles', uri: 'https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTZVgW859BQ_Dvv5m9lKX6YLa81zxW_UKZXKGERlmaO-O8Xgxj3O7FI66v7TUbp3nN-Hs4cB9-hJS2qlTfuYYPg8EktAzDqshK1sICaqHN1r9BRC5FKR6L98A&usqp=CAc' },
];

export default function App() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(MATERIALS[0]);

  // YOUR BACKEND URL (Keep this one if it was working, or switch to Render if Vercel times out)
  const API_URL = "https://room-backend-bice.vercel.app";

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

      // --- FIX IS HERE: Added /generate-room ---
      const response = await fetch(`${API_URL}/generate-room`, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // BETTER ERROR HANDLING
      if (!response.ok) {
        const errorText = await response.text(); 
        console.log("Server Error:", errorText);
        throw new Error(`Server said: ${response.status} ${errorText}`);
      }

      // ... rest of your code handles the blob ...
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