import Navbar from '../components/navbar.jsx'
import Footer from '../components/footer.jsx'
import Home from '../pages/Home.jsx'
import './App.css'

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Home />
      </main>
      <Footer />
    </>
  )
}

export default App