import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Linking,
    FlatList,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite } from '../redux/slices/favoritesSlice';
import { RootState } from '../redux/types';
import { useTheme } from '../context/ThemeContext';

// Define interfaces for type safety
interface PetOwner {
    _id: string;
    fullName: string;
    profileImage: string | null;
    mobileNumber?: string;
    countryCode?: string;
    userType: string;
}

interface OwnerPet {
    _id: string;
    name: string;
    breedType?: {
        _id: string;
        name: string;
    };
    images: string[];
    kms?: number;
    gender?: string;
    age?: string;
    size?: string;
    description?: string;
    owner?: {
        _id: string;
        fullName: string;
    };
}

const OwnerOrganizationDetailsScreen = ({ route, navigation }: any) => {
    const { ownerData, petId, address, city, state, country } = route.params;
    const [selectedTab, setSelectedTab] = useState("Pets");
    
    const dispatch = useDispatch();
    const favorites = useSelector((state: RootState) => state.favorites.items);
    const allAnimals = useSelector((state: RootState) => state.animals.animals);
    const animalsLoading = useSelector((state: RootState) => state.animals.loading);
    const animalsError = useSelector((state: RootState) => state.animals.error);
    const { colors } = useTheme();
    
    // Filter pets by owner ID only, don't exclude the current pet
    const ownerPets = allAnimals.filter((pet: OwnerPet) => 
        pet.owner?._id === ownerData._id
    );
    
    // Format phone number with country code
    const phoneNumber = ownerData?.mobileNumber 
        ? `+${ownerData.countryCode || '1'}${ownerData.mobileNumber}` 
        : "";
    const email = "info@petadopt.org"; // Default email if not available
    const website = "https://www.petadopt.org"; // Default website if not available
    const locationQuery = `${address || ''}, ${city || ''}, ${state || ''}, ${country || ''}`;

    // Handlers for Actions
    const handleCall = () => phoneNumber && Linking.openURL(`tel:${phoneNumber}`);
    const handleEmail = () => Linking.openURL(`mailto:${email}`);
    const handleWebsite = () => Linking.openURL(website);
    const handleNavigate = () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`);

    // Toggle favorite status
    const handleToggleFavorite = (pet: OwnerPet) => {
        dispatch(toggleFavorite({
            id: pet._id,
            title: pet.name,
            description: pet.breedType?.name || 'Unknown breed',
            images: pet.images,
            name: pet.name,
            breedType: pet.breedType,
            kms: pet.kms
        }));
    };
    
    const handlePetPress = (petId: string) => {
        navigation.navigate('PetDetails', { petId });
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: colors.text }]}>Owner / Organization</Text>
            </View>

            {/* Organization Details Card */}
            <View style={[styles.card, { backgroundColor: colors.card }]}>
                <Image 
                    source={
                        ownerData?.profileImage 
                            ? { uri: ownerData.profileImage } 
                            : require('../assets/images/stock_photo1.jpg')
                    } 
                    style={styles.profileImage} 
                />
                <View style={styles.detailsContainer}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                        {ownerData?.fullName || 'Pet Owner'}
                    </Text>
                    <View style={styles.detailRow}>
                        <MaterialIcons name="place" size={20} color="#FF6F61" />
                        <Text style={[styles.detailText, { color: colors.text }]}>
                            {city ? `${city}, ${state || ''}` : 'Location not available'}
                        </Text>
                    </View>
                    {phoneNumber && (
                        <View style={styles.detailRow}>
                            <MaterialIcons name="call" size={20} color="#FF6F61" />
                            <Text style={[styles.detailText, { color: colors.text }]}>{phoneNumber}</Text>
                        </View>
                    )}
                    <View style={styles.detailRow}>
                        <MaterialIcons name="email" size={20} color="#FF6F61" />
                        <Text style={[styles.detailText, { color: colors.text }]}>{email}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <MaterialIcons name="language" size={20} color="#FF6F61" />
                        <Text style={[styles.detailText, { color: colors.text }]}>{website}</Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                    <MaterialIcons name="phone" size={28} color="#FF6F61" />
                    <Text style={[styles.actionText, { color: colors.text }]}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
                    <MaterialIcons name="email" size={28} color="#FF6F61" />
                    <Text style={[styles.actionText, { color: colors.text }]}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
                    <MaterialIcons name="public" size={28} color="#FF6F61" />
                    <Text style={[styles.actionText, { color: colors.text }]}>Website</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleNavigate}>
                    <MaterialIcons name="map" size={28} color="#FF6F61" />
                    <Text style={[styles.actionText, { color: colors.text }]}>Navigate</Text>
                </TouchableOpacity>
            </View>

            {/* Tab Switch */}
            <View style={styles.tabContainer}>
                <TouchableOpacity 
                    style={[
                        styles.tabButton, 
                        selectedTab === "Pets" && styles.activeTab,
                        { backgroundColor: selectedTab === "Pets" ? "#FF6F61" : colors.card }
                    ]} 
                    onPress={() => setSelectedTab("Pets")}
                >
                    <Text 
                        style={[
                            styles.tabText, 
                            selectedTab === "Pets" && styles.activeTabText,
                            { color: selectedTab === "Pets" ? "#fff" : colors.text }
                        ]}
                    >
                        Pets
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[
                        styles.tabButton, 
                        selectedTab === "Policy" && styles.activeTab,
                        { backgroundColor: selectedTab === "Policy" ? "#FF6F61" : colors.card }
                    ]} 
                    onPress={() => setSelectedTab("Policy")}
                >
                    <Text 
                        style={[
                            styles.tabText, 
                            selectedTab === "Policy" && styles.activeTabText,
                            { color: selectedTab === "Policy" ? "#fff" : colors.text }
                        ]}
                    >
                        Adoption Policy
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Conditional Content */}
            {selectedTab === "Pets" ? (
                <>
                    {animalsLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#FF6F61" />
                        </View>
                    ) : animalsError ? (
                        <Text style={[styles.errorText, { color: colors.text }]}>{animalsError}</Text>
                    ) : ownerPets.length === 0 ? (
                        <Text style={[styles.emptyText, { color: colors.text }]}>
                            No pets available from this owner
                        </Text>
                    ) : (
                        <FlatList
                            data={ownerPets}
                            numColumns={2}
                            keyExtractor={(item: OwnerPet) => item._id}
                            renderItem={({ item }: { item: OwnerPet }) => {
                                const isFavorited = favorites.some(fav => fav.id === item._id);
                                const isCurrentPet = item._id === petId;
                                
                                return (
                                    <TouchableOpacity 
                                        style={[
                                            styles.petCard, 
                                            { 
                                                backgroundColor: colors.card,
                                                borderWidth: isCurrentPet ? 2 : 0,
                                                borderColor: isCurrentPet ? "#FF6F61" : "transparent"
                                            }
                                        ]}
                                        onPress={() => handlePetPress(item._id)}
                                        disabled={isCurrentPet}
                                    >
                                        <View style={styles.imageContainer}>
                                            <Image 
                                                source={{ uri: item.images[0] }} 
                                                style={styles.petImage} 
                                            />
                                            <TouchableOpacity 
                                                style={styles.favoriteIcon} 
                                                onPress={() => handleToggleFavorite(item)}
                                            >
                                                <Ionicons 
                                                    name={isFavorited ? "heart" : "heart-outline"} 
                                                    size={24} 
                                                    color={isFavorited ? "#FF6F61" : "#fff"} 
                                                />
                                            </TouchableOpacity>
                                            {isCurrentPet && (
                                                <View style={styles.currentPetBadge}>
                                                    <Text style={styles.currentPetText}>Current</Text>
                                                </View>
                                            )}
                                        </View>
                                        <Text style={[styles.petName, { color: colors.text }]}>{item.name}</Text>
                                        <View style={styles.infoContainer}>
                                            <FontAwesome6 name="location-dot" size={12} color="#F4A460" />
                                            <Text style={[styles.petInfo, { color: colors.secondaryText }]}>
                                                {item.kms?.toFixed(1) || '?'} km • {item.breedType?.name || 'Unknown breed'}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }}
                        />
                    )}
                </>
            ) : (
                <ScrollView style={styles.policyContainer}>
                    <Text style={[styles.policyText, { color: colors.text }]}>
                        Adoption policies ensure that pets find safe, loving homes. Adopters must provide proof of residence,
                        undergo an interview, and pay a small adoption fee. Visit the website for more details.
                    </Text>
                </ScrollView>
            )}
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
        padding: 16,
        gap: 16,
        borderBottomWidth: 1,
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        padding: 16,
        margin: 16,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 3,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 16,
    },
    detailsContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    detailText: {
        fontSize: 16,
        marginLeft: 8,
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 16,
        paddingVertical: 12,
    },
    actionButton: {
        alignItems: "center",
    },
    actionText: {
        marginTop: 4,
        fontSize: 14,
    },
    tabContainer: { 
        flexDirection: "row", 
        marginVertical: 16,
        paddingHorizontal: 16,
        justifyContent: "space-between"
    },
    tabButton: { 
        flex: 1,
        paddingVertical: 12, 
        paddingHorizontal: 20, 
        borderRadius: 8,
        marginHorizontal: 4,
        alignItems: "center"
    },
    activeTab: { 
        backgroundColor: "#FF6F61" 
    },
    tabText: { 
        fontSize: 16,
    },
    activeTabText: { 
        color: "#fff", 
        fontWeight: "bold" 
    },
    petCard: { 
        flex: 1, 
        margin: 8,
        borderRadius: 10, 
        padding: 10 
    },
    imageContainer: {
        position: "relative",
    },
    petImage: { 
        width: "100%", 
        height: 120, 
        borderRadius: 8 
    },
    favoriteIcon: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 6,
        borderRadius: 20,
    },
    currentPetBadge: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(255, 111, 97, 0.8)",
        paddingVertical: 4,
        alignItems: "center",
    },
    currentPetText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    petName: { 
        fontSize: 16, 
        fontWeight: "bold", 
        marginTop: 8 
    },
    infoContainer: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginTop: 4 
    },
    petInfo: { 
        fontSize: 12,
        marginLeft: 4 
    },
    policyContainer: { 
        padding: 16 
    },
    policyText: { 
        fontSize: 16,
        lineHeight: 24 
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 16,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 16,
    }
});

export default OwnerOrganizationDetailsScreen;
