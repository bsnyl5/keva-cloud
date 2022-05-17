import React, { useState, useEffect } from 'react'

import axios from 'axios'
import { useNavigate } from 'react-router-dom'

async function getHealthApi() {
  const { data } = await axios.get(`https://keva-cloud.tuhuynh.com/health?who=${localStorage.getItem('email')}`)
  return data
}

async function createServerApi() {
  const { data } = await axios.post(`https://keva-cloud.tuhuynh.com/create?who=${localStorage.getItem('email')}`)
  return data
}

async function deleteServerApi() {
  const { data } = await axios.delete(`https://keva-cloud.tuhuynh.com/delete?who=${localStorage.getItem('email')}`)
  return data
}

function Main() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [health, setHealth] = useState(null)
  const [created, setCreated] = useState(null)

  useEffect(() => {
    if (!localStorage.getItem('email')) {
      navigate('/')
    }
  })

  useEffect(() => {
    loadHealth()
  }, [])

  function loadHealth(isSkipLoading) {
    if (!isSkipLoading) {
      setLoading(true)
    }
    getHealthApi().then(r => {
      if (r.container) {
        setHealth(r)
      } else {
        setHealth(null)
      }
    }).finally(() => {
      setLoading(false)
    })
  }

  async function createServer() {
    const result = await createServerApi()
    setCreated(result)
  }

  async function deleteServer() {
    setCreated(null)
    await deleteServerApi()
    loadHealth()
  }

  return (
    <React.Fragment>
      <h1>Hello {localStorage.getItem('email')}</h1>
      {loading && <div>Fetching your server data...</div>}
      {!loading && !created && !health && <React.Fragment>
        <p>You haven't created any Keva instance</p>
        <button onClick={createServer}>Create your Keva instance!</button>
      </React.Fragment>}
      {!loading && health && <React.Fragment>
        <div>Your Keva server is up!</div>
        <div>Container ID: {health.container}</div>
        <div>CPU Usage: {health.cpu}</div>
        <div>Memory Usage: {health.memory.raw} ({health.memory.percent})</div>
        <div><button onClick={() => loadHealth(true)} style={{ marginTop: '20px' }}>Refresh health</button></div>
        <div><button disabled={loading} onClick={deleteServer}>Destroy this instance</button></div>
      </React.Fragment>}
      {created && <React.Fragment>
        <div style={{ marginTop: '25px' }}><strong>Your Keva server credentials:</strong></div>
        <div>Host: redis://128.199.213.116:{created.port}</div>
        <div>Password: {created.pwd}</div>
        <div>Please save this information!</div>
        <div><button disabled={loading} onClick={() => { setCreated(null); loadHealth(); }}>Ok, I've saved it!</button></div>
        <div>Connect by redis-cli:</div>
        <div><code>redis-cli -h 128.199.213.116 -p {created.port} -a {created.pwd}</code></div>
      </React.Fragment>}
    </React.Fragment>
  )
}

export default Main
