import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../components/Common/TableContainer';

//import components
import Breadcrumbs from '../../components/Common/Breadcrumb';
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";

import {
  changeOrderStatus,
  getPickUpPoints,
  getUpcomingOrders as onGetUpcoming,
  getPaymentHistory
} from "store/actions";


//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import {
  Col,
  Row,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Spinners from "components/Common/Spinner";
import { ToastContainer } from "react-toastify";
import OffCanvasComponent from "pages/Customers/OffCanvasComponent";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { formatDate } from "helpers/date_helper";

function PaymentHistory() {

  //meta title
  document.title = "Payment History";
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");
  const selectPaymentState = (state) => state.Payment;
  const PaymentProperties = createSelector(
    selectPaymentState,
    (Payment) => ({
      paymenstHistory: Payment.payments,
      totalRecords: Payment.totalRecords
    })
  );
  const { paymenstHistory, totalRecords } = useSelector(PaymentProperties);

  const [isLoading, setLoading] = useState(true);
  const [pageNumber, setPage] = useState(1);

  const [startDate, setStartDate] = useState(
    new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });

  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState({});

  const toggleCanvas = () => {
      setIsCanvasOpen(!isCanvasOpen);
  };

  const onOrderClick= (orderDetails) => {
      toggleCanvas();
      setSelectedOrder(orderDetails);
  }

  const [orderChecked, setOrderChecked] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [orderStatus, setOrderStatus] = useState("pending");

   useEffect(() => {
    dispatch(getPaymentHistory(pageNumber, limit, startDate, endDate, query));
  }, [dispatch, pageNumber,limit, startDate, endDate, query]);

  const columns = useMemo(
    () => [
      {
        Header: 'Order IDs',
        accessor: "orderId",
        width: "150px",
        style: {
            textAlign: "center",
            width: "10%",
            background: "#0000",
        },
        filterable: true,
        Cell: ({ row }) => {
            return <>{row?.original?.orders?.map(order=> order.orderId).join(",   ") ?? "Not Available"} </>;
        },
      },
      {
        Header: 'Payment ID',
        accessor: "razorpayPaymentId",
        width: "150px",
        style: {
            textAlign: "center",
            width: "10%",
            background: "#0000",
        },
        filterable: true,
        Cell: ({ row }) => {
            return <>{row?.original?.razorpayPaymentId ?? "Not Available"} </>;
        },
      },
      {
        Header: 'Razorpay Order ID',
        accessor: "razorpayOrderId",
        width: "150px",
        style: {
            textAlign: "center",
            width: "10%",
            background: "#0000",
        },
        filterable: true,
        Cell: ({ row }) => {
            return <>{row?.original?.razorpayOrderId ?? "Not Available"} </>;
        },
      },
      {
        Header: 'Amount',
        accessor: 'amount',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          return <>
            ₹ {cellProps?.row?.original?.amount || 0}
          </>;
        }
      },
      {
        Header: 'Created At',
        accessor: 'createdAt',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          return <>
            {formatDate(cellProps?.row?.original?.createdAt)}
          </>;
        }
      },
      {
        Header: 'Customer Name',
        accessor: 'name',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          return <>
            {cellProps?.row?.original?.customer?.fname?.charAt(0).toUpperCase() + cellProps?.row?.original?.customer?.fname?.slice(1) + " " + cellProps?.row?.original?.customer?.lname?.charAt(0).toUpperCase() + cellProps?.row?.original?.customer?.lname?.slice(1)}
          </>;
        }
      },
      {
        Header: 'Email ID',
        accessor: 'email',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          return <>
            {cellProps?.row?.original?.customer?.email}
          </>;
        }
      },
      {
        Header: 'Mobile',
        accessor: 'mobile',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          return <>
            {cellProps?.row?.original?.customer?.mobile}
          </>;
        }
      },
      {
        Header: 'Status',
        accessor: 'status',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          const status = cellProps?.row?.original?.status;
          return <>
            {
              status === "captured" ?
                <span className="badge bg-success p-2">Captured</span> :
              status === "created" ?
                <span className="badge bg-info p-2">Initiated</span> :
                <span className="badge bg-danger p-2">Failed</span>
            }
          </>;
        }
      },
    ],
    []
  );
  
  return (
    <React.Fragment>


      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Payment History" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>

                    <TableContainer
                      title="Payment History"
                      columns={columns}
                      data={paymenstHistory || []}
                      // isGlobalFilter={true}
                      isCustomGlobalFilter={true}
                      setQuery={setQuery}
                      isStartDate={true}
                      startDate={startDate}
                      setStartDate={setStartDate}
                      isEndDate={true}
                      endDate={endDate}
                      setEndDate={setEndDate}
                      handleOrderClicks={() => { }}
                      customPageSize={10}
                      isPagination={false}
                      filterable={false}
                      // csvExport={true}
                      // exportToCSVButtonClicked={exportToCSVButtonClicked}
                      iscustomPageSizeOptions={true}
                      setAllChecked={setAllChecked}
                      allChecked={allChecked}
                      setOrderChecked={setOrderChecked}
                      orderChecked={orderChecked}
                      // isCheckable={true}
                      setOrderStatus={setOrderStatus}
                      orderStatus={orderStatus}
                      tableClass="align-middle table-check"
                      theadClass="table-light"
                      pagination="pagination pagination-rounded justify-content-end mb-2"
                      isCustomPagination={true}
                      setPage={setPage}
                      pageNumber={pageNumber}
                      totals={totalRecords}
                      setLimit={setLimit}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
        </div>
      </div>
      <ToastContainer />
      <OffCanvasComponent
        isCanvasOpen={isCanvasOpen}
        toggleCanvas={toggleCanvas}
        selectedOrder={selectedOrder} 
      />
    </React.Fragment>
  );
}
PaymentHistory.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};


export default PaymentHistory;

