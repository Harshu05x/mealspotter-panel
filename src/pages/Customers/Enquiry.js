import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from "lodash";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../components/Common/TableContainer';
import * as Yup from "yup";
import { useFormik } from "formik";
import Select from "react-select";

//import components
import Breadcrumbs from '../../components/Common/Breadcrumb';

import { getCustomers as onGetCustomers } from "store/actions"; 
import { getCustomers } from "store/actions";
import { mkConfig, generateCsv, download } from "export-to-csv";
import { formatDate } from "helpers/date_helper";
//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import {
    Button,
    Col,
    Row,
    UncontrolledTooltip,
    Card,
    CardBody,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import moment from "moment";
import Spinners from "components/Common/Spinner";
import { ToastContainer, toast } from "react-toastify";

import {
    getZones,
    getCities,
    deleteCustomer,
    getCustomerEnquiries
} from "store/actions";
import DeleteModal from "components/Common/DeleteModal";
import { get, post, put } from "helpers/api_helper";

function Enquiry() {

    //meta title
    document.title = "Enquiry";

    const [pageNumber, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();

    const selectCustomerState = (state) => state.Customer;
    const CustomerProperties = createSelector(
        selectCustomerState,
        (Customer) => ({
            enquiries: Customer.enquiries,
            totalEnquiries: Customer.totalEnquiries,
        })
    );

    const { enquiries, totalEnquiries } = useSelector(CustomerProperties);

    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        dispatch(getCustomerEnquiries(pageNumber, limit, query));
    }, [dispatch, pageNumber, limit, query]);

    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedEnquiry, setSelectedEnquiry] = useState("");
    const onClickDelete = (id) => {
        setDeleteModal(true);
        setSelectedEnquiry(id);
    }

    const csvConfig = mkConfig({ useKeysAsHeaders: true });
    
  const exportToCSVButtonClicked = async () => {
    try {
      const res = await post(`customers/enquiries/1?query=${query}&csvTrue=${true}`, );
      console.log("res", res);
      if(res.success === false){
        toast.error("Error in exporting data");
        return;
      }
      const csvData = res?.enquiries?.map((enquirie) => {
        return {
            Name: enquirie.name,
            Email: enquirie.email,
            Mobile: enquirie.phone,
            Subject: enquirie.subject,
            Message: enquirie.message,
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

    const handleDelete = async() => {
        try {
            const response = await post(`customers/delete-enquiry`, { Id: selectedEnquiry });
            if (response?.success) {
                toast.success("Enquiry deleted successfully");
                setDeleteModal(false);
                dispatch(getCustomerEnquiries(pageNumber, limit, query));
            }
        } catch (error) {
            console.log("error", error);
            toast.error("Error in deleting enquiry");
        }
    }

    const columns = useMemo(
        () => [
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
                    const fullName = cellProps?.row?.original?.name;
                    const capitalizedName = fullName.split(' ').map(name => name.charAt(0).toUpperCase() + name.slice(1)).join(' ');
                    return <>
                        {capitalizedName}
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
                        {cellProps?.row?.original?.phone}
                    </>;
                }
            },
            {
                Header: 'Subject',
                accessor: 'subject',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {cellProps?.row?.original?.subject}
                    </>;
                }
            },
            {
                Header: 'Message',
                accessor: 'message',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {cellProps?.row?.original?.message}
                    </>;
                }
            },
            {
                Header: "Action",
                accessor: "action",
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                // Add action to delete the enquiry
                Cell: (cellProps) => {
                    return (
                        <div className="d-flex justify-content-center">
                            <Link
                                to="#"
                                className="text-danger"
                                onClick={() => {
                                    onClickDelete(cellProps.row.original._id);
                                }}
                            >
                                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                <UncontrolledTooltip placement="top" target="deletetooltip">
                                    Delete
                                </UncontrolledTooltip>
                            </Link>
                        </div>
                    );
                },
            }
        ],
        []
    );

    return (
        <React.Fragment>
            <DeleteModal
                show={deleteModal}
                onDeleteClick={handleDelete}
                onCloseClick={() => setDeleteModal(false)}
                title={"Enquiry"}
            />
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Home" breadcrumbItem="Enquiry" />
                    <Row>
                        <Col xs="12">
                            <Card>
                                <CardBody>

                                    <TableContainer
                                        columns={columns}
                                        data={enquiries}
                                        // isGlobalFilter={true}
                                        isCustomGlobalFilter={true}
                                        setQuery={setQuery}
                                        csvExport={true}
                                        exportToCSVButtonClicked={exportToCSVButtonClicked}
                                        handleOrderClicks={() => { }}
                                        customPageSize={10}
                                        // isPagination={true}
                                        filterable={false}
                                        iscustomPageSizeOptions={true}
                                        tableClass="align-middle  table-check"
                                        theadClass="table-light"
                                        pagination="pagination pagination-rounded justify-content-end mb-2"
                                        isCustomPagination={true}
                                        setPage={setPage}
                                        pageNumber={pageNumber}
                                        totals={totalEnquiries}
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
Enquiry.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};


export default Enquiry;