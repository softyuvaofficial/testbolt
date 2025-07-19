'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Clock, Users, Calendar, Trophy, Target, AlertCircle, CheckCircle } from 'lucide-react';

export default function LiveTestDetails({ params }) {
  const { liveTestId } = params;
  const { user } = useUserAuth();
  const router = useRouter();
  const [test, setTest] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load test details
    setTimeout(() => {
      const demoTest = {
        id: parseInt(liveTestId),
        title: "JEE Main Live Mock Test 2024",
        description: "National level live mock test for JEE Main aspirants with real-time ranking and instant results",
        startTime: "2024-01-20T10:00:00Z",
        duration: 180,
        totalQuestions: 90,
        registeredUsers: 2500,
        maxParticipants: 5000,
        category: "Engineering",
        difficulty: "high",
        prizePool: 50000,
        instructions: [
          "This is a live test with real-time ranking updates",
          "Test will start exactly at the scheduled time",
          "Late entries are not allowed once the test begins",
          "All participants will see live leaderboard during the test",
          "Results and rankings will be available immediately after submission",
          "Top performers will be eligible for cash prizes",
          "Ensure stable internet connection throughout the test",
          "Calculator and rough sheets are not allowed"
        ],
        prizes: [
          { rank: "1st", amount: 25000 },
          { rank: "2nd", amount: 15000 },
          { rank: "3rd", amount: 10000 }
        ],
        syllabus: [
          "Physics: Mechanics, Thermodynamics, Optics, Modern Physics",
          "Chemistry: Organic, Inorganic, Physical Chemistry", 
          "Mathematics: Algebra, Calculus, Coordinate Geometry"
        ]
      };
      setTest(demoTest);
      setIsRegistered(Math.random() > 0.5); // Random registration status
      setLoading(false);
    }, 1000);
  }, [liveTestId]);

  useEffect(() => {
    if (test) {
      const updateCountdown = () => {
        const now = new Date().getTime();
        const testTime = new Date(test.startTime).getTime();
        const difference = testTime - now;

        if (difference > 0) {
          const days = Math.floor(difference / (1000 * 60 * 60 * 24));
          const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((difference % (1000 * 60)) / 1000);

          setTimeLeft({ days, hours, minutes, seconds });
        } else {
          setTimeLeft(null);
        }
      };

      updateCountdown();
      const timer = setInterval(updateCountdown, 1000);
      return () => clearInterval(timer);
    }
  }, [test]);

  const handleRegister = () => {
    if (!user) {
      router.push('/user-login');
      return;
    }
    setIsRegistered(true);
    // API call to register user
  };

  const handleJoinTest = () => {
    if (!user) {
      router.push('/user-login');
      return;
    }
    if (!isRegistered) {
      alert('Please register first to join the test');
      return;
    }
    router.push(`/live-tests/${liveTestId}/start`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Live test not found</h1>
            <Button onClick={() => router.push('/live-tests')}>
              Back to Live Tests
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isTestStarted = new Date() >= new Date(test.startTime);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Test Header */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="bg-white text-red-600 mb-4">Live Test</Badge>
            <h1 className="text-4xl font-bold mb-4">{test.title}</h1>
            <p className="text-xl text-red-100 mb-6">{test.description}</p>
            
            {/* Countdown Timer */}
            {timeLeft && (
              <div className="bg-white bg-opacity-20 rounded-lg p-6 inline-block">
                <h3 className="text-lg font-semibold mb-4">Test starts in:</h3>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">{timeLeft.days}</div>
                    <div className="text-sm">Days</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{timeLeft.hours}</div>
                    <div className="text-sm">Hours</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{timeLeft.minutes}</div>
                    <div className="text-sm">Minutes</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{timeLeft.seconds}</div>
                    <div className="text-sm">Seconds</div>
                  </div>
                </div>
              </div>
            )}
            
            {isTestStarted && (
              <Alert className="bg-green-100 border-green-400 text-green-800 max-w-md mx-auto">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Test is now live! Join now to participate.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Test Details */}
            <Card>
              <CardHeader>
                <CardTitle>Test Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">{test.duration}</div>
                    <div className="text-sm text-gray-600">Minutes</div>
                  </div>
                  <div className="text-center">
                    <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">{test.totalQuestions}</div>
                    <div className="text-sm text-gray-600">Questions</div>
                  </div>
                  <div className="text-center">
                    <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">{test.registeredUsers}</div>
                    <div className="text-sm text-gray-600">Registered</div>
                  </div>
                  <div className="text-center">
                    <Trophy className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                    <div className="text-lg font-bold">₹{test.prizePool.toLocaleString()}</div>
                    <div className="text-sm text-gray-600">Prize Pool</div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Schedule</h4>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{formatDateTime(test.startTime)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Test Instructions</CardTitle>
                <CardDescription>Please read carefully before joining the test</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {test.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="bg-blue-100 rounded-full p-1 mt-1">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Syllabus */}
            <Card>
              <CardHeader>
                <CardTitle>Syllabus Coverage</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {test.syllabus.map((item, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Target className="h-4 w-4 text-blue-500 mt-1" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card>
              <CardHeader>
                <CardTitle>Join Live Test</CardTitle>
                <CardDescription>
                  {isRegistered ? 'You are registered for this test' : 'Register to participate'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {isRegistered ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-700">
                      Successfully registered! You can join when the test starts.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Registration required to participate in this live test.
                    </AlertDescription>
                  </Alert>
                )}

                {isTestStarted ? (
                  <Button 
                    onClick={handleJoinTest}
                    className="w-full bg-red-600 hover:bg-red-700"
                    disabled={!isRegistered}
                  >
                    Join Live Test Now
                  </Button>
                ) : isRegistered ? (
                  <Button disabled className="w-full">
                    Wait for Test to Start
                  </Button>
                ) : (
                  <Button onClick={handleRegister} className="w-full">
                    Register for Free
                  </Button>
                )}

                <div className="text-xs text-gray-500 text-center">
                  {test.maxParticipants - test.registeredUsers} spots remaining
                </div>
              </CardContent>
            </Card>

            {/* Prize Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Prize Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {test.prizes.map((prize, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-4 w-4 text-yellow-600" />
                        <span className="font-medium">{prize.rank} Place</span>
                      </div>
                      <span className="font-bold text-green-600">₹{prize.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Test Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Test Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Category:</span>
                  <Badge variant="outline">{test.category}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Difficulty:</span>
                  <Badge className={test.difficulty === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                    {test.difficulty}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">Multiple Choice</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Negative Marking:</span>
                  <span className="font-medium">Yes (-1)</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}