import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const HomeScreen = ({
  city,
  weather,
  loading,
  onRefresh,
  unit,
  onOpenNotifications,
  onViewAllForecast,
}) => {
  const current = weather?.current;
  const hourly = weather?.hourly || [];
  const daily = weather?.daily || [];

  const tempDisplay = (celsius) => {
    if (celsius === null || celsius === undefined) return '--';
    const c = Math.round(celsius);
    if (unit === 'fahrenheit') {
      return `${Math.round((c * 9) / 5 + 32)}°`;
    }
    return `${c}°`;
  };

  const getEmojiIcon = (code) => {
    const c = Number(code);
    if (c === 0) return '☀️';
    if (c === 1 || c === 2) return '⛅';
    if (c === 3) return '☁️';
    if ([51, 53, 55, 61, 63, 65, 80, 81].includes(c)) return '🌧️';
    if ([71, 73, 75, 85].includes(c)) return '❄️';
    if ([95, 96, 99].includes(c)) return '⛈️';
    return '⛅';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor="#00D2FF"
          />
        }
      >
        {/* Top Header Location & Notifications */}
        <View style={styles.headerRow}>
          <View style={styles.locationContainer}>
            <Text style={styles.pinIcon}>📍</Text>
            <Text style={styles.cityName}>
              {city?.name || 'New York'}{city?.country ? `, ${city.country}` : ', USA'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.bellButton}
            onPress={onOpenNotifications}
            activeOpacity={0.7}
          >
            <Text style={styles.bellIcon}>🔔</Text>
            <View style={styles.bellBadge} />
          </TouchableOpacity>
        </View>

        {/* Hero Weather Card */}
        <LinearGradient
          colors={['#162447', '#111C38', '#0D162D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          {loading && !weather ? (
            <ActivityIndicator size="large" color="#00D2FF" style={{ marginVertical: 40 }} />
          ) : (
            <>
              {/* Skyline silhouette emoji graphic */}
              <View style={styles.skylineGraphic}>
                <Text style={styles.skylineEmoji}>🏙️ 🌉 🌃</Text>
              </View>

              <View style={styles.heroMain}>
                <Text style={styles.weatherEmoji}>
                  {getEmojiIcon(current?.weatherCode)}
                </Text>
                <View style={styles.tempColumn}>
                  <Text style={styles.heroTemp}>
                    {tempDisplay(current?.temperature)}
                  </Text>
                  <Text style={styles.heroCondition}>
                    {current?.condition || 'Partly Cloudy'}
                  </Text>
                </View>
              </View>

              {/* Stats Bar */}
              <View style={styles.statsBar}>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Feels like</Text>
                  <Text style={styles.statValue}>{tempDisplay(current?.feelsLike)}</Text>
                </View>
                <Text style={styles.statDivider}>•</Text>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Humidity</Text>
                  <Text style={styles.statValue}>{current?.humidity ?? 68}%</Text>
                </View>
                <Text style={styles.statDivider}>•</Text>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Wind</Text>
                  <Text style={styles.statValue}>
                    {Math.round(current?.windSpeed ?? 12)} km/h
                  </Text>
                </View>
                <Text style={styles.statDivider}>•</Text>
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Pressure</Text>
                  <Text style={styles.statValue}>{current?.pressure ?? 1013} hPa</Text>
                </View>
              </View>
            </>
          )}
        </LinearGradient>

        {/* Today (Hourly Forecast) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today</Text>
          <Text style={styles.highLowText}>
            H: {tempDisplay(daily[0]?.maxTemp ?? 22)} L: {tempDisplay(daily[0]?.minTemp ?? 14)}
          </Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.hourlyScroll}
        >
          {hourly.slice(0, 8).map((slot, index) => (
            <View key={index} style={styles.hourlyCard}>
              <Text style={styles.hourlyTime}>{slot.label}</Text>
              <Text style={styles.hourlyEmoji}>{getEmojiIcon(slot.weatherCode)}</Text>
              <Text style={styles.hourlyTemp}>{tempDisplay(slot.temperature)}</Text>
            </View>
          ))}
        </ScrollView>

        {/* 7-Day Forecast Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>7-Day Forecast</Text>
          <TouchableOpacity onPress={onViewAllForecast}>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dailyList}>
          {daily.slice(0, 5).map((day, index) => (
            <View key={index} style={styles.dailyRow}>
              <View style={styles.dayCol}>
                <Text style={styles.dayName}>{day.dayName}</Text>
                <Text style={styles.dayDate}>{day.formattedDate}</Text>
              </View>

              <Text style={styles.dailyEmoji}>{getEmojiIcon(day.weatherCode)}</Text>

              <View style={styles.dailyTempCol}>
                <Text style={styles.dailyMax}>{tempDisplay(day.maxTemp)}</Text>
                <Text style={styles.dailyMin}>{tempDisplay(day.minTemp)}</Text>
              </View>
            </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  cityName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bellButton: {
    padding: 8,
    backgroundColor: '#111C38',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    position: 'relative',
  },
  bellIcon: {
    fontSize: 16,
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00D2FF',
  },
  heroCard: {
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    padding: 20,
    marginBottom: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  skylineGraphic: {
    position: 'absolute',
    right: 10,
    bottom: 50,
    opacity: 0.2,
  },
  skylineEmoji: {
    fontSize: 32,
  },
  heroMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherEmoji: {
    fontSize: 54,
    marginRight: 18,
  },
  tempColumn: {
    justifyContent: 'center',
  },
  heroTemp: {
    color: '#FFFFFF',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: -1,
  },
  heroCondition: {
    color: '#38BDF8',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 10,
    marginBottom: 2,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statDivider: {
    color: '#334155',
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  highLowText: {
    color: '#94A3B8',
    fontSize: 12,
  },
  viewAllText: {
    color: '#00D2FF',
    fontSize: 12,
    fontWeight: '600',
  },
  hourlyScroll: {
    paddingBottom: 20,
  },
  hourlyCard: {
    backgroundColor: '#111C38',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginRight: 10,
    width: 68,
  },
  hourlyTime: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
  hourlyEmoji: {
    fontSize: 22,
    marginVertical: 8,
  },
  hourlyTemp: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dailyList: {
    backgroundColor: '#111C38',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    padding: 14,
  },
  dailyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  dayCol: {
    width: 80,
  },
  dayName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  dayDate: {
    color: '#64748B',
    fontSize: 10,
  },
  dailyEmoji: {
    fontSize: 20,
  },
  dailyTempCol: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyMax: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 8,
  },
  dailyMin: {
    color: '#64748B',
    fontSize: 13,
  },
});
