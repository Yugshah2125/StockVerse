import { BrowserRouter, Routes, Route } from "react-router-dom";

const SimpleApp = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground p-8">
        <Routes>
          <Route path="/" element={
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">StockVerse</h1>
              <p className="text-xl text-muted-foreground">Virtual Trading Platform</p>
              <p className="mt-4">App is loading successfully!</p>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default SimpleApp;