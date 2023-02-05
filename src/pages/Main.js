import React, { useEffect, useState } from 'react';
import axios from "axios";
import SearchBar from '../components/SearchBar'
import ShareTitleTable from '../components/ShareTitleTable';


function Main() {
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
  const [query, setQuery] = useState({page:0});
  const [payload, setPayload] = useState(0);
  
  useEffect(() => {
    async function initialFetch() {
      let response = await axios.get(`/api/query`);
      setPayload(response.data);
      setFinished(true);
      setReady(true);
    }
    initialFetch();
  }, []);
  
  async function handleSubmit(e) {
    e.preventDefault();
    
    setReady(false);
    setFinished(false);
    setPayload({})
    
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
    setQuery(_query);
    
    // request from backend
    let queryStr = new URLSearchParams(query).toString();
    try {
      let response = await axios.get(`/api/query?${queryStr}`);
      setPayload(response.data);
      setFinished(true);
      console.log(response.data);
    }
    catch (err) {
      console.log(err);
    }
    
    setReady(true);
  }
  
  async function handlePageMove(event) {
    
    setReady(false);
    setFinished(false);
    setPayload({})
    
    // change page by offset
    let pageOffset = parseInt(event.target.value);
    let _query = query;
    if (_query.page + pageOffset <= 0) {
      _query.page = 0
    }
    else {
      _query.page += pageOffset;
    }
    await setQuery(_query);
    console.log(pageOffset);
    console.log(query);
    
    // request from backend
    let queryStr = new URLSearchParams(query).toString();
    try {
      let response = await axios.get(`/api/query?${queryStr}`);
      setPayload(response.data);
      setFinished(true);
      console.log(response.data);
    }
    catch (err) {
      console.log(err);
    }
    
    setReady(true);
  }
  
  return (
    <div className="Main" style={{display:`${ready ? "block" : "none"}`}}>
      <div className="SearchForm">
        <h3>Search</h3>
        <form onSubmit={handleSubmit}>
          <SearchBar className="SearchBar" width={"80%"} height={"5%"} />
          <button type="submit">Submit</button>
        </form>
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
