import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Navigation from './components/shared/Navigation/Navigation';
import Authenticate from './pages/Authenticate/Authenticate';
import Activate from './pages/Activate/Activate';
import Rooms from './pages/Rooms/Rooms';
import Room from './pages/Room/Room';
import { useSelector } from 'react-redux';
import { useLoadingWithRefresh } from './hooks/useLoadingWithRefresh';
import Loader from './components/shared/Loader/Loader';

function App() {
    const { loading } = useLoadingWithRefresh();

    return loading ? (
        <Loader message={"Loading, please wait..."} />
    ) : (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/" element={<GuestRoute element={<Home />} />} />
                <Route
                    path="/authenticate"
                    element={<GuestRoute element={<Authenticate />} />}
                />
                <Route
                    path="/activate"
                    element={<SemiProtectedRoute element={<Activate />} />}
                />
                <Route
                    path="/rooms"
                    element={<ProtectedRoute element={<Rooms />} />}
                />
                <Route
                    path="/room/:id"
                    element={<ProtectedRoute element={<Room />} />}
                />
            </Routes>
        </BrowserRouter>
    );
}

const GuestRoute = ({ element }) => {
    const { isAuth } = useSelector((state) => state.auth);
    return isAuth ? <Navigate to="/rooms" /> : element;
};

const SemiProtectedRoute = ({ element }) => {
    const { isAuth, user } = useSelector((state) => state.auth);
    return (
        <>
            {!isAuth ? (
                <Navigate to="/" />
            ) : isAuth && !user.activated ? (
                element
            ) : (
                <Navigate to="/rooms" />
            )}
        </>
    );
};

const ProtectedRoute = ({ element }) => {
    const { isAuth, user } = useSelector((state) => state.auth);
    return (
        <>
            {!isAuth ? (
                <Navigate to="/" />
            ) : isAuth && !user.activated ? (
                <Navigate to="/activate" />
            ) : (
                element
            )}
        </>
    );
};

export default App;