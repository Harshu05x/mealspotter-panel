import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from "lodash";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../components/Common/TableContainer';
import * as Yup from "yup";
import { useFormik } from "formik";

//import components
import Breadcrumbs from '../../components/Common/Breadcrumb';
import DeleteModal from '../../components/Common/DeleteModal';

import { addNewCoupon, getCoupons, updateCoupon, deleteCoupon } from '../../store/coupons/actions';


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
} from "reactstrap";
import moment from "moment";
import Spinners from "components/Common/Spinner";
import { toast, ToastContainer } from "react-toastify";
import Coupon from "../../store/coupons/reducer";
function Coupons() {

    //meta title
    document.title = "Master >> Coupons";

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [coupon, setCoupon] = useState(null);

    // validation
    const validation = useFormik({
        // enableReinitialize : use this flag when initial values needs to be changed
        enableReinitialize: true,

        initialValues: {
            status: (coupon && coupon.status) || '',
            code: (coupon && coupon.code) || '',
            percentage: (coupon && coupon.percentage) || '',
            maxDiscount: (coupon && coupon.maxDiscount) || 0,
            minOrder: (coupon && coupon.minOrder) || '',
            countOfProducts: (coupon && coupon.countOfProducts) || '',
            onlyNewCustomer: (coupon && coupon.onlyNewCustomer) || false,
        },
        validationSchema: Yup.object({
            code: Yup.string().required("Please Enter Coupon Code"),
            percentage: Yup.number().required("Please Enter Percentage").min(1, "Percentage should be 1 or more"),
            // maxDiscount: Yup.number().required("Please Enter Max Discount").min(0, "Max Discount should be 0 or more"),
            minOrder: Yup.number().required("Please Enter Min Order").min(0, "Minimum order value should be 0 or more"),
            countOfProducts: Yup.number().required("Please Enter Count Of Products").min(0, "Minimum count of products should be 0 or more"),
            onlyNewCustomer: Yup.boolean().required("Please Enter Only New Customer"),
            status: Yup.boolean().required("Please Enter Status"),
        }),
        onSubmit: (values) => {
            //check if both minOrder and countOfProducts are 0,
            if (values.minOrder == 0 && values.countOfProducts == 0) {
                toast.error("Either Min Order or Min Count Of Products in Cart shall be greater than 0.");
                return;
            }
            if (isEdit) {
                const updatedCoupon = {
                    _id: coupon._id,
                    code: values.code,
                    percentage: values.percentage,
                    // maxDiscount: values.maxDiscount,
                    minOrder: values.minOrder,
                    countOfProducts: values.countOfProducts,
                    onlyNewCustomer: values.onlyNewCustomer,
                    status: values.status,
                };
                // Update coupon
                dispatch(updateCoupon(updatedCoupon));
                validation.resetForm();
            } else {
                const newCoupon = {
                    code: values.code,
                    percentage: values.percentage,
                    // maxDiscount: values.maxDiscount,
                    maxDiscount: 0,
                    minOrder: values.minOrder,
                    countOfProducts: values.countOfProducts,
                    onlyNewCustomer: values.onlyNewCustomer,
                    status: values.status,
                };
                // Save new coupon
                dispatch(addNewCoupon(newCoupon));
                validation.resetForm();
            }
            toggle();
        },
    });


    const toggleViewModal = () => setModal1(!modal1);

    const dispatch = useDispatch();

    const selectCouponState = (state) => state.Coupon;
    const CouponProperties = createSelector(
        selectCouponState,
        (Coupon) => ({
            coupons: Coupon.coupons,
        })
    );

    const { coupons } = useSelector(CouponProperties) || {};

    useEffect(() => {
        dispatch(getCoupons());
    }, [dispatch]);

    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        if (!isEmpty(coupons) && !!isEdit) {
            setIsEdit(false);
        }
    }, [coupons]);

    const toggle = () => {
        if (modal) {
            setModal(false);
            setCoupon(null);
        } else {
            setModal(true);
        }
    };

    const handleCouponClick = (arg) => {
        const coupon = arg;
        setCoupon({
            _id: coupon._id,
            status: '' + coupon.status,
            code: coupon.code,
            percentage: coupon.percentage,
            // maxDiscount: coupon.maxDiscount,
            minOrder: coupon.minOrder,
            countOfProducts: coupon.countOfProducts,
            onlyNewCustomer: coupon.onlyNewCustomer,
        });

        setIsEdit(true);

        toggle();
    };

    // Delete coupon
    const [deleteModal, setDeleteModal] = useState(false);
    const [deletingCouponId, setDeletingCouponId] = useState(null); // Coupon id to be deleted.

    const onClickDelete = (couponId) => {
        setDeletingCouponId(couponId);
        setDeleteModal(true);
    };

    const handleDeleteCoupon = () => {
        if (deletingCouponId) {
            dispatch(deleteCoupon(deletingCouponId));
            setDeleteModal(false);
            setDeletingCouponId(null);
        }
    };

    const handleCouponClicks = () => {
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
                Header: 'Code',
                accessor: 'code',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {cellProps?.row?.original?.code}
                    </>;
                }
            },
            {
                Header: 'Percentage',
                accessor: 'percentage',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {cellProps?.row?.original?.percentage}
                    </>;
                }
            },
            // {
            //     Header: 'Max Discount',
            //     accessor: 'maxDiscount',
            //     width: '150px',
            //     style: {
            //         textAlign: "center",
            //         width: "10%",
            //         background: "#0000",
            //     },
            //     filterable: true,
            //     Cell: (cellProps) => {
            //         return <>
            //             {cellProps?.row?.original?.maxDiscount}
            //         </>;
            //     }
            // },
            {
                Header: 'Min-Order',
                accessor: 'minOrder',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {cellProps?.row?.original?.minOrder}
                    </>;
                }
            },
            {
                Header: 'Min. Count Of Products in Cart',
                accessor: 'countOfProducts',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {cellProps?.row?.original?.countOfProducts}
                    </>;
                }
            },
            {
                Header: 'Only New Customer',
                accessor: 'onlyNewCustomer',
                width: '150px',
                style: {
                    textAlign: "center",
                    width: "10%",
                    background: "#0000",
                },
                filterable: true,
                Cell: (cellProps) => {
                    return <>
                        {cellProps?.row?.original?.onlyNewCustomer ? 'Yes' : 'No'}
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
                                    const couponData = cellProps.row.original;
                                    handleCouponClick(couponData);
                                }}
                            >
                                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                                <UncontrolledTooltip placement="top" target="edittooltip">
                                    Edit
                                </UncontrolledTooltip>
                            </Link>
                            {/* <Link
                                to="#"
                                className="text-danger"
                                onClick={() => {
                                    const couponData = cellProps.row.original._id;
                                    onClickDelete(couponData);
                                }}
                            >
                                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                                <UncontrolledTooltip placement="top" target="deletetooltip">
                                    Delete
                                </UncontrolledTooltip>
                            </Link> */}
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
                onDeleteClick={handleDeleteCoupon}
                onCloseClick={() => setDeleteModal(false)}
                title="Coupon"
            />
            <div className="page-content">
                <div className="container-fluid">
                    <Breadcrumbs title="Masters" breadcrumbItem="Coupons" />
                        <Row>
                            <Col xs="12">
                                <Card>
                                    <CardBody>

                                        <TableContainer
                                            title={"Coupon"}
                                            columns={columns}
                                            data={coupons}
                                            isGlobalFilter={true}
                                            isAddOptions={true}
                                            handleOrderClicks={handleCouponClicks}
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
                    <Modal isOpen={modal} toggle={toggle}>
                        <ModalHeader toggle={toggle} tag="h4">
                            {!!isEdit ? "Edit Coupon" : "Add Coupon"}
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
                                    <Col className="col-12">
                                        <div className="mb-3">
                                            <Label>Coupon Code</Label>
                                            <Input
                                                name="code"
                                                type="text"
                                                placeholder="Coupon Code"
                                                validate={{
                                                    required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.code || ''}
                                                invalid={
                                                    validation.touched.name && validation.errors.name ? true : false
                                                }
                                            />
                                            {validation.touched.name && validation.errors.name ? (
                                                <FormFeedback type="invalid">{validation.errors.code}</FormFeedback>
                                            ) : null}
                                        </div>

                                        <div className="mb-3">
                                            <Label>Percentage</Label>
                                            <Input
                                                name="percentage"
                                                type="text"
                                                placeholder="Percentage"
                                                validate={{
                                                    required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.percentage || ''}
                                                invalid={
                                                    validation.touched.percentage && validation.errors.percentage ? true : false
                                                }
                                            />
                                            {validation.touched.percentage && validation.errors.percentage ? (
                                                <FormFeedback type="invalid">{validation.errors.percentage}</FormFeedback>
                                            ) : null}
                                        </div>

                                        {/* <div className="mb-3">
                                            <Label>Max Discount</Label>
                                            <Input
                                                name="maxDiscount"
                                                type="text"
                                                placeholder="Max Discount"
                                                validate={{
                                                    required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.maxDiscount || ''}
                                                invalid={
                                                    validation.touched.maxDiscount && validation.errors.maxDiscount ? true : false
                                                }
                                            />
                                            {validation.touched.maxDiscount && validation.errors.maxDiscount ? (
                                                <FormFeedback type="invalid">{validation.errors.maxDiscount}</FormFeedback>
                                            ) : null}
                                        </div> */}

                                        <div className="mb-3">
                                            <Label>Min Order</Label>
                                            <Input
                                                name="minOrder"
                                                type="text"
                                                placeholder="Min Order"
                                                validate={{
                                                    required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.minOrder || ''}
                                                invalid={
                                                    validation.touched.minOrder && validation.errors.minOrder ? true : false
                                                }
                                            />
                                            {validation.touched.minOrder && validation.errors.minOrder ? (
                                                <FormFeedback type="invalid">{validation.errors.minOrder}</FormFeedback>
                                            ) : null}
                                        </div>

                                        <div className="mb-3">
                                            <Label>Min. Count Of Products in Cart</Label>
                                            <Input
                                                name="countOfProducts"
                                                type="text"
                                                placeholder="Min. Count Of Products in Cart"
                                                validate={{
                                                    required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                value={validation.values.countOfProducts || ''}
                                                invalid={
                                                    validation.touched.countOfProducts && validation.errors.countOfProducts ? true : false
                                                }
                                            />
                                            {validation.touched.countOfProducts && validation.errors.countOfProducts ? (
                                                <FormFeedback type="invalid">{validation.errors.countOfProducts}</FormFeedback>
                                            ) : null}
                                        </div>

                                        <div className="mb-3">
                                            <Label>Only New Customer</Label>
                                            <Input
                                                name="onlyNewCustomer"
                                                type="checkbox"
                                                placeholder="Only New Customer"
                                                validate={{
                                                    required: { value: true },
                                                }}
                                                onChange={validation.handleChange}
                                                onBlur={validation.handleBlur}
                                                checked={validation.values.onlyNewCustomer || false}
                                                value={validation.values.onlyNewCustomer || ''}
                                                invalid={
                                                    validation.touched.onlyNewCustomer && validation.errors.onlyNewCustomer ? true : false
                                                }
                                            />
                                            {validation.touched.onlyNewCustomer && validation.errors.onlyNewCustomer ? (
                                                <FormFeedback type="invalid">{validation.errors.onlyNewCustomer}</FormFeedback>
                                            ) : null}
                                        </div>

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
                                            <Button
                                                type="submit"
                                                className="btn btn-success save-user"
                                            >
                                                Save
                                            </Button>
                                            <Button
                                                type="button"
                                                className="btn btn-light ms-2"
                                                onClick={toggle}
                                            >
                                                Cancel
                                            </Button>
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
Coupons.propTypes = {
    preGlobalFilteredRows: PropTypes.any,

};

export default Coupons;