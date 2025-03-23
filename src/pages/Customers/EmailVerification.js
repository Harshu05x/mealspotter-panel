import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import { isEmpty } from "lodash";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../components/Common/TableContainer';

//import components
import Breadcrumbs from '../../components/Common/Breadcrumb';

import { getCustomers as onGetCustomers } from "store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import {
    Button,
    Col,
    Row,
    Card,
    CardBody,
} from "reactstrap";
import moment from "moment";
import Spinners from "components/Common/Spinner";
import { ToastContainer, toast } from "react-toastify";

import { get, put } from "helpers/api_helper";
import VerifyEmailModal from "components/Common/VerifyEmailModal";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { formatDate } from "helpers/date_helper";

function EmailVerificationPage() {

    //meta title
    document.title = "Pending Email Verification";
    const emailVerificationEnabled = process.env.REACT_APP_EMAIL_VERIFICATION_ENABLED === "true" ? true : false;
    const [isEdit, setIsEdit] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [pageNumber, setPage] = useState(1);
    const [query, setQuery] = useState("");
    const [limit, setLimit] = useState(10)

    const dispatch = useDispatch();

    const selectCustomerState = (state) => state.Customer;
    const CustomerProperties = createSelector(
        selectCustomerState,
        (Customer) => ({
            customers: Customer.customers,
            totalCustomers: Customer.totalCustomers,
        })
    );

    const { customers,totalCustomers } = useSelector(CustomerProperties);

    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        if(emailVerificationEnabled)
            dispatch(onGetCustomers("emailVerification",pageNumber, limit, query));
    }, [dispatch,pageNumber, limit, query]);

    useEffect(() => {
        if (!isEmpty(customers) && !!isEdit) {
            setIsEdit(false);
        }
    }, [customers]);

    const updateCustomer = async (customerData) => {
        setLoading(true);
        try{
            const response = await put(`customers/verify-email/${customerData?._id}` );
            toast.success("Email verified successfully.");
            dispatch(onGetCustomers("emailVerification",pageNumber, limit, query));
        }
        catch(error){
            let msg = error?.response?.data?.message || "Error in updating customer";
            toast.error(msg);
        }finally{
            setLoading(false);
        }
    }
    const [verifyEmailModal, setVerifyEmailModal] = useState(false);
    const handleverifyCustomerClick = (customerData) => {
        setVerifyEmailModal(true);
        setCustomer(customerData);
    };
    const csvConfig = mkConfig({ useKeysAsHeaders: true });

    const exportToCSVButtonClicked = async () => {
        try {
            const res = await get(`customers?enquiry=emailVerification&query=${query}&csvTrue=${true}`,);
            if (res.success === false) {
                toast.error("Error in exporting data");
                return;
            }
            const csvData = res?.customers?.map((customer) => {
                return {
                    customerId: customer?._id,
                    name: customer?.fname + " " + customer?.lname,
                    email: customer?.email,
                    mobile: customer?.mobile,
                    address: customer?.address?.addressLine1 ? customer?.address?.addressLine1 :
                        "" + " " + customer?.address?.addressLine2 ? customer?.address?.addressLine2 : "",
                    pincode: customer?.pincode,
                    city: customer?.city?.name,
                    zone: customer?.zone?.name,
                    registeredOn: formatDate(customer?.createdAt),
                };
            });
            if (csvData.length === 0) {
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
                Header: () => <div className="form-check font-size-16" >
                    <input className="form-check-input" type="checkbox" id="checkAll" />
                    <label className="form-check-label" htmlFor="checkAll"></label>
                </div>,
                accessor: '#',
                width: '20px',
                filterable: true,
                Cell: (cellProps) => (
                    <div className="form-check font-size-16" >
                        <input className="form-check-input" type="checkbox" id="checkAll" />
                        <label className="form-check-label" htmlFor="checkAll"></label>
                    </div>
                )
            },
            {
                Header: 'Name',
                accessor: 'fname',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {cellProps?.row?.original?.fname?.charAt(0).toUpperCase() + cellProps?.row?.original?.fname?.slice(1) + " " + cellProps?.row?.original?.lname?.charAt(0).toUpperCase() + cellProps?.row?.original?.lname?.slice(1)}
                    </>;
                }
            },
            {
                Header: 'Email',
                accessor: 'email',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {cellProps?.row?.original?.email}
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
                        {cellProps?.row?.original?.mobile}
                    </>;
                }
            },
            {
                Header: 'Registered On',
                accessor: 'createdAt',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {moment(cellProps?.row?.original?.createdAt).format("DD/MM/YYYY")}
                    </>;
                }
            },
            {
                Header: "Address",
                accessor: "address",
                width: "150px",
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: cellProps => {
                    const addressObject = cellProps?.row?.original?.address;
                    return (
                        <>
                            <div>{addressObject?.addressLine1},</div>
                            <div>{addressObject?.addressLine2}</div>
                            <div>Pincode: {cellProps?.row?.original?.pincode}</div>
                        </>
                    );
                },
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
                        {cellProps?.row?.original?.city?.name}
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
                        {cellProps?.row?.original?.zone?.name}
                    </>;
                }
            },
            {
                Header: 'Pincode',
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
                        {cellProps?.row?.original?.pincode}
                    </>;
                }
            },
            {
                Header: 'Status',
                accessor: 'status',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {cellProps?.row?.original?.isActive ? "Active" : "Inactive"}
                    </>;
                }
            },

            {
                Header: 'Action',
                accessor: 'action',
                disableFilters: true,
                Cell: (cellProps) => {
                    return (
                        <div className="d-flex gap-3">
                            <Button
                                color="primary"
                                onClick={() => handleverifyCustomerClick(cellProps?.row?.original)}
                            >
                                Verify
                            </Button>
                        </div>
                    );
                }
            },
        ],
        []
    );

    return (
        <React.Fragment>
            <VerifyEmailModal 
                show={verifyEmailModal}
                email={customer?.email}
                onVerifyClick={() => {
                    updateCustomer({ _id: customer?._id });
                    setVerifyEmailModal(false);
                }}
                onCloseClick={() => setVerifyEmailModal(false)}
            />

            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Home" breadcrumbItem="Pending Email Verification" />
                        <>
                            {
                                !emailVerificationEnabled ?
                                <div className="d-flex justify-content-center align-items-center w-100" style={{ height: '50vh' }}>
                                    <div className="alert alert-danger d-flex justify-content-between align-items-center" role="alert">
                                        <i className="fas fa-exclamation-circle me-2"></i>
                                        Email Verification is disabled. Please enable it from the settings.
                                    </div>
                                </div>
                                :
                                <Row>
                                    <Col xs="12">
                                        <Card>
                                            <CardBody>
                                                <TableContainer
                                                    columns={columns}
                                                    data={customers}
                                                    // isGlobalFilter={true}
                                                    isCustomGlobalFilter={true}
                                                    setQuery={setQuery}
                                                    csvExport={true}
                                                    exportToCSVButtonClicked={exportToCSVButtonClicked}
                                                    handleOrderClicks={() => { }}
                                                    customPageSize={10}
                                                    isPagination={false}
                                                    filterable={false}
                                                    iscustomPageSizeOptions={true}
                                                    tableClass="align-middle table-check"
                                                    theadClass="table-light"
                                                    pagination="pagination pagination-rounded justify-content-end mb-2"
                                                    isCustomPagination={true}
                                                    setPage={setPage}
                                                    pageNumber={pageNumber}
                                                    totals={totalCustomers}
                                                    setLimit={setLimit}
                                                />
                                            </CardBody>
                                        </Card>
                                    </Col>
                                </Row>
                            }    
                        </>
                </div>
            </div>
            <ToastContainer />
        </React.Fragment>
    );
}
EmailVerificationPage.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};


export default EmailVerificationPage;