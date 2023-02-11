import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import MD5 from 'crypto-js/md5';
import Cookies from 'js-cookie';

function Login() {
  
  const [redirectHome, setRedirectHome] = useState(false);
  const [ready, setReady] = useState(true);
  
  async function handleLogin() {
    // calculate auth_hash & rm password
    var form = document.querySelector('[id="login"]')
    var username = form.querySelector('[id="username"]').value;
    var password = form.querySelector('[id="password"]').value;
    var auth_hash = MD5(
        username.toLowerCase()+password
    ).toString().toLowerCase();
    
    await setReady(false);
    await Cookies.set("username", username, { expires: 10*24*3600 });
    await Cookies.set("auth_hash", auth_hash, { expires: 10*24*3600 });
    await setRedirectHome(true);
    await setReady(true);
  }
  
  return (
    <div className="Login">
      {
        ready && !redirectHome ?
        <div>
          <span>Login Page</span>
          <form className="LoginForm" id="login" onSubmit={handleLogin}>
            <label htmlFor="username" value="Username">Username</label>
            <input id="username" type="text" />
            <label htmlFor="password" value="Password">Password</label>
            <input id="password" type="password" />
            <input id="auth_hash" type="hidden" />
            <button type="submit">Login</button>
          </form>
        </div>
        :
        <Navigate to="/sharetitle" />
      }
    </div>
  )
}

export default Login;
