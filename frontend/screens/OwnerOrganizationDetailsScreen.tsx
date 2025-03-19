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
    ScrollView
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import  Ionicons from 'react-native-vector-icons/Ionicons'; // Import heart icon

// Sample Pets Data (Replace with API Data)
const pets = [
    { id: 1, name: "Mochi", breed: "Abyssinian", distance: "1.2 km", image: require("../assets/images/mochi.png") },
    { id: 2, name: "Luna", breed: "Chihuahua", distance: "1.2 km", image: require("../assets/images/luna.png") },
    { id: 3, name: "Casper", breed: "Maine Coon", distance: "1.2 km", image: require("../assets/images/casper.jpeg") },
    { id: 4, name: "Bella", breed: "Siamese", distance: "1.2 km", image: require("../assets/images/bella.png") },
    { id: 5, name: "Clover", breed: "Rabbit", distance: "1.2 km", image: require("../assets/images/clover.png") },
    { id: 6, name: "Hazel", breed: "Rabbit", distance: "1.2 km", image: require("../assets/images/hazel.png") },
];

const OwnerOrganizationDetailsScreen = ({ navigation }: any) => {
    const phoneNumber = "+1234567890";
    const email = "info@petadopt.org";
    const website = "https://www.petadopt.org";
    const locationQuery = "1600 Amphitheatre Parkway, Mountain View, CA";

    // Handlers for Actions
    const handleCall = () => Linking.openURL(`tel:${phoneNumber}`);
    const handleEmail = () => Linking.openURL(`mailto:${email}`);
    const handleWebsite = () => Linking.openURL(website);
    const handleNavigate = () => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`);

    const [selectedTab, setSelectedTab] = useState("Pets");
    const [favorites, setFavorites] = useState<number[]>([]); // State for favorite pets

    // Toggle favorite status
    const toggleFavorite = (petId: number) => {
        setFavorites(prevFavorites =>
            prevFavorites.includes(petId)
                ? prevFavorites.filter(id => id !== petId) // Remove from favorites
                : [...prevFavorites, petId] // Add to favorites
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/images/back_icon.png')} style={styles.inputIcon} />
                </TouchableOpacity>
                <Text style={styles.title}>Owner / Organization</Text>
            </View>

            {/* Organization Details Card */}
            <View style={styles.card}>
                <Image source={require('../assets/images/stock_photo1.jpg')} style={styles.profileImage} />
                <View style={styles.detailsContainer}>
                    <Text style={styles.cardTitle}>Happy Tails Animal Rescue</Text>
                    <View style={styles.detailRow}>
                        <MaterialIcons name="place" size={20} color="#FF6F61" />
                        <Text style={styles.detailText}>New York, USA</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <MaterialIcons name="call" size={20} color="#FF6F61" />
                        <Text style={styles.detailText}>{phoneNumber}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <MaterialIcons name="email" size={20} color="#FF6F61" />
                        <Text style={styles.detailText}>{email}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <MaterialIcons name="language" size={20} color="#FF6F61" />
                        <Text style={styles.detailText}>{website}</Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
                    <MaterialIcons name="phone" size={28} color="#FF6F61" />
                    <Text style={styles.actionText}>Call</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleEmail}>
                    <MaterialIcons name="email" size={28} color="#FF6F61" />
                    <Text style={styles.actionText}>Email</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleWebsite}>
                    <MaterialIcons name="public" size={28} color="#FF6F61" />
                    <Text style={styles.actionText}>Website</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={handleNavigate}>
                    <MaterialIcons name="map" size={28} color="#FF6F61" />
                    <Text style={styles.actionText}>Navigate</Text>
                </TouchableOpacity>
            </View>

            {/* Tab Switch */}
            <View style={styles.tabContainer}>
                <TouchableOpacity style={[styles.tabButton, selectedTab === "Pets" && styles.activeTab]} onPress={() => setSelectedTab("Pets")}>
                    <Text style={[styles.tabText, selectedTab === "Pets" && styles.activeTabText]}>Pets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabButton, selectedTab === "Policy" && styles.activeTab]} onPress={() => setSelectedTab("Policy")}>
                    <Text style={[styles.tabText, selectedTab === "Policy" && styles.activeTabText]}>Adoption Policy</Text>
                </TouchableOpacity>
            </View>

            {/* Conditional Content */}
            {selectedTab === "Pets" ? (
                <FlatList
                    data={pets}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => {
                        const isFavorited = favorites.includes(item.id);
                        return (
                            <View style={styles.petCard}>
                                <View style={styles.imageContainer}>
                                    <Image source={item.image} style={styles.petImage} />
                                    <TouchableOpacity style={styles.favoriteIcon} onPress={() => toggleFavorite(item.id)}>
                                        <Ionicons name={isFavorited ? "heart" : "heart-outline"} size={24} color={isFavorited ? "#FF6F61" : "#fff"} />
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.petName}>{item.name}</Text>
                                <View style={styles.infoContainer}>
                                    <FontAwesome6 name="location-dot" size={12} color="#F4A460" />
                                    <Text style={styles.petInfo}>{item.distance} • {item.breed}</Text>
                                </View>
                            </View>
                        );
                    }}
                />
            ) : (
                <ScrollView style={styles.policyContainer}>
                    <Text style={styles.policyText}>
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
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 16,
    },
    backButton: {
        padding: 8,
    },
    inputIcon: {
        marginRight: 12,
        height: 20,
        width: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
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
        color: '#333',
    },
    detailRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    detailText: {
        fontSize: 16,
        color: "#333",
        marginLeft: 8,
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 16,
        paddingVertical: 12,
        backgroundColor: "#fff",
    },
    actionButton: {
        alignItems: "center",
    },
    actionText: {
        marginTop: 4,
        fontSize: 14,
        color: "#333",
    },
    tabContainer: { 
        flexDirection: "row", 
        marginVertical: 16, 
        justifyContent: "center" 
    },
    tabButton: { 
        paddingVertical: 12, 
        paddingHorizontal: 20, 
        borderRadius: 8, 
        backgroundColor: "#EAEAEA", 
        marginHorizontal: 8 
    },
    activeTab: { 
        backgroundColor: "#FF6F61" 
    },
    tabText: { 
        fontSize: 16, 
        color: "#333" 
    },
    activeTabText: { 
        color: "#fff", 
        fontWeight: "bold" 
    },
    petCard: { 
        flex: 1, 
        margin: 8, 
        backgroundColor: "#F9F9F9", 
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
        color: "#666", 
        marginLeft: 4 
    },
    policyContainer: { 
        padding: 16 
    },
    policyText: { 
        fontSize: 16, 
        color: "#333", 
        lineHeight: 24 
    },
});


export default OwnerOrganizationDetailsScreen;
