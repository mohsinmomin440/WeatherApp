import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { mobileApi } from '../api/client.js';

export const SearchScreen = ({ onSelectCity, unit }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const popularCities = [
    { name: 'New York', country: 'USA', admin1: 'New York', latitude: 40.7128, longitude: -74.006, temp: 22, emoji: '🗽' },
    { name: 'London', country: 'UK', admin1: 'Greater London', latitude: 51.5074, longitude: -0.1278, temp: 16, emoji: '🎡' },
    { name: 'Tokyo', country: 'Japan', admin1: 'Tokyo', latitude: 35.6762, longitude: 139.6503, temp: 18, emoji: '🗼' },
    { name: 'Mumbai', country: 'India', admin1: 'Maharashtra', latitude: 19.076, longitude: 72.8777, temp: 32, emoji: '🏛️' },
  ];

  const recentSearches = [
    { name: 'Delhi', country: 'India', admin1: 'Delhi', latitude: 28.6139, longitude: 77.209, temp: 34, emoji: '🕌' },
    { name: 'Sydney', country: 'Australia', admin1: 'New South Wales', latitude: -33.8688, longitude: 151.2093, temp: 20, emoji: '⛵' },
  ];

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await mobileApi.searchCities(query);
        setResults(res.data || []);
      } catch (err) {
        console.error('Mobile city search failed:', err);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

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
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search city..."
            placeholderTextColor="#64748B"
            value={query}
            onChangeText={setQuery}
          />
          {loading && <ActivityIndicator size="small" color="#00D2FF" />}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Dynamic Query Results */}
        {query.trim().length >= 2 && (
          <View style={styles.section}>
            <Text style={styles.sectionHeader}>Search Results</Text>
            {results.length > 0 ? (
              results.map((city) => (
                <TouchableOpacity
                  key={`${city.id}-${city.latitude}-${city.longitude}`}
                  style={styles.cityCard}
                  onPress={() => onSelectCity(city)}
                  activeOpacity={0.7}
                >
                  <View style={styles.cityLeft}>
                    <Text style={styles.cityEmoji}>📍</Text>
                    <View>
                      <Text style={styles.cityName}>{city.name}</Text>
                      <Text style={styles.countryName}>
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.chevron}>›</Text>
                </TouchableOpacity>
              ))
            ) : !loading ? (
              <Text style={styles.emptyText}>No cities found for "{query}".</Text>
            ) : null}
          </View>
        )}

        {/* Popular Cities */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Popular Cities</Text>
          {popularCities.map((city) => (
            <TouchableOpacity
              key={city.name}
              style={styles.cityCard}
              onPress={() => onSelectCity(city)}
              activeOpacity={0.7}
            >
              <View style={styles.cityLeft}>
                <View style={styles.thumbBox}>
                  <Text style={styles.thumbEmoji}>{city.emoji}</Text>
                </View>
                <View>
                  <Text style={styles.cityName}>{city.name}</Text>
                  <Text style={styles.countryName}>{city.country}</Text>
                </View>
              </View>

              <View style={styles.cityRight}>
                <Text style={styles.cityTemp}>{tempDisplay(city.temp)}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Searches */}
        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Recent Searches</Text>
          {recentSearches.map((city) => (
            <TouchableOpacity
              key={city.name}
              style={styles.cityCard}
              onPress={() => onSelectCity(city)}
              activeOpacity={0.7}
            >
              <View style={styles.cityLeft}>
                <View style={styles.thumbBox}>
                  <Text style={styles.thumbEmoji}>{city.emoji}</Text>
                </View>
                <View>
                  <Text style={styles.cityName}>{city.name}</Text>
                  <Text style={styles.countryName}>{city.country}</Text>
                </View>
              </View>

              <View style={styles.cityRight}>
                <Text style={styles.cityTemp}>{tempDisplay(city.temp)}</Text>
                <Text style={styles.chevron}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111C38',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 48,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#111C38',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.12)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
  },
  cityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  thumbEmoji: {
    fontSize: 20,
  },
  cityEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  cityName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  countryName: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  cityRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cityTemp: {
    color: '#38BDF8',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 8,
  },
  chevron: {
    color: '#64748B',
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#64748B',
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 14,
  },
});
