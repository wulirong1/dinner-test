import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


export default function AddComment({ onClose, onSubmit, onDelete, restaurant, review, panHandlers }) {
  const [text, setText] = useState('');
  const [like, setLike] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (review) {
      setText(review.text || '');
      setLike(review.like || null);
      setImages(review.images || []);
    }
  }, [review]);
  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('需要權限才能選擇圖片');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const ok = await requestPermission();
    if (!ok) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const selected = result.assets.map(a => a.uri);
      setImages([...images, ...selected]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('需要相機權限');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 1,
    });

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  return (


    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{ flex: 1 }}>

        <View style={styles.handleContainer} {...panHandlers} pointerEvents="box-none" >
          <View style={styles.handle} />
        </View>

        <View
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 150 }}
          keyboardShouldPersistTaps="handled"
        >

          <View style={styles.top}>
            {/*返回按鈕*/}
            <TouchableOpacity
              style={styles.backBtn}
              onPress={onClose}
            >
              <MaterialIcons name="chevron-left" size={35} color="#6B4F4F" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
            >
              <MaterialIcons name="close" size={28} color="#6B4F4F" />
            </TouchableOpacity>


            <Text style={styles.title}>
              {restaurant?.name || '店家名稱'}
            </Text>



          </View>

          <ScrollView
            style={styles.context}
            nestedScrollEnabled={true} // ⭐ 必加
            contentContainerStyle={{ paddingBottom: review ? 170 : 160 }}
          >

            {/*喜歡與討厭按鈕*/}
            <View style={styles.likeRow}>
              <TouchableOpacity onPress={() => setLike('like')}>
                <MaterialIcons
                  name={like === 'like' ? 'thumb-up' : 'thumb-up-off-alt'}
                  size={40}
                  color={like === 'like' ? '#8FA89E' : '#555'}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setLike('dislike')}>
                <MaterialIcons
                  name={like === 'dislike' ? 'thumb-down' : 'thumb-down-off-alt'}
                  size={40}
                  color={like === 'dislike' ? '#8FA89E' : '#555'}
                />
              </TouchableOpacity>
            </View>


            <View style={styles.inputContainer}>
              <TextInput
                placeholder="新增評論..."
                placeholderTextColor="#aaa"   // 可選：讓字變淡灰色
                value={text}
                onChangeText={setText}
                multiline
                style={styles.input}
              />
            </View>


            <TouchableOpacity
              style={styles.uploadBox}
              
              onPress={() =>
                Alert.alert(
                  '選擇圖片',
                  '請選擇方式',
                  [
                    { text: '拍照', onPress: takePhoto },
                    { text: '從相簿選擇', onPress: pickImage },
                    { text: '取消', style: 'cancel' },
                  ]
                )
              }
            >
              
              <Text>上傳圖片</Text>
            </TouchableOpacity>


            <View style={styles.imageScrollContainer}>
              <ScrollView
                horizontal
                nestedScrollEnabled={true} // ⭐ 超重要
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.imageScrollContent}
              >
                {images.map((img, i) => (
                  <View key={i} style={styles.imageWrapper}>

                    <Image
                      source={{ uri: img }}
                      style={styles.previewImage}
                    />

                    {/* ❌ 刪除按鈕 */}
                    <TouchableOpacity
                      style={styles.deleteImageBtn}
                      onPress={() => {
                        const newImages = images.filter((_, index) => index !== i);
                        setImages(newImages);
                      }}
                    >
                      <MaterialIcons name="close" size={16} color="#fff" />
                    </TouchableOpacity>

                  </View>
                ))}
              </ScrollView>
            </View>




          </ScrollView>
          {/*上傳按鈕*/}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              onSubmit({
                text,
                like,
                images,
              });
            }}
          >
            <Text style={styles.submitText}>發佈</Text>
          </TouchableOpacity>

          {/*刪除按鈕*/}
          {review && (
            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                Alert.alert(
                  '刪除評論',
                  '確定要刪除這則評論嗎？',
                  [
                    { text: '取消', style: 'cancel' },
                    { text: '刪除', style: 'destructive', onPress: onDelete },
                  ]
                );
              }}
            >
              <Text style={styles.deleteText}>刪除評論</Text>
            </TouchableOpacity>
          )}


        </View>
      </View>



    </TouchableWithoutFeedback>
  );
}

// ✅ 要放在 function 外面！
const styles = StyleSheet.create({
  container: {
    flex: 1,
    Bottom: 0,
    height: '90%'
  },

  top: {

    backgroundColor: '#Fffode',
    paddingHorizontal: 20,
    borderRadius: 20,
    paddingTop: 10,
  },

  context: {
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingTop: 20,
    borderRadius: 20,

  },


  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },

  likeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 20,
  },

  icon: {
    fontSize: 30,
    color: '#555',
  },

  active: {
    color: '#8FA89E',
  },

  inputContainer: {
    borderWidth: 3,
    borderColor: '#848282',
    borderRadius: 15,
    padding: 15,
    height: 150,
    marginBottom: 20,
  },

  input: {

  },

  uploadBox: {
    borderWidth: 3,
    color: '#848282',
    borderRadius: 999,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',

  },

  submitBtn: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#8FA89E',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  imageScrollContent: {
  paddingHorizontal: 5,
  flexDirection: 'row', // ⭐ 很重要
  alignItems: 'center',
},

    
  previewImage: {
    width: 120,   // 🔥 放大
    height: 120,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: '#ddd',
    marginTop:12,
  },

  backBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },

  deleteBtn: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#FF6B6B',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
  },

  deleteText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 5,
  },

  handle: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },

  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },

  imageWrapper: {
  position: 'relative',
  marginRight: 12,
},

deleteImageBtn: {
  position: 'absolute',
  top: 5,
  right: 5,
  backgroundColor: 'rgba(0,0,0,0.6)',
  borderRadius: 10,
  padding: 3,
  zIndex: 10,
},
});
