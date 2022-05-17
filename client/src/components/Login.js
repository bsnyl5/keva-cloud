import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import axios from 'axios'

axios.defaults.baseURL = 'https://keva-cloud.tuhuynh.com'

function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/console')
    }
  }, [navigate])

  async function onLogin({ token }) {
    const { data } = await axios.post('/login', { token })
    localStorage.setItem('token', data.token)
    localStorage.setItem('email', data.email)
    navigate('/console')
  }

  function responseGoogle(data) {
    if (data.error) return
    if (!data || !data.profileObj.email || !data.accessToken) return
    onLogin({ token: data.accessToken })
  }

  return (
    <React.Fragment>
      <h1>Try Keva Cloud!</h1>
      <p>Spawn your Keva instance in seconds!</p>
      <div className="login-box" onSubmit={onLogin}>
        <GoogleLogin
          clientId="834798810236-mo101qd4s238ajssl05n4j4t9i2r4ch5.apps.googleusercontent.com"
          render={renderProps => (
            <button type="button" onClick={renderProps.onClick}>Login with Google account</button>
          )}
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
        />
      </div>
      <p className="notice">Free forever 1 Keva instance with 256MB memory per account</p>
      <p className="notice">Upgrade to pro instance (1GB+ memory) starting 5$/month</p>
    </React.Fragment>
  )
}

export default Login
