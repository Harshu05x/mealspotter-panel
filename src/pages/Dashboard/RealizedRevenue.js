import React from "react";

import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";

import ApexRadial from "./ApexRadial";

const RealizedRevenue = ({income}) => {
  return (
    <React.Fragment>
      {" "}
      <Card>
        <CardBody>
          <CardTitle className="mb-4">Realized Revenue</CardTitle>
          <Row>
            <Col sm="6">
              <p className="text-muted">This month</p>
              <h3>₹{income}</h3>
            </Col>
          </Row>  
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default RealizedRevenue;
