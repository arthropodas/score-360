import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useBreadcrumbs from 'use-react-router-breadcrumbs';

const clientRoutes = [
    { path: "/tournament", breadcrumb: "Home" },
    { path: "/tournament/team-list", breadcrumb: null },
    { path: "/tournament/TournamentDetails", breadcrumb: null },
    { path: "/tournament/TournamentDetails/:tournamentId", breadcrumb: null },
    { path: "/tournament/TournamentDetails/:tournamentId/team-list/:id", breadcrumb: "Tournament Details" },

    { path: "/tournament/TournamentDetails/:tournamentId/team-list", breadcrumb: null },
    { path: "/tournament/TournamentDetails/:tournamentId/team-list/:id", breadcrumb: null },
    { path: "/tournament/TournamentDetails/:tournamentId/team-list/:id/team-players/:id", breadcrumb: null },
    { path: "/tournament/TournamentDetails/:tournamentId/team-list/:id/team-players", breadcrumb: null },
    { path: "/tournament/TournamentDetails/:tournamentId/matches/:id", breadcrumb:  "Tournament Details" },
    { path: "/tournament/TournamentDetails/:tournamentId/matches", breadcrumb: null },



   


];

function MyBreadcrumbs() {
    const location = useLocation();
    const breadcrumbs = useBreadcrumbs(clientRoutes);
    console.log(breadcrumbs,".....................");

    return (
        
        <nav style={{ width: "100%", height: "30px", marginLeft: "10px" }} className='navbar navbar-expand-lg navbar-light bg-light'>
            {breadcrumbs.map(({ match, breadcrumb }) => (
                match.pathname !== "/" && ( // Check if the path is not "/"
                    <React.Fragment key={match.pathname}>
                        &nbsp;&nbsp;
                        {match.pathname === location.pathname ? (
                            <span style={{ textDecoration: "none", color: "black" }}>
                                {breadcrumb}
                            </span>
                        ) : (
                            <Link to={match} style={{ textDecoration: "none", color: "green" }}>
                                {breadcrumb}&nbsp;
                            </Link>
                        )}
                        &nbsp;&nbsp;{">"}
                    </React.Fragment>
                )
            ))}
        </nav>
    );
}

export default MyBreadcrumbs;
