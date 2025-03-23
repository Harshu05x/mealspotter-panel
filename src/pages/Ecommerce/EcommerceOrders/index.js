import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from "lodash";
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../../components/Common/TableContainer';
import * as Yup from "yup";
import { useFormik } from "formik";

//import components
import Breadcrumbs from '../../../components/Common/Breadcrumb';
import DeleteModal from '../../../components/Common/DeleteModal';
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

import {
  getOrders as onGetOrders,
  addNewOrder as onAddNewOrder,
  updateOrder as onUpdateOrder,
  deleteOrder as onDeleteOrder,
} from "store/actions";

import {
  Status,
  ToyName,
  Catagory,
  AgeGroup,
  MRP,
  Purchase
}
  from "./EcommerceOrderCol";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import EcommerceOrdersModal from "./EcommerceOrdersModal";

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
import { ToastContainer } from "react-toastify";

function EcommerceOrder() {

  //meta title
  document.title = "Orders | Skote - React Admin & Dashboard Template";

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [order, setOrder] = useState(null);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      status: (order && order.status) || '',
      toyName: (order && order.toyName) || '',
      catagory: (order && order.catagory) || '',
      ageGroup: (order && order.ageGroup) || '',
      mrp: (order && order.mrp) || '',
      // badgeclass: (order && order.badgeclass) || 'success',
      purchase: (order && order.purchase) || '',
    },
    validationSchema: Yup.object({
      status: Yup.string()
        .matches(
          /[0-9\.\-\s+\/()]+/,
          "Please Enter Valid Status"
        ).required("Please Enter Your "),
      toyName: Yup.string().required("Please Enter Your Toy Name"),
      catagory: Yup.string().required("Please Enter Your Order Catagory"),
      ageGroup: Yup.string().matches(
        /[0-9\.\-\s+\/()]+/,
        "Please Enter Valid Amount"
      ).required("Age Group"),
      mrp: Yup.string().required("Please Enter Your MRP"),
      badgeclass: Yup.string().required("Please Enter Your Badge Class"),
      purchase: Yup.string().required("Please Enter Your purchase"),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateOrder = {
          id: order ? order.id : 0,
          status: values.status,
          toyName: values.toyName,
          catagory: values.catagory,
          ageGroup: values.ageGroup,
          mrp: values.mrp,
          purchase: values.purchase,
          // badgeclass: values.badgeclass,
        };
        // update order
        dispatch(onUpdateOrder(updateOrder));
        validation.resetForm();
      } else {
        const newOrder = {
          id: Math.floor(Math.random() * (30 - 20)) + 20,
          status: values["status"],
          toyName: values["toyName"],
          catagory: values["catagory"],
          ageGroup: values["ageGroup"],
          mrp: values["mrp"],
          purchase: values["purchase"],
          // badgeclass: values["badgeclass"],
        };
        // save new order
        dispatch(onAddNewOrder(newOrder));
        validation.resetForm();
      }
      toggle();
    },
  });


  const toggleViewModal = () => setModal1(!modal1);

  const dispatch = useDispatch();

  const selectEcommerceState = (state) => state.ecommerce;
  const EcommerceOrderProperties = createSelector(
    selectEcommerceState,
    (Ecommerce) => ({
      orders: Ecommerce.orders,
      loading: Ecommerce.loading
    })
  );

  const { orders, loading } = useSelector(EcommerceOrderProperties);

  const [isLoading, setLoading] = useState(loading)

  useEffect(() => {
    if (orders && !orders.length) {
      dispatch(onGetOrders());
    }
  }, [dispatch, orders]);

  useEffect(() => {
    if (!isEmpty(orders) && !!isEdit) {
      setIsEdit(false);
    }
  }, [orders]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setOrder(null);
    } else {
      setModal(true);
    }
  };

  const handleOrderClick = arg => {
    const order = arg;
    setOrder({
      id: order.id,
      status: order.status,
      toyName: order.toyName,
      catagory: order.catagory,
      ageGroup: order.ageGroup,
      mrp: order.mrp,
      purchase: order.purchase,
      // badgeclass: order.badgeclass,
    });

    setIsEdit(true);

    toggle();
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (order) => {
    setOrder(order);
    setDeleteModal(true);
  };

  const handleDeleteOrder = () => {
    if (order && order.id) {
      dispatch(onDeleteOrder(order.id));
      setDeleteModal(false);
    }
  };
  const handleOrderClicks = () => {
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
          return <Status {...cellProps} />;
        }
      },
      {
        Header: 'Toy Name',
        accessor: 'toyName',
        filterable: true,
        Cell: (cellProps) => {
          return <ToyName {...cellProps} />;
        }
      },
      {
        Header: 'Catagory',
        accessor: 'catagory',
        filterable: true,
        Cell: (cellProps) => {
          return <Catagory {...cellProps} />;
        }
      },
      {
        Header: 'Age Group',
        accessor: 'ageGroup',
        filterable: true,
        Cell: (cellProps) => {
          return <AgeGroup {...cellProps} />;
        }
      },
      {
        Header: 'MRP',
        accessor: 'mrp',
        filterable: true,
        Cell: (cellProps) => {
          return <MRP {...cellProps} />;
        }
      },
      {
        Header: 'Purchase',
        accessor: 'purchase',
        Cell: (cellProps) => {
          return <Purchase {...cellProps} />;
        }
      },
      {
        Header: 'View Details',
        accessor: 'view',
        disableFilters: true,
        Cell: () => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm btn-rounded"
              onClick={toggleViewModal}
            >
              View Details
            </Button>);
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
                  const orderData = cellProps.row.original;
                  handleOrderClick(orderData);
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
                  const orderData = cellProps.row.original;
                  onClickDelete(orderData);
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
      <EcommerceOrdersModal isOpen={modal1} toggle={toggleViewModal} />
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Toys" breadcrumbItem="Toys" />
          {
            isLoading ? <Spinners setLoading={setLoading} />
              :
              <Row>
                <Col xs="12">
                  <Card>
                    <CardBody>

                      <TableContainer
                        columns={columns}
                        data={orders}
                        isGlobalFilter={true}
                        isAddOptions={true}
                        handleOrderClicks={handleOrderClicks}
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
          }
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit ? "Edit Toy" : "Add Toy"}
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
                      <Label>Status</Label>
                      <Input
                        name="status"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.status || ""}
                      >
                        <option>Select Availability</option>
                        <option>AVAILABLE</option>
                        <option>NOT AVAILABLE</option>
                      </Input>
                      {validation.touched.status && validation.errors.status ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.status}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Toy Name</Label>
                      <Input
                        name="toyName"
                        type="text"
                        placeholder="Insert Toy Name"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.toyName || ""}
                        invalid={
                          validation.touched.toyName && validation.errors.toyName ? true : false
                        }
                      />
                      {validation.touched.toyName && validation.errors.toyName ? (
                        <FormFeedback type="invalid">{validation.errors.toyName}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Catagory</Label>
                      <Input
                        name="catagory"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.catagory || ""}
                      >
                        <option>Select catagory</option>
                        <option>catagory 1</option>
                        <option>catagory 2</option>
                        <option>catagory 3</option>
                        <option>catagory 4</option>
                        <option>catagory 5</option>
                        <option>catagory 6</option>
                        <option>catagory 7</option>
                        <option>catagory 8</option>
                        <option>catagory 9</option>
                        <option>catagory 10</option>
                      </Input>
                      {validation.touched.catagory && validation.errors.catagory ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.catagory}</FormFeedback>
                      ) : null}
                    </div>

                    {/* <div className="mb-3">
                      <Label>Catagory</Label>
                      <Flatpickr
                        className="form-control d-block"
                        name="catagory"
                        placeholder="Select Catagory"
                        options={{
                          dateFormat: 'd M, Y',
                        }}
                        onChange={(catagory) => validation.setFieldValue("catagory", moment(catagory[0]))}
                        value={validation.values.catagory}
                      />
                      {validation.touched.catagory && validation.errors.catagory ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.catagory}</FormFeedback>
                      ) : null}
                    </div> */}

                    <div className="mb-3">
                      <Label>Age Group</Label>
                      <Input
                        name="ageGroup"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.ageGroup || ""}
                      >
                        <option>Select Age Group</option>
                        <option>0-4</option>
                        <option>4-6</option>
                        <option>6-8</option>
                        <option>8-10</option>
                        <option>10-12</option>
                        <option>12-14</option>
                      </Input>
                      {validation.touched.ageGroup && validation.errors.ageGroup ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.ageGroup}</FormFeedback>
                      ) : null}
                    </div>
                    
                    {/* <div className="mb-3">
                      <Label>Age Group</Label>
                      <Input
                        name="ageGroup"
                        type="text"
                        placeholder="Insert Age Group"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.ageGroup || ""}
                        invalid={
                          validation.touched.ageGroup && validation.errors.ageGroup ? true : false
                        }
                      />
                      {validation.touched.ageGroup && validation.errors.ageGroup ? (
                        <FormFeedback type="invalid">{validation.errors.ageGroup}</FormFeedback>
                      ) : null}
                    </div> */}

                    <div className="mb-3">
                      <Label>MRP</Label>
                      <Input
                        name="mrp"
                        type="text"
                        placeholder="Insert MRP amount"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.mrp || ""}
                        invalid={
                          validation.touched.mrp && validation.errors.mrp ? true : false
                        }
                      />
                      {validation.touched.mrp && validation.errors.mrp ? (
                        <FormFeedback type="invalid">{validation.errors.mrp}</FormFeedback>
                      ) : null}
                    </div>

                    {/* <div className="mb-3">
                      <Label>MRP</Label>
                      <Input
                        name="mrp"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={
                          validation.values.mrp || ""
                        }
                      >
                        <option>Paid</option>
                        <option>Chargeback</option>
                        <option>Refund</option>
                      </Input>
                      {validation.touched.mrp && validation.errors.mrp ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.mrp}</FormFeedback>
                      ) : null}
                    </div> */}

                    {/* <div className="mb-3">
                      <Label>Badge Class</Label>
                      <Input
                        name="badgeclass"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.badgeclass || ""}
                      >
                        <option>success</option>
                        <option>danger</option>
                        <option>warning</option>
                      </Input>
                      {validation.touched.badgeclass && validation.errors.badgeclass ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.badgeclass}</FormFeedback>
                      ) : null}
                    </div> */}

                    <div className="mb-3">
                      <Label>Purchase</Label>
                      <Input
                        name="purchase"
                        type="text"
                        placeholder="Insert Purchase amount"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.purchase || ""}
                        invalid={
                          validation.touched.purchase && validation.errors.purchase ? true : false
                        }
                      />
                      {validation.touched.purchase && validation.errors.purchase ? (
                        <FormFeedback type="invalid">{validation.errors.purchase}</FormFeedback>
                      ) : null}
                    </div>

                    {/* <div className="mb-3">
                      <Label>Purchase</Label>
                      <Input
                        name="purchase"
                        type="select"
                        className="form-select"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={
                          validation.values.purchase || ""
                        }
                      >
                        <option>Mastercard</option>
                        <option>Visa</option>
                        <option>Paypal</option>
                        <option>COD</option>
                      </Input>
                      {validation.touched.purchase && validation.errors.purchase ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.purchase}</FormFeedback>
                      ) : null}
                    </div> */}
                    
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
EcommerceOrder.propTypes = {
  preGlobalFilteredRows: PropTypes.any,

};


export default EcommerceOrder;