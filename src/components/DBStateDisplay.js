// bootstrap components
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function DBStateDisplay(prop) {
  return (
    <Container fluid className="DBStateDisplay">
      <strong>Database Status:</strong>
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
            <Button disabled size="sm" variant="secondary">
              {prop.dbstate ? prop.dbstate.sharetitle_count : "-"}
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
            <Button disabled size="sm" variant="success">
              {prop.dbstate ? prop.dbstate.sharetitle_visited_count : "-"}
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
            <Button disabled size="sm" variant="danger">
              {prop.dbstate ? prop.dbstate.sharetitle_unvisited_count : "-"}
            </Button>
          </span>
        </OverlayTrigger>
        </Col>
      </Row>
    </Container>
  );
}

export default DBStateDisplay;