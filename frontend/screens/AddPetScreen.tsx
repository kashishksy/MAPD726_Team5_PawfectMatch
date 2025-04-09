import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    TextInput,
    Alert,
    Modal,
    Image,
    Platform,
    PermissionsAndroid,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import api from '../services/api';
import { getToken } from '../utils/authStorage';
import { useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import { fetchAnimalsFailure, fetchAnimalsStart, fetchAnimalsSuccess } from '../redux/slices/animalsSlice';
import { useDispatch } from 'react-redux';
interface PetType {
    _id: string;
    name: string;
}

interface BreedType {
    _id: string;
    name: string;
}

interface FormData {
    name: string;
    gender: string;
    petType: string;
    breedType: string;
    size: string;
    age: string;
    location: { lat: number; lng: number };
    address: string;
    city: string;
    state: string;
    country: string;
    description: string;
    images: Array<{
        uri: string;
        type: string;
        name: string;
    }>;
}

const AddPetScreen = () => {
    const navigation = useNavigation();
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const [petTypes, setPetTypes] = useState<PetType[]>([]);
    const [breedTypes, setBreedTypes] = useState<BreedType[]>([]);
    const [activePickerField, setActivePickerField] = useState<string | null>(null);
    const userData = useSelector((state: any) => state.auth.userData);
    const [locationError, setLocationError] = useState<string | null>(null);
    const dispatch = useDispatch();
    // Form state with proper typing
    const [formData, setFormData] = useState<FormData>({
        name: '',
        gender: '',
        petType: '',
        breedType: '',
        size: '',
        age: '',
        location: { lat: 43.7756435641, lng: -79.2340690637 }, // Default location
        address: '',
        city: '',
        state: '',
        country: '',
        description: '',
        images: [],
    });

    // Location permission request function
    const requestLocationPermission = async () => {
        try {
            if (Platform.OS === 'ios') {
                const auth = await Geolocation.requestAuthorization('whenInUse');
                return auth === 'granted';
            }

            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Permission',
                        message: 'PawfectMatch needs access to your location.',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            }
            return false;
        } catch (error) {
            console.error('Error requesting location permission:', error);
            return false;
        }
    };

    // Get current location function
    const getCurrentLocation = async () => {
        try {
            const hasPermission = await requestLocationPermission();
            
            if (!hasPermission) {
                setLocationError('Location permission denied');
                return;
            }

            Geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({
                        ...prev,
                        location: {
                            lat: latitude,
                            lng: longitude,
                        }
                    }));
                    setLocationError(null);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setLocationError('Error getting location');
                },
                { 
                    enableHighAccuracy: true, 
                    timeout: 15000, 
                    maximumAge: 10000,
                    distanceFilter: 0,
                    forceRequestLocation: true,
                    forceLocationManager: true,
                }
            );
        } catch (error) {
            console.error('Error in getCurrentLocation:', error);
            setLocationError('Error getting location');
        }
    };

    // Fetch pet types on mount and get current location
    useEffect(() => {
        fetchPetTypes();
        getCurrentLocation();
    }, []);

    // Fetch breed types when pet type changes
    useEffect(() => {
        if (formData.petType) {
            fetchBreedTypes(formData.petType);
        }
    }, [formData.petType]);

    const fetchPetTypes = async () => {
        try {
            const token = await getToken();
            const response = await api.get('/pets', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPetTypes(response.data.data);
        } catch (error) {
            console.error('Error fetching pet types:', error);
            Alert.alert('Error', 'Failed to fetch pet types');
        }
    };

    const fetchBreedTypes = async (petTypeId: string) => {
        try {
            const token = await getToken();
            const response = await api.post('/breeds', 
                { pet_id: petTypeId },
                { headers: { Authorization: `Bearer ${token}` }}
            );
            setBreedTypes(response.data.data);
        } catch (error) {
            console.error('Error fetching breed types:', error);
            Alert.alert('Error', 'Failed to fetch breed types');
        }
    };

    const handleImagePick = async () => {
        try {
            const result = await launchImageLibrary({
                mediaType: 'photo',
                quality: 1,
                selectionLimit: 5,
            });

            if (result.assets) {
                const newImages = result.assets.map(asset => ({
                    uri: asset.uri!,
                    type: asset.type || 'image/jpeg',
                    name: asset.fileName || `image-${Date.now()}.jpg`,
                }));

                setFormData(prev => ({
                    ...prev,
                    images: [...prev.images, ...newImages].slice(0, 5), // Limit to 5 images
                }));
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            console.log(userData.userId);
            if (!userData.userId) {
                Alert.alert('Error', 'You must be logged in to add a pet');
                return;
            }

            // Validate required fields
            const requiredFields = [
                'name', 'gender', 'petType', 'size', 'age',
                'address', 'city', 'state', 'country', 'description'
            ] as const;

            const missingFields = requiredFields.filter(field => !formData[field]);
            if (missingFields.length > 0) {
                Alert.alert('Missing Fields', `Please fill in: ${missingFields.join(', ')}`);
                return;
            }

            if (formData.images.length === 0) {
                Alert.alert('Error', 'Please add at least one image');
                return;
            }

            const token = await getToken();
            if (!token) {
                Alert.alert('Error', 'You must be logged in to add a pet');
                return;
            }
            
            // Create FormData instance
            const form = new FormData();

            // Append owner ID from Redux state
            form.append('owner', userData.userId);

            // Append images
            formData.images.forEach((image, index) => {
                form.append('images', {
                    uri: Platform.OS === 'ios' ? image.uri.replace('file://', '') : image.uri,
                    type: image.type,
                    name: image.name,
                } as any);
            });

            // Append all other form fields
            Object.entries(formData).forEach(([key, value]) => {
                if (key !== 'images') {
                    if (key === 'location') {
                        form.append(key, JSON.stringify(value));
                    } else {
                        form.append(key, value.toString());
                    }
                }
            });

            const response = await api.post('/animal', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`
                }
            });
            console.log("adding pet details:", response.data);
            
            // Dispatch action to refresh animals data
            const fetchAnimals = async () => {
                dispatch(fetchAnimalsStart());
                try {
                  const response = await api.post('/animals/search', 
                    {
                      search: "",
                      size: "",
                      age: "",
                      gender: "",
                      page: 1,
                      limit: 20,
                      breedType: "",
                      petType: ""
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                      }
                    }
                  );
                  const data = response.data;
                  dispatch(fetchAnimalsSuccess({
                    data: data.data,
                    total: data.total,
                    page: data.page,
                    limit: data.limit
                  }));
                //   console.log('Animals data received:', data);
                } catch (error) {
                  console.error('Error fetching animals:', error);
                  dispatch(fetchAnimalsFailure('Failed to fetch animals'));
                }
              };
            
            
            Alert.alert('Success', 'Pet added successfully!');
            navigation.goBack();

        } catch (error) {
            console.error('Error adding pet:', error);
            Alert.alert('Error', 'Failed to add pet');
        } finally {
            setLoading(false);
        }
    };

    const renderCustomPicker = (
        value: string,
        onValueChange: (value: string) => void,
        items: { label: string; value: string }[],
        placeholder: string,
        fieldName: string
    ) => {
        const selectedItem = items.find(item => item.value === value);
        
        return (
            <>
                <TouchableOpacity
                    style={[styles.input, { backgroundColor: colors.card }]}
                    onPress={() => setActivePickerField(fieldName)}
                >
                    <Text style={{ color: value ? colors.text : colors.secondaryText }}>
                        {selectedItem ? selectedItem.label : placeholder}
                    </Text>
                </TouchableOpacity>

                <Modal
                    visible={activePickerField === fieldName}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setActivePickerField(null)}
                >
                    <TouchableOpacity
                        style={styles.modalOverlay}
                        activeOpacity={1}
                        onPress={() => setActivePickerField(null)}
                    >
                        <View style={[styles.pickerModal, { backgroundColor: colors.card }]}>
                            <Text style={[styles.pickerTitle, { color: colors.text }]}>
                                {placeholder}
                            </Text>
                            <ScrollView>
                                {items.map((item) => (
                                    <TouchableOpacity
                                        key={item.value}
                                        style={styles.pickerItem}
                                        onPress={() => {
                                            onValueChange(item.value);
                                            setActivePickerField(null);
                                        }}
                                    >
                                        <Text style={[
                                            styles.pickerItemText,
                                            { color: colors.text },
                                            value === item.value && styles.pickerItemSelected
                                        ]}>
                                            {item.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Add New Pet</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.form}>
                    {/* Image Selection Section */}
                    <View style={styles.imagesContainer}>
                        {formData.images.map((image, index) => (
                            <View key={index} style={styles.imageWrapper}>
                                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => removeImage(index)}
                                >
                                    <Ionicons name="close-circle" size={24} color="#FF6F61" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        {formData.images.length < 5 && (
                            <TouchableOpacity 
                                style={styles.addImageButton}
                                onPress={handleImagePick}
                            >
                                <Ionicons name="add-circle-outline" size={40} color={colors.primary} />
                                <Text style={[styles.addImageText, { color: colors.text }]}>
                                    Add Image
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                        placeholder="Pet Name"
                        placeholderTextColor={colors.secondaryText}
                        value={formData.name}
                        onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
                    />

                    {renderCustomPicker(
                        formData.gender,
                        (value) => setFormData(prev => ({ ...prev, gender: value })),
                        [
                            { label: 'Male', value: 'Male' },
                            { label: 'Female', value: 'Female' },
                        ],
                        'Select Gender',
                        'gender'
                    )}

                    {renderCustomPicker(
                        formData.petType,
                        (value) => setFormData(prev => ({ ...prev, petType: value })),
                        petTypes.map(type => ({
                            label: type.name,
                            value: type._id,
                        })),
                        'Select Pet Type',
                        'petType'
                    )}

                    {formData.petType && renderCustomPicker(
                        formData.breedType,
                        (value) => setFormData(prev => ({ ...prev, breedType: value })),
                        breedTypes.map(breed => ({
                            label: breed.name,
                            value: breed._id,
                        })),
                        'Select Breed',
                        'breedType'
                    )}

                    {renderCustomPicker(
                        formData.size,
                        (value) => setFormData(prev => ({ ...prev, size: value })),
                        [
                            { label: 'Small', value: 'Small' },
                            { label: 'Medium', value: 'Medium' },
                            { label: 'Large', value: 'Large' },
                        ],
                        'Select Size',
                        'size'
                    )}

                    {renderCustomPicker(
                        formData.age,
                        (value) => setFormData(prev => ({ ...prev, age: value })),
                        [
                            { label: 'Baby', value: 'Baby' },
                            { label: 'Young', value: 'Young' },
                            { label: 'Adult', value: 'Adult' },
                            { label: 'Senior', value: 'Senior' },
                        ],
                        'Select Age',
                        'age'
                    )}

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Location</Text>
                        <View style={styles.locationContainer}>
                            <Text style={styles.locationText}>
                                Lat: {formData.location.lat.toFixed(6)}, Lng: {formData.location.lng.toFixed(6)}
                            </Text>
                            <TouchableOpacity 
                                style={styles.refreshButton}
                                onPress={getCurrentLocation}
                            >
                                <Text style={styles.refreshButtonText}>Refresh Location</Text>
                            </TouchableOpacity>
                        </View>
                        {locationError && (
                            <Text style={styles.errorText}>{locationError}</Text>
                        )}
                    </View>

                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                        placeholder="Address"
                        placeholderTextColor={colors.secondaryText}
                        value={formData.address}
                        onChangeText={text => setFormData(prev => ({ ...prev, address: text }))}
                    />

                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                        placeholder="City"
                        placeholderTextColor={colors.secondaryText}
                        value={formData.city}
                        onChangeText={text => setFormData(prev => ({ ...prev, city: text }))}
                    />

                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                        placeholder="State"
                        placeholderTextColor={colors.secondaryText}
                        value={formData.state}
                        onChangeText={text => setFormData(prev => ({ ...prev, state: text }))}
                    />

                    <TextInput
                        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                        placeholder="Country"
                        placeholderTextColor={colors.secondaryText}
                        value={formData.country}
                        onChangeText={text => setFormData(prev => ({ ...prev, country: text }))}
                    />

                    <TextInput
                        style={[styles.textArea, { backgroundColor: colors.card, color: colors.text }]}
                        placeholder="Description"
                        placeholderTextColor={colors.secondaryText}
                        value={formData.description}
                        onChangeText={text => setFormData(prev => ({ ...prev, description: text }))}
                        multiline
                        numberOfLines={4}
                    />
                </View>
            </ScrollView>

            <TouchableOpacity
                style={[styles.submitButton, { opacity: loading ? 0.7 : 1 }]}
                onPress={handleSubmit}
                disabled={loading}
            >
                <Text style={styles.submitButtonText}>
                    {loading ? 'Adding Pet...' : 'Add Pet'}
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    form: {
        gap: 16,
    },
    input: {
        height: 48,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    textArea: {
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingTop: 12,
        fontSize: 16,
        minHeight: 120,
        textAlignVertical: 'top',
    },
    submitButton: {
        backgroundColor: '#FF6F61',
        margin: 16,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    pickerModal: {
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        maxHeight: '70%',
    },
    pickerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    pickerItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    pickerItemText: {
        fontSize: 16,
    },
    pickerItemSelected: {
        color: '#FF6F61',
        fontWeight: 'bold',
    },
    imagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    imageWrapper: {
        position: 'relative',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: 'white',
        borderRadius: 12,
    },
    addImageButton: {
        width: 100,
        height: 100,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ddd',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    addImageText: {
        marginTop: 4,
        fontSize: 12,
    },
    formGroup: {
        gap: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 8,
        padding: 12,
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
    },
    locationText: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    refreshButton: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6,
        marginLeft: 10,
    },
    refreshButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    errorText: {
        color: '#ff0000',
        fontSize: 12,
        marginTop: 4,
    },
});

export default AddPetScreen; 