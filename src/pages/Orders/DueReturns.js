import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../components/Common/TableContainer';

//import components
import Breadcrumbs from '../../components/Common/Breadcrumb';
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import { mkConfig, generateCsv, download } from "export-to-csv";
import {
    getDueReturns,
    getPickUpPoints,
    getUpcomingOrders as onGetUpcoming,
    setDueReturnOrdersStartDate,
    setDueReturnOrdersEndDate
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
} from "reactstrap";
import Spinners from "components/Common/Spinner";
import { ToastContainer } from "react-toastify";
import OffCanvasComponent from "pages/Customers/OffCanvasComponent";
import { filterOrders } from "./Upcoming";
import moment from "moment";
import { formatDate } from "helpers/date_helper";

function DueReturns() {

    //meta title
    document.title = "Master >> Returns";
    const dispatch = useDispatch();
    const [limit, setLimit] = useState(10);
    const [query, setQuery] = useState("");
    const [week, setWeek] = useState(0);
    const [orders, setOrders] = useState([]);

    const selectOrderState = (state) => state.Order;
    const OrderProperties = createSelector(
        selectOrderState,
        (Order) => ({
            duereturnOrders: Order.duereturnOrders,
            totalOrders: Order.totalOrders
        })
    );

    const selectDateState = (state) => state.OrderDates;
    const DateProperties = createSelector(
        selectDateState,
        (Dates) => ({
            _startDate: Dates.dueReturnOrdersStartDate,
            _endDate: Dates.dueReturnOrdersEndDate
        })
    );

    const selectPickUpPointState = (state) => state.PickupPoint;
    const PickupPointProperties = createSelector(
        selectPickUpPointState,
        (PickupPoint) => ({
            pickUpPoints: PickupPoint.pickUpPoints
        })
    );
    const { pickUpPoints } = useSelector(PickupPointProperties);

    const { duereturnOrders, totalOrders } = useSelector(OrderProperties);

    const { _startDate, _endDate } = useSelector(DateProperties);

    const [startDate, setStartDate] = useState(_startDate);
    const [endDate, setEndDate] = useState(_endDate);

    const [isLoading, setLoading] = useState(true);


    const [pageNumber, setPage] = useState(1);
    useEffect(() => {
        dispatch(getDueReturns(pageNumber, limit, startDate, endDate, query));
        dispatch(getPickUpPoints());
    }, [dispatch,pageNumber,limit,startDate,endDate, query]);

   
    const [pickUpType, setPickUpType] = useState("All");
    const [pickUpPoint,setpickUpPoint] = useState("All");
  
    useEffect(() => {
      setOrders(filterOrders(duereturnOrders, pickUpPoint, pickUpType));
    },[pickUpType, pickUpPoint, startDate, endDate])

    const [isCanvasOpen, setIsCanvasOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});
  
    const toggleCanvas = () => {
        setIsCanvasOpen(!isCanvasOpen);
    };
  
    const onOrderClick= (orderDetails) => {
        toggleCanvas();
        setSelectedOrder(orderDetails);
    }

    const csvData = duereturnOrders.map((order) => {
      return {
        orderId: order?.orderId,
        customerName: order?.customer?.fname + " " + order?.customer?.lname,
        mobile: order?.customer?.mobile,
        toy_pic: order?.toy?.defaultPhoto,
        toy_name: order?.toy?.name,
        city: order?.customer?.city?.name,
        zone: order?.customer?.zone?.name,
        pincode: order?.customer?.pincode,
        orderDate: formatDate(order?.createdAt),
        deliveryDate: formatDate(order?.deliveryDate),
        returnDate: formatDate(order?.returnDate),
        orderTotal: order?.orderTotal,
        deliverCharge: order?.deliveryFee,
        duration: moment(order?.returnDate).diff(order?.deliveryDate, 'days') + " days",
        paid: order?.paid,
        selfPickup: order?.selfPickup ? "Yes" : "No",
      };
    });
  
    const csvConfig = mkConfig({ useKeysAsHeaders: true });
  
    const exportToCSVButtonClicked = () => {
      const csv = generateCsv(csvConfig)(csvData);
      download(csvConfig)(csv)  
    }

    const columns = useMemo(
        () => [
          {
            Header: 'Order ID',
            accessor: "orderId",
            width: "150px",
            style: {
                textAlign: "center",
                width: "10%",
                background: "#0000",
            },
            filterable: true,
            Cell: ({ row }) => {
                return <>{row?.original?.orderId ?? " "} </>;
            },
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
            Header: 'Toy Pic',
            accessor: 'toy_pic',
            width: '150px',
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                <img src={cellProps?.row?.original?.toy?.defaultPhoto} alt="toyImage" className="avatar-sm"/>          </>;
            }
          },
          {
            Header: 'Toy Name',
            accessor: 'toy_name',
            width: '150px',
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                {cellProps?.row?.original?.toy?.name}
              </>;
            }
          },
          {
            Header: 'City',
            accessor: 'city',
            width: '150px',
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                {cellProps?.row?.original?.customer?.city?.name}
              </>;
            }
          },
          {
            Header: 'Zone',
            accessor: 'zone',
            width: '150px',
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                {cellProps?.row?.original?.customer?.zone?.name}
              </>;
            }
          },
          {
            Header: 'Pin Code',
            accessor: 'pincode',
            width: '150px',
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                {cellProps?.row?.original?.customer?.pincode}
              </>;
            }
          },
          {
            Header: 'Delivery Date',
            accessor: 'deliveryDate',
            width: '150px',
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                {formatDate(cellProps?.row?.original?.deliveryDate)}
              </>;
            }
          },
          {
            Header: 'Return Date',
            accessor: 'returnDate',
            width: '150px',
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                {formatDate(cellProps?.row?.original?.returnDate)}
              </>;
            }
          },
          {
            Header: "Action",
            accessor: "action",
            width: "150px",
            style: {
                textAlign: "center",
                width: "10%",
                background: "#0000",
            },
            filterable: true,
            Cell: ({ row }) => {
                
                return (
                    <Button
                        color="primary"
                        onClick={() => onOrderClick(row?.original)}
                    >
                        View
                    </Button>
                );
            }
          }
        ],
        []
      );

    

    return (
        <React.Fragment>


        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs title="Home" breadcrumbItem="Due Return-Orders" />
              <Row>
                <Col xs="12">
                  <Card>
                    <CardBody>

                      <TableContainer
                        title="Age Group"
                        columns={columns}
                        data={week == 0 && pickUpType === "All" ? duereturnOrders : orders}
                        // isGlobalFilter={true}
                        isCustomGlobalFilter={true}
                        setQuery={setQuery}
                        // isAddOptions={true}
                        isStartDate={true}
                        startDate={startDate}
                        setStartDate={(date) => {
                          setStartDate(date);
                          dispatch(setDueReturnOrdersStartDate(date));
                        }}
                        isEndDate={true}
                        endDate={endDate}
                        setEndDate={(date) => {
                          setEndDate(date);
                          dispatch(setDueReturnOrdersEndDate(date));
                        }}
                        DateFilterTitle={"Return Date"}
                        handleOrderClicks={() => { }}
                        customPageSize={10}
                        isPagination={false}
                        filterable={false}
                        csvExport={true}
                        exportToCSVButtonClicked={exportToCSVButtonClicked}
                        isPickUpPointOptions={true}
                        pickUpType={pickUpType}
                        setPickUpType={setPickUpType}
                        pickUpPoints={pickUpPoints}
                        setpickUpPoint={setpickUpPoint}
                        pickUpPoint={pickUpPoint}
                        iscustomPageSizeOptions={true}
                        tableClass="align-middle table-check"
                        theadClass="table-light"
                        pagination="pagination pagination-rounded justify-content-end mb-2"
                        isCustomPagination={true}
                        setPage={setPage}
                        pageNumber={pageNumber}
                        totals={totalOrders}
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
DueReturns.propTypes = {
    preGlobalFilteredRows: PropTypes.any,

};


export default DueReturns;