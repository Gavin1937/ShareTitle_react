import axios from "axios";
import React, { useState } from "react";
import "../css/ShareTitleTable.css"
import { DeleteIcon } from "./Icons";

// bootstrap components
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';


function ShareTitleTable(prop) {
  
  const [payload, setPayload] = useState(prop.payload);
  const [selectedRow, setSelectedRow] = useState(null);
  
  async function handleDelete(event) {
    let id = parseInt(event.target.parentNode.parentNode.id);
    
    // request backend to delete
    try {
      let response = await axios.delete(`/api/sharetitle/${id}`);
      let deleteResp = response.data;
      
      // delete row in table
      if (deleteResp.ok) {
        let row = document.querySelector(`.table tbody tr[id="${id}"]`);
        row.remove();
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  
  async function handleToggleIsVisited(event) {
    let id = parseInt(event.target.parentNode.parentNode.id);
    
    // request backend to toggle
    try {
      let row = document.querySelector(`.table tbody tr[id="${id}"]`);
      let cell = row.childNodes[3];
      // first time selecting cell
      if (selectedRow === null) {
        row.setAttribute("selected", "1");
        cell.style.backgroundColor = "#DBDBDB";
        await setSelectedRow(id);
      }
      // already have selected cells, same as current
      // actually update
      else if (selectedRow == id) {
        let lastSelected = document.querySelector(`.table tbody tr[id="${selectedRow}"]`);
        lastSelected.removeAttribute("selected");
        lastSelected.childNodes[3].style.backgroundColor = "white";
        await setSelectedRow(null);
        
        // set temporary value to the row & disable buttons
        let visitStr = '-';
        let visitColor = 'black';
        let timeStr = '-';
        row.childNodes[3].childNodes[0].textContent = visitStr;
        row.childNodes[3].childNodes[0].style.color = visitColor;
        row.childNodes[3].childNodes[0].setAttribute('disabled', '');
        row.childNodes[4].textContent = timeStr;
        row.childNodes[5].childNodes[0].setAttribute('disabled', '');
        
        // do put request
        let response = await axios.put(`/api/sharetitle/${id}`);
        let _payload = response.data;
        
        // update the row & re-enable buttons
        visitStr = `${_payload.is_visited == 0 ? 'unvisited' : 'visited'}`;
        visitColor = `${_payload.is_visited == 0 ? 'red' : 'green'}`;
        let time = new Date(parseInt(_payload.time)*1000);
        let year = time.getFullYear().toString().padStart(4, '0');
        let month = (time.getMonth()+1).toString().padStart(2, '0');
        let date = time.getDate().toString().padStart(2, '0');
        let hour = time.getHours().toString().padStart(2, '0');
        let minute = time.getMinutes().toString().padStart(2, '0');
        let second = time.getSeconds().toString().padStart(2, '0');
        timeStr = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
        row.childNodes[3].childNodes[0].textContent = visitStr;
        row.childNodes[3].childNodes[0].style.color = visitColor;
        row.childNodes[3].childNodes[0].removeAttribute('disabled');
        row.childNodes[4].textContent = timeStr;
        row.childNodes[5].childNodes[0].removeAttribute('disabled');
      }
      // already have selected cells, different then current
      else {
        row.setAttribute("selected", "1");
        cell.style.backgroundColor = "#DBDBDB";
        let lastSelected = document.querySelector(`.table tbody tr[id="${selectedRow}"]`);
        lastSelected.removeAttribute("selected");
        lastSelected.childNodes[3].style.backgroundColor = "white";
        await setSelectedRow(id);
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  
  return (
    <div className="ShareTitleTable">
      {
        payload ?
        <div className="table">
          <h3>ShareTitle Table (Size: {payload.sharetitles.length})</h3>
          <Table striped bordered responsive hover size="sm">
            <thead>
              <tr>
                <th>Id</th>
                <th>Title</th>
                <th>Link</th>
                <th>IsVisited</th>
                <th>Time</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {payload.ok ? Array.from(
                payload.sharetitles,
                (data) => {
                  let linkStr = `${data.domain} ${data.parent_child == 0 ? 'parent' : 'child'}`;
                  let visitStr = `${data.is_visited == 0 ? 'unvisited' : 'visited'}`;
                  let visitColor = `${data.is_visited == 0 ? 'red' : 'green'}`;
                  let time = new Date(parseInt(data.time)*1000);
                  let year = time.getFullYear().toString().padStart(4, '0');
                  let month = time.getMonth().toString().padStart(2, '0');
                  let date = time.getDate().toString().padStart(2, '0');
                  let hour = time.getHours().toString().padStart(2, '0');
                  let minute = time.getMinutes().toString().padStart(2, '0');
                  let second = time.getSeconds().toString().padStart(2, '0');
                  let timeStr = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
                  return (
                    <tr key={data.id} id={data.id}>
                      <td>{data.id}</td>
                      <td>{data.title}</td>
                      <td><a href={data.url}>{linkStr}</a></td>
                      <td>
                        <button
                          type="button"
                          className="visitStateBtn"
                          onClick={handleToggleIsVisited}
                          style={{color:visitColor}}
                        >
                          {visitStr}
                        </button>
                      </td>
                      <td>{timeStr}</td>
                      <td>
                        <Button
                          type="button"
                          variant="danger"
                          onClick={handleDelete}
                        >
                          <DeleteIcon/>
                        </Button>
                      </td>
                    </tr>
                  );
                }
              ) : unll}
            </tbody>
          </Table>
        </div>
        :
        <p>waiting...</p>
      }
    </div>
  );
}

export default ShareTitleTable;
