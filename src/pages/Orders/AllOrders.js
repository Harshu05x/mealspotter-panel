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
  getAllCustomers,
    getAllOrders,
    getPickUpPoints,
    getToys as onGetToys,
    setAllOrderStartDate,
    setAllOrdersEndDate
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
    ModalFooter,
    Input,
    Label,
} from "reactstrap";
import Select from "react-select";
import Spinners from "components/Common/Spinner";
import { ToastContainer, toast } from "react-toastify";
import OffCanvasComponent from "pages/Customers/OffCanvasComponent";
import { filterOrders } from "./Upcoming";
import { get, post } from "helpers/api_helper";
import { formatDate, formatDateWithDay } from "helpers/date_helper";
import moment from "moment";
import AddOrderModal from "components/Common/addOrderModal";

function AllOrders() {

    //meta title
    document.title = "Master >> All Orders";
    const dispatch = useDispatch();
    const [week, setWeek] = useState(0);
    const [query, setQuery] = useState("");
    const [orders, setOrders] = useState([]);
    const [limit, setLimit] = useState(10);

    const [deliveryDate, setDeliveryDate] = useState("");
    const [duration, setDuration] = useState(2);
    const [availableDates, setAvailableDates] = useState({
      "w2": [],
      "w3": [],
      "w4": [],
    });

    const [pickupPoints, setPickupPoints] = useState([]);
    const [pickupPointSelected, setPickupPointSelected] = useState(false);
    const [pickupPoint, setPickupPoint] = useState({
      _id: "",
      storeName: "",
      city: "",
      status: false
    });

    const selectOrderState = (state) => state.Order;
    const OrderProperties = createSelector(
        selectOrderState,
        (Order) => ({
            allOrders: Order.allOrders,
            totalOrders: Order.totalOrders
        })
    );

    const selectDateState = (state) => state.OrderDates;
    const DateProperties = createSelector(
        selectDateState,
        (Dates) => ({
            _startDate: Dates.allOrdersStartDate,
            _endDate: Dates.allOrdersEndDate
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

    const { allOrders, totalOrders } = useSelector(OrderProperties);

    const { _startDate, _endDate } = useSelector(DateProperties);

    const [startDate, setStartDate] = useState(_startDate);
    const [endDate, setEndDate] = useState(_endDate);

    const [isLoading, setLoading] = useState(true);


    const [pageNumber, setPage] = useState(1);
    useEffect(() => {
        dispatch(getAllOrders(pageNumber, limit, startDate, endDate, query));
        dispatch(getPickUpPoints());
    }, [dispatch,pageNumber,startDate,endDate, limit, query]);
   
    const [pickUpType, setPickUpType] = useState("All");
    const [pickUpPoint,setpickUpPoint] = useState("All");
  
    useEffect(() => {
      setOrders(filterOrders(allOrders, pickUpPoint, pickUpType));
    },[pickUpType, pickUpPoint, startDate, endDate])

    const [isCanvasOpen, setIsCanvasOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});
    const [editOrder, setEditOrder] = useState(false);
    const [selectedToy, setSelectedToy] = useState({});
    const [toyError, setToyError] = useState("");
  
    const toggleCanvas = () => {
        setIsCanvasOpen(!isCanvasOpen);
    }; 

    const editOrderCanvasToggle = () => {
        setEditOrder(!editOrder);
        setSelectedOrder({});
        setSelectedToy({});  
        setAvailableDates({
          "w2": [],
          "w3": [],
          "w4": [],
        });
    }
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
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
        let message = error?.response?.data?.message || "Error in getting availibility";
        setToyError(message);
      }
      setAvailabilityLoading(false);
    }

    useEffect(() => {
      if(selectedToy?._id){
        getAvailibility(deliveryDate, duration, selectedOrder?._id, selectedToy?._id, pickupPointSelected);
      }
    }, [selectedToy, selectedOrder, pickupPointSelected]);

    const fetchPickUpPoints = async () => {
      try {
        const res = await get(`orders/pickup-points/${selectedOrder?.customer?._id}`);
        setPickupPoints(res?.pickUpPoints);
      } catch (error) {
        console.log("Error in fetching pick up points", error);
      }
    }

    useEffect(() => {
      if(selectedOrder?.customer?._id !== undefined){
        fetchPickUpPoints();
      }
    }, [selectedOrder?.customer?._id]);

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
        setEditOrder(false);
        setSelectedOrder({});
        setSelectedToy({});
        toast.success("Order updated successfully");
        dispatch(getAllOrders(pageNumber, limit, startDate, endDate, query));
      }
      catch(error){
        setEditOrder(false);
        setSelectedOrder({});
        setSelectedToy({});
        console.log("Error in editing order", error);
        let message = error?.response?.data?.message || "Error in editing order";
        toast.error(message);
      }
    }

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

    console.log(toys)

    const onOrderClick= (orderDetails) => {
        toggleCanvas();
        setSelectedOrder(orderDetails);
    }
    //Open a Modal to edit the order
    const onOrderEditClick = (orderDetails) => {
        console.log("Edit Order:: ", orderDetails);
        setEditOrder(true);
        setSelectedOrder(orderDetails);
        setSelectedToy(orderDetails?.toy);
        setDuration(parseInt(orderDetails?.duration));
        setDeliveryDate(orderDetails?.deliveryDate);
        setPickupPoint(orderDetails?.selfPickup);
        setPickupPointSelected(orderDetails?.selfPickup ? true : false);
        getAvailibility(orderDetails?.deliveryDate, orderDetails?.duration, orderDetails?._id, orderDetails?.toy?._id, orderDetails?.selfPickup ? true : false);
    }
  
    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    
    const exportToCSVButtonClicked = async () => {
      try {
        const res = await post(`/orders/all/${pageNumber}/${limit}`, {startDate, endDate, csvTrue:true});

        if(res.success === false){
          toast.error("Error in exporting data");
          return;
        }
        const csvData = res?.orders?.map((order) => {
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
            duration: moment(order?.returnDate).diff(order?.deliveryDate, 'days') + " days",
            paid: order?.paid,
            selfPickup: order?.selfPickup ? "Yes" : "No",
          };
        });
  
        if(csvData.length === 0) {
          toast.error("No data to export");
          return;
        }
  
        const csv = generateCsv(csvConfig)(csvData);
        download(csvConfig)(csv)  
  
      } catch (error) {
        toast.error("Error in exporting data");
        console.log("Error in exporting data", error);
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
                ₹ {cellProps?.row?.original?.orderTotal}
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
            Header: 'Duration',
            accessor: 'duration',
            width: '150px',
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                {/* calculate duration return date - delivery date */}
                {moment(cellProps?.row?.original?.returnDate).diff(cellProps?.row?.original?.deliveryDate, 'days') + " days"}
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
                  <div className="d-flex gap-1">
                    <Button
                        color="primary"
                        onClick={() => onOrderClick(row?.original)}
                    >
                        View
                    </Button>
                    <Button
                        color="warning"
                        onClick={() => onOrderEditClick(row?.original)}
                    >
                        Edit
                    </Button>
                  </div>
                );
            }
          }
        ],
        []
      );

    const [addOrderModal, setAddOrderModal] = useState(false);

    return (
        <React.Fragment>

        <AddOrderModal 
          show={addOrderModal}
          onCloseClick={() => setAddOrderModal(false)}
          getAllOrders={ () => dispatch(getAllOrders(pageNumber, limit, startDate, endDate, query))}
        />
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs title="Home" breadcrumbItem="All Orders" />
              <Row>
                <Col xs="12">
                  <Card>
                    <CardBody>

                      <TableContainer
                        title="Age Group"
                        columns={columns}
                        data={week == 0 && pickUpType === "All" ? allOrders : orders}
                        addOrder={true}
                        handleAddOrderClick={() => setAddOrderModal(true)}
                        // isGlobalFilter={true}
                        // isAddOptions={true}
                        isCustomGlobalFilter={true}
                        setQuery={setQuery}
                        isStartDate={true}
                        startDate={startDate}
                        setStartDate={(date) => {
                          setStartDate(date);
                          dispatch(setAllOrderStartDate(date));
                        }}
                        isEndDate={true}
                        endDate={endDate}
                        setEndDate={(date) => {
                          setEndDate(date);
                          dispatch(setAllOrdersEndDate(date));
                        }}
                        DateFilterTitle={"Delivery Date"}
                        handleOrderClicks={() => { }}
                        customPageSize={10}
                        isPagination={false}
                        filterable={false}
                        csvExport={true}
                        exportToCSVButtonClicked={exportToCSVButtonClicked}
                        // isPickUpPointOptions={true}
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
        {/*Open Edit Modal if editOrder is true */}
        {editOrder && (
          <Modal isOpen={editOrder} toggle={editOrderCanvasToggle} centered={true} size="lg">
            <ModalHeader toggle={editOrderCanvasToggle}>Edit Order</ModalHeader>
            <ModalBody>
              <h5>Old Data</h5>
              <div className=' d-flex flex-column border border-1 border-primary rounded-3 px-4 py-2 mb-4 gap-1'>
                <div className="d-flex gap-2 align-items-center">
                    <strong>Order ID: </strong>
                    <span>{selectedOrder?.orderId}</span>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <strong>Customer Name: </strong>
                    <span>{selectedOrder?.customer?.fname + " " + selectedOrder?.customer?.lname}</span>
                </div>
                <div className="d-flex gap-2 align-items-center">
                    <strong>Current Toy: </strong>
                    <strong className="text-primary">{selectedOrder?.toy?.name}</strong>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <strong>Delivery Date: </strong>
                  <strong className="text-primary">{formatDate(selectedOrder?.deliveryDate)}</strong>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <strong>Return Date: </strong>
                  <strong className="text-primary">{formatDate(selectedOrder?.returnDate)}</strong>
                </div>
                <div className="d-flex gap-2 align-items-center">
                  <strong>Duration: </strong>
                  <span>{selectedOrder?.duration} Weeks</span>
                </div>
                <div>
                  <strong>Self Pickup: </strong>
                  <strong className="text-primary">{selectedOrder?.selfPickup ? "Yes" : "No"} {selectedOrder?.selfPickup ? <strong className="text-primary font-bold">({selectedOrder?.selfPickup?.storeName})</strong> : null}</strong>
                </div>
              </div>
              <h5>New Data</h5>
              {
                selectedOrder?.returnDate < new Date().toISOString() ? <div className="alert alert-danger text-center">Order is already completed. You can't edit this order.</div> : 
                <div className=' d-flex flex-column border border-1 border-primary rounded-3 p-4 mb-4 gap-1'>
                  <Row className="mb-4">
                    <Col md="6">
                      <Label>Select Toy</Label>
                      <Select
                        className="react-select-container"
                        classNamePrefix="react-select"
                        options={toys?.map((toy) => {
                          return {
                            value: toy._id,
                            label: toy.name,
                          };
                        })}
                        value={{
                          value: selectedToy?._id || selectedOrder?.toy?._id,
                          label: selectedToy?.name || selectedOrder?.toy?.name,
                        }}
                        onChange={(e) => {
                          setSelectedToy(toys.find((toy) => toy._id === e.value));
                        }}
                      />
                    </Col>
                    <Col md="6">
                      <Label>Select Duration</Label>
                      <Select
                        className="react-select-container"
                        classNamePrefix="react-select"
                        options={[
                          { value: 2, label: "2 Week" },
                          { value: 3, label: "3 Week" },
                          { value: 4, label: "4 Week" },
                        ]}
                        value={{ value: duration, label: duration + " Week" }}
                        onChange={(e) => {
                          setDuration(e.value);
                        }}
                      />
                    </Col>
                    {toyError && <Col md="12" className="text-danger">{toyError}</Col>}
                  </Row>
                  <Row className="mb-4">
                    <Col className="md-6">
                      <div className="d-flex gap-2">
                        <Input className="pe-auto" type="checkbox" id="selfPickup" checked={pickupPointSelected} 
                          onClick={(e) => {
                            setPickupPointSelected((prev) => !prev);
                            if(e.target.checked){
                              setPickupPoint({
                                _id: selectedOrder?.selfPickup?._id,
                                storeName: selectedOrder?.selfPickup?.storeName,
                                city: selectedOrder?.selfPickup?.city,
                                status: selectedOrder?.selfPickup?.status,
                              });
                            }
                          }}
                        />
                        <Label for="selfPickup" className="pe-auto">Self PickUp from Store/Centre</Label>
                      </div>
                    </Col>
                    {
                      pickupPointSelected && (
                      <Col md="6">
                        <Select
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={pickupPoints.map((point) => {
                            return {
                              value: point._id,
                              label: point.storeName,
                            };
                          })}
                          value={{
                            value: pickupPoint?._id,
                            label: pickupPoint?.storeName,
                          }}
                          onChange={(e) => {
                            setPickupPoint({
                              _id: e.value,
                              storeName: e.label,
                              city: pickupPoints.find((point) => point._id === e.value)?.city,
                              status: pickupPoints.find((point) => point._id === e.value)?.status,
                            });
                          }}
                        />
                      </Col>
                      )

                    }
                  </Row>
                  <Row>
                    <Col md="12">
                    <Label>Select Date: </Label>
                    {
                      availabilityLoading ? <Spinners setLoading={setAvailabilityLoading} /> :
                      availableDates && availableDates["w" + duration]?.length > 0 ? (
                          <div
                            className="row gap-2 mx-auto"
                          >
                            {
                                availableDates["w" + duration]?.map((date) => {
                                  return (
                                    <button 
                                      className={`col-2 border border-1 border-primary rounded-3 p-2 ${deliveryDate === date ? "bg-primary text-white" : ""}`}
                                      key={date}
                                      onClick={() => {
                                        if(deliveryDate === date){
                                          setDeliveryDate("");
                                          return;
                                        }
                                        setToyError("");
                                        setDeliveryDate(date);
                                      }}
                                    >
                                      <span>{formatDateWithDay(date)}</span>
                                    </button>
                                  )
                                })
                            }
                          </div>
                        ) : (
                          <div className=" border border-1 border-danger rounded-3 p-2">
                            <span className="text-danger"><strong >Delivery Slots Not Available!</strong> <br />Slots not available for selected duration for the toy.Our pre-booking slots open 60 days before.</span>
                          </div>
                        )
                    }
                    </Col>
                  </Row>
                </div>
              }
            </ModalBody>
            <ModalFooter>
            {
              selectedOrder.returnDate < new Date().toISOString() ? <Button color="secondary" onClick={editOrderCanvasToggle}>Close</Button> :
              <>
                <Button color="primary" onClick={saveOrder}>Save</Button>{' '}
                <Button color="secondary" onClick={editOrderCanvasToggle}>Cancel</Button>
              </>
            }
            </ModalFooter>
          </Modal>
        )}
        <OffCanvasComponent
          isCanvasOpen={isCanvasOpen}
          toggleCanvas={toggleCanvas}
          selectedOrder={selectedOrder} 
        />
      </React.Fragment>
    );
}
AllOrders.propTypes = {
    preGlobalFilteredRows: PropTypes.any,

};


export default AllOrders;