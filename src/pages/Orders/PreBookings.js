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
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

import {
  getOrders as onGetOrders,
  addNewOrder as onAddNewOrder,
  updateOrder as onUpdateOrder,
  deleteOrder as onDeleteOrder,
  getCategories as onGetCategories,
  getAgeGroups as onGetAgeGroups,
  getCities as onGetCities,
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
  Nav,
  NavItem, 
  NavLink, 
  TabContent,
  TabPane,
  CardText,
  Table
} from "reactstrap";
import moment from "moment";
import Spinners from "components/Common/Spinner";
import { ToastContainer } from "react-toastify";
import classnames from "classnames";

function PreBookings() {

  //meta title
  document.title = "Pre Bookings";

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [activeTab, setactiveTab] = useState("1");

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


  const selectCityState = (state) => state.City;
  const CityProperties = createSelector(
    selectCityState,
    (City) => ({
      cities: City.cities
    })
  );

  const { cities } = useSelector(CityProperties);




  const selectCategoryState = (state) => state.Category;
  const CategoryProperties = createSelector(
    selectCategoryState,
    (Category) => ({
      categories: Category.categories
    })
  );
  const { categories} = useSelector(CategoryProperties);

  //Get Age Groups
  const selectAgeGroupState = (state) => state.AgeGroup;
  const AgeGroupProperties = createSelector(
    selectAgeGroupState,
    (AgeGroup) => ({
      ageGroups: AgeGroup.ageGroups
    })
  );
  const { ageGroups} = useSelector(AgeGroupProperties);



  const [isLoading, setLoading] = useState(loading)

  useEffect(() => {
    dispatch(onGetCategories())
    dispatch(onGetAgeGroups())
    dispatch(onGetCities())
  }, [dispatch]);

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

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
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
        Cell: (row) => {
          return <>
         {row.status}
          </>;
        }
      },
      {
        Header: 'Toy Name',
        accessor: 'toyName',
        filterable: true,
        Cell: (row) => {
          return row.name;
        }
      },
      {
        Header: 'Catagory',
        accessor: 'catagory',
        filterable: true,
        Cell: (row) => {
          return row.category;
        }
      },
      {
        Header: 'Age Group',
        accessor: 'ageGroup',
        filterable: true,
        Cell: (row) => {
          return row.ageGroup;
        }
      },
      {
        Header: 'MRP',
        accessor: 'mrp',
        filterable: true,
        Cell: (row) => {
          return row.mrp;
        }
      },
      {
        Header: 'Purchase',
        accessor: 'purchase',
        Cell: (row) => {
          return row.purchase;
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
      
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteOrder}
        onCloseClick={() => setDeleteModal(false)}
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Pre Booking" breadcrumbItem="Pre Booking" />
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
          <Modal size="lg" isOpen={modal} toggle={toggle}>
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
                <Nav tabs>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "1",
                        })}
                        onClick={() => {
                          toggleTab("1");
                        }}
                      >
                        Toy Details
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "photoVideo",
                        })}
                        onClick={() => {
                          toggleTab("photoVideo");
                        }}
                      >
                        Photo & Video
                      </NavLink>
                    </NavItem>
                    <NavItem>
                      <NavLink
                        style={{ cursor: "pointer" }}
                        className={classnames({
                          active: activeTab === "3",
                        })}
                        onClick={() => {
                          toggleTab("3");
                        }}
                      >
                        Pricing
                      </NavLink>
                    </NavItem>
                   
                  </Nav>

                  <TabContent activeTab={activeTab} className="p-3 text-muted">
                    <TabPane tabId="1">
                      <Row>
                        <Col sm="12">
                          <CardText className="mb-0">
                          <Row className="mb-4">
                            <Label
                              htmlFor="horizontal-firstname-Input"
                              className="col-sm-3 col-form-label"
                            >
                              Toy name
                            </Label>
                            <Col sm={9}>
                              <Input
                                name="toyName"
                                type="text"
                                className="form-control"
                                id="horizontal-firstname-Input"
                                placeholder="Enter Toy Name"
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
                            </Col>
                          </Row>
                          </CardText>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Label
                          className="col-sm-3 col-form-label">Catagory</Label>
                        <Col sm={9}>
                          <Input
                            name="catagory"
                            type="select"
                            className="form-select"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.catagory || ""}
                          >
                            <option>Select catagory</option>
                            {categories.map((category) => (
                              <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                            
                            <option>catagory 10</option>
                          </Input>
                          {validation.touched.catagory && validation.errors.catagory ? (
                            <FormFeedback type="invalid" className="d-block">{validation.errors.catagory}</FormFeedback>
                          ) : null}
                        </Col>
                        
                      </Row>
                      <Row className="mb-4">
                        <Label className="col-sm-3 col-form-label">Age Group</Label>
                        <Col sm={9}>
                          <Input
                            name="ageGroup"
                            type="select"
                            className="form-select"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.ageGroup || ""}
                          >
                            <option>Select Age Group</option>
                            {ageGroups.map((age) => (
                              <option key={age._id}>{age.fromAge} - {age.toAge} Years</option>
                            ))}
                            
                          </Input>
                          {validation.touched.ageGroup && validation.errors.ageGroup ? (
                            <FormFeedback type="invalid" className="d-block">{validation.errors.ageGroup}</FormFeedback>
                          ) : null}
                        </Col>
                          
                      </Row>

                    <Row className="mb-4">
                      <Label className="col-sm-3 col-form-label">Toy Description</Label>
                      <Col sm={9}>
                        <Input
                          name="description"
                          type="textarea"
                          className="form-control"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.description || ""}
                        >

                        </Input>
                        {validation.touched.description && validation.errors.description ? (
                          <FormFeedback type="invalid" className="d-block">{validation.errors.description}</FormFeedback>
                        ) : null}
                      </Col>

                    </Row>
                    <Row className="mb-3">
                      <Label className="col-sm-3 col-form-label">Brand</Label>
                      <Col sm={9}>
                        <Input
                          name="brand"
                          type="text"
                          placeholder="Brand"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.brand || ""}
                          invalid={
                            validation.touched.brand && validation.errors.brand ? true : false
                          }
                        />
                        {validation.touched.brand && validation.errors.brand ? (
                          <FormFeedback type="invalid">{validation.errors.brand}</FormFeedback>
                        ) : null}
                      </Col>

                    </Row>
                      
                      <Row className="mb-3">
                        <Label className="col-sm-3 col-form-label">Status</Label>
                        <Col sm={9}>
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
                          </Col>
                      </Row>
                        
                    </TabPane>
                    <TabPane tabId="photoVideo">
                      <Row className="mb-3">
                        <Label className="col-sm-3 col-form-label">Toy Photo</Label>
                        <Col sm={9}>
                          <Input
                            name="image"
                            type="file"
                            placeholder="Select toy photo"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.image || ""}
                            invalid={
                              validation.touched.image && validation.errors.image ? true : false
                            }
                          />
                          {validation.touched.image && validation.errors.image ? (
                            <FormFeedback type="invalid">{validation.errors.image}</FormFeedback>
                          ) : null}
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Label className="col-sm-3 col-form-label">YouTube Video</Label>
                        <Col sm={9}>
                          <Input
                            name="youtube_url"
                            type="text"
                            placeholder="Paste youtube video link here"
                            validate={{
                              required: { value: true },
                            }}
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.youtube_url || ""}
                            invalid={
                              validation.touched.image && validation.errors.image ? true : false
                            }
                          />
                          {validation.touched.image && validation.errors.image ? (
                            <FormFeedback type="invalid">{validation.errors.image}</FormFeedback>
                          ) : null}
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tabId="3">
                      <Row>
                        <Col>
                        <div className="table-responsive">
                          <Table className="table table-bordered border-primary mb-0">
                            <thead>
                              <tr>
                                <th>City</th>
                                <th>Rental Price</th>
                              </tr>
                            </thead>
                            <tbody>

                              {cities.map((city) => (
                                <tr key={city._id}>
                                  <td>{city.name}</td>
                                  <td>
                                    <Input
                                      name="price"
                                      type="text"
                                      placeholder=""
                                      validate={{
                                        required: { value: true },
                                      }}
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.price || ""}
                                      invalid={
                                        validation.touched.image && validation.errors.image ? true : false
                                      }
                                    />
                                  </td>
                                </tr>

                              ))}
                              
                              
                            
                              
                            </tbody>
                          </Table>
                        </div>
                        </Col>
                      </Row>
                      <Row className="mt-4">

                        <Col sm="12">
                          <Row className="mb-3">
                            <Label className="col-sm-3 col-form-label">MRP</Label>
                            <Col sm={3}>
                              <Input
                                name="mrp"
                                type="text"
                                placeholder="MRP amount"
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
                            </Col>
                            <Label className="col-sm-2 col-form-label text-end">Purchase</Label>
                            <Col sm={3}>
                                <Input
                                  name="purchase"
                                  type="text"
                                  placeholder="Purchase amount"
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
                            </Col>
                          </Row>
                        </Col>
                      </Row>
                    </TabPane>
                    
                    
                  </TabContent>

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
PreBookings.propTypes = {
  preGlobalFilteredRows: PropTypes.any,

};


export default PreBookings;