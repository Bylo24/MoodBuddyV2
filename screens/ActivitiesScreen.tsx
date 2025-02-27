import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  TouchableOpacity,
  TextInput,
  ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SHADOWS } from '../constants/theme';
import { useAppContext } from '../context/AppContext';
import ActivityCard from '../components/ActivityCard';
import { ActivityCategory } from '../types';

const categories: { id: ActivityCategory; name: string; icon: string }[] = [
  { id: 'mindfulness', name: 'Mindfulness', icon: 'leaf-outline' },
  { id: 'journaling', name: 'Journaling', icon: 'book-outline' },
  { id: 'music', name: 'Music', icon: 'musical-notes-outline' },
  { id: 'physical', name: 'Physical', icon: 'fitness-outline' },
  { id: 'social', name: 'Social', icon: 'people-outline' },
  { id: 'creative', name: 'Creative', icon: 'color-palette-outline' },
];

const ActivitiesScreen = () => {
  const navigation = useNavigation();
  const { activities, user } = useAppContext();
  
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter activities based on selected category and search query
  const filteredActivities = activities.filter(activity => {
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const isPremiumAccessible = !activity.isPremium || (activity.isPremium && user?.isPremium);
    
    return matchesCategory && matchesSearch && isPremiumAccessible;
  });
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Activities</Text>
        <View style={{ width: 40 }} />
      </View>
      
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search activities..."
          placeholderTextColor={COLORS.textMuted}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        >
          <TouchableOpacity
            style={[
              styles.categoryButton,
              selectedCategory === 'all' && styles.selectedCategory
            ]}
            onPress={() => setSelectedCategory('all')}
          >
            <Ionicons 
              name="grid-outline" 
              size={20} 
              color={selectedCategory === 'all' ? COLORS.white : COLORS.primary} 
            />
            <Text 
              style={[
                styles.categoryText,
                selectedCategory === 'all' && styles.selectedCategoryText
              ]}
            >
              All
            </Text>
          </TouchableOpacity>
          
          {categories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Ionicons 
                name={category.icon as any} 
                size={20} 
                color={selectedCategory === category.id ? COLORS.white : COLORS.primary} 
              />
              <Text 
                style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.selectedCategoryText
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredActivities}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ActivityCard 
            activity={item}
            onPress={() => navigation.navigate('ActivityDetail' as never, { activityId: item.id } as never)}
          />
        )}
        contentContainerStyle={styles.activitiesList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={48} color={COLORS.textMuted} />
            <Text style={styles.emptyText}>No activities found</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  title: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...SHADOWS.small,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    ...FONTS.regular,
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    padding: 0,
  },
  categoriesContainer: {
    paddingVertical: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    ...SHADOWS.small,
  },
  selectedCategory: {
    backgroundColor: COLORS.primary,
  },
  categoryText: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 4,
  },
  selectedCategoryText: {
    color: COLORS.white,
  },
  activitiesList: {
    padding: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});

export default ActivitiesScreen;