import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { mobileApi, setAuthToken } from '../api/client.js';

export const LoginScreen = ({ onLoginSuccess, onCancel }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      let res;
      if (isLogin) {
        res = await mobileApi.login(email, password);
      } else {
        res = await mobileApi.register(name, email, password);
      }

      if (res.token) {
        setAuthToken(res.token);
      }
      onLoginSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('john@example.com');
    setPassword('password123');
    setName('John Doe');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header Brand */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>✕</Text>
            </TouchableOpacity>

            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>⛅</Text>
            </View>
            <View style={styles.titleRow}>
              <Text style={styles.titleWhite}>Sky</Text>
              <Text style={styles.titleCyan}>Cast</Text>
            </View>
            <Text style={styles.subtitle}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            <Text style={styles.subtext}>
              {isLogin ? 'Login to your account' : 'Sign up to sync your weather data'}
            </Text>
          </View>

          {/* Error Message */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Input Fields */}
          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="John Doe"
                  placeholderTextColor="#64748B"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email or Phone</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email or phone"
                placeholderTextColor="#64748B"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="Enter your password"
                  placeholderTextColor="#64748B"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  <Text style={styles.eyeText}>{showPassword ? '👁️' : '🔒'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Action Button */}
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#0284C7', '#00D2FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.actionButtonText}>
                    {isLogin ? 'Login' : 'Sign Up'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotButton}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}

            {/* Auto Demo Helper */}
            <TouchableOpacity onPress={handleDemoFill} style={styles.demoFillButton}>
              <Text style={styles.demoFillText}>Auto-fill Demo Credentials</Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Buttons */}
            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
              <Text style={styles.socialIcon}>🌐</Text>
              <Text style={styles.socialText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialButton} activeOpacity={0.7}>
              <Text style={styles.socialIcon}>🍎</Text>
              <Text style={styles.socialText}>Continue with Apple</Text>
            </TouchableOpacity>
          </View>

          {/* Toggle Login / Register */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
            >
              <Text style={styles.footerHighlight}>
                {isLogin ? ' Sign Up' : ' Login'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B132B',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  cancelButton: {
    alignSelf: 'flex-end',
    padding: 8,
  },
  cancelText: {
    color: '#94A3B8',
    fontSize: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 24,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    borderWidth: 1.5,
    borderColor: '#00D2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoIcon: {
    fontSize: 32,
  },
  titleRow: {
    flexDirection: 'row',
  },
  titleWhite: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  titleCyan: {
    fontSize: 26,
    fontWeight: '900',
    color: '#00D2FF',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 12,
  },
  subtext: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 12,
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#111C38',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#FFFFFF',
    fontSize: 14,
  },
  passwordContainer: {
    position: 'relative',
    justifyContent: 'center',
  },
  passwordInput: {
    paddingRight: 45,
  },
  eyeButton: {
    position: 'absolute',
    right: 14,
  },
  eyeText: {
    fontSize: 16,
  },
  actionButton: {
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#00D2FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  gradientButton: {
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  forgotButton: {
    alignItems: 'center',
    marginTop: 12,
  },
  forgotText: {
    color: '#38BDF8',
    fontSize: 12,
  },
  demoFillButton: {
    alignItems: 'center',
    marginTop: 10,
    padding: 6,
  },
  demoFillText: {
    color: '#00D2FF',
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1E293B',
  },
  dividerText: {
    color: '#64748B',
    paddingHorizontal: 12,
    fontSize: 12,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111C38',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.15)',
    borderRadius: 14,
    paddingVertical: 13,
    marginBottom: 10,
  },
  socialIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  socialText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#94A3B8',
    fontSize: 13,
  },
  footerHighlight: {
    color: '#00D2FF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
