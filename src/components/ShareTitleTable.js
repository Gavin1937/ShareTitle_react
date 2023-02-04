
function ShareTitleTable(prop) {
  return (
    <div className="ShareTitleTable">
      {
        prop.payload ?
        <div className="table">
          <h3>Table Size: {prop.payload.sharetitles.length}</h3>
          <table>
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
              {prop.payload.ok ? Array.from(
                prop.payload.sharetitles,
                (data) => {
                  let linkStr = `${data.domain} ${data.parent_child == 0 ? 'parent' : 'child'}`;
                  let visitStr = `${data.is_visited == 0 ? 'unvisited' : 'visited'}`;
                  let visitColor = `${data.is_visited == 0 ? 'red' : 'green'}`;
                  let time = new Date(parseInt(data.time));
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
                      <td style={{color:visitColor}}>{visitStr}</td>
                      <td>{timeStr}</td>
                      <td><button>delete</button></td>
                    </tr>
                  );
                }
              ) : null}
            </tbody>
          </table>
        </div>
        :
        <p>waiting...</p>
      }
    </div>
  );
}

export default ShareTitleTable;
