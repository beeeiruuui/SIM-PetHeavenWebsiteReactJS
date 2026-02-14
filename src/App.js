import NavBar from "./components/NavBar";
import "./styles.css";
import Dogs from "./components/Dogs";
import Cats from "./components/Cats";
import About from "./components/About";
import Home from "./components/Home";
import Profile from "./components/Profile";
import AdoptionForm from "./components/AdoptionForm";
import ReleaseForm from "./components/ReleaseForm";
import Auth from "./components/Auth";
import AdminDashboard from "./components/AdminDashboard";
import { AuthProvider } from "./services/unified-auth";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Router basename="/SIM-PetHeavenWebsiteReactJS">
        <AuthProvider>
        <NavBar />

        <div className="container">
          <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/funcat" element={<Cats />} />
            <Route path="/fundog" element={<Dogs />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/adopt" element={<AdoptionForm />} />
            <Route path="/release" element={<ReleaseForm />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </div>
        
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h3>🐾 Pet Heaven</h3>
              <p>Giving abandoned pets a second chance at happiness since 2015.</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About Us</a></li>
                <li><a href="/funcat">Cats</a></li>
                <li><a href="/fundog">Dogs</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Services</h4>
              <ul>
                <li><a href="/adopt">Adopt a Pet</a></li>
                <li><a href="/release">Release a Pet</a></li>
                <li><a href="/profile">Become a Member</a></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>📍 Storhub, 615 Lorong 4 Toa Payoh, Singapore</p>
              <p>📞 +65 8682 8785</p>
              <p>📧 info@petheaven.org.sg</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 Pet Heaven. All rights reserved.</p>
          </div>
        </footer>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;