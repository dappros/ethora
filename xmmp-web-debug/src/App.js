import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import React from "react";

import "./App.css"
import Debug from "./components/Debug";
import Register from "./components/Register";

function App() {

  return (
    <div className="App">
        <Router>
          <Switch>
            <Route path="/" exact>
              <Debug></Debug>
            </Route>
            <Route path="/register">
              <Register></Register>
            </Route>
          </Switch>
        </Router>
    </div>
  );
}

export default App;
