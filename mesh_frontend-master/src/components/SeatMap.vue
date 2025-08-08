<template>
  <div class="seat-map-container">
    <!-- Shared Area Layout (32 seats around tables) -->
    <div v-if="areaType === 'shared'" class="shared-area-map">
      <h3 class="text-center text-lg font-semibold mb-4 text-gray-700">SHARED AREA</h3>
      
      <!-- Reception/Info Desk at top -->
      <div class="flex justify-center mb-6">
        <div class="reception-desk flex items-center justify-center bg-gray-300 rounded-lg px-6 py-2">
          <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
          </svg>
          <span class="text-sm font-medium">Reception</span>
        </div>
      </div>

      <!-- Seat arrangement in 4 rows with tables -->
      <div class="seat-rows space-y-8">
        <!-- Row 1: Seats 1-8 -->
        <div class="row flex justify-center items-center space-x-4">
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [1, 3]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
          
          <!-- Table -->
          <div class="table bg-amber-100 rounded-lg p-4 mx-4">
            <div class="w-16 h-12 bg-amber-200 rounded border-2 border-amber-300"></div>
          </div>
          
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [2, 4]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>

          <div class="mx-8"></div>

          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [5, 7]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
          
          <!-- Table -->
          <div class="table bg-amber-100 rounded-lg p-4 mx-4">
            <div class="w-16 h-12 bg-amber-200 rounded border-2 border-amber-300"></div>
          </div>
          
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [6, 8]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
        </div>

        <!-- Row 2: Seats 9-16 -->
        <div class="row flex justify-center items-center space-x-4">
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [9, 11]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
          
          <!-- Table -->
          <div class="table bg-amber-100 rounded-lg p-4 mx-4">
            <div class="w-16 h-12 bg-amber-200 rounded border-2 border-amber-300"></div>
          </div>
          
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [10, 12]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>

          <div class="mx-8"></div>

          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [13, 15]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
          
          <!-- Table -->
          <div class="table bg-amber-100 rounded-lg p-4 mx-4">
            <div class="w-16 h-12 bg-amber-200 rounded border-2 border-amber-300"></div>
          </div>
          
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [14, 16]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
        </div>

        <!-- Row 3: Seats 17-24 -->
        <div class="row flex justify-center items-center space-x-4">
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [17, 19]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
          
          <!-- Table -->
          <div class="table bg-amber-100 rounded-lg p-4 mx-4">
            <div class="w-16 h-12 bg-amber-200 rounded border-2 border-amber-300"></div>
          </div>
          
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [18, 20]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>

          <div class="mx-8"></div>

          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [21, 23]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
          
          <!-- Table -->
          <div class="table bg-amber-100 rounded-lg p-4 mx-4">
            <div class="w-16 h-12 bg-amber-200 rounded border-2 border-amber-300"></div>
          </div>
          
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [22, 24]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
        </div>

        <!-- Row 4: Seats 25-32 -->
        <div class="row flex justify-center items-center space-x-4">
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [25, 27]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
          
          <!-- Table -->
          <div class="table bg-amber-100 rounded-lg p-4 mx-4">
            <div class="w-16 h-12 bg-amber-200 rounded border-2 border-amber-300"></div>
          </div>
          
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [26, 28]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>

          <div class="mx-8"></div>

          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [29, 31]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
          
          <!-- Table -->
          <div class="table bg-amber-100 rounded-lg p-4 mx-4">
            <div class="w-16 h-12 bg-amber-200 rounded border-2 border-amber-300"></div>
          </div>
          
          <div class="seat-group flex space-x-2">
            <div
              v-for="seatNum in [30, 32]"
              :key="`seat-${seatNum}`"
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Private Space Layout (15 individual desks) -->
    <div v-if="areaType === 'private'" class="private-area-map">
      <h3 class="text-center text-lg font-semibold mb-4 text-gray-700">PRIVATE SPACE</h3>
      
      <div class="flex justify-between items-start space-x-8">
        <!-- Left Column: Seats 11-15 -->
        <div class="left-column space-y-4">
          <div
            v-for="seatNum in [11, 12, 13, 14, 15]"
            :key="`seat-${seatNum}`"
            class="private-desk flex items-center space-x-3"
          >
            <div
              @click="selectSeat(getSeatById(seatNum))"
              :class="getSeatClasses(getSeatById(seatNum))"
              class="seat-item transition-all duration-200"
              :title="`Seat #${seatNum} - ${getSeatStatus(getSeatById(seatNum))}`"
            >
              <span class="seat-number">{{ seatNum }}</span>
            </div>
            <!-- Desk -->
            <div class="desk bg-amber-100 rounded-lg p-2 border-2 border-amber-200">
              <div class="w-12 h-8 bg-amber-200 rounded"></div>
            </div>
          </div>
        </div>

        <!-- Right Column: Seats 1-10 (in pairs) -->
        <div class="right-column space-y-4">
          <div
            v-for="row in [[10, 1], [9, 2], [8, 3], [7, 4], [6, 5]]"
            :key="`row-${row[0]}-${row[1]}`"
            class="desk-pair flex items-center space-x-6"
          >
            <!-- Left desk and seat -->
            <div class="desk-unit flex items-center space-x-3">
              <!-- Desk -->
              <div class="desk bg-amber-100 rounded-lg p-2 border-2 border-amber-200">
                <div class="w-12 h-8 bg-amber-200 rounded"></div>
              </div>
              <div
                @click="selectSeat(getSeatById(row[0]))"
                :class="getSeatClasses(getSeatById(row[0]))"
                class="seat-item transition-all duration-200"
                :title="`Seat #${row[0]} - ${getSeatStatus(getSeatById(row[0]))}`"
              >
                <span class="seat-number">{{ row[0] }}</span>
              </div>
            </div>

            <!-- Right desk and seat -->
            <div class="desk-unit flex items-center space-x-3">
              <div
                @click="selectSeat(getSeatById(row[1]))"
                :class="getSeatClasses(getSeatById(row[1]))"
                class="seat-item transition-all duration-200"
                :title="`Seat #${row[1]} - ${getSeatStatus(getSeatById(row[1]))}`"
              >
                <span class="seat-number">{{ row[1] }}</span>
              </div>
              <!-- Desk -->
              <div class="desk bg-amber-100 rounded-lg p-2 border-2 border-amber-200">
                <div class="w-12 h-8 bg-amber-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Exclusive Space Layout (4 seats around conference table) -->
    <div v-if="areaType === 'exclusive'" class="exclusive-area-map">
      <h3 class="text-center text-lg font-semibold mb-4 text-gray-700">EXCLUSIVE SPACE</h3>
      
      <div class="conference-setup flex flex-col items-center space-y-6">
        <!-- Top seats -->
        <div class="top-seats flex space-x-8">
          <div
            @click="selectSeat(getSeatById(1))"
            :class="getSeatClasses(getSeatById(1))"
            class="seat-item transition-all duration-200"
            :title="`Seat #1 - ${getSeatStatus(getSeatById(1))}`"
          >
            <span class="seat-number">1</span>
          </div>
          <div
            @click="selectSeat(getSeatById(2))"
            :class="getSeatClasses(getSeatById(2))"
            class="seat-item transition-all duration-200"
            :title="`Seat #2 - ${getSeatStatus(getSeatById(2))}`"
          >
            <span class="seat-number">2</span>
          </div>
        </div>

        <!-- Conference Table -->
        <div class="conference-table bg-amber-100 rounded-2xl border-4 border-amber-300 p-8">
          <div class="w-32 h-24 bg-amber-200 rounded-xl flex items-center justify-center">
            <span class="text-amber-600 font-semibold text-sm">Conference Table</span>
          </div>
        </div>

        <!-- Bottom seats -->
        <div class="bottom-seats flex space-x-8">
          <div
            @click="selectSeat(getSeatById(3))"
            :class="getSeatClasses(getSeatById(3))"
            class="seat-item transition-all duration-200"
            :title="`Seat #3 - ${getSeatStatus(getSeatById(3))}`"
          >
            <span class="seat-number">3</span>
          </div>
          <div
            @click="selectSeat(getSeatById(4))"
            :class="getSeatClasses(getSeatById(4))"
            class="seat-item transition-all duration-200"
            :title="`Seat #4 - ${getSeatStatus(getSeatById(4))}`"
          >
            <span class="seat-number">4</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="legend mt-6 flex justify-center space-x-6 text-sm">
      <div class="flex items-center space-x-2">
        <div class="w-4 h-4 bg-green-500 rounded border"></div>
        <span>Available</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-4 h-4 bg-blue-500 rounded border"></div>
        <span>Selected</span>
      </div>
      <div class="flex items-center space-x-2">
        <div class="w-4 h-4 bg-gray-400 rounded border"></div>
        <span>Occupied</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeatMap',
  props: {
    areaType: {
      type: String,
      required: true,
      validator: value => ['shared', 'private', 'exclusive'].includes(value)
    },
    availableSeats: {
      type: Array,
      default: () => []
    },
    selectedSeat: {
      type: Number,
      default: null
    }
  },
  emits: ['seat-selected'],
  methods: {
    getSeatById(seatNum) {
      return this.availableSeats.find(seat => seat.num == seatNum);
    },
    getSeatStatus(seat) {
      if (!seat) return 'Not Available';
      if (seat.is_reserved) return 'Occupied';
      if (this.selectedSeat === seat.id) return 'Selected';
      return 'Available';
    },
    getSeatClasses(seat) {
      const baseClasses = 'seat-item w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center cursor-pointer text-xs md:text-sm font-semibold';
      
      if (!seat) {
        return `${baseClasses} bg-gray-200 border-gray-300 text-gray-500 cursor-not-allowed`;
      }
      
      if (seat.is_reserved) {
        return `${baseClasses} bg-gray-400 border-gray-500 text-white cursor-not-allowed opacity-60`;
      }
      
      if (this.selectedSeat === seat.id) {
        return `${baseClasses} bg-blue-500 border-blue-600 text-white shadow-lg transform scale-110`;
      }
      
      return `${baseClasses} bg-green-500 border-green-600 text-white hover:bg-green-600 hover:shadow-md`;
    },
    selectSeat(seat) {
      if (!seat || seat.is_reserved) return;
      this.$emit('seat-selected', seat);
    }
  }
};
</script>

<style scoped>
.seat-map-container {
  @apply w-full max-w-4xl mx-auto p-4;
}

.seat-item {
  transition: all 0.2s ease-in-out;
}

.seat-item:hover:not(.cursor-not-allowed) {
  transform: scale(1.05);
}

.seat-number {
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.table, .desk, .conference-table {
  transition: all 0.2s ease-in-out;
}

.legend {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
  .seat-rows .row {
    flex-direction: column;
    space-y: 4;
  }
  
  .private-area-map .flex {
    flex-direction: column;
    space-x: 0;
    space-y: 6;
  }
  
  .conference-setup .top-seats,
  .conference-setup .bottom-seats {
    space-x: 4;
  }
}
</style>