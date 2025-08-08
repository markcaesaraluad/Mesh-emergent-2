<template>
  <div class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <button
          @click="editMode = !editMode"
          class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
        >
          {{ editMode ? 'Cancel' : 'Edit Profile' }}
        </button>
      </div>

      <form @submit.prevent="saveProfile" class="space-y-6">
        <!-- Profile Picture Section -->
        <div class="flex items-center space-x-6">
          <div class="shrink-0">
            <img
              class="h-24 w-24 object-cover rounded-full border-4 border-gray-200"
              :src="profileData.profilePicUrl || '/api/placeholder/96/96'"
              alt="Profile picture"
            />
          </div>
          <div v-if="editMode">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Change Profile Picture
            </label>
            <input
              type="file"
              accept="image/*"
              @change="handleProfilePicChange"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <!-- Personal Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- First Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              v-model="profileData.fname"
              :disabled="!editMode"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              v-model="profileData.lname"
              :disabled="!editMode"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <!-- Middle Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Middle Name
            </label>
            <input
              v-model="profileData.mname"
              :disabled="!editMode"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              v-model="profileData.email"
              :disabled="!editMode"
              type="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <!-- Contact Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              v-model="profileData.contact_num"
              :disabled="!editMode"
              type="tel"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>

          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              v-model="profileData.address"
              :disabled="!editMode"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>

        <!-- Password Section -->
        <div v-if="editMode" class="border-t pt-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                v-model="passwordData.newPassword"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                v-model="passwordData.confirmPassword"
                type="password"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div v-if="editMode" class="flex justify-end space-x-3">
          <button
            type="button"
            @click="cancelEdit"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {{ loading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ProfileView',
  data() {
    return {
      editMode: false,
      loading: false,
      profileData: {
        fname: '',
        mname: '',
        lname: '',
        email: '',
        contact_num: '',
        address: '',
        profilePicUrl: ''
      },
      originalProfileData: {},
      passwordData: {
        newPassword: '',
        confirmPassword: ''
      },
      profilePicFile: null
    };
  },
  props: {
    showNotification: Function
  },
  methods: {
    async loadUserProfile() {
      if (!this.$store.state.user || !this.$store.state.user.id) {
        this.$router.push('/');
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.VUE_APP_BASE_URL}/user/find/${this.$store.state.user.id}`
        );

        if (response.status === 200) {
          this.profileData = {
            fname: response.data.fname || '',
            mname: response.data.mname || '',
            lname: response.data.lname || '',
            email: response.data.email || '',
            contact_num: response.data.contact_num || '',
            address: response.data.address || '',
            profilePicUrl: response.data.profile_pic ? 
              `${process.env.VUE_APP_BASE_URL}/user/get_img/${response.data.profile_pic}` : ''
          };
          this.originalProfileData = { ...this.profileData };
        }
      } catch (error) {
        console.error('Error loading profile:', error);
        this.showNotification(0, 'Error', 'Failed to load profile data');
      }
    },

    handleProfilePicChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePicFile = file;
        // Preview the image
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileData.profilePicUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async saveProfile() {
      if (this.passwordData.newPassword && 
          this.passwordData.newPassword !== this.passwordData.confirmPassword) {
        this.showNotification(0, 'Error', 'Passwords do not match');
        return;
      }

      this.loading = true;

      try {
        // Update profile data
        const updateData = {
          fname: this.profileData.fname,
          mname: this.profileData.mname,
          lname: this.profileData.lname,
          email: this.profileData.email,
          contact_num: this.profileData.contact_num,
          address: this.profileData.address
        };

        // Add password if provided
        if (this.passwordData.newPassword) {
          updateData.password = this.passwordData.newPassword;
        }

        const response = await axios.patch(
          `${process.env.VUE_APP_BASE_URL}/user/update/${this.$store.state.user.id}`,
          updateData
        );

        if (response.status === 200) {
          // Update store with new data
          this.$store.commit('UPDATE_USER', {
            ...this.$store.state.user,
            ...updateData
          });

          this.showNotification(1, 'Success', 'Profile updated successfully');
          this.editMode = false;
          this.passwordData = { newPassword: '', confirmPassword: '' };
          this.originalProfileData = { ...this.profileData };
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        this.showNotification(0, 'Error', 'Failed to update profile');
      } finally {
        this.loading = false;
      }
    },

    cancelEdit() {
      this.profileData = { ...this.originalProfileData };
      this.passwordData = { newPassword: '', confirmPassword: '' };
      this.editMode = false;
    }
  },

  mounted() {
    this.loadUserProfile();
  }
};
</script>

<style scoped>
/* Custom styles for better visual consistency */
input:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.disabled\:bg-gray-50:disabled {
  background-color: #f9fafb;
}
</style>