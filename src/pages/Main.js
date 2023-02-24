import React, { useEffect, useReducer, useState } from 'react';
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
  Tooltip,
  Nav
} from 'react-bootstrap';


function Main() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [username, setUsername] = useState(null);
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [dbstate, setDBState] = useState(0);
  const [query, setQuery] = useState({page:0, is_visited:"unvisited", order:"DESC"});
  const [payload, setPayload] = useState(0);
  const [searchBarField, updateSearchBarField] = useReducer(
    (prev, next) => {
      return {...prev, ...next};
    },
    {"disabled":false}
  );
  const [addShareTitleErr, updateAddShareTitleErr] = useReducer(
    (prev, next) => {
      return {...next};
    },
    {"ready":false, "msg":""}
  );
  
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
    
    // add global "/" key press detection
    document.addEventListener('keydown', handleGlobalKeypress);
    
    doInit().catch(console.log);
  }, []);
  
  // update table every time updating state query
  useEffect(() => {
    //!for debug only
    // console.log(query);
    //!for debug only
    async function doUpdateQuery() {
      // modify filter base on "is_visited" field
      document.querySelector(".filter-form").value = query["is_visited"];
      
      // update table content
      if (isLoggedIn)
        await updateTable();
    }
    
    doUpdateQuery().catch(console.log);
  }, [query]);
  
  
  async function handleGlobalKeypress(event) {
    let currentKeyCode = event.code;
    let searchBarField = document.querySelector(".SearchBar > input");
    let currentFocusOnInput = (document.activeElement.tagName == 'INPUT');
    
    // focus on the search bar if pressing "/" and currently not focused on an input
    if (currentKeyCode == "Slash" && !currentFocusOnInput) {
      event.preventDefault();
      let navbarButton = document.querySelector('nav > div > button.navbar-toggler');
      let isCollapsed = Array.from(navbarButton.classList).find(s => s == 'collapsed');
      let isLargeWindow = (window.innerWidth >= 992);
      // expand navbar if needed
      if (isCollapsed && !isLargeWindow)
        await navbarButton.click();
      await searchBarField.focus();
    }
  }
  
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
  
  
  // parse search value String to Object
  function searchValueS2O(val) {
    let searchValue = val.trim();
    let _query = {}
    
    // 1st character is special search character
    if (searchValue[0] == "#") {
      let list = Array.from(
        searchValue.substr(1).split("#"),
        (i) => (i.trim().split(":"))
      );
      for (let l of list) {
        // handle special cases
        if (l[0].toLowerCase() == "page") {
          _query["page"] = parseInt(l[1]) - 1;
        }
        // general case
        else {
          _query[l[0]] = l[1]
        }
      }
    }
    // 1st character isn't special search character, assume searchValue starts with title
    else if (searchValue.length > 0) {
      let pos = searchValue.indexOf("#");
      if (pos == -1) // only contain title
        _query["title"] = searchValue.trim();
      else { // contain extra special search characters after title
        let titleStr = searchValue.substr(0, pos).trim();
        let paramStr = searchValue.substr(pos).trim();
        _query = {"title":titleStr, ...searchValueS2O(paramStr)};
      }
    }
    
    // add "page" to query
    if ("page" in _query) {
      let pageNum = parseInt(_query["page"]);
      if (pageNum <= 0)
        pageNum = 0;
      _query["page"] = pageNum; 
    }
    else
      _query["page"] = 0;
    
    // add "is_visited" to query
    if ("is_visited" in _query) {
      let _queryVal = _query["is_visited"].toLowerCase();
      if (_queryVal != "all" && _queryVal != "visited" && _queryVal != "unvisited")
        _query["is_visited"] = "unvisited";
      else
        _query["is_visited"] = _queryVal;
    }
    else
      _query["is_visited"] = "unvisited";
    
    // add "order" to query
    if ("order" in _query) {
      let _queryVal = _query["order"].toUpperCase();
      if (_queryVal != "ASC" && _queryVal != "DESC")
        _query["order"] = "DESC";
      else
        _query["order"] = _queryVal;
    }
    else
      _query["order"] = "DESC";
    
    return _query;
  }
  
  // parse search value Object to String
  function searchValueO2S(val) {
    let output = "";
    
    for (let key in val) {
      output += `#${key}:${val[key]} `
    }
    
    return output;
  }
  
  async function handleSearchSubmit(e) {
    e.preventDefault();
    
    await updateSearchBarField({"disabled":true});
    
    // update search query
    let searchValue = document.querySelector(".SearchBar > input").value;
    searchValue = searchValue.trim();
    let _query = searchValueS2O(searchValue);
    await setQuery(_query);
    
    await updateSearchBarField({"disabled":false});
  }
  
  async function handleSearchClear(e) {
    e.preventDefault();
    window.location.reload(false);
  }
  
  async function handleFilterSelection(event) {
    let value = event.target.value;
    await setQuery(prev => {
      let obj = JSON.parse(JSON.stringify(prev));
      delete obj.is_visited;
      delete obj.page;
      return {"is_visited":value, "page":0, ...obj};
    });
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
  
  async function handleAddShareTitle(event) {
    event.preventDefault();
    
    await updateAddShareTitleErr({"ready": false, "msg":""});
    let inputBar = event.target.querySelector('.addShareTitle-input');
    let value = inputBar.value.trim();
    inputBar.value = "";
    if (value.length <= 0) {
      await updateAddShareTitleErr({"ready": true, "msg":"Empty input"});
      return;
    }
    
    try {
      let config = {
        headers: {
          "Content-Type": "text/plain"
        },
        responseType: "json"
      };
      await axios.post("/api/sharetitle", value, config);
      
      // update whole table
      await setQuery({page:0, is_visited:"unvisited", order:"DESC"})
    }
    catch (err) {
      console.log(err);
      let respMsg = err.response.data.error;
      await updateAddShareTitleErr({"ready": true, "msg":respMsg});
    }
  }
  
  return (
    <div>
    {
      isLoggedIn ?
      <div className="Main" style={{display:`${ready ? "block" : "none"}`}}>
        
        <Navbar
          bg="light"
          expand="lg"
          sticky="top"
          style={{
            marginBottom:"2%",
          }}
        >
          <Container fluid>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="m-auto">
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
                    width={"100%"} height={"100%"}
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
            </Nav>
          </Navbar.Collapse>
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
                  className="filter-form"
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
          
            <Form className="addShareTitle py-2" onSubmit={handleAddShareTitle}>
              <span
                style={{
                  color:"red",
                  fontWeight:"bold",
                  marginBottom:"10%"
                }}
              >
                {addShareTitleErr.ready ? addShareTitleErr.msg : ""}
              </span>
              <Row>
                <Col xs={4} lg={4} md={4}>
                  <Form.Control className="addShareTitle-input" type="text" placeholder="Add new ShareTitle" />
                </Col>
                <Col xs={1} lg={1} md={1}>
                  <Button variant="primary" className="addShareTitle-submit" type="submit">
                    Add
                  </Button>
                </Col>
              </Row>
            </Form>
          
          <Row style={{width:"100%"}}>
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
      <Navigate to="/login" />
    }
    </div>
);
}

export default Main;
