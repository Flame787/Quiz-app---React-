import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  // During development, </React.StrictMode> will execute every component-function 2x to help us catch any errors!
  // because some errors won't happen immediately in the first run, but in the 2nd run, or after that...
  // But this also triggers that our interval-function is called 2x, instead just once. 
  // Therefore, we need a cleanup-function for interval. Then, it doesn't matter if the interval is called 10x,
  // because we always clean up old intervals, and only one will be up and running at one time. 
)
