import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export const SplashScreen = ({ onGetStarted, onLoginPress }) => {
  return (
    <LinearGradient
      colors={['#070B19', '#0B132B', '#111C38', '#070B19']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Main Brand Section */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Text style={styles.logoIcon}>⛅</Text>
          </View>

          <View style={styles.titleRow}>
            <Text style={styles.titleWhite}>Sky</Text>
            <Text style={styles.titleCyan}>Cast</Text>
          </View>

          <Text style={styles.tagline}>Your Weather, Our Priority</Text>
          <Text style={styles.subtext}>
            Real-time atmospheric insights, 7-day outlooks, and intelligent forecasts across the globe.
          </Text>
        </View>

        {/* Mountain Silhouette Art */}
        <View style={styles.mountainGraphic}>
          <Text style={styles.mountainEmoji}>🏔️ 🌌 🌲</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={onGetStarted}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#0284C7', '#00D2FF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={onLoginPress}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>
              Already have an account? <Text style={styles.loginHighlight}>Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 24,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  logoBadge: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(0, 210, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  logoIcon: {
    fontSize: 48,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWhite: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -1,
  },
  titleCyan: {
    fontSize: 38,
    fontWeight: '900',
    color: '#00D2FF',
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 15,
    fontWeight: '600',
    color: '#38BDF8',
    marginTop: 6,
    letterSpacing: 0.5,
  },
  subtext: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 18,
    paddingHorizontal: 16,
  },
  mountainGraphic: {
    alignItems: 'center',
    marginVertical: 20,
  },
  mountainEmoji: {
    fontSize: 44,
    opacity: 0.85,
  },
  actionContainer: {
    width: '100%',
    marginBottom: 20,
  },
  getStartedButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 14,
    elevation: 8,
  },
  gradientButton: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  loginLink: {
    marginTop: 18,
    alignItems: 'center',
  },
  loginText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  loginHighlight: {
    color: '#00D2FF',
    fontWeight: 'bold',
  },
});
