import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"

import "./App.css"

// pages and components
import { Dashboard } from "./pages/dashboard/Dashboard"
import { Create } from "./pages/create/Create"
import { Project } from "./pages/project/Project"
import { Login } from "./pages/login/Login"
import { Signup } from "./pages/signup/Signup"
import { Navbar } from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import { useAuthContext } from "./hooks/useAuthContext"
import { OnlineUsers } from "./components/OnlineUsers"

function App() {
  const { user, authIsReady } = useAuthContext()

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
          {user && <Sidebar />}
          <div className="container">
            <Navbar />
            <Switch>
              <Route exact path="/">
                {!user && <Redirect to="/login" />}
                {user && <Dashboard />}
              </Route>
              <Route exact path="/create">
                {!user && <Redirect to="/login" />}
                {user && <Create />}
              </Route>
              <Route exact path="/projects/:id">
                {!user && <Redirect to="/login" />}
                {user && <Project />}
              </Route>
              <Route exact path="/login">
                {user && <Redirect to="/" />}
                {!user && <Login />}
              </Route>
              <Route exact path="/signup">
                {user && <Redirect to="/" />}
                {!user && <Signup />}
              </Route>
            </Switch>
          </div>
          {user && <OnlineUsers />}
        </BrowserRouter>
      )}
    </div>
  )
}

export default App
