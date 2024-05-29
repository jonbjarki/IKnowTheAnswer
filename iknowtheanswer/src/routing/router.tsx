import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import LoginPage from "../views/login-page-view/LoginPage";
import RegisterPage from "../views/register-page-view/RegisterPage";
import MainLayout from "../layouts/main-layout";
import DashboardPage from "../views/dashboard-view/DashboardPage";
import CreateMatch from "../views/create-match-view/CreateMatch";
import MatchRoom from "../views/match-room-view/MatchRoom";
import GameView from "../views/game-view/GameView";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/*" element={<MainLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="create" element={<CreateMatch />} />
        <Route path="match/:id" element={<MatchRoom />} />
        <Route path="game/:id" element={<GameView />} />
      </Route>
    </>
  )
);
