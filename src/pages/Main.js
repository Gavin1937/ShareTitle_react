import React, { ReactComponent, useEffect, useReducer, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from "axios";
import Cookies from 'js-cookie';

// components
import SearchBar from '../components/SearchBar'
import ShareTitleTable from '../components/ShareTitleTable';
import DBStateDisplay from '../components/DBStateDisplay';
import {
  ClearIcon,
  LogoutIcon,
  NextPageIcon,
  PrevPageIcon,
  RefreshIcon,
  SearchIcon
} from '../components/Icons';

// bootstrap components
import {
  Container,
  Row,
  Col,
  Button,
  FloatingLabel,
  Form,
  Navbar,
  OverlayTrigger,
  Tooltip
} from 'react-bootstrap';


function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState(null);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [dbstate, setDBState] = useState(0);
  const [query, setQuery] = useState({page:0, order:"DESC", is_visited:"unvisited"});
  const [payload, setPayload] = useState(0);
  const [searchBarField, updateSearchBarField] = useReducer(
    (prev, next) => {
      return {...prev, ...next};
    },
    {"disabled":false}
  )
  
  // fetch before first render
  useEffect(() => {
    async function doInit() {
      let _username = await Cookies.get("username");
      let _auth_hash = await Cookies.get("auth_hash");
      if (_username && _auth_hash) {
        await setIsLoggedIn(true);
        await setUsername(_username);
        await updateDBState();
      }
      else {
        await setIsLoggedIn(false);
      }
    }
    
    doInit().catch(console.log);
  }, []);
  
  // update table every time updating state query
  useEffect(() => {
    async function doUpdateTable() {
      if (isLoggedIn)
        await updateTable();
    }
    
    doUpdateTable().catch(console.log);
  }, [query]);
  
  
  async function handleLogout() {
    await Cookies.remove("username");
    await Cookies.remove("auth_hash");
    await setIsLoggedIn(false);
  }
  
  async function updateDBState() {
    try {
      let response = await axios.get(`/api/status`);
      setDBState(response.data);
    }
    catch (err) {
      console.log(err);
    }
  }
  
  async function updateTable() {
    setReady(false);
    setFinished(false);
    setPayload({})
    
    // request from backend
    let queryStr = new URLSearchParams(query).toString();
    try {
      let response = await axios.get(`/api/query?${queryStr}`);
      setPayload(response.data);
      setFinished(true);
    }
    catch (err) {
      console.log(err);
    }
    
    setReady(true);
  }
  
  
  async function handleSearchSubmit(e) {
    e.preventDefault();
    
    await updateSearchBarField({"disabled":true});
    // parse search value
    let searchValue = document.querySelector(".SearchBar > input").value;
    searchValue = searchValue.trim();
    let _query = {}
    // contains special search command
    if (searchValue[0] == "#") {
      let list = await Array.from(
        searchValue.substr(1).split("#"),
        (i) => (i.trim().split(":"))
      );
      for (let l of list) {
        _query[l[0]] = l[1]
      }
    }
    // no special search command, assume searching title
    else if (searchValue.length > 0) {
      _query["title"] = searchValue.trim();
    }
    if (("page" in _query) == false) {
      _query["page"] = 0;
    }
    else {
      let pageNum = parseInt(_query["page"]) - 1;
      if (pageNum <= 0)
        pageNum = 0;
      _query["page"] = pageNum; 
    }
    
    await setQuery(_query);
    await updateSearchBarField({"disabled":false});
  }
  
  async function handleSearchClear(e) {
    e.preventDefault();
    window.location.reload(false);
  }
  
  async function handleFilterSelection(event) {
    let value = event.target.value;
    if (value === "visited" || value === "unvisited") {
      await setQuery(prev => {
        let obj = JSON.parse(JSON.stringify(prev));
        delete obj.is_visited;
        delete obj.page;
        return {"is_visited":value, "page":0, ...obj};
      });
    }
    else if (value === "all") {
      // remove is_visited key from object
      await setQuery(prev => {
        let obj = JSON.parse(JSON.stringify(prev));
        delete obj.is_visited;
        delete obj.page;
        return {"page":0, ...obj};
      });
    }
  }
  
  async function handlePageMove(event) {
    // change page by offset
    let _query = query;
    let targetVal = 0;
    if (event.target.className.includes("prev"))
      targetVal = -1;
    else if (event.target.className.includes("next"))
      targetVal = 1;
    let nextPageNum = parseInt(_query.page) + targetVal;
    
    if (nextPageNum <= 0) {
      await setQuery(prev => {
        let obj = JSON.parse(JSON.stringify(prev));
        obj.page = 0;
        return obj;
      });
    }
    else {
      await setQuery(prev => {
        let obj = JSON.parse(JSON.stringify(prev));
        obj.page = parseInt(nextPageNum);
        return obj;
      });
    }
  }
  
  return (
    <div>
    {
      isLoggedIn ?
      <div className="Main" style={{display:`${ready ? "block" : "none"}`}}>
        
        <Navbar
          bg="light"
          expanded
          className="sticky-top"
          style={{
            marginBottom:"2%"
          }}
        >
          <Container fluid>
            <Row>
              
              <Col
                className="DBState"
                md="auto"
              >
                <Row>
                  <Col xs={8}>
                    <DBStateDisplay dbstate={dbstate} />
                  </Col>
                  <Col style={{
                      marginLeft:"0",
                      alignContent:"center",
                      alignSelf:"center"
                    }}
                  >
                    <OverlayTrigger 
                      placement={"bottom"}
                      overlay={
                        <Tooltip id={`tooltip`}>
                          Refresh Database Status
                        </Tooltip>
                      }
                    >
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={updateDBState}
                      >
                        <RefreshIcon/>
                      </Button>
                    </OverlayTrigger>
                  </Col>
                </Row>
              </Col>
              
              <Col
                className="SearchForm"
                md="auto"
              >
                <Form
                  className="d-flex"
                  onSubmit={handleSearchSubmit}
                >
                  <SearchBar
                    className="SearchBar me-2"
                    width={"30rem"} height={"100%"}
                    disabled={searchBarField.disabled}
                  />
                  <Button type="submit">
                    <SearchIcon/>
                  </Button>
                  <Button
                    type="input"
                    onClick={handleSearchClear}
                  >
                    <ClearIcon/>
                  </Button>
                </Form>
              </Col>
              
              <Col
                className="Logout"
                md="auto"
              >
                <Navbar.Text className="mx-2">
                  Logged in as: <b>{username ? username : "-"}</b>
                </Navbar.Text>
                <OverlayTrigger 
                  className="mx-2"
                  placement={"bottom"}
                  overlay={
                    <Tooltip id={`tooltip`}>
                      Logout
                    </Tooltip>
                  }
                >
                  <Button
                    type="button"
                    onClick={handleLogout}
                  >
                    <LogoutIcon/>
                  </Button>
                </OverlayTrigger>
              </Col>
              
            </Row>
          </Container>
        </Navbar>
        
        <Container
          fluid
          style={{
            marginBottom:"3%"
          }}
        >
          
          <Row>
            
            <Col xs={2} className="filter">
              <FloatingLabel label="filter">
                <Form.Select
                  size="sm"
                  htmlSize="1"
                  defaultValue="unvisited"
                  onChange={handleFilterSelection}
                >
                  <option key="1" value="unvisited">unvisited</option>
                  <option key="2" value="visited">visited</option>
                  <option key="3" value="all">all</option>
                </Form.Select>
              </FloatingLabel>
            </Col>
            
            <Col
              xs={3}
              className="PageMover-1"
              style={{marginLeft: "20%", marginRight: "auto"}}
            >
              <Button
                className="prev me-3"
                variant="secondary"
                type="button"
                onClick={handlePageMove}
              >
                <PrevPageIcon/>
              </Button>
              <span className="me-3">Page: {query.page+1}</span>
              <Button
                className="next me-3"
                variant="secondary"
                type="button"
                onClick={handlePageMove}
              >
                <NextPageIcon/>
              </Button>
            </Col>
            
          </Row>
          
          <Row>
            {ready && finished && payload ? <ShareTitleTable payload={payload} /> : null}
          </Row>
          
          <Row className="justify-content-md-center">
            <Col xs={3} className="PageMover-2">
              <Button
                className="prev me-3"
                variant="secondary"
                type="button"
                onClick={handlePageMove}
              >
                <PrevPageIcon/>
              </Button>
              <span className="me-3">Page: {query.page+1}</span>
              <Button
                className="next me-3"
                variant="secondary"
                type="button"
                onClick={handlePageMove}
              >
                <NextPageIcon/>
              </Button>
            </Col>
          </Row>
          
        </Container>
        
      </div>
      :
      <Navigate to="/sharetitle/login" />
    }
    </div>
);
}

export default Main;
