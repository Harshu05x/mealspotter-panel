import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../components/Common/TableContainer';

//import components
import Breadcrumbs from '../../components/Common/Breadcrumb';
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";

import {
    getOngoingOrders,
    getPickUpPoints,
    cancelOrder as cancelOrderAction
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
import { ToastContainer, toast } from "react-toastify";
import OffCanvasComponent from "pages/Customers/OffCanvasComponent";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { filterOrders } from "./Upcoming";
import CancelOrderModal from "components/Common/CancelOrderModal";
import moment from "moment";
import { formatDate } from "helpers/date_helper";
import RefundOrderModal from "components/Common/RefundOrderModal";
import { post } from "helpers/api_helper";

function OngoingOrders() {

    //meta title
    document.title = "Master >> Ongoing";

    const dispatch = useDispatch();
    const selectOrderState = (state) => state.Order;
    const [week, setWeek] = useState(0);
    const [query, setQuery] = useState("");
    const [limit, setLimit] = useState(10);
    const [orders, setOrders] = useState([]);
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(() => {
      const start = new Date(startDate);
      const end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 7 days in milliseconds
      return end;
    });
    
    const OrderProperties = createSelector(
        selectOrderState,
        (Order) => ({
            ongoingOrders: Order.ongoingOrders,
            totalOrders: Order.totalOrders
        })
    );
    const { ongoingOrders, totalOrders } = useSelector(OrderProperties);

    const selectPickUpPointState = (state) => state.PickupPoint;
    const PickupPointProperties = createSelector(
        selectPickUpPointState,
        (PickupPoint) => ({
            pickUpPoints: PickupPoint.pickUpPoints
        })
    );
    const { pickUpPoints } = useSelector(PickupPointProperties);

    const [isLoading, setLoading] = useState(true)
    const [pageNumber, setPage] = useState(1);

    useEffect(() => {
        dispatch(getOngoingOrders(pageNumber, limit, startDate, endDate, query));
        dispatch(getPickUpPoints());
    }, [dispatch,pageNumber,limit, startDate,endDate, query]);


   
    const [pickUpType, setPickUpType] = useState("All");
    const [pickUpPoint,setpickUpPoint] = useState("All");
  
    useEffect(() => {
      setOrders(filterOrders(ongoingOrders, pickUpPoint, pickUpType));
    },[pickUpType, pickUpPoint, startDate, endDate]);

    const [isCanvasOpen, setIsCanvasOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});
  
    const toggleCanvas = () => {
        setIsCanvasOpen(!isCanvasOpen);
    };
  
    const onOrderClick= (orderDetails) => {
        toggleCanvas();
        setSelectedOrder(orderDetails);
    }

    const csvData = ongoingOrders.map((order) => {
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

    const [cancelOrderModal, setCancelOrderModal] = useState(false);
    const [reason,setReason] = useState("");
    const [orderId, setOrderId] = useState("");

    const onClickCancelOrder = async (id) => {
        setCancelOrderModal(true);
        setOrderId(id);
    }      

    const cancelOrder = () => {
      if(reason === "") {
        toast.error("Please enter reason to cancel order");
        return;
      }
      dispatch(cancelOrderAction(orderId, reason));
      dispatch(getOngoingOrders(pageNumber, limit, startDate, endDate, query));
      setReason("");
      setCancelOrderModal(false);
    }

    const [refundOrderModal, setRefundOrderModal] = useState(false);
    const [refundData, setRefundData] = useState({});
    const onRefundColseClick = () => {
      setRefundOrderModal(false);
      setOrderId("");
    }

    const refundOrder = async (data) => {
      try {
        const res = await post(`/orders/refund/${orderId}`, data);
        toast.success("Order refunded successfully");
        dispatch(getOngoingOrders(pageNumber, limit, startDate, endDate, query));
        setRefundOrderModal(false);
        setOrderId("");
      } catch (error) {
        console.log(error);
        toast.error(`${error.response.data.message || "Something went wrong"}`);
      }
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
                  <div className=" d-flex gap-2">
                      <Button
                          color="primary"
                          onClick={() => onOrderClick(row?.original)}
                      >
                          View
                      </Button>
                  </div>
                );
            }
          },
          {
            // Column for the cancel order button
            Header: "Refund / Cancel Order",
            accessor: "cancelOrder",
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
                    color="danger"
                    onClick={() => {
                      setOrderId(row?.original?._id);
                      setRefundOrderModal(true);
                      setRefundData({
                        orderId: row?.original?.orderId,
                        customerName: row?.original?.customer?.fname + " " + row?.original?.customer?.lname,
                        toyName: row?.original?.toy?.name,
                      })
                    }}
                  >
                    Cancel
                  </Button>
                );
            }
          }
        ],
        []
      );

    return (
        <React.Fragment>

        <CancelOrderModal
          show={cancelOrderModal}
          onCancelClick={() => cancelOrder()}
          onCloseClick={() => setCancelOrderModal(false)}
          setReason={setReason}
        />

        <RefundOrderModal 
          show={refundOrderModal}
          onCloseClick={onRefundColseClick}
          onRefundClick={refundOrder}
          data={refundData}
        />

        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs title="Home" breadcrumbItem="Ongoing-Orders" />
              <Row>
                <Col xs="12">
                  <Card>
                    <CardBody>

                      <TableContainer
                        title="Age Group"
                        columns={columns}
                        data={week == 0 && pickUpType === "All" ? ongoingOrders : orders}
                        // isGlobalFilter={true}
                        isCustomGlobalFilter={true}
                        setQuery={setQuery}
                        // isAddOptions={true}
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
OngoingOrders.propTypes = {
    preGlobalFilteredRows: PropTypes.any,

};


export default OngoingOrders;