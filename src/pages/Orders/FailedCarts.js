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
    Col,
    Row,
    Card,
    CardBody,
    Button,
} from "reactstrap";
import Spinners from "components/Common/Spinner";
import { ToastContainer, toast } from "react-toastify";
import { get } from "helpers/api_helper";
import { formatDate } from "helpers/date_helper";
import moment from "moment";
import { setSystemError, setSystemLoading } from "store/actions";
import { useDispatch } from "react-redux";

function FailedCarts() {

    //meta title
    document.title = "Master >> Failed Carts";
    const [failedCarts, setFailedCarts] = useState([]);
    const [totalFailedCarts, setTotalFailedCarts] = useState(0);
    const [query, setQuery] = useState("");
    const [limit, setLimit] = useState(10);
    const [isLoading, setLoading] = useState(true)
    const [pageNumber, setPage] = useState(1);
    const dispatch = useDispatch();

    const fetchFailedCarts = async () => {
        try {
            dispatch(setSystemLoading(true));
            const res = await get(`orders/failed-carts?page=${pageNumber}&limit=${limit}&query=${query}`);
            setFailedCarts(res?.orders);
            setTotalFailedCarts(res?.totalOrders);
            setLoading(false);
            dispatch(setSystemLoading(false));
            dispatch(setSystemError(false));
        } catch (error) {
            console.log("error", error);
            setLoading(false);
             let errorMessage = !error?.response ? "No internet connection. Please check your network settings and try again." : (error?.response?.data?.message || "Something went wrong");
            dispatch(setSystemError(errorMessage));
        }
    }

    useEffect(() => {
        fetchFailedCarts();
    }, [pageNumber, limit, query]);

    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    
    const exportToCSVButtonClicked = async () => {
      try {
        const res = await get(`orders/failed-carts?query=${query}&csvTrue=${true}`);
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
        //   {
        //     Header: "Action",
        //     accessor: "action",
        //     width: "150px",
        //     style: {
        //         textAlign: "center",
        //         width: "10%",
        //         background: "#0000",
        //     },
        //     filterable: true,
        //     Cell: ({ row }) => {
                
        //         return (
        //             <Button
        //                 color="primary"
        //                 onClick={() => onOrderClick(row?.original)}
        //             >
        //                 View
        //             </Button>
        //         );
        //     }
        //   },
        //   {
        //     // Column for the cancel order button
        //     Header: "Cancel Order",
        //     accessor: "cancelOrder",
        //     width: "150px",
        //     style: {
        //         textAlign: "center",
        //         width: "10%",
        //         background: "#0000",
        //     },
        //     filterable: true,
        //     Cell: ({ row }) => {
        //         return (
        //             <Button
        //                 color="danger"
        //                 onClick={() =>  onClickCancelOrder(row?.original?._id)}
        //             >
        //                 Cancel
        //             </Button>
        //         );
        //     }
        //   }
        ],
        []
      );

    return (
        <React.Fragment>
        <div className="page-content">
          <div className="container-fluid">
            <Breadcrumbs title="Home" breadcrumbItem="Failed-Carts" />
              <Row>
                <Col xs="12">
                  <Card>
                    <CardBody>

                      <TableContainer
                        title="Age Group"
                        columns={columns}
                        data={failedCarts || []}
                        csvExport={true}
                        exportToCSVButtonClicked={exportToCSVButtonClicked}
                        // isGlobalFilter={true}
                        isCustomGlobalFilter={true}
                        setQuery={setQuery}
                        // isAddOptions={true}
                        handleOrderClicks={() => { }}
                        customPageSize={10}
                        isPagination={false}
                        filterable={false}
                        iscustomPageSizeOptions={true}
                        tableClass="align-middle table-nowrap table-check"
                        theadClass="table-light"
                        pagination="pagination pagination-rounded justify-content-end mb-2"
                        isCustomPagination={true}
                        setPage={setPage}
                        pageNumber={pageNumber}
                        totals={totalFailedCarts}
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
FailedCarts.propTypes = {
    preGlobalFilteredRows: PropTypes.any,

};


export default FailedCarts;