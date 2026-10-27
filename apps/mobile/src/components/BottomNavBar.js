import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const BottomNavBar = ({ activeTab, onTabPress }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabPress(tab.id)}
            style={styles.tabButton}
            activeOpacity={0.7}
          >
            <Text style={[styles.icon, isActive && styles.activeIcon]}>
              {tab.icon}
            </Text>
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#0B132B',
    borderTopWidth: 1,
    borderTopColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 20,
    marginBottom: 2,
    opacity: 0.6,
  },
  activeIcon: {
    opacity: 1,
    transform: [{ scale: 1.1 }],
  },
  label: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  activeLabel: {
    color: '#00D2FF',
    fontWeight: '700',
  },
});
