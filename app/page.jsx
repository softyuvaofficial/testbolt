import Link from 'next/link';

export default function Homepage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="bg-blue-600 text-white p-4 rounded-lg mb-6 inline-block">
            <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to <span className="text-blue-600">TestYukti</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            India&apos;s Most Comprehensive Online Test Series Platform
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">50,000+</div>
              <div className="text-gray-600">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">1,200+</div>
              <div className="text-gray-600">Test Series</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">25+</div>
              <div className="text-gray-600">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">98%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/homepage" className="bg-blue-50 hover:bg-blue-100 p-6 rounded-lg transition-colors block">
              <div className="text-2xl mb-2">🏠</div>
              <h3 className="font-semibold text-gray-900">Homepage</h3>
              <p className="text-sm text-gray-600">Complete homepage with all features</p>
            </Link>
            
            <Link href="/test-series" className="bg-green-50 hover:bg-green-100 p-6 rounded-lg transition-colors block">
              <div className="text-2xl mb-2">📚</div>
              <h3 className="font-semibold text-gray-900">Test Series</h3>
              <p className="text-sm text-gray-600">Browse all available test series</p>
            </Link>
            
            <Link href="/live-tests" className="bg-red-50 hover:bg-red-100 p-6 rounded-lg transition-colors block">
              <div className="text-2xl mb-2">🔴</div>
              <h3 className="font-semibold text-gray-900">Live Tests</h3>
              <p className="text-sm text-gray-600">Join live competitive tests</p>
            </Link>
            
            <Link href="/leaderboard" className="bg-yellow-50 hover:bg-yellow-100 p-6 rounded-lg transition-colors block">
              <div className="text-2xl mb-2">🏆</div>
              <h3 className="font-semibold text-gray-900">Leaderboard</h3>
              <p className="text-sm text-gray-600">Check your ranking</p>
            </Link>
            
            <Link href="/user-login" className="bg-purple-50 hover:bg-purple-100 p-6 rounded-lg transition-colors block">
              <div className="text-2xl mb-2">👤</div>
              <h3 className="font-semibold text-gray-900">User Login</h3>
              <p className="text-sm text-gray-600">Access your account</p>
            </Link>
            
            <Link href="/admin-login" className="bg-gray-50 hover:bg-gray-100 p-6 rounded-lg transition-colors block">
              <div className="text-2xl mb-2">⚙️</div>
              <h3 className="font-semibold text-gray-900">Admin Panel</h3>
              <p className="text-sm text-gray-600">Admin dashboard access</p>
            </Link>
          </div>
        </div>
        
        <div className="text-center text-gray-600">
          <p>&copy; 2024 TestYukti. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
