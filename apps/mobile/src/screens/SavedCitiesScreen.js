import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

export const SavedCitiesScreen = ({
  favorites = [],
  onSelectCity,
  onRemoveFavorite,
  onBack,
  unit,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const defaultCities = [
    { id: '1', name: 'New York', country: 'USA', latitude: 40.7128, longitude: -74.006, temp: 22, emoji: '⛅' },
    { id: '2', name: 'London', country: 'UK', latitude: 51.5074, longitude: -0.1278, temp: 16, emoji: '☁️' },
    { id: '3', name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, temp: 18, emoji: '🌙' },
    { id: '4', name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777, temp: 32, emoji: '☀️' },
  ];

  const displayList = favorites.length > 0 ? favorites : defaultCities;

  const tempDisplay = (celsius) => {
    if (celsius === null || celsius === undefined) return '--';
    const c = Math.round(celsius);
    if (unit === 'fahrenheit') {
      return `${Math.round((c * 9) / 5 + 32)}°F`;
    }
    return `${c}°C`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backText}>‹</Text>
          <Text style={styles.title}>Saved Cities</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setIsEditing(!isEditing)}
          style={styles.editButton}
        >
          <Text style={styles.editText}>{isEditing ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {displayList.map((city) => (
          <TouchableOpacity
            key={city.id || city._id || city.name}
            style={styles.card}
            onPress={() => onSelectCity(city)}
            activeOpacity={0.7}
          >
            <View style={styles.cardLeft}>
              <View style={styles.thumbBox}>
                <Text style={styles.thumbEmoji}>🏛️</Text>
              </View>
              <View>
                <Text style={styles.cityName}>{city.name}</Text>
                <Text style={styles.countryName}>{city.country || 'Region'}</Text>
              </View>
            </View>

            <View style={styles.cardRight}>
              <Text style={styles.weatherEmoji}>{city.emoji || '⛅'}</Text>
              <Text style={styles.tempText}>{tempDisplay(city.temp ?? 22)}</Text>
              {isEditing && (
                <TouchableOpacity
                  onPress={() => onRemoveFavorite(city.id || city._id)}
                  style={styles.deleteButton}
                >
                  <Text style={styles.deleteText}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#00D2FF',
    fontSize: 28,
    fontWeight: '300',
    marginRight: 6,
    marginTop: -2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  editButton: {
    padding: 6,
  },
  editText: {
    color: '#00D2FF',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111C38',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  thumbEmoji: {
    fontSize: 22,
  },
  cityName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  countryName: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherEmoji: {
    fontSize: 22,
    marginRight: 8,
  },
  tempText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  deleteButton: {
    marginLeft: 12,
    padding: 4,
  },
  deleteText: {
    fontSize: 16,
  },
});
