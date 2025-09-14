import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// import your page components
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";

// import your JSON config
import routesConfig from "./routes.json";
import Header from "./components/header";

// create a type for routes
interface RouteConfig {
    path: string;
    element: string;
}

// map string names from JSON to actual components
const componentsMap: Record<string, React.ComponentType> = {
    HomePage,
    AboutPage,
    ContactPage,
};

const App: React.FC = () => {
    return (
        <Router>
            <Layout>
                <Routes>
                    {(routesConfig as RouteConfig[]).map((route, index) => {
                        const Component = componentsMap[route.element];
                        if (!Component) {
                            // fallback if component not found
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={<h1>Component not found</h1>}
                                />
                            );
                        }
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<Component />}
                            />
                        );
                    })}
                </Routes>
            </Layout>
        </Router>
    );
};

export default App;
