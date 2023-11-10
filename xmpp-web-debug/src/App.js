import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import React from "react";

import "./App.css"
import Debug from "./components/Debug";
import Register from "./components/Register";
import ChatPage from "./pages/ChatPage/ChatPage";
import AppNav from "./components/AppNav";

function App() {

  return (
    <div className="App">
        <Router>
          <AppNav></AppNav>
          <Switch>
            <Route path="/" exact>
              <Debug></Debug>
            </Route>
            <Route path="/register">
              <Register></Register>
            </Route>
            <Route path="/chat">
              <ChatPage></ChatPage>
            </Route>
          </Switch>
        </Router>
    </div>
  );
}

export default App;
