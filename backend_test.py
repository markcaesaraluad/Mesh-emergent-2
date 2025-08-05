import requests
import sys
import json
from datetime import datetime

class MeshConnectAPITester:
    def __init__(self, base_url="http://localhost:8001"):
        self.base_url = base_url
        self.token = None
        self.user_data = None
        self.tests_run = 0
        self.tests_passed = 0
        self.session = requests.Session()

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = self.session.get(url, headers=test_headers)
            elif method == 'POST':
                response = self.session.post(url, json=data, headers=test_headers)
            elif method == 'PUT':
                response = self.session.put(url, json=data, headers=test_headers)
            elif method == 'DELETE':
                response = self.session.delete(url, headers=test_headers)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if isinstance(response_data, dict) and len(str(response_data)) < 500:
                        print(f"   Response: {response_data}")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.text and response.text.strip() else {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_swagger_endpoint(self):
        """Test if Swagger documentation is accessible"""
        success, _ = self.run_test(
            "Swagger Documentation",
            "GET",
            "",
            200
        )
        return success

    def test_login(self, email="test@test.com", password="test123"):
        """Test login functionality"""
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            201,
            data={
                "email": email,
                "password": password,
                "isGoogleLogin": False
            }
        )
        
        if success and 'access_token' in response:
            self.token = response['access_token']
            self.user_data = response.get('user', {})
            print(f"   ✅ Login successful - Token received")
            print(f"   User ID: {self.user_data.get('id', 'N/A')}")
            print(f"   User Email: {self.user_data.get('email', 'N/A')}")
            return True
        return False

    def test_user_endpoints(self):
        """Test user-related endpoints"""
        results = []
        
        # Test get all users (paginated)
        success, _ = self.run_test(
            "Get All Users (Page 1)",
            "GET",
            "user/get_all/1/10/",
            200
        )
        results.append(success)
        
        # Test get user count
        success, _ = self.run_test(
            "Get User Count",
            "GET",
            "user/get_count",
            200
        )
        results.append(success)
        
        # Test get pending users
        success, _ = self.run_test(
            "Get Pending Users",
            "GET",
            "user/get_all_pending/1/10/",
            200
        )
        results.append(success)
        
        if self.user_data and 'id' in self.user_data:
            # Test find specific user
            success, _ = self.run_test(
                f"Find User by ID",
                "GET",
                f"user/find/{self.user_data['id']}",
                200
            )
            results.append(success)
        
        return all(results)

    def test_areas_endpoints(self):
        """Test areas-related endpoints"""
        results = []
        
        # Test get all areas
        success, response = self.run_test(
            "Get All Areas",
            "GET",
            "areas/get_all/1/10/",
            200
        )
        results.append(success)
        
        # Test get areas count
        success, _ = self.run_test(
            "Get Areas Count",
            "GET",
            "areas/get_count",
            200
        )
        results.append(success)
        
        return all(results)

    def test_area_rooms_endpoints(self):
        """Test area rooms endpoints"""
        results = []
        
        # Test get all area rooms
        success, _ = self.run_test(
            "Get All Area Rooms",
            "GET",
            "area_rooms/get_all/1/10/",
            200
        )
        results.append(success)
        
        # Test get area rooms count
        success, _ = self.run_test(
            "Get Area Rooms Count",
            "GET",
            "area_rooms/get_count",
            200
        )
        results.append(success)
        
        return all(results)

    def test_reservations_endpoints(self):
        """Test reservation-related endpoints"""
        results = []
        
        # Test get all reservations
        success, _ = self.run_test(
            "Get All Reservations",
            "GET",
            "area_rooms_reservation/get_all/1/10/",
            200
        )
        results.append(success)
        
        # Test get reservations count
        success, _ = self.run_test(
            "Get Reservations Count",
            "GET",
            "area_rooms_reservation/get_count",
            200
        )
        results.append(success)
        
        return all(results)

    def test_user_sessions_endpoints(self):
        """Test user sessions endpoints"""
        results = []
        
        # Test get all user sessions
        success, _ = self.run_test(
            "Get All User Sessions",
            "GET",
            "user_sessions/get_all/1/10/",
            200
        )
        results.append(success)
        
        # Test get user sessions count
        success, _ = self.run_test(
            "Get User Sessions Count",
            "GET",
            "user_sessions/get_count",
            200
        )
        results.append(success)
        
        return all(results)

    def test_wallet_transactions_endpoints(self):
        """Test wallet transaction endpoints"""
        results = []
        
        # Test get all wallet transactions
        success, _ = self.run_test(
            "Get All Wallet Transactions",
            "GET",
            "user_wallet_transaction/get_all/1/10/",
            200
        )
        results.append(success)
        
        # Test get wallet transactions count
        success, _ = self.run_test(
            "Get Wallet Transactions Count",
            "GET",
            "user_wallet_transaction/get_count",
            200
        )
        results.append(success)
        
        return all(results)

    def test_notifications_endpoints(self):
        """Test notifications endpoints"""
        results = []
        
        # Test get all notifications
        success, _ = self.run_test(
            "Get All Notifications",
            "GET",
            "notifications/get_all/1/10/",
            200
        )
        results.append(success)
        
        return all(results)

def main():
    print("🚀 Starting MeshConnect Coworking System API Tests")
    print("=" * 60)
    
    # Setup
    tester = MeshConnectAPITester("http://localhost:8001")
    
    # Test basic connectivity
    print("\n📡 Testing Basic Connectivity...")
    if not tester.test_swagger_endpoint():
        print("❌ Cannot connect to backend service")
        return 1
    
    # Test authentication
    print("\n🔐 Testing Authentication...")
    if not tester.test_login():
        print("❌ Login failed - cannot proceed with authenticated tests")
        print("   Make sure the test user (test@test.com/test123) exists and is approved")
        return 1
    
    # Test core endpoints
    print("\n👥 Testing User Management...")
    tester.test_user_endpoints()
    
    print("\n🏢 Testing Areas Management...")
    tester.test_areas_endpoints()
    
    print("\n🚪 Testing Area Rooms...")
    tester.test_area_rooms_endpoints()
    
    print("\n📅 Testing Reservations...")
    tester.test_reservations_endpoints()
    
    print("\n⏰ Testing User Sessions...")
    tester.test_user_sessions_endpoints()
    
    print("\n💰 Testing Wallet Transactions...")
    tester.test_wallet_transactions_endpoints()
    
    print("\n🔔 Testing Notifications...")
    tester.test_notifications_endpoints()
    
    # Print final results
    print("\n" + "=" * 60)
    print(f"📊 FINAL RESULTS")
    print(f"Tests passed: {tester.tests_passed}/{tester.tests_run}")
    print(f"Success rate: {(tester.tests_passed/tester.tests_run)*100:.1f}%")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed! Backend APIs are working correctly.")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed. Check the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())