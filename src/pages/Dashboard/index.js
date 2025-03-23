import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  CardBody,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import { Link, NavLink } from "react-router-dom";

import classNames from "classnames";

//import Charts
import StackedColumnChart from "./StackedColumnChart";

import modalimage1 from "../../assets/images/product/img-7.png";
import modalimage2 from "../../assets/images/product/img-4.png";

// Pages Components
import MonthlyEarning from "./MonthlyEarning";
import TopProducts from "./TopProducts";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import { getDashboardCounts } from "store/actions";
import RealizedRevenue from "./RealizedRevenue";
import Spinners from "components/Common/Spinner";
// import { co } from "@fullcalendar/core/internal-common";

const Dashboard = props => {
  const dispatch = useDispatch();
  const [modal, setmodal] = useState(false);

  const selectDashboardState = (state) => state.Dashboard;
  const DashboardProperties = createSelector(
    selectDashboardState,
    (dashboard) => ({
      dashboardCounts: dashboard.dashboardCounts,
      loading: dashboard.loading,
    })
  );

  const { dashboardCounts, loading } = useSelector(DashboardProperties);

  // Fetch dashboard actual card counts data when the component mounts...
  useEffect(() => {
    dispatch(getDashboardCounts());
  }, [dispatch]);

  // Select the counts data from the Redux state
  const counts = useSelector((state) => state.Dashboard.dashboardCounts);

  const reports = [
    { id: "1", title: "Upcoming-Orders", iconClass: "bx-copy-alt", description: `${dashboardCounts?.upcomingOrderCount ?? 0}`, path: "/upcoming-orders" },
    { id: "2", title: "Due for Returns", iconClass: "bx-archive-in", description: `${dashboardCounts?.dueReturnsCount ?? 0}`, path: "/due-returns" },
    {
      id: "3", title: "New Registrations",
      iconClass: "bx-purchase-tag-alt",
      description: `${dashboardCounts?.newRegisteredCustomers ?? 0}`, path: "/new-registration",
    },
    {
      id: "4", title: "Customers who Ordered",
      iconClass: "bx-purchase-tag-alt",
      description: `${dashboardCounts?.customersWhoOrdered ?? 0}`, path: "/customers",
    },
  ];

  //meta title
  document.title = "Dashboard | The ToyRent Company";

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumbs
            title={props.t("Dashboards")}
            breadcrumbItem={props.t("Dashboard")}
          />

          {
            loading ? <Spinners /> : 
            <>
              <Row>
                <Col xl="4">
                  <MonthlyEarning income={dashboardCounts?.monthlyIncome ?? 0}/>
                  <RealizedRevenue income={dashboardCounts?.realizedIncome ?? 0}/>
                </Col>
                <Col xl="8">
                  <Row>
                    {/* Reports Render */}
                    {reports.map((report, key) => (
                      <Col md="6" key={"_col_" + key}>
                        <Card className="mini-stats-wid">
                          <CardBody>
                            <NavLink to={report.path} className="text-muted float">
                              <div className="d-flex py-2 mx-4">
                                <div className="flex-grow-1">
                                  <p className="text-muted fw-medium">
                                    {report.title}
                                  </p>
                                  <h4 className="mb-0">{report.description}</h4>
                                </div>
                                <div className="avatar-sm rounded-circle bg-primary align-self-center mini-stat-icon">
                                  <span className="avatar-title rounded-circle bg-primary">
                                    <i
                                      className={
                                        "bx " + report.iconClass + " font-size-24"
                                      }
                                    ></i>
                                  </span>
                                </div>
                              </div>
                            </NavLink>
                          </CardBody>
                        </Card>
                      </Col>
                    ))}
                  </Row>

                </Col>
              </Row>

              <Row>
                <Col xl="4">
                  <TopProducts />
                </Col>
              </Row>
            </>
          }


        </Container>
      </div>

      {/* subscribe ModalHeader */}

      <Modal
        isOpen={modal}
        role="dialog"
        autoFocus={true}
        centered={true}
        className="exampleModal"
        tabIndex="-1"
        toggle={() => {
          setmodal(!modal);
        }}
      >
        <div>
          <ModalHeader
            toggle={() => {
              setmodal(!modal);
            }}
          >
            Order Details
          </ModalHeader>
          <ModalBody>
            <p className="mb-2">
              Product id: <span className="text-primary">#SK2540</span>
            </p>
            <p className="mb-4">
              Billing Name: <span className="text-primary">Neal Matthews</span>
            </p>

            <div className="table-responsive">
              <Table className="table table-centered table-nowrap">
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage1} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Wireless Headphone (Black)
                        </h5>
                        <p className="text-muted mb-0">$ 225 x 1</p>
                      </div>
                    </td>
                    <td>$ 255</td>
                  </tr>
                  <tr>
                    <th scope="row">
                      <div>
                        <img src={modalimage2} alt="" className="avatar-sm" />
                      </div>
                    </th>
                    <td>
                      <div>
                        <h5 className="text-truncate font-size-14">
                          Hoodie (Blue)
                        </h5>
                        <p className="text-muted mb-0">$ 145 x 1</p>
                      </div>
                    </td>
                    <td>$ 145</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Sub Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Shipping:</h6>
                    </td>
                    <td>Free</td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <h6 className="m-0 text-end">Total:</h6>
                    </td>
                    <td>$ 400</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="secondary"
              onClick={() => {
                setmodal(!modal);
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </React.Fragment>
  );
};

Dashboard.propTypes = {
  t: PropTypes.any,
  chartsData: PropTypes.any,
  onGetChartsData: PropTypes.func,
};

export default withTranslation()(Dashboard);
