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
    getCompletedOrders as getAllOrders,
    getPickUpPoints,
    setCompletedOrdersDate
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
import { filterOrders } from "./Upcoming";
import { post } from "helpers/api_helper";
import { formatDate } from "helpers/date_helper";
import moment from "moment";

function CompletedOrders() {

    //meta title
    document.title = "Master >> Completed Orders";
    const dispatch = useDispatch();
    const [week, setWeek] = useState(0);
    const [query, setQuery] = useState("");
    const [orders, setOrders] = useState([]);
    const [limit, setLimit] = useState(10);

    const selectDateState = (state) => state.OrderDates;
    const DateProperties = createSelector(
        selectDateState,
        (Dates) => ({
            _date: Dates.completedOrdersDate,
        })
    );
    const { _date } = useSelector(DateProperties);
    const [date, setDate] = useState(_date);

    const selectOrderState = (state) => state.Order;
    const OrderProperties = createSelector(
        selectOrderState,
        (Order) => ({
            allOrders: Order.completedOrders,
            totalOrders: Order.totalOrders
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
    const [isLoading, setLoading] = useState(true);

    const [pageNumber, setPage] = useState(1);
    useEffect(() => {
        dispatch(getAllOrders(pageNumber, limit, date, query));
        dispatch(getPickUpPoints());
    }, [dispatch,pageNumber, date, limit, query]);

   
    const [pickUpType, setPickUpType] = useState("All");
    const [pickUpPoint,setpickUpPoint] = useState("All");
  
    useEffect(() => {
      setOrders(filterOrders(allOrders, pickUpPoint, pickUpType));
    },[pickUpType, pickUpPoint, date])

    const [isCanvasOpen, setIsCanvasOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState({});
  
    const toggleCanvas = () => {
        setIsCanvasOpen(!isCanvasOpen);
    };
  
    const onOrderClick= (orderDetails) => {
        toggleCanvas();
        setSelectedOrder(orderDetails);
    }
  
    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    
    const exportToCSVButtonClicked = async () => {
      try {
        const res = await post(`/orders/completed/${pageNumber}/${limit}`, {date, csvTrue:true});

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
            <Breadcrumbs title="Home" breadcrumbItem="Completed Orders" />
              <Row>
                <Col xs="12">
                  <Card>
                    <CardBody>

                      <TableContainer
                        title="Age Group"
                        columns={columns}
                        data={week == 0 && pickUpType === "All" ? allOrders : orders}
                        // isGlobalFilter={true}
                        // isAddOptions={true}
                        isCustomGlobalFilter={true}
                        setQuery={setQuery}
                        // isStartDate={true}
                        // startDate={startDate}
                        // setStartDate={setStartDate}
                        // isEndDate={true}
                        // endDate={endDate}
                        // setEndDate={setEndDate}
                        isDate={true}
                        date={date}
                        DateFilterTitle={"Delivery Date"}
                        setDate={(date) => {
                          setDate(date);
                          dispatch(setCompletedOrdersDate(date));
                        }}
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
        <OffCanvasComponent
          isCanvasOpen={isCanvasOpen}
          toggleCanvas={toggleCanvas}
          selectedOrder={selectedOrder} 
        />
      </React.Fragment>
    );
}
CompletedOrders.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};


export default CompletedOrders;