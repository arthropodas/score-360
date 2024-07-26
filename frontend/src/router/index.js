import { Navigate, createBrowserRouter } from "react-router-dom";
import TournamentRegister from "../Pages/TournamentRegister/TournamentRegister";
import TournamentEdit from "../Pages/TournamentEdit/TournamentEdit";
import TournamentsList from "../Pages/TournamentListing/TournamentsList";
import React from "react";
import Login from "../Pages/Login/Login";
import RegistrationForm from "../Pages/Register/RegistrationForm";
import EmailValidation from "../Pages/Register/EmailValidation";
import { ResetPassword } from "../Pages/resetPassword/ResetPassword";
import { ChangePassword } from "../Pages/changePassword/ChangePassword";
import { TeamCreation } from "../Pages/teamCreation/TeamCreation";

import { ForgotPassword } from "../Pages/forgotPassword/ForgotPassword";
import { LandingPage } from "../Pages/landingPage/LandingPage";
import Protected from "../Services/CommonService/Protecter";
import TeamList from "../Pages/teamList/TeamList";
import PlayerList from "../Pages/playerList/PlayerList";
import { AddPlayers } from "../Pages/addPlayers/AddPlayers";
import LogoutButton from "../Pages/logout/Logout";
import NotFound from "../components/Common/notFound/NotFound";
import PropTypes from "prop-types";
import MatchList from "../Pages/matchList/MatchList";
import CoinToss from "../Pages/coinToss/CoinToss";
import MatchEdit from "../Pages/matchEdit/MatchEdit";

import TournamentDetails from "../Pages/tournamentDetails/TournamentDetails";
import PlayingEleven from "../Pages/playingEleven/PlayingEleven";
import LiveScoreView from "../Pages/liveScoreView/LiveScoreView";
import AddScore from "../Pages/ScoreUpdate/ScoreUpdate";

const isAuthenticated = () => {
  const refreshToken = localStorage?.getItem("authTokens");
  return !!refreshToken;
};

const PrivateRoute = ({ element, path }) => {
  return isAuthenticated() ? (
    element
  ) : (
    <Navigate to="/login" replace state={{ from: path }} />
  );
};

PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired,
};

const PublicRoute = ({ Comp, path }) => {
  const token = localStorage.getItem("authTokens");
  const user = token ? JSON.parse(token) : null;
  const userType = user ? user?.user_type : null;

  if (isAuthenticated()) {
    if (userType === 0) {
      return <Navigate to="/tournament" replace state={{ from: path }} />;
    }
  } else {
    return <Comp />;
  }
};

const routes = [
  {
    path: "",
    element: <Protected Comp={LandingPage} />,
    children: [
      {
        path: "/tournament-edit/:tournamentId",
        element: <Protected Comp={TournamentEdit} />,
      },
      {
        path: "/tournament",
        element: <Protected Comp={TournamentsList} />,
      },
      {
        path: "/tournament-register",
        element: <Protected Comp={TournamentRegister} />,
      },

      {
        path: "/changePassword",
        element: <Protected Comp={ChangePassword} />,
      },
      {
        path: "/logout",
        element: <Protected Comp={LogoutButton} />,
      },

      {
        path: "/schedule-match",
        element: <Protected Comp={MatchEdit} />,
      },

      {
        path: "/add-score/:id",
        element: <Protected Comp={AddScore} />,
      },

      {
        path: "/tournament/TournamentDetails/:id",
        element: <Protected Comp={TournamentDetails} />,
        children: [
          {
            path: "team-list/:tournamentId",
            element: <Protected Comp={TeamList} />,
          },
          {
            path: "matches/:tournamentId",
            element: <Protected Comp={MatchList} />,
          },
          {
            path: "teamCreation/:tournamentId",
            element: <Protected Comp={TeamCreation} />,
          },
          {
            path: "team-list/:id/team-players/:teamId",
            element: <Protected Comp={PlayerList} />,
          },
          {
            path: "add-player/:teamId",
            element: <Protected Comp={AddPlayers} />,
          },
          {
            path: "matches/:id/add-playing-eleven",
            element: <Protected Comp={PlayingEleven} />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <PublicRoute Comp={Login} />,
  },

  {
    path: "/validate-email",
    element: <PublicRoute Comp={EmailValidation} />,
  },

  {
    path: "/register/:token",
    element: <PublicRoute Comp={RegistrationForm} />,
  },
  {
    path: "/forgotPassword",
    element: <PublicRoute Comp={ForgotPassword} />,
  },

  {
    path: "/resetPassword",
    element: <PublicRoute Comp={ResetPassword} />,
  },
  {
    path: "/coinToss",
    element: <CoinToss />,
  },
  {
    path: "/liveScoreView/:id",
    element: <LiveScoreView />,
  },

  {
    path: "*",
    element: <NotFound />,
  },
];

const router = createBrowserRouter(routes);
export default router;
PrivateRoute.propTypes = {
  element: PropTypes.element.isRequired,
  path: PropTypes.string.isRequired,
};
PublicRoute.propTypes = {
  Comp: PropTypes.elementType.isRequired,
  path: PropTypes.string.isRequired,
};
