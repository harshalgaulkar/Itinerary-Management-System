import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  FlatList,
  Platform,
} from 'react-native';
import { reviewAPI } from '../services/api';

export default function Reviews({ route, navigation }) {
  const { packageId } = route.params || {};
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
  });

  useEffect(() => {
    if (packageId) {
      fetchReviews();
    }
  }, [packageId]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await reviewAPI.getByPackage(packageId);
      
      if (response.success) {
        setReviews(response.data || []);
      } else {
        setError(response.error || 'Failed to fetch reviews');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!formData.title.trim() || !formData.comment.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      const response = await reviewAPI.create({
        packageId,
        rating: formData.rating,
        title: formData.title,
        comment: formData.comment,
      });

      if (response.data) {
        Alert.alert('Success', 'Review submitted successfully');
        setFormData({ rating: 5, title: '', comment: '' });
        setShowForm(false);
        fetchReviews();
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.reviewTitle}>{item.title}</Text>
        <Text style={styles.reviewRating}>{renderStars(item.rating)}</Text>
      </View>
      <Text style={styles.reviewAuthor}>by {item.userName || 'Anonymous'}</Text>
      <Text style={styles.reviewDate}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reviews</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Write Review Button */}
        <TouchableOpacity
          style={styles.writeReviewButton}
          onPress={() => setShowForm(!showForm)}
        >
          <Text style={styles.writeReviewButtonText}>
            {showForm ? 'Cancel' : 'Write a Review'}
          </Text>
        </TouchableOpacity>

        {/* Review Form */}
        {showForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Share Your Experience</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Rating</Text>
              <View style={styles.ratingSelector}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => setFormData({ ...formData, rating: star })}
                    style={styles.starButton}
                  >
                    <Text style={styles.star}>
                      {star <= formData.rating ? '⭐' : '☆'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Amazing experience!"
                placeholderTextColor="#999"
                value={formData.title}
                onChangeText={(value) =>
                  setFormData({ ...formData, title: value })
                }
                editable={!submitting}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Review</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Share your thoughts about this package..."
                placeholderTextColor="#999"
                value={formData.comment}
                onChangeText={(value) =>
                  setFormData({ ...formData, comment: value })
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!submitting}
              />
            </View>

            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmitReview}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Review</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Reviews List */}
        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : reviews.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No reviews yet. Be the first to review!</Text>
          </View>
        ) : (
          <FlatList
            data={reviews}
            renderItem={renderReview}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.reviewsList}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  writeReviewButton: {
    backgroundColor: '#27ae60',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  writeReviewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 15,
    elevation: 3,
    boxShadow: Platform.OS === 'web' ? '0px 2px 4px rgba(0,0,0,0.1)' : undefined,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  ratingSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  starButton: {
    flex: 1,
    alignItems: 'center',
  },
  star: {
    fontSize: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    minHeight: 100,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reviewsList: {
    paddingVertical: 10,
  },
  reviewCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    elevation: 2,
    boxShadow: Platform.OS === 'web' ? '0px 2px 4px rgba(0,0,0,0.1)' : undefined,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  reviewTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  reviewRating: {
    fontSize: 12,
    marginLeft: 8,
  },
  reviewAuthor: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
    marginBottom: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 13,
    color: '#555',
    lineHeight: 19,
  },
  errorContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#e74c3c',
  },
  emptyContainer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
});
