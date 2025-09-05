import { createRoot } from 'react-dom/client'
import './index.css'

// Test different versions by uncommenting one:
// import App from './App-simple.tsx'     // Basic test
// import App from './App-fixed.tsx'      // Minimal working version
// import App from './App-enhanced.tsx'   // Enhanced with error boundaries
// import App from './App-original-fixed.tsx' // Original with error handling
import App from './App.tsx'            // Original complex version

createRoot(document.getElementById("root")!).render(<App />);
