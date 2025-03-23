import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../components/Common/TableContainer';

//import components
import Breadcrumbs from '../../components/Common/Breadcrumb';
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
import { formatDate } from "helpers/date_helper";
import { post } from "helpers/api_helper";
import Spinners from "components/Common/Spinner";
import { useDispatch } from "react-redux";
import { setSystemError, setSystemLoading } from "store/actions";


function OrderHistory() {

    //meta title
    document.title = "Toy Order History";
    const location = useLocation(); //from react-router-dom
    const searchParams = new URLSearchParams(location.search);
    const toyId = searchParams.get("toyId");

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [toy, setToy] = useState({});

    const dispatch = useDispatch();

    const fetchToyHistory = async () => {
        try {
            dispatch(setSystemLoading(true));
            const res = await post(`toys/history`, {toyId: toyId});
            setOrders(res?.orders);
            setToy(res?.toy);
            dispatch(setSystemLoading(false));
            dispatch(setSystemError(false));
        } catch (error) {
            console.log("Error: ", error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchToyHistory();
    }, [toyId]);
    



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
                Header: 'Customer Name',
                accessor: 'customerName',
                width: "150px",
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: ({ row }) => {
                    return <>{row?.original?.customer ? row?.original?.customer?.fname + " " + row?.original?.customer?.lname : " "} </>;
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
                    const paid = row?.original?.paid || '';
                    return <>
                        {
                            paid === true ? <span className="badge bg-success p-2">Paid</span> :
                                <span className="badge bg-danger p-2">Not Paid</span>
                        }
                    </>
                },
            }
        ],
        []
    );

    return (
        <React.Fragment>
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Home" breadcrumbItem="Toy Order History" />
                    <>
                        <Row>
                            <Col xs="12" lg="12">
                                <Card >
                                    <Link to="/toys">
                                        <Button className="position-absolute top-0 end-0 m-3">Back to Toys</Button>
                                    </Link>
                                    <CardBody className="my-2">
                                        <CardTitle className="mb-3" tag="h5">Toy Details</CardTitle>
                                        <CardText className="">
                                            <Row>
                                                <Col xs="12" lg="4">
                                                    <img src={toy?.defaultPhoto} alt="Toy" className="img-fluid" />
                                                </Col>
                                                <Col xs="12" lg="8">
                                                    <h4>{toy?.name}</h4>
                                                    <p><strong>Description:</strong> {toy?.description}</p>
                                                    <p><strong>Brand:</strong> {toy?.brand}</p>
                                                    <p><strong>Category:</strong> {
                                                        toy?.category?.map((category, index) => {
                                                            return <span key={index}>{
                                                                index === 0 ? category.name : ", " + category.name
                                                            } </span>
                                                        })    
                                                    }</p>
                                                    <p><strong>Age Group:</strong>: {
                                                        toy?.ageGroup?.map((age, index) => {
                                                            return <span key={index}>{
                                                                index === 0 ? `${age.fromAge} - ${age.toAge} Years` : `, ${age.fromAge} - ${age.toAge} Years`
                                                            } </span>
                                                        })
                                                    }</p>
                                                    <p><strong>MRP:</strong> ₹ {toy?.mrp}</p>
                                                    <p><strong>Purchase Price:</strong> ₹ {toy?.purchase}</p>
                                                    <p><strong>Deposit:</strong> ₹ {toy?.deposit}</p>
                                                    <p><strong>Rent:</strong> ₹ {toy?.cityPricing?.[0]?.w2}</p>
                                                </Col>
                                            </Row>
                                        </CardText>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>

                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>
                                        <CardTitle tag="h5">Orders</CardTitle>
                                        {
                                            orders?.length === 0 ?
                                            <div className="text-center my-5">
                                                <h4>No Orders History Found</h4>
                                            </div>
                                            :
                                            <TableContainer
                                                columns={columnsForOrders}
                                                data={orders||[]}
                                                isGlobalFilter={true}
                                                customPageSize={10}
                                                isPagination={true}
                                                filterable={false}
                                                iscustomPageSizeOptions={true}
                                                tableClass="align-middle table-nowrap table-check"
                                                theadClass="table-light"
                                                pagination="pagination pagination-rounded justify-content-end mb-2"
                                            />
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </>
                </div>
            </div>
            <ToastContainer />
        </React.Fragment>
    );
}
OrderHistory.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};

export default OrderHistory;