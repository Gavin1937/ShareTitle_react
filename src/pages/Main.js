import React, { useEffect, useState } from 'react';
import axios from "axios";
import SearchBar from '../components/SearchBar'
import ShareTitleTable from '../components/ShareTitleTable';


function Main() {
  const [ready, setReady] = useState(false);
  const [finished, setFinished] = useState(false);
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
    let query = {}
    // contains special search command
    if (searchValue[0] == "#") {
      let list = await Array.from(
        searchValue.substr(1).split("#"),
        (i) => (i.trim().split(":"))
      );
      for (let l of list) {
        query[l[0]] = l[1]
      }
    }
    // no special search command, assume searching title
    else if (searchValue.length > 0) {
      query["title"] = searchValue.trim();
    }
    
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
    <div className="Main">
      <div className="SearchForm">
        <form style={{display:`${ready ? "block" : "none"}`}} onSubmit={handleSubmit}>
          <SearchBar className="SearchBar" width={"80%"} height={"5%"} />
          <button type="submit">Submit</button>
        </form>
      </div>
      {ready && finished && payload ? <ShareTitleTable payload={payload} /> : null}
    </div>
  );
}

export default Main;
