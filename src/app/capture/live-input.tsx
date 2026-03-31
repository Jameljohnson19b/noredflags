import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Image,
  Vibration
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { Colors } from '../../constants/colors';
import { AnalysisService } from '../../lib/capture/analysisService';
import { SubjectService, SubjectProfile } from '../../lib/subjects/subjectService';
import { UserService } from '../../lib/user/userService';
import { db, auth } from '../../lib/firebase';
import { router, useLocalSearchParams } from 'expo-router';

export default function LiveInputScreen() {
  const { sessionId: initialSessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [subjects, setSubjects] = useState<SubjectProfile[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [userTier, setUserTier] = useState<'none' | 'core' | 'pro'>('none');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  // Gating Logic
  const checkAuth = useCallback((tier: 'none' | 'core' | 'pro' = 'none') => {
    if (process.env.EXPO_PUBLIC_ENVIRONMENT === 'development') return;
    const user = auth.currentUser;
    if (!user || user.isAnonymous || tier === 'none') {
      console.log("Access denied. Redirecting to paywall. Tier:", tier);
      router.replace('/paywall/pro');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      const timeoutId = setTimeout(() => {
        setFetching(false);
        Alert.alert("Engine Check", "The database is taking longer than usual to respond. Your connection might be slow.");
      }, 15000);

      try {
        const profile = await UserService.getProfile();
        const tier = (profile?.tier as 'none' | 'core' | 'pro') || 'none';
        setUserTier(tier);
        checkAuth(tier);
        clearTimeout(timeoutId);
      } catch (e) {
        console.error("Init Error:", e);
        clearTimeout(timeoutId);
      } finally {
        setFetching(false);
      }
    };

    const user = auth.currentUser;
    let unsubscribeSubjects: () => void = () => { };

    if (user && !user.isAnonymous) {
      const subjectsRef = collection(db, 'users', user.uid, 'subjects');
      const qSubjects = query(subjectsRef, orderBy('createdAt', 'desc'));

      unsubscribeSubjects = onSnapshot(qSubjects, (snap) => {
        const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SubjectProfile));
        setSubjects(list);
        if (list.length > 0 && !selectedSubjectId) {
          setSelectedSubjectId(list[0].id);
        }
      }, (err) => {
        console.error("Subjects Listener Error:", err);
      });
    }

    init();

    const onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value) {
        setInput(e.value[0]);
      }
    };

    const onSpeechError = (e: SpeechErrorEvent) => {
      console.warn("Speech Error:", e.error);
      setIsListening(false);
    };

    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    const unsubscribeAuth = auth.onAuthStateChanged((user: any) => {
      if (!user || user.isAnonymous) {
        checkAuth('none');
      } else {
        init();
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSubjects();
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [checkAuth, selectedSubjectId]);

  const handleStartDictation = async () => {
    if (isListening) {
      try {
        await Voice.stop();
        setIsListening(false);
      } catch (e) {
        console.error(e);
      }
      return;
    }

    try {
      Vibration.vibrate(50);
      setIsListening(true);
      await Voice.start('en-US');
    } catch (e: any) {
      Alert.alert("Dictation Error", "Ensure REDFLAGS has microphone access in settings.");
      setIsListening(false);
    }
  };

  const handleUploadScreenshot = async () => {
    if (!selectedSubjectId) {
      Alert.alert("Target Required", "Select who you are dating before uploading a signal.");
      return;
    }

    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission Required", "Allow access to photos to analyze screenshots.");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      quality: 0.8,
    });

    if (pickerResult.canceled || !pickerResult.assets[0].base64) return;

    setSelectedImage(pickerResult.assets[0].uri);
    setImageBase64(pickerResult.assets[0].base64);
  };

  const handleAddPerson = async () => {
    if (!newSubjectName.trim()) {
      setIsAddingSubject(false);
      return;
    }

    const limitCount = userTier === 'pro' ? 10 : 3;
    if (subjects.length >= limitCount) {
      Alert.alert("Limit Reached", `You have reached your ${limitCount} person limit.`, [
        { text: "View Pro", onPress: () => router.push('/paywall/pro') },
        { text: "Cancel", style: "cancel" }
      ]);
      return;
    }

    setLoading(true);
    try {
      const res = await SubjectService.createSubject(newSubjectName.trim(), userTier);
      if (res.success && res.id) {
        setSelectedSubjectId(res.id);
        setNewSubjectName('');
        setIsAddingSubject(false);
      } else {
        Alert.alert("Save Error", res.error || "Failed to add person.");
      }
    } catch (e: any) {
      console.error("Subject Creation Error:", e);
      Alert.alert("Network Failure", "Check your connection and try again.");
    } finally {
      // Small delay for listener sync
      setTimeout(() => setLoading(false), 800);
    }
  };

  const handleCapture = async () => {
    if (!selectedSubjectId || loading) return;
    if (!input.trim() && !imageBase64) return;

    setLoading(true);
    setError(null);

    try {
      const res = imageBase64
        ? await AnalysisService.analyzeImage(imageBase64, selectedSubjectId)
        : await AnalysisService.analyzeSignal(input, selectedSubjectId);

      if (res.success && res.signal) {
        setInput('');
        setSelectedImage(null);
        router.push({
          pathname: '/reports/psychology-read',
          params: {
            riskLevel: res.signal.riskLevel,
            reasoning: res.signal.reasoning,
            confidence: res.signal.confidence.toString(),
            content: res.signal.content
          }
        });
      } else {
        throw new Error(res.error || "Capture failed.");
      }
    } catch (e: any) {
      setError(e.message);
      Alert.alert("Processing Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <View style={styles.container}>
        <ActivityIndicator color={Colors.text} size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>CAPTURE FLAGS</Text>

      <View style={styles.subjectRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subjectList}>
          {subjects.map(s => (
            <TouchableOpacity
              key={s.id}
              onPress={() => {
                if (selectedSubjectId === s.id) {
                  router.push({ pathname: '/reports/subject-analysis', params: { id: s.id } });
                } else {
                  setSelectedSubjectId(s.id);
                }
              }}
              style={[styles.subjectTab, selectedSubjectId === s.id && styles.subjectTabActive]}
            >
              <Text style={[styles.subjectTabText, selectedSubjectId === s.id && styles.subjectTabTextActive]}>
                {s.name} {selectedSubjectId === s.id ? '📊' : ''}
              </Text>
            </TouchableOpacity>
          ))}

          {isAddingSubject ? (
            <View style={styles.inlineAddContainer}>
              <TextInput
                style={styles.inlineInput}
                placeholder="Name..."
                placeholderTextColor="#666"
                value={newSubjectName}
                onChangeText={setNewSubjectName}
                autoFocus
                onSubmitEditing={handleAddPerson}
                onBlur={() => !newSubjectName && setIsAddingSubject(false)}
              />
              <TouchableOpacity onPress={handleAddPerson} style={styles.inlineCheck}>
                <Text style={styles.inlineCheckText}>✓</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addTab} onPress={() => setIsAddingSubject(true)}>
              <Text style={styles.addTabText}>+ ADD PERSON</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>

      <View style={[styles.inputContainer, isListening && styles.inputContainerListening]}>
        {selectedImage ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity style={styles.removeImage} onPress={() => setSelectedImage(null)}>
              <Text style={styles.removeImageText}>✕ REMOVE</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TextInput
            style={styles.textInput}
            placeholder={isListening ? "Listening..." : "Type manually or upload screenshot..."}
            placeholderTextColor={isListening ? Colors.maxRisk : Colors.textMuted}
            value={input}
            onChangeText={setInput}
            multiline
          />
        )}
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.uploadButton, loading && styles.buttonDisabled]}
          onPress={handleUploadScreenshot}
          disabled={loading}
        >
          <Text style={styles.uploadButtonText}>📸 UPLOAD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.uploadButton, isListening && styles.dictationButtonActive]}
          onPress={handleStartDictation}
          disabled={loading}
        >
          <Text style={[styles.uploadButtonText, isListening && styles.dictationTextActive]}>
            {isListening ? "🎤 LISTENING..." : "🎤 DICTATE"}
          </Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <TouchableOpacity
        style={[
          styles.button,
          (!input.trim() && !selectedImage || !selectedSubjectId || loading) && styles.buttonDisabled
        ]}
        onPress={handleCapture}
        disabled={(!input.trim() && !selectedImage) || !selectedSubjectId || loading}
      >
        {loading ? (
          <ActivityIndicator color={Colors.background} />
        ) : (
          <Text style={styles.buttonText}>ANALYZE SIGNAL</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subjectRow: {
    marginBottom: 20,
    height: 48,
  },
  subjectList: {
    gap: 12,
    alignItems: 'center',
  },
  subjectTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 22,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#333',
  },
  subjectTabActive: {
    backgroundColor: Colors.text,
    borderColor: Colors.text,
  },
  subjectTabText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: 'bold',
  },
  subjectTabTextActive: {
    color: Colors.background,
  },
  addTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#444',
  },
  addTabText: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inlineAddContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: Colors.text,
    paddingRight: 8,
  },
  inlineInput: {
    color: Colors.text,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    minWidth: 100,
  },
  inlineCheck: {
    backgroundColor: Colors.text,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inlineCheckText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 16,
    minHeight: 180,
    marginBottom: 20,
  },
  inputContainerListening: {
    borderColor: Colors.maxRisk,
    borderWidth: 1,
    shadowColor: Colors.maxRisk,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  textInput: {
    color: Colors.text,
    fontSize: 16,
    flex: 1,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: Colors.text,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    color: Colors.background,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  dictationButtonActive: {
    backgroundColor: Colors.maxRisk,
    borderColor: Colors.maxRisk,
  },
  uploadButtonText: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: 'bold',
  },
  dictationTextActive: {
    color: Colors.background,
  },
  imagePreviewContainer: {
    width: '100%',
    height: 150,
    position: 'relative',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImage: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  removeImageText: {
    color: Colors.text,
    fontSize: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  }
});
