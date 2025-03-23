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
  cancelOrder as cancelOrderAction,
  getToys as onGetToys,
  setUpcomingOrdersStartDate,
  setUpcomingOrdersEndDate
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
  UncontrolledTooltip,
} from "reactstrap";
import Spinners from "components/Common/Spinner";
import { ToastContainer, toast } from "react-toastify";
import OffCanvasComponent from "pages/Customers/OffCanvasComponent";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { formatDate, formatDateWithDay } from "helpers/date_helper";
import moment from "moment";
import CancelOrderModal from "components/Common/CancelOrderModal";
import { CANCEL_ORDER_API } from "helpers/url_helper";
import { get, post } from "helpers/api_helper";
import RefundOrderModal from "components/Common/RefundOrderModal";
import EditOrderModal from "./EditOrder";

function Upcoming() {

  //meta title
  document.title = "Master >> Upcoming";
  const dispatch = useDispatch();
  const [limit, setLimit] = useState(10);
  const [query, setQuery] = useState("");
  const selectOrderState = (state) => state.Order;
  const OrderProperties = createSelector(
    selectOrderState,
    (Order) => ({
      upcomingOrders: Order.upcomingOrders,
      totalOrders: Order.totalOrders
    })
  );
  const { upcomingOrders, totalOrders } = useSelector(OrderProperties);

  const selectDateState = (state) => state.OrderDates;
  const DateProperties = createSelector(
      selectDateState,
      (Dates) => ({
          _startDate: Dates.upcomingOrdersStartDate,
          _endDate: Dates.upcomingOrdersEndDate
      })
  );

  const { _startDate, _endDate } = useSelector(DateProperties);

  const selectPickUpPointState = (state) => state.PickupPoint;
  const PickupPointProperties = createSelector(
      selectPickUpPointState,
      (PickupPoint) => ({
          pickUpPoints: PickupPoint.pickUpPoints
      })
  );
  const { pickUpPoints } = useSelector(PickupPointProperties);

  const [isLoading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [pageNumber, setPage] = useState(1);

  const [startDate, setStartDate] = useState(_startDate);
  const [endDate, setEndDate] = useState(_endDate);

  useEffect(() => {
    dispatch(onGetUpcoming(pageNumber,limit, startDate, endDate, query));
    dispatch(getPickUpPoints());
  }, [dispatch,startDate,limit, endDate, pageNumber, query]);

  
  const [pickUpType, setPickUpType] = useState("All");
  const [pickUpPoint,setpickUpPoint] = useState("All");

  useEffect(() => {
    setOrders(filterOrders(upcomingOrders, pickUpPoint, pickUpType));
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

  const csvData = upcomingOrders.map((order) => {
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
  const [reason, setReason] = useState("");
  const [orderId, setOrderId] = useState("");

  const onClickCancelOrder = async (id) => {
    setCancelOrderModal(true);
    setOrderId(id);
    console.log(orderId);
  } 

  const cancelOrder = async () => {
    try {
      if(reason === "") {
        toast.error("Please enter reason to cancel order");
        return;
      }
        const res = await post(CANCEL_ORDER_API, {orderId, reason});
        toast.success("Order Cancelled Successfully");
        dispatch(onGetUpcoming(pageNumber, limit, startDate, endDate, query));
        setReason("");
        setCancelOrderModal(false);
    } catch (error) {
         let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : (error?.response?.data?.message || "Something went wrong");
        toast.error(errorMessage);
    }
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
      dispatch(onGetUpcoming(pageNumber, limit, startDate, endDate, query));
      setRefundOrderModal(false);
      setOrderId("");
    } catch (error) {
      console.log(error);
      toast.error(`${error.response.data.message || "Something went wrong"}`);
    }
  }

  const [orderChecked, setOrderChecked] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [orderStatus, setOrderStatus] = useState("pending");

  // Edit Order Functionality

  const [editOrderModal, setEditOrderModal] = useState(false);
  const [pickupPointSelected, setPickupPointSelected] = useState(false);
  const [pickupPoints, setPickupPoints] = useState([]);
  const [pickupPoint, setPickupPoint] = useState({
    _id: "",
    storeName: "",
    city: "",
    status: false
  });
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availableDates, setAvailableDates] = useState({});
  const [deliveryDate, setDeliveryDate] = useState("");
  const [duration, setDuration] = useState(0);
  const [selectedToy, setSelectedToy] = useState({});
  const [toyError, setToyError] = useState("");


  // Fetch Toys
  const selectToyState = (state) => state.Toy;
  const ToyProperties = createSelector(
    selectToyState,
    (Toy) => ({
      toys: Toy.toys,
    })
  );
  const { toys } = useSelector(ToyProperties);
  useEffect(() => {
    dispatch(onGetToys(1, 100, "", "all", "all", "all"));
  }, [dispatch]);

  // Fetch PickUp Points
  const fetchPickUpPoints = async () => {
    try {
      const res = await get(`orders/pickup-points/${selectedOrder?.customer?._id}`);
      setPickupPoints(res?.pickUpPoints);
    } catch (error) {
      console.log("Error in fetching pick up points", error);
    }
  }

  // Get Availibility Dates
  const getAvailibility = async (deliveryDate, duration, orderId, toyId, pickupPointSelected) => {
    setAvailabilityLoading(true);
    setToyError("")
    try {
      let _deliveryDate = deliveryDate ? new Date(deliveryDate).toISOString() : selectedOrder?.deliveryDate;
      const res = await post(`orders/check-toy-availability/${toyId}`, {orderId, deliveryDate: _deliveryDate, duration, selfPickup: pickupPointSelected});
      console.log(res);
      setAvailableDates(res?.availability);
      setDeliveryDate(moment(deliveryDate).format("YYYY-MM-DD"));
    } catch (error) {
      setAvailableDates(error?.response?.data?.availability);
      console.log("Error in getting availibility", error);
      setDeliveryDate("");
      let message = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.message || "Error in getting availibility";
      setToyError(message);
    }
    setAvailabilityLoading(false);
  }

  useEffect(() => {
    if(selectedToy?._id){
      getAvailibility(deliveryDate, duration, selectedOrder?._id, selectedToy?._id, pickupPointSelected);
    }
  }, [selectedToy, selectedOrder, pickupPointSelected]);

  useEffect(() => {
    if(selectedOrder?.customer?._id !== undefined){
      fetchPickUpPoints();
    }
  }, [selectedOrder?.customer?._id]);

  // Save Edited Order
  const saveOrder = async () => {
    try{
      if(!selectedToy?._id){
        toast.error("Please select a toy");
        return;
      }
      if(!deliveryDate){
        toast.error("Please select a delivery date");
        return;
      }
      // if(moment(selectedOrder.deliveryDate).format('YYYY-MM-DD') !== moment(deliveryDate).format('YYYY-MM-DD')){
        if(availableDates && availableDates["w" + duration]?.includes(deliveryDate) === false){
          toast.error(`Toy is not available for selected duration on ${formatDateWithDay(deliveryDate)}`);
          return;
        }
      // }
      if(pickupPointSelected && !pickupPoint?._id){
        toast.error("Please select a pickup point");
        return;
      }
      const res = await post(`/orders/edit-order/${selectedOrder?._id}`, {toyId: selectedToy?._id, deliveryDate, duration, pickupPoint: pickupPointSelected ? pickupPoint : null});
      setEditOrderModal(false);
      setSelectedOrder({});
      setSelectedToy({});
      toast.success("Order updated successfully");
      dispatch(onGetUpcoming(pageNumber, limit, startDate, endDate, query));
    }
    catch(error){
      setEditOrderModal(false);
      setSelectedOrder({});
      setSelectedToy({});
      console.log("Error in editing order", error);
      let message = !error?.response ? "No internet connection. Please check your network settings and try again." : error?.response?.data?.message || "Error in editing order";
      toast.error(message);
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
              <div className="d-flex gap-3">
                <div className="text-primary" onClick={() => onOrderClick(row?.original)} style={{ cursor: "pointer"}}>
                  <i className="mdi mdi-eye font-size-18" id="eyetooltip" />
                  <UncontrolledTooltip placement="top" target="eyetooltip">
                    Order Details
                  </UncontrolledTooltip>
                </div>
                <div className="text-success" style={{ cursor: "pointer"}} onClick={() => {
                  setEditOrderModal(true)
                  setSelectedOrder(row?.original)
                  setSelectedToy(row?.original?.toy)
                  setDuration(parseInt(row?.original?.duration))
                  setPickupPointSelected(row?.original?.selfPickup ? true : false)
                  setPickupPoint(row?.original?.selfPickup ? row?.original?.selfPickup : "")
                  setDeliveryDate(row?.original?.deliveryDate)
                  getAvailibility(row?.original?.deliveryDate, row?.original?.duration, row?.original?._id, row?.original?.toy?._id, row?.original?.selfPickup ? true : false)
                }}>
                  <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                  <UncontrolledTooltip placement="top" target="edittooltip">
                    Edit Order
                  </UncontrolledTooltip>
                </div>
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
                    onClick={() =>  {
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

    <EditOrderModal
      show={editOrderModal}
      onCloseClick={() => setEditOrderModal(false)}
      selectedOrder={selectedOrder}
      toys={toys}
      duration={duration}
      setDuration={setDuration}
      pickupPointSelected={pickupPointSelected}
      toyError={toyError}
      saveOrder={saveOrder}
      availabilityLoading={availabilityLoading}
      selectedToy={selectedToy}
      setPickupPointSelected={setPickupPointSelected}
      setPickupPoint={setPickupPoint}
      availableDates={availableDates}
      setToyError={setToyError}
      pickupPoints={pickupPoints}
      pickupPoint={pickupPoint}
      setDeliveryDate={setDeliveryDate}
      deliveryDate={deliveryDate}
      setSelectedToy={setSelectedToy}
    />


      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Upcoming-Orders" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>

                    <TableContainer
                      title="Age Group"
                      columns={columns}
                      data={pickUpType === "All" ? upcomingOrders : orders}
                      // isGlobalFilter={true}
                      isCustomGlobalFilter={true}
                      setQuery={setQuery}
                      isStartDate={true}
                      startDate={startDate}
                      setStartDate={(date) => {
                        setStartDate(date)
                        dispatch(setUpcomingOrdersStartDate(date))
                      }}
                      isEndDate={true}
                      endDate={endDate}
                      setEndDate={(date) => {
                        setEndDate(date)
                        dispatch(setUpcomingOrdersEndDate(date))
                      }}
                      DateFilterTitle={"Delivery Date"}
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
                      setAllChecked={setAllChecked}
                      allChecked={allChecked}
                      setOrderChecked={setOrderChecked}
                      orderChecked={orderChecked}
                      isCheckable={true}
                      setOrderStatus={setOrderStatus}
                      orderStatus={orderStatus}
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
          {
            <Modal size="lg" isOpen={orderStatus !== "pending"} toggle={ () => setOrderStatus("pending")}>
            <ModalHeader toggle={ () => setOrderStatus("pending")} tag="h4">
              {
                orderStatus === "delivered" ? 
                "Are you sure you want to mark the selected orders as delivered?" :
                "Are you sure you want to mark the selected orders as returned?"
              }
            </ModalHeader>
            <ModalBody>
                <div className="">
                      <button
                        type="submit"
                        className="btn btn-success save-user"
                        onClick={() => changeOrderStatus(orderChecked, orderStatus)}
                      >
                      {
                        orderStatus === "delivered" ? 
                        "Mark as Delivered" : "Mark as Returned"
                      }
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => setOrderStatus("pending")}
                      >
                        Close
                      </button>
                    </div>
            </ModalBody>
          </Modal>
          }
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
Upcoming.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};


export default Upcoming;


export const filterOrders = (ordersList, pickUpPoint, pickUpType) => {
  let orders = [];
  if (pickUpType == "All") {
    return ordersList;
  }
  else if (pickUpType == "Company") {
    orders = ordersList.filter(order => {
      return order?.selfPickup === null || order?.selfPickup === undefined;
    });
  }
  else if (pickUpType == "Self" && pickUpPoint === "All") {
    orders = ordersList.filter(order => {
      return order?.selfPickup;
    });
  }
  else if (pickUpType == "Self" && pickUpPoint !== "All") {
    orders = ordersList.filter(order => {
      return order?.selfPickup && order?.selfPickup?.storeName === pickUpPoint;
    });
  }
  return orders;
}