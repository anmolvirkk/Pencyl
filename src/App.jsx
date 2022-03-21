import './main.sass'
import Dashboard from './screens/Dashboard'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import LandingPage from './screens/LandingPage'
import { RecoilRoot } from 'recoil'

const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path='dashboard/*' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App