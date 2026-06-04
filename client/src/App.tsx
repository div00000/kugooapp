import { Route, Switch, useLocation } from "wouter";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Restaurants from "./pages/Restaurants";
import RestaurantDetail from "./pages/RestaurantDetail";
import Checkout from "./pages/Checkout";
import Track from "./pages/Track";
import Orders from "./pages/Orders";
import Account from "./pages/Account";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Merchant from "./pages/Merchant";
import Rider from "./pages/Rider";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { ZaamAssistant } from "./components/ZaamAssistant";
import { ProtectedRoute } from "./components/ProtectedRoute";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Landing} />
        <Route path="/restaurants" component={Restaurants} />
        <Route path="/restaurant/:id" component={RestaurantDetail} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/track/:trackingId?" component={Track} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/orders">
          <ProtectedRoute roles={["customer", "admin", "merchant", "rider"]}>
            <Orders />
          </ProtectedRoute>
        </Route>
        <Route path="/account">
          <ProtectedRoute roles={["customer", "admin", "merchant", "rider"]}>
            <Account />
          </ProtectedRoute>
        </Route>
        <Route path="/merchant">
          <ProtectedRoute roles={["merchant", "admin"]}>
            <Merchant />
          </ProtectedRoute>
        </Route>
        <Route path="/rider">
          <ProtectedRoute roles={["rider", "admin"]}>
            <Rider />
          </ProtectedRoute>
        </Route>
        <Route path="/admin">
          <ProtectedRoute roles={["admin"]}>
            <Admin />
          </ProtectedRoute>
        </Route>
        <Route component={NotFound} />
      </Switch>
      <ZaamAssistant />
    </>
  );
}
