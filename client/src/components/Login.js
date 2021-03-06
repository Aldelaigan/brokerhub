import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { app, facebookProvider, googleProvider } from '../base'

const loginStyles = {
  width: "90%",
  maxWidth: "315px",
  margin: "20px auto",
  border: "1px solid #ddd",
  borderRadius: "5px",
  padding: "10px"
}

class Login extends Component {
  constructor(props) {
    super(props)
    this.authWithFacebook = this.authWithFacebook.bind(this)
    this.authWithGoogle = this.authWithGoogle.bind(this)
    this.authWithEmailPassword = this.authWithEmailPassword.bind(this)
    this.state = {
      redirect: false
    }
  }

  authWithFacebook() {
    console.log("authed with facebook")
    app.auth().signInWithPopup(facebookProvider)
      .then((user, error) => {
        if (error) {
          console.log("Unable to sign in");
        } else {
          this.props.setCurrentUser(user)
          this.setState({ redirect: true })
        }
    })
  }

  authWithGoogle() {
    console.log("authed with google")
    app.auth().signInWithPopup(googleProvider)
      .then((user, error) => {
        if (error) {
          console.log("Unable to sign in");
        } else {
          this.props.setCurrentUser(user)
          this.setState({ redirect: true })
        }
    })
  }

  authWithEmailPassword(event) {
    event.preventDefault();

    const email = this.emailInput.value
    const password = this.passwordInput.value

    app.auth().fetchProvidersForEmail(email)
    .then((providers) => {
      if (providers.length === 0) {
        // create user
        return app.auth().createUserWithEmailAndPassword(email, password)
      } else if (providers.indexOf("password") === -1) {
        this.loginForm.reset()
        this.alert("Unable to sign in -- Duplicate email exists");
      } else {
        return app.auth().signInWithEmailAndPassword(email, password)
      }
    })
    .then((user) => {
      if (user && user.email) {
        this.loginForm.reset()
        this.props.setCurrentUser(user)
        this.setState({redirect: true})
      }
    })
    .catch((error) => {
      console.log("Unable to sign in -- Duplicate email exists");
    })
  }

  render() {
    
    
    const { from } = this.props.location.state || { from: { pathname: '/' } }

    if (this.state.redirect === true) {
      return <Redirect to={from} />
    }

    return (
      <div style={loginStyles}>
        <button style={{ width: "100%" }} className="btn btn-primary" onClick={() => { this.authWithFacebook() }}>Log In with Facebook</button>
        <br />
        <button style={{ width: "100%" }} className="btn btn-danger" onClick={() => { this.authWithGoogle() }}>Log In with Google</button>

        <hr style={{ marginTop: "10px", marginBottom: "10px" }} />

        <div style={{ marginBottom: "10px" }} className="pt-callout pt-icon-info-sign" >
          <h5>Note</h5>
          <p>
            If you do not have an account already, this form will create your account.
            </p>
        </div>
        <form onSubmit={(event) => { this.authWithEmailPassword(event) }} ref={(form) => { this.loginForm = form }}>
          <label className="pt-label">
            Email
            <input style={{ width: "100%" }} className="pt-input" name="email" type="email" ref={(input) => { this.emailInput = input }} placeholder="Email"></input>
          </label>
          <label className="pt-label">
            Password
            <input style={{ width: "100%" }} className="pt-input" name="password" type="password" ref={(input) => { this.passwordInput = input }} placeholder="Password"></input>
          </label>
          <input style={{ width: "100%" }} type="submit" className="btn btn-success" value="Log In"></input>

        </form>
      </div>
    )
  }
}

export default Login
