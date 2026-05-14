import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import Home from '../pages/Home.jsx'
import './App.css'
import Login from '../pages/Login.jsx'
import SignUp from '../pages/SignUp.jsx'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App