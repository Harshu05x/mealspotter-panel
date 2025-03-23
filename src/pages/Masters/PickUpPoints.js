import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from "lodash";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../components/Common/TableContainer';
import * as Yup from "yup";
import { useFormik, FieldArray } from "formik";

//import components
import Breadcrumbs from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";
import DayCheckBox from "./DayCheckbox";

import {
    getZones as onGetZones,
    addNewZone as onAddNewZone,
    updateZone as onUpdateZone,
    deleteZone as onDeleteZone,
    getCities as onGetCities,
    getPickUpPoints as onGetPickUpPoints,
    addNewPickUpPoint as onAddNewPickUpPoint,
    updatePickUpPoint as onUpdatePickUpPoint,
    deletePickUpPoint as onDeletePickUpPoint
} from "store/actions";


//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import {
    Button,
    Col,
    Row,
    UncontrolledTooltip,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    Input,
    FormFeedback,
    Label,
    Card,
    CardBody,
    Badge
} from "reactstrap";
import moment from "moment";
import Spinners from "components/Common/Spinner";
import { ToastContainer } from "react-toastify";
import { DeliveryDays } from "constants/AppConstants";

function PickUpPoints() {

    //meta title
    document.title = "Master >> PickUpPoints";

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [pickupPoint, setPickupPoint] = useState(null);



    // validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            status: (pickupPoint && pickupPoint.status) || '',
            storeName: (pickupPoint && pickupPoint.storeName) || '',
            city: (pickupPoint && pickupPoint.city) || '',
        },
        validationSchema: Yup.object({
            storeName: Yup.string().required("Please Enter Store/Center Name"),
            city: Yup.string().required("Please Select City"),
            status: Yup.string().required("Please Enter Status"),
        }),
        onSubmit: (values) => {

            if (isEdit) {
                const updatePickUpPoint = {
                    _id: pickupPoint ? pickupPoint._id : null,
                    status: values.status == 'true' ? true : false,
                    storeName: values.storeName,
                    city: values.city,
                };
                dispatch(onUpdatePickUpPoint(updatePickUpPoint));
                validation.resetForm();
            } else {

                const newPickUpPoint = {
                    status: values["status"] == "true" ? true : false,
                    storeName: values["storeName"],
                    city: values["city"],
                };
                dispatch(onAddNewPickUpPoint(newPickUpPoint));
                validation.resetForm();
            }
            toggle();
        },
    });



    const dispatch = useDispatch();

    const selectPickUpPointState = (state) => state.PickupPoint;
    const PickupPointProperties = createSelector(
        selectPickUpPointState,
        (PickupPoint) => ({
            pickUpPoints: PickupPoint.pickUpPoints
        })
    );
    const { pickUpPoints } = useSelector(PickupPointProperties);

    const selectCityState = (state) => state.City;
    const CityProperties = createSelector(
        selectCityState,
        (City) => ({
            cities: City.cities
        })
    );

    const { cities } = useSelector(CityProperties);


    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        dispatch(onGetPickUpPoints());
        dispatch(onGetCities({ status: true }));

    }, [dispatch]);

    useEffect(() => {
        if (!isEmpty(pickUpPoints) && !!isEdit) {
            setIsEdit(false);
        }
    }, [pickUpPoints]);

    const toggle = () => {
        if (modal) {
            setModal(false);
            setPickupPoint(null);
        } else {
            setModal(true);
        }
    };

    const handlePickUpPointClick = arg => {
        const pickUpPoint = arg;
        setPickupPoint({
            _id: pickUpPoint ? pickUpPoint._id : null,
            status: '' + pickUpPoint.status,
            storeName: pickUpPoint.storeName,
            city: pickUpPoint.city?._id,
        })

        setIsEdit(true);

        toggle();
    };

    //delete order
    const [deleteModal, setDeleteModal] = useState(false);

    const onClickDelete = (pickUpPoint) => {
        setPickupPoint(pickUpPoint);
        setDeleteModal(true);
    };

    const handlePickUpPointDelete = () => {
        if (pickupPoint && pickupPoint._id) {
            dispatch(onDeletePickUpPoint(pickupPoint._id));
            setDeleteModal(false);
        }
    };
    const handlePickUpPointClicks = () => {
        setIsEdit(false);
        toggle();
    };



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
                Header: 'Store/Center Name',
                accessor: 'storeName',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {cellProps?.row?.original?.storeName}
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
                        {cellProps?.row?.original?.city?.name}
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
                        {cellProps?.row?.original?.status ? 'Active' : 'Inactive'}
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
                            <Link
                                to="#"
                                className="text-success"
                                onClick={() => {
                                    const pickUpPointDate = cellProps.row.original;
                                    handlePickUpPointClick(pickUpPointDate);
                                }}
                            >
                                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                                <UncontrolledTooltip placement="top" target="edittooltip">
                                    Edit
                                </UncontrolledTooltip>
                            </Link>
                            <Link
                                to="#"
                                className="text-danger"
                                onClick={() => {
                                    const pickUpPointDate = cellProps.row.original;
                                    onClickDelete(pickUpPointDate);
                                }}
                            >
                                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                <UncontrolledTooltip placement="top" target="deletetooltip">
                                    Delete
                                </UncontrolledTooltip>
                            </Link>
                        </div>
                    );
                }
            },
        ],
        []
    );

    return (
        <React.Fragment>

            <DeleteModal
                show={deleteModal}
                onDeleteClick={handlePickUpPointDelete}
                onCloseClick={() => setDeleteModal(false)}
                title="Pick-Up Points"
            />
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Masters" breadcrumbItem="Pick-Up Points" />
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>

                                        <TableContainer
                                            columns={columns}
                                            title="Pick-Up Point"
                                            data={pickUpPoints}
                                            isGlobalFilter={true}
                                            isAddOptions={true}
                                            handleOrderClicks={handlePickUpPointClicks}
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
                    <Modal size="lg" isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle} tag="h4">
                            {!!isEdit ? "Edit Pick-Up Point" : "Add Pick-Up Point"}
                        </ModalHeader>
                        <ModalBody>
                            <Form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    validation.handleSubmit();
                                    return false;
                                }}
                            >
                                <Row>
                                    <Col col={6}>
                                        <div className="mb-3">
                                            <Label>Store / Center Name</Label>
                                            <Input
                                                name="storeName"
                                                type="text"
                                                placeholder="Store/Center Name"
                                                validate={{
                                                    required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.storeName || ''}
                                                invalid={
                                                    validation.touched.storeName && validation.errors.storeName ? true : false
                                                }
                                            />
                                            {validation.touched.storeName && validation.errors.storeName ? (
                                                <FormFeedback type="invalid">{validation.errors.storeName}</FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col col={6}>
                                        <div className="mb-3">
                                            <Label>City</Label>
                                            <Input
                                                name="city"
                                                type="select"
                                                placeholder="City"
                                                validate={{
                                                    required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.city || ''}
                                                invalid={
                                                    validation.touched.city && validation.errors.city ? true : false
                                                }
                                            >
                                                <option value="">Select City</option>
                                                {cities.map((city) => (
                                                    <option key={city._id} value={city._id}>{city.name}</option>
                                                ))}
                                            </Input>
                                            {validation.touched.city && validation.errors.city ? (
                                                <FormFeedback type="invalid">{validation.errors.city}</FormFeedback>
                                            ) : null}
                                        </div>

                                    </Col>
                                    <Col col={6}>
                                        <div className="mb-3">
                                            <Label>Status</Label>
                                            <Input
                                                name="status"
                                                type="select"
                                                className="form-select"
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.status}

                                            >
                                                <option>Select Status</option>
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </Input>
                                            {validation.touched.status && validation.errors.status ? (
                                                <FormFeedback type="invalid" className="d-block">{validation.errors.status}</FormFeedback>
                                            ) : null}
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        <div className="text-end">
                                            <button
                                                type="submit"
                                                className="btn btn-success save-user"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                            </Form>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
            <ToastContainer />
        </React.Fragment>
    );
}
PickUpPoints.propTypes = {
    preGlobalFilteredRows: PropTypes.any,
};

export default PickUpPoints;