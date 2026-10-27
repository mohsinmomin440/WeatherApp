import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { getMobileApiUrl, setMobileApiUrl } from '../api/client.js';

export const SettingsScreen = ({
  unit,
  onToggleUnit,
  user,
  onLogout,
  onLoginPress,
}) => {
  const [apiUrl, setApiUrl] = useState(getMobileApiUrl());
  const [urlSaved, setUrlSaved] = useState(false);

  const handleSaveApiUrl = () => {
    setMobileApiUrl(apiUrl);
    setUrlSaved(true);
    setTimeout(() => setUrlSaved(false), 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings & Preferences</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Unit Selection Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Temperature Unit</Text>
          <Text style={styles.cardDesc}>
            Select Celsius or Fahrenheit across all forecasts.
          </Text>

          <View style={styles.unitRow}>
            <TouchableOpacity
              style={[styles.unitButton, unit === 'celsius' && styles.unitButtonActive]}
              onPress={() => onToggleUnit('celsius')}
            >
              <Text style={[styles.unitText, unit === 'celsius' && styles.unitTextActive]}>
                Metric (°C)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.unitButton, unit === 'fahrenheit' && styles.unitButtonActive]}
              onPress={() => onToggleUnit('fahrenheit')}
            >
              <Text style={[styles.unitText, unit === 'fahrenheit' && styles.unitTextActive]}>
                Imperial (°F)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Backend Server Connection (for Physical Android Device Testing) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Backend Server API URL</Text>
          <Text style={styles.cardDesc}>
            For physical Android devices on Wi-Fi, enter your computer's local LAN IP.
          </Text>

          <TextInput
            style={styles.input}
            value={apiUrl}
            onChangeText={setApiUrl}
            placeholder="http://192.168.1.100:5000/api/v1"
            placeholderTextColor="#64748B"
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.saveUrlButton} onPress={handleSaveApiUrl}>
            <Text style={styles.saveUrlText}>
              {urlSaved ? '✓ Saved!' : 'Update Server URL'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account Profile Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Account</Text>
          {user ? (
            <View style={styles.userBox}>
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>
                  {user.name ? user.name.slice(0, 2).toUpperCase() : 'JD'}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
              </View>
              <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.loginCardButton} onPress={onLoginPress}>
              <Text style={styles.loginCardText}>Sign In / Register</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* About Project */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>About SkyCast</Text>
          <Text style={styles.aboutText}>
            • Project: BCA Final-Year Major Project{'\n'}
            • Provider: Open-Meteo Forecast & Geocoding API{'\n'}
            • Mobile Framework: React Native + Expo SDK 52{'\n'}
            • Backend: Node.js + Express REST API{'\n'}
            • Database: MongoDB + Mongoose
          </Text>
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
    paddingBottom: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#111C38',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDesc: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 14,
    lineHeight: 16,
  },
  unitRow: {
    flexDirection: 'row',
    gap: 10,
  },
  unitButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  unitButtonActive: {
    backgroundColor: 'rgba(0, 210, 255, 0.15)',
    borderColor: '#00D2FF',
  },
  unitText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  unitTextActive: {
    color: '#00D2FF',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#0B132B',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
    marginBottom: 10,
  },
  saveUrlButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveUrlText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  userBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0284C7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userEmail: {
    color: '#94A3B8',
    fontSize: 11,
  },
  logoutButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 10,
  },
  logoutText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loginCardButton: {
    backgroundColor: '#0284C7',
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  loginCardText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  aboutText: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 20,
  },
});
