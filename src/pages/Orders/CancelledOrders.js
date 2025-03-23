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
    getAllOrders,
    getPickUpPoints,
    getCancelledOrders
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

function CancelledOrders() {

    //meta title
    document.title = "Master >> Cancelled Orders";
    const dispatch = useDispatch();
    const [limit, setLimit] = useState(10);
    const [query, setQuery] = useState("");
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [startDate, setStartDate] = useState(() => {
      const start = new Date(endDate);
      const end = new Date(start.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 30 days in milliseconds
      return end;
    });

    const selectOrderState = (state) => state.Order;
    const OrderProperties = createSelector(
        selectOrderState,
        (Order) => ({
            cancelledOrders: Order.cancelledOrders,
            totalOrders: Order.totalOrders,
        })
    );

    const { cancelledOrders, totalOrders } = useSelector(OrderProperties);
    const [isLoading, setLoading] = useState(true);
    const [pageNumber, setPage] = useState(1);

    useEffect(() => {
        dispatch(getCancelledOrders(pageNumber, limit, startDate, endDate, query));
    }, [dispatch,pageNumber,limit,startDate,endDate, query]);
  
    const csvConfig = mkConfig({ useKeysAsHeaders: true });

    const exportToCSVButtonClicked = async () => {
      try {
        const res = await post(`/orders/cancelled/${pageNumber}/${limit}`, {startDate, endDate, csvTrue:true});
        
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
            Header: "Cancelled Date",
            accessor: "cancelledDate",
            width: "150px",
            style: {
              textAlign: "center",
              width: "10%",
              background: "#0000",
            },
            filterable: true,
            Cell: (cellProps) => {
              return <>
                {formatDate(cellProps?.row?.original?.cancelOrder?.createdAt)}
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
                {cellProps?.row?.original?.cancelOrder?.reason}
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
            <Breadcrumbs title="Home" breadcrumbItem="Cancelled Orders" />
            {
              isLoading ? <Spinners setLoading={setLoading} />
                :
                <Row>
                  <Col xs="12">
                    <Card>
                      <CardBody>
  
                        <TableContainer
                          title="Age Group"
                          columns={columns}
                          data={cancelledOrders}
                          // isGlobalFilter={true}
                          isCustomGlobalFilter={true}
                          setQuery={setQuery}
                          // isAddOptions={true}
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
            }
          </div>
        </div>
        <ToastContainer />
      </React.Fragment>
    );
}
CancelledOrders.propTypes = {
    preGlobalFilteredRows: PropTypes.any,

};


export default CancelledOrders;