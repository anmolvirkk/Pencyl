import './main.sass'
import Dashboard from './screens/Dashboard'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import LandingPage from './screens/LandingPage'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path='dashboard/*' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App