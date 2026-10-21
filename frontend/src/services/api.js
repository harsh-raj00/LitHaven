// LitHaven API Client Service

const BASE_URL = import.meta.env.VITE_API_URL || '';

const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('lithaven_token');
  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
};

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.message || (data.errors && data.errors[0]?.msg) || 'Something went wrong';
    throw new Error(errorMsg);
  }
  return data;
};

export const api = {
  // Authentication
  auth: {
    register: async (userData) => {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return handleResponse(res);
    },
    login: async (credentials) => {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      return handleResponse(res);
    },
    getMe: async () => {
      const res = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    updateProfile: async (profileData) => {
      const res = await fetch(`${BASE_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData)
      });
      return handleResponse(res);
    },
    getUserProfile: async (userId) => {
      const res = await fetch(`${BASE_URL}/api/auth/user/${userId}`);
      return handleResponse(res);
    }
  },

  // Books Marketplace
  books: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const res = await fetch(`${BASE_URL}/api/books?${query.toString()}`);
      return handleResponse(res);
    },
    getFeatured: async () => {
      const res = await fetch(`${BASE_URL}/api/books/featured`);
      return handleResponse(res);
    },
    getCategories: async () => {
      const res = await fetch(`${BASE_URL}/api/books/categories`);
      return handleResponse(res);
    },
    getMyListings: async () => {
      const res = await fetch(`${BASE_URL}/api/books/my-listings`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/api/books/${id}`);
      return handleResponse(res);
    },
    create: async (formData) => {
      const isForm = formData instanceof FormData;
      const res = await fetch(`${BASE_URL}/api/books`, {
        method: 'POST',
        headers: getAuthHeaders(isForm),
        body: isForm ? formData : JSON.stringify(formData)
      });
      return handleResponse(res);
    },
    update: async (id, formData) => {
      const isForm = formData instanceof FormData;
      const res = await fetch(`${BASE_URL}/api/books/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(isForm),
        body: isForm ? formData : JSON.stringify(formData)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/api/books/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    toggleWishlist: async (id) => {
      const res = await fetch(`${BASE_URL}/api/books/${id}/wishlist`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },

  // StudyVault Resources
  resources: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          query.append(key, val);
        }
      });
      const res = await fetch(`${BASE_URL}/api/resources?${query.toString()}`);
      return handleResponse(res);
    },
    getMyResources: async () => {
      const res = await fetch(`${BASE_URL}/api/resources/my-resources`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/api/resources/${id}`);
      return handleResponse(res);
    },
    download: async (id) => {
      const res = await fetch(`${BASE_URL}/api/resources/${id}/download`, {
        method: 'POST'
      });
      return handleResponse(res);
    },
    toggleLike: async (id, isLiked = false, currentUpvotes = 0) => {
      const res = await fetch(`${BASE_URL}/api/resources/${id}/like`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          action: isLiked ? 'unlike' : 'like',
          currentUpvotes
        })
      });
      return handleResponse(res);
    },
    create: async (formData) => {
      const isForm = formData instanceof FormData;
      const res = await fetch(`${BASE_URL}/api/resources`, {
        method: 'POST',
        headers: getAuthHeaders(isForm),
        body: isForm ? formData : JSON.stringify(formData)
      });
      return handleResponse(res);
    },
    delete: async (id) => {
      const res = await fetch(`${BASE_URL}/api/resources/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    }
  },

  // Inquiries & Direct Buyer-Seller Chats
  inquiries: {
    create: async (payload) => {
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });
      return handleResponse(res);
    },
    getMyInquiries: async () => {
      const res = await fetch(`${BASE_URL}/api/inquiries/my-inquiries`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    getById: async (id) => {
      const res = await fetch(`${BASE_URL}/api/inquiries/${id}`, {
        headers: getAuthHeaders()
      });
      return handleResponse(res);
    },
    sendMessage: async (id, text) => {
      const res = await fetch(`${BASE_URL}/api/inquiries/${id}/messages`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ text })
      });
      return handleResponse(res);
    },
    updateStatus: async (id, status) => {
      const res = await fetch(`${BASE_URL}/api/inquiries/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status })
      });
      return handleResponse(res);
    }
  },

  // Reviews
  reviews: {
    create: async (reviewData) => {
      const res = await fetch(`${BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData)
      });
      return handleResponse(res);
    },
    getSellerReviews: async (sellerId) => {
      const res = await fetch(`${BASE_URL}/api/reviews/seller/${sellerId}`);
      return handleResponse(res);
    }
  },

  // Platform Stats
  stats: {
    get: async () => {
      const res = await fetch(`${BASE_URL}/api/stats`);
      return handleResponse(res);
    }
  }
};
