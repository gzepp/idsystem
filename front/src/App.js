import "./App.css";
import { Route, Routes } from "react-router-dom";
import { routes } from "./config";

function App() {
  return (
    <div>
      <link
        href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
        rel="stylesheet"
      ></link>
      <Routes>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
    </div>
  );
}

export default App;
