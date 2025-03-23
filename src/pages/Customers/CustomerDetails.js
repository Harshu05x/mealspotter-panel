import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { isEmpty } from "lodash";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../components/Common/TableContainer';

//import components
import Breadcrumbs from '../../components/Common/Breadcrumb';

import {
    getCustomers as onGetCustomers,
    onGetCustomerOrders,
    getCustomerDetails,
} from "store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import {
    Button,
    Col,
    Row,
    Card,
    CardBody,
    CardTitle,
    CardText,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import OffCanvasComponent from "./OffCanvasComponent";
import { formatDate } from "helpers/date_helper";
import Spinners from "components/Common/Spinner";


function CustomerDetails() {

    //meta title
    document.title = "Customer Details";

    const [isEdit, setIsEdit] = useState(false);
    const[selectedOrder, setSelectedOrder] = useState({});

    const dispatch = useDispatch();

    const selectCustomerState = (state) => state.Customer;
    const CustomerProperties = createSelector(
        selectCustomerState,
        (Customer) => ({
            customer: Customer.customer,
            orders: Customer.orders,
            loading: Customer.loading,
        })
    );

    const { customer, orders, loading } = useSelector(CustomerProperties);

    const location = useLocation(); //from react-router-dom
    const searchParams = new URLSearchParams(location.search);
    const customerId = searchParams.get("customerId");

    useEffect(() => {
        dispatch(getCustomerDetails(customerId));
        dispatch(onGetCustomerOrders(customerId));
    }, [dispatch,customerId]);


    useEffect(() => {
        if (!isEmpty(customer) && !!isEdit) {
            setIsEdit(false);
        }

    }, [customer]);

    const [isCanvasOpen, setIsCanvasOpen] = useState(false);

    const toggleCanvas = () => {
        setIsCanvasOpen(!isCanvasOpen);
    };

    const onOrderClick= (orderDetails) => {
        toggleCanvas();
        setSelectedOrder(orderDetails);
    }

    const columnsForOrders = useMemo(
        () => [
            {
                Header: () => (
                    <div className="form-check font-size-16">
                        <input className="form-check-input" type="checkbox" id="checkAll" />
                        <label className="form-check-label" htmlFor="checkAll"></label>
                    </div>
                ),
                accessor: '#',
                width: '20px',
                filterable: true,
                Cell: () => (
                    <div className="form-check font-size-16">
                        <input className="form-check-input" type="checkbox" id="checkAll" />
                        <label className="form-check-label" htmlFor="checkAll"></label>
                    </div>
                ),
            },
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
                Header: 'Product Name',
                accessor: row => row.toy,
                width: "150px",
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: ({ row }) => {
                    const productName = row?.original?.toy?.name || '';
                    const toyImage = row?.original?.toy?.defaultPhoto || '';
                    return <>
                    <img src={toyImage} alt="Toy Image." className="avatar-sm rounded"/> {" "} | {" "}
                    {productName} </>;
                },
            },
            {
                Header: 'Created Date',
                accessor: 'createdDate',
                width: "150px",
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: ({ row }) => {
                    const createdDate = formatDate(row?.original?.createdAt);
                    return <> {createdDate} </>;
                },
            },
            {
                Header: 'Delivery Date',
                accessor: 'deliveryDate',
                width: "150px",
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: ({ row }) => {
                    const deliveryDate = formatDate(row?.original?.deliveryDate);
                    return <> {deliveryDate} </>;
                },
            },
            {
                Header: 'Return Date',
                accessor: 'returnDate',
                width: "150px",
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: ({ row }) => {
                    const returnDate = formatDate(row.original.returnDate);
                    return <> {returnDate} </>;
                },
            },
            {
                Header: 'Paid',
                accessor: 'paid',
                width: "150px",
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: ({ row }) => {
                    return <> {
                        row.original.paid ?
                        <span className="badge bg-success p-2">Paid</span> :
                        <span className="badge bg-danger p-2">Unpaid</span>
                    } </>;
                },
            },
            {
                Header: 'Duration',
                accessor: 'duration',
                width: "150px",
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: ({ row }) => {
                    const duration = row?.original?.duration || '';
                    return <> {duration} week(s)</>;
                },
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
                    <Breadcrumbs title="Home" breadcrumbItem="Customer Details" />
                    <>
                        <Row>
                            <Col xs="12" lg="12">
                                <Card >
                                    <Link to="/customers">
                                        <Button className="position-absolute top-0 end-0 m-3">Back to Customers</Button>
                                    </Link>
                                    <CardBody className="my-2">
                                        <CardTitle className="mb-3" tag="h5">Customer Details</CardTitle>
                                        <CardText className=" d-sm-flex">
                                            <div className=" mx-3">
                                                <div className="mb-3">
                                                    <strong>Name:</strong> {customer?.fname?.charAt(0)?.toUpperCase() + customer?.fname?.slice(1) + " " + customer?.lname?.charAt(0)?.toUpperCase() + customer?.lname?.slice(1)}
                                                </div>
                                                <hr />
                                                <div className="mb-3">
                                                    <strong>Email:</strong> {customer?.email}
                                                </div>
                                                <hr />
                                                <div className="mb-3">
                                                    <strong>Address: </strong>
                                                    {customer?.address?.addressLine1} {customer?.address?.addressLine2}
                                                </div>
                                            </div>
                                            <hr />
                                            <div className=" mx-3">
                                                <div className="mb-3">
                                                    <strong>Zone: </strong>
                                                    {customer?.zone?.name}
                                                </div>
                                                <hr />
                                                <div className="mb-3">
                                                    <strong>Pincode: </strong>
                                                    {customer?.pincode}
                                                </div>
                                                <hr />
                                                <div className="mb-3 pb-3">
                                                    <strong>Mobile:</strong> {customer?.mobile}
                                                </div>
                                            </div>
                                        </CardText>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        {/* Orders Table */}
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">Orders</CardTitle>
                                        <TableContainer
                                            columns={columnsForOrders}
                                            data={orders || []}
                                            isGlobalFilter={true}
                                            customPageSize={10}
                                            isPagination={true}
                                            filterable={false}
                                            iscustomPageSizeOptions={true}
                                            tableClass="align-middle table-nowrap table-check"
                                            theadClass="table-light"
                                            pagination="pagination pagination-rounded justify-content-end mb-2"
                                        />
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </>
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
CustomerDetails.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};

export default CustomerDetails;