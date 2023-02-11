import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import MD5 from 'crypto-js/md5';
import Cookies from 'js-cookie';

// bootstrap components
import {
  Button,
  Col,
  Container,
  Form,
  Row
} from 'react-bootstrap';

function Login() {
  
  const [redirectHome, setRedirectHome] = useState(false);
  const [ready, setReady] = useState(true);
  
  useEffect(() => {
    async function doInit() {
      let _username = await Cookies.get("username");
      let _auth_hash = await Cookies.get("auth_hash");
      if (_username && _auth_hash)
        await setRedirectHome(true);
    }
    
    doInit().catch(console.log);
  }, []);
  
  
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
    <Container className="Login">
      {
        ready && !redirectHome ?
        <Row className="my-5">
          <Col md={{span:4,offset:3}}>
            <h3 className="mb-3">Login Page</h3>
            <Form className="LoginForm" id="login" onSubmit={handleLogin}>
              
              <Form.Group className="mb-3" controlId="username">
                <Form.Control type="text" placeholder="Enter Username" />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="password">
                <Form.Control type="password" placeholder="Enter Password" />
              </Form.Group>
              
              <input id="auth_hash" type="hidden" />
              <Button type="submit">Login</Button>
              
            </Form>
          </Col>
        </Row>
        :
        <Navigate to="/sharetitle" />
      }
    </Container>
  )
}

export default Login;
