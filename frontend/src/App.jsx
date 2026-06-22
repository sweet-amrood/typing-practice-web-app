import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GuestRoute from './components/GuestRoute';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { StatsProvider } from './context/StatsContext';
import { ThemeProvider } from './context/ThemeContext';
import { ItemProvider } from './context/ItemContext';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Items from './pages/Items';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Lessons from './pages/Lessons';
import TypingTest from './pages/TypingTest';
import Leaderboard from './pages/Leaderboard';
import Race from './pages/Race';
import Coach from './pages/Coach';
import Shop from './pages/Shop';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StatsProvider>
          <ThemeProvider>
            <ItemProvider>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Home />} />
                  <Route
                    path="login"
                    element={
                      <GuestRoute>
                        <Login />
                      </GuestRoute>
                    }
                  />
                  <Route
                    path="signup"
                    element={
                      <GuestRoute>
                        <Signup />
                      </GuestRoute>
                    }
                  />
                  <Route
                    path="dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="lessons"
                    element={
                      <ProtectedRoute>
                        <Lessons />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="test"
                    element={
                      <ProtectedRoute>
                        <TypingTest />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="leaderboard" element={<Leaderboard />} />
                  <Route
                    path="race"
                    element={
                      <ProtectedRoute>
                        <Race />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="coach"
                    element={
                      <ProtectedRoute>
                        <Coach />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="shop"
                    element={
                      <ProtectedRoute>
                        <Shop />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="items" element={<Items />} />
                </Route>
              </Routes>
            </ItemProvider>
          </ThemeProvider>
        </StatsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
