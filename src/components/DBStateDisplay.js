
function DBStateDisplay(prop) {
  return (
    <div className="DBStateDisplay">
      <h3>Database Status:</h3>
      {prop.dbstate ?
        <div>
          <span>{`[all: ${prop.dbstate.sharetitle_count}]`}</span>
          <span style={{color:"green"}}>{`[visited: ${prop.dbstate.sharetitle_visited_count}]`}</span>
          <span style={{color:"red"}}>{`[unvisited: ${prop.dbstate.sharetitle_unvisited_count}]`}</span>
        </div>
        :
        <div>
          <span>{"[all: - ]"}</span>
          <span style={{color:"green"}}>{"[visited: - ]"}</span>
          <span style={{color:"red"}}>{"[unvisited: - ]"}</span>
        </div>
      }
    </div>
  );
}

export default DBStateDisplay;