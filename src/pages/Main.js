import React, { useEffect, useState } from 'react';
import axios from "axios";
import SearchBar from '../components/SearchBar'
import ShareTitleTable from '../components/ShareTitleTable';
import DBStateDisplay from '../components/DBStateDisplay';


function Main() {
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [dbstate, setDBState] = useState(0);
  const [query, setQuery] = useState({page:0, order:"DESC", is_visited:"unvisited"});
  const [payload, setPayload] = useState(0);
  
  // fetch before first render
  useEffect(() => {
    updateDBState();
  }, []);
  
  // update table every time updating state query
  useEffect(() => {
    //! debug message
    console.log("updating table...", query);
    updateTable();
  }, [query]);
  
  
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
  
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    // parse search value
    let searchValue = document.querySelector(".SearchBar > textarea").value;
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
    
    await setQuery(_query);
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
    let pageOffset = parseInt(event.target.value);
    let _query = query;
    if (_query.page + pageOffset <= 0) {
      await setQuery(prev => {
        let obj = JSON.parse(JSON.stringify(prev));
        obj.page = 0;
        return obj;
      });
    }
    else {
      await setQuery(prev => {
        let obj = JSON.parse(JSON.stringify(prev));
        obj.page += pageOffset;
        return obj;
      });
    }
  }
  
  return (
    <div className="Main" style={{display:`${ready ? "block" : "none"}`}}>
      <div className="DBState">
        <DBStateDisplay dbstate={dbstate} />
        <button type="button" onClick={updateDBState}>Refresh</button>
      </div>
      <div className="SearchForm">
        <h3>Search</h3>
        <form onSubmit={handleSubmit}>
          <SearchBar className="SearchBar" width={"80%"} height={"5%"} />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="fileter">
        <p>filter</p>
        <select defaultValue="unvisited" onChange={handleFilterSelection}>
          <option key="1" value="unvisited">unvisited</option>
          <option key="2" value="visited">visited</option>
          <option key="3" value="all">all</option>
        </select>
      </div>
      <div className="PageMover-1">
        <button className="prev" type="button" value="-1" onClick={handlePageMove}>
          Prev
        </button>
        <p>Page: {query.page+1}</p>
        <button className="next" type="button" value="1" onClick={handlePageMove}>
          Next
        </button>
      </div>
      {ready && finished && payload ? <ShareTitleTable payload={payload} /> : null}
      <div className="PageMover-2">
        <button className="prev" type="button" value="-1" onClick={handlePageMove}>
          Prev
        </button>
        <p>Page: {query.page+1}</p>
        <button className="next" type="button" value="1" onClick={handlePageMove}>
          Next
        </button>
      </div>
    </div>
  );
}

export default Main;
