import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import React from "react";

import "./App.css"
import Debug from "./components/Debug";

function App() {

  return (
    <div className="App">
        <Router>
          <Switch>
            <Route path="/">
              <Debug></Debug>
            </Route>
          </Switch>
        </Router>
    </div>
  );
}

export default App;
