import { useEffect, useState } from 'react';

// bootstrap components
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { ClockIcon } from './Icons';

function DBStateDisplay(prop) {
  
  const [pressingButton, setPressingButton] = useState(false);
  
  useEffect(() => {
    if (prop.dbstate) {
      prop.dbstate.sharetitle_visited_count_perc = Math.round(
        prop.dbstate.sharetitle_visited_count / prop.dbstate.sharetitle_count * 10000
      ) / 100;
      prop.dbstate.sharetitle_unvisited_count_perc = Math.round(
        prop.dbstate.sharetitle_unvisited_count / prop.dbstate.sharetitle_count * 10000
      ) / 100;
    }
    let elem = document.querySelector('.DBStateDisplay');
    elem.addEventListener('mousedown', () => {
      setPressingButton(true);
    });
    elem.addEventListener('mouseup', () => {
      setPressingButton(false);
    });
  }, [])
  
  function parseTimeStamp(timestamp) {
    let time = new Date(parseInt(timestamp)*1000);
    let year = time.getFullYear().toString().padStart(4, '0');
    let month = (time.getMonth()+1).toString().padStart(2, '0');
    let date = time.getDate().toString().padStart(2, '0');
    let hour = time.getHours().toString().padStart(2, '0');
    let minute = time.getMinutes().toString().padStart(2, '0');
    let second = time.getSeconds().toString().padStart(2, '0');
    let timeStr = `${year}-${month}-${date} ${hour}:${minute}:${second}`;
    return timeStr;
  }
  
  return (
    <Container fluid className="DBStateDisplay">
      <Row className="py-1">
        <Col style={{paddingRight:"0"}}>
          <OverlayTrigger 
            placement={"bottom"}
            overlay={
              <Tooltip id={`tooltip`}>
                {`Last Database Update Time:\n${prop.dbstate ? parseTimeStamp(prop.dbstate.last_update_time) : "-"}`}
              </Tooltip>
            }
          >
            <span>
              <Button
                disabled
                id="database-status"
                size="sm"
                variant="info"
              >
                <ClockIcon/>
              </Button>
            </span>
          </OverlayTrigger>
        </Col>
        <Col style={{paddingLeft:"0",paddingRight:"0"}}>
          <strong style={{whiteSpace:"nowrap",overflow:"hidden"}}>Database Status</strong>
        </Col>
      </Row>
      <Row>
        <Col md={{span:4}}>
        <OverlayTrigger 
          placement={"bottom"}
          overlay={
            <Tooltip id={`tooltip`}>
              All ShareTitles
            </Tooltip>
          }
        >
          <span>
            <Button
              disabled
              id="all-sharetitles"
              size="sm"
              variant="secondary"
            >
              {prop.dbstate ? (pressingButton ? `100.00%` : prop.dbstate.sharetitle_count) : "-"}
            </Button>
          </span>
        </OverlayTrigger>
        </Col>
        <Col md={{span:4}}>
        <OverlayTrigger 
          placement={"bottom"}
          overlay={
            <Tooltip id={`tooltip`}>
              Visited ShareTitles
            </Tooltip>
          }
        >
          <span>
            <Button
              disabled
              id="visited-sharetitles"
              size="sm"
              variant="success"
            >
              {prop.dbstate ? (pressingButton ? `${prop.dbstate.sharetitle_visited_count_perc}%` : prop.dbstate.sharetitle_visited_count) : "-"}
            </Button>
          </span>
        </OverlayTrigger>
        </Col>
        <Col md={{span:4}}>
        <OverlayTrigger 
          placement={"bottom"}
          overlay={
            <Tooltip id={`tooltip`}>
              Unvisited ShareTitles
            </Tooltip>
          }
        >
          <span>
            <Button
              disabled
              id="unvisited-sharetitles"
              size="sm"
              variant="danger"
            >
              {prop.dbstate ? (pressingButton ? `${prop.dbstate.sharetitle_unvisited_count_perc}%` : prop.dbstate.sharetitle_unvisited_count) : "-"}
            </Button>
          </span>
        </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
}

export default DBStateDisplay;