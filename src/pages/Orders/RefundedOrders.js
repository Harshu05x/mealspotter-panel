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
    getRefundedOrders,
    setRefundedOrdersStartDate,
    setRefundedOrdersEndDate
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
import { post } from "helpers/api_helper";
import { formatDate } from "helpers/date_helper";

function RefundedOrders() {

    //meta title
    document.title = "Master >> Refunded/Cancelled Orders";
    const dispatch = useDispatch();
    const [limit, setLimit] = useState(10);
    const [query, setQuery] = useState("");
    const selectOrderState = (state) => state.Order;
    const OrderProperties = createSelector(
        selectOrderState,
        (Order) => ({
            refundedOrders: Order.refundedOrders,
            totalOrders: Order.totalOrders,
        })
    );

    const selectDateState = (state) => state.OrderDates;
    const DateProperties = createSelector(
        selectDateState,
        (Dates) => ({
            _startDate: Dates.refundedOrdersStartDate,
            _endDate: Dates.refundedOrdersEndDate
        })
    );

    const { _startDate, _endDate } = useSelector(DateProperties);
    const { refundedOrders, totalOrders } = useSelector(OrderProperties);
    const [isLoading, setLoading] = useState(true);
    const [pageNumber, setPage] = useState(1);

    const [startDate, setStartDate] = useState(_startDate);
    const [endDate, setEndDate] = useState(_endDate);

    useEffect(() => {
        dispatch(getRefundedOrders(pageNumber, limit, startDate, endDate, query));
    }, [dispatch,pageNumber,limit,startDate,endDate, query]);
  
    const csvConfig = mkConfig({ useKeysAsHeaders: true });

    const exportToCSVButtonClicked = async () => {
      try {
        const res = await post(`/orders/refunded/${pageNumber}/${limit}`, {startDate, endDate, csvTrue:true});
        
        if(res.success === false){
          toast.error("Error in exporting data");
          return;
        }
        const csvData = res?.orders?.map((order) => {
          return {
            orderId: order?.orderId,
            name: order?.customer?.fname + " " + order?.customer?.lname,
            toy_name: order?.toy?.name,
            city: order?.customer?.city?.name,
            zone: order?.customer?.zone?.name,
            cancelledDate: formatDate(order?.cancelOrder?.createdAt),
            reason: order?.cancelOrder?.reason,
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
            Header: "Delivery Date",
            accessor: "deliveryDate",
            width: "150px",
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
            Header: "Reason",
            accessor: "reason",
            width: "150px",
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                {cellProps?.row?.original?.refundOrder?.reason}
              </>;
            }
          },
          {
            Header: "Amount",
            accessor: "amount",
            width: "150px",
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                {cellProps?.row?.original?.refundOrder?.amount}
              </>;
            }
          },
          {
            Header: "Method",
            accessor: "method",
            width: "150px",
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                {cellProps?.row?.original?.refundOrder?.method}
              </>;
            }
          }
        ],
        []
      );

    

    return (
        <React.Fragment>


        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs title="Home" breadcrumbItem="Refunded / Cancelled Orders" />
              <Row>
                <Col xs="12">
                  <Card>
                    <CardBody>

                      <TableContainer
                        title="Age Group"
                        columns={columns}
                        data={refundedOrders}
                        // isGlobalFilter={true}
                        isCustomGlobalFilter={true}
                        setQuery={setQuery}
                        // isAddOptions={true}
                        isStartDate={true}
                        startDate={startDate}
                        setStartDate={(date) => {
                          setStartDate(date);
                          dispatch(setRefundedOrdersStartDate(date));
                        }}
                        isEndDate={true}
                        endDate={endDate}
                        setEndDate={(date) => {
                          setEndDate(date);
                          dispatch(setRefundedOrdersEndDate(date));
                        }}
                        DateFilterTitle={"Delivery Date"}
                        handleOrderClicks={() => { }}
                        customPageSize={10}
                        isPagination={false}
                        filterable={false}
                        csvExport={true}
                        exportToCSVButtonClicked={exportToCSVButtonClicked}
                        // isPickUpPointOptions={true}
                      //   pickUpType={pickUpType}
                      //   setPickUpType={setPickUpType}
                      //   pickUpPoints={pickUpPoints}
                      //   setpickUpPoint={setpickUpPoint}
                      //   pickUpPoint={pickUpPoint}
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
      </React.Fragment>
    );
}
RefundedOrders.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};

export default RefundedOrders;