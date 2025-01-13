import { Suspense, lazy } from "react";
import {
  Outlet,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import "./styles.scss";
import "./global.css";
import { Provider } from "react-redux";
import store from "./store/index.ts";

import "./common/styles/common.scss";
import Loader from "./common/components/Loader/index.tsx";
import ProtectedRoute from "./layouts/protectedRoute.tsx";
import RoleBasedRoute from "./layouts/RoleBasedRoute.tsx";

const Header = lazy(() => import("./common/Header/index"));
const Subheader = lazy(() => import("./common/Subheader/index"));
const LoginScreen = lazy(() => import("./pages/LoginScreen/index.tsx"));

const Zoom = lazy(() => import("./pages/Zoom/index.tsx"));
const UserStatus = lazy(() => import("./pages/UserStatus/index.tsx"));
const VerifyUserFace = lazy(() => import("./pages/VerifyUserFace/index.tsx"));
const Profile = lazy(() => import("./pages/Profile/index.tsx"));
const JoinWithOthers = lazy(
  () => import("./components/JoinWithOthers/index.tsx"),
);
const Redirect = lazy(() => import("./pages/Redirect/index.tsx"));
const NewSeeker = lazy(() => import("./pages/NewSeeker/index.tsx"));
const VerifyPhonenumber = lazy(
  () => import("./pages/PhonenumberVerify/index.tsx"),
);
const FriendsAndFamily = lazy(
  () => import("./pages/FriendsAndFamily/index.tsx"),
);

const Myspace = lazy(() => import("./pages/Myspace/index.tsx"));
const Unathorized = lazy(() => import("./pages/Unathorized/index.tsx"));

interface AppLayoutProps {
  type: string;
}

//App layout to render the nested routes with a subheader component
const AppLayout: React.FC<AppLayoutProps> = ({ type }) => {
  return (
    <>
      <Subheader appType={type} />
      <Outlet /> {/* This will render the nested routes */}
    </>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Suspense fallback={<Loader type="large" />}>
            <Header />
            <div>
              <Routes>
                <Route path="/" element={<LoginScreen />} />
                <Route path="/login" element={<LoginScreen />} />
                <Route path="/verifyuserface" element={<VerifyUserFace />} />
                <Route element={<ProtectedRoute />}>
                  {/* Routes for seeker start here */}
                  <Route
                    path="/infinipath"
                    element={
                      <RoleBasedRoute
                        element={<AppLayout type="infinipath" />}
                        allowedRoles={["viewer", "mahatria", "admin"]}
                      />
                    }
                  >
                    <Route path="zoom" element={<Zoom />} />
                    <Route path="userstatus" element={<UserStatus />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="joinwithothers" element={<JoinWithOthers />} />
                    <Route path="redirect" element={<Redirect />} />
                    <Route path="newseeker" element={<NewSeeker />} />
                    <Route
                      path="friendsandfamily"
                      element={<FriendsAndFamily />}
                    />
                    <Route
                      path="verifyphonenumber"
                      element={<VerifyPhonenumber />}
                    />
                    <Route path="myspace" element={<Myspace />} />
                  </Route>
                  {/* Routes for seeker ends here */}
                  {/* Routes for Admin starts here */}
                  {/* <Route
                    path="/admin"
                    element={
                      <RoleBasedRoute
                        element={<AppLayout type="admin" />}
                        allowedRoles={["mahatria"]}
                      />
                    }
                  >
                    <Route path="home" element={<Admin />} />
                    <Route
                      path="createinfinipath"
                      element={<CreateMeeting />}
                    />
                    <Route path="viewanalytics" element={<ViewAnalytics />} />
                    <Route path="sessions" element={<TrackRegistrations />} />
                    <Route path="zoom" element={<Zoom />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="redirect" element={<Redirect />} />
                    <Route path="seekerslist" element={<MuiDataGrid />} />
                  </Route> */}
                  {/* Routes for Admin ends here */}
                </Route>
                <Route path="*" element={<LoginScreen />} />
                <Route path="/unauthorized" element={<Unathorized />} />
              </Routes>
            </div>
          </Suspense>
        </div>
      </Router>
    </Provider>
  );
}
