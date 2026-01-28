import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/reviews';

interface Review {
  _id?: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

export const useReviewStore = defineStore('reviewStore', {
  state: () => ({
    reviews: [] as Review[],
    loading: false,
    error: null as string | null
  }),

  getters: {
    /**
     * Getter: Dynamically calculates the average rating from the reviews array.
     * Use this in your ProductDetail.vue stars section.
     */
    averageRating: (state) => {
      if (state.reviews.length === 0) return 0;
      const totalScore = state.reviews.reduce((acc, review) => acc + review.rating, 0);
      const average = totalScore / state.reviews.length;
      // Returns a number rounded to 1 decimal place (e.g., 4.5)
      return Math.round(average * 10) / 10;
    },

    /**
     * Getter: Returns the total count of reviews.
     */
    totalReviews: (state) => state.reviews.length
  },

  actions: {
    /**
     * Fetch all reviews for a specific product from the backend.
     */
    async fetchReviews(productId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get(`${API_BASE_URL}?productId=${productId}`);
        // Support both direct array response or { data: [...] } structure
        this.reviews = response.data.data || response.data || [];
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to fetch reviews';
      } finally {
        this.loading = false;
      }
    },

    /**
     * Submits a new review and automatically sets the user role to 'Guest'.
     */
    async submitReview(reviewData: Partial<Review>) {
      try {
        // Automatically inject the 'Guest' role before sending to the server
        const finalPayload = {
          ...reviewData,
          role: 'Guest'
        };

        const response = await axios.post(API_BASE_URL, finalPayload);

        if (response.data.success) {
          // Add the new review from the server response to the top of the local list
          // This makes the UI update instantly without a page refresh
          this.reviews.unshift(response.data.data as Review);
          return { success: true };
        }

        return {
          success: false,
          message: response.data.message || 'Submission failed'
        };
      } catch (err: any) {
        return {
          success: false,
          message: err.response?.data?.message || 'Error submitting review'
        };
      }
    }
  }
});
