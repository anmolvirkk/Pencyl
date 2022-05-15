import './main.sass'
import Dashboard from './screens/Dashboard'
import {BrowserRouter, Routes, Route} from "react-router-dom"
import LandingPage from './screens/LandingPage'
import { RecoilRoot } from 'recoil'
import React from 'react'

const App = React.memo(() => {
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
})

export default App