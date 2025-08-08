<template>
  <div class="max-w-6xl mx-auto">
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">System Settings</h1>
        <p class="text-gray-600">Configure your coworking space management system</p>
      </div>

      <div class="p-6">
        <!-- Settings Navigation Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Business Information Tab -->
        <div v-if="activeTab === 'business'" class="space-y-6">
          <form @submit.prevent="saveBusinessSettings">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Business Name -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Business Name
                </label>
                <input
                  v-model="businessSettings.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your Coworking Space Name"
                />
              </div>

              <!-- Contact Information -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  v-model="businessSettings.phone"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  v-model="businessSettings.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="contact@yourspace.com"
                />
              </div>

              <!-- Address -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Business Address
                </label>
                <textarea
                  v-model="businessSettings.address"
                  rows="3"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Full business address..."
                />
              </div>

              <!-- Logo Upload -->
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Business Logo
                </label>
                <div class="flex items-center space-x-4">
                  <div class="shrink-0">
                    <img
                      class="h-16 w-16 object-contain bg-gray-50 rounded-lg border border-gray-200"
                      :src="businessSettings.logoUrl || '/api/placeholder/64/64'"
                      alt="Business logo"
                    />
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      @change="handleLogoChange"
                      class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p class="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : 'Save Business Settings' }}
              </button>
            </div>
          </form>
        </div>

        <!-- System Preferences Tab -->
        <div v-if="activeTab === 'system'" class="space-y-6">
          <form @submit.prevent="saveSystemSettings">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Timezone -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Timezone
                </label>
                <select
                  v-model="systemSettings.timezone"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Asia/Manila">Philippine Time</option>
                </select>
              </div>

              <!-- Currency -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  v-model="systemSettings.currency"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="PHP">PHP - Philippine Peso</option>
                  <option value="GBP">GBP - British Pound</option>
                </select>
              </div>

              <!-- Date Format -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Date Format
                </label>
                <select
                  v-model="systemSettings.dateFormat"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>

              <!-- Time Format -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Time Format
                </label>
                <select
                  v-model="systemSettings.timeFormat"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="12">12-hour (AM/PM)</option>
                  <option value="24">24-hour</option>
                </select>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : 'Save System Settings' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Notifications Tab -->
        <div v-if="activeTab === 'notifications'" class="space-y-6">
          <form @submit.prevent="saveNotificationSettings">
            <div class="space-y-4">
              <!-- Email Notifications -->
              <div class="border rounded-lg p-4">
                <h3 class="font-medium text-gray-900 mb-3">Email Notifications</h3>
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input
                      v-model="notificationSettings.emailOnBooking"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">New booking notifications</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="notificationSettings.emailOnPayment"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Payment confirmation emails</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="notificationSettings.emailOnCancellation"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Booking cancellation notices</span>
                  </label>
                </div>
              </div>

              <!-- Push Notifications -->
              <div class="border rounded-lg p-4">
                <h3 class="font-medium text-gray-900 mb-3">Push Notifications</h3>
                <div class="space-y-3">
                  <label class="flex items-center">
                    <input
                      v-model="notificationSettings.pushEnabled"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Enable push notifications</span>
                  </label>
                  <label class="flex items-center">
                    <input
                      v-model="notificationSettings.soundEnabled"
                      type="checkbox"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span class="ml-2 text-sm text-gray-700">Enable notification sounds</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="flex justify-end mt-6">
              <button
                type="submit"
                :disabled="loading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {{ loading ? 'Saving...' : 'Save Notification Settings' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// Remove unused axios import - using it in methods but not importing correctly
export default {
  name: 'SettingsView',
  data() {
    return {
      activeTab: 'business',
      loading: false,
      tabs: [
        { id: 'business', name: 'Business Info' },
        { id: 'system', name: 'System Preferences' },
        { id: 'notifications', name: 'Notifications' }
      ],
      businessSettings: {
        name: 'MeshConnect Coworking',
        phone: '',
        email: '',
        address: '',
        logoUrl: ''
      },
      systemSettings: {
        timezone: 'Asia/Manila',
        currency: 'PHP',
        dateFormat: 'MM/DD/YYYY',
        timeFormat: '12'
      },
      notificationSettings: {
        emailOnBooking: true,
        emailOnPayment: true,
        emailOnCancellation: true,
        pushEnabled: true,
        soundEnabled: true
      }
    };
  },
  props: {
    showNotification: Function
  },
  methods: {
    async loadSettings() {
      try {
        // Load settings from API or localStorage
        const savedSettings = localStorage.getItem('meshconnect_settings');
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          this.businessSettings = { ...this.businessSettings, ...settings.business };
          this.systemSettings = { ...this.systemSettings, ...settings.system };
          this.notificationSettings = { ...this.notificationSettings, ...settings.notifications };
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    },

    handleLogoChange(event) {
      const file = event.target.files[0];
      if (file) {
        // Preview the image
        const reader = new FileReader();
        reader.onload = (e) => {
          this.businessSettings.logoUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async saveBusinessSettings() {
      this.loading = true;
      try {
        // Save business settings to localStorage for now
        const allSettings = JSON.parse(localStorage.getItem('meshconnect_settings') || '{}');
        allSettings.business = this.businessSettings;
        localStorage.setItem('meshconnect_settings', JSON.stringify(allSettings));

        this.showNotification(1, 'Success', 'Business settings saved successfully');
      } catch (error) {
        console.error('Error saving business settings:', error);
        this.showNotification(0, 'Error', 'Failed to save business settings');
      } finally {
        this.loading = false;
      }
    },

    async saveSystemSettings() {
      this.loading = true;
      try {
        // Save system settings to localStorage for now
        const allSettings = JSON.parse(localStorage.getItem('meshconnect_settings') || '{}');
        allSettings.system = this.systemSettings;
        localStorage.setItem('meshconnect_settings', JSON.stringify(allSettings));

        this.showNotification(1, 'Success', 'System settings saved successfully');
      } catch (error) {
        console.error('Error saving system settings:', error);
        this.showNotification(0, 'Error', 'Failed to save system settings');
      } finally {
        this.loading = false;
      }
    },

    async saveNotificationSettings() {
      this.loading = true;
      try {
        // Save notification settings to localStorage for now
        const allSettings = JSON.parse(localStorage.getItem('meshconnect_settings') || '{}');
        allSettings.notifications = this.notificationSettings;
        localStorage.setItem('meshconnect_settings', JSON.stringify(allSettings));

        this.showNotification(1, 'Success', 'Notification settings saved successfully');
      } catch (error) {
        console.error('Error saving notification settings:', error);
        this.showNotification(0, 'Error', 'Failed to save notification settings');
      } finally {
        this.loading = false;
      }
    }
  },

  mounted() {
    this.loadSettings();
  }
};
</script>

<style scoped>
/* Custom styles for better visual consistency */
input:focus, select:focus, textarea:focus {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.tab-active {
  border-bottom-color: #3b82f6;
  color: #3b82f6;
}
</style>