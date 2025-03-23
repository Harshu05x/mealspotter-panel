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
  getCategories as onGetCategories,
  addNewCategory as onAddNewCategory,
  updateCategory as onUpdateCategory,
  deleteCategory as onDeleteCategory,
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
} from "reactstrap";
import moment from "moment";
import Spinners from "components/Common/Spinner";
import { ToastContainer } from "react-toastify";

function Category() {

  //meta title
  document.title = "Master >> Categories";

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [category, setCategory] = useState(null);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      status: (category && category.status) || '',
      name: (category && category.name) || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Category Name"),
      status: Yup.string().required("Please Enter Status")
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateCategory = {
          _id: category ? category._id : '',
          status: values.status == 'true' ? true : false,
          name: values.name,
        };
        // update order
        dispatch(onUpdateCategory(updateCategory));
        validation.resetForm();
      } else {

        const newCategory = {
          status: values["status"] == "true" ? true : false,
          name: values["name"],
        };
        // save new order
        dispatch(onAddNewCategory(newCategory));
        validation.resetForm();
      }
      toggle();
    },
  });


  const toggleViewModal = () => setModal1(!modal1);

  const dispatch = useDispatch();

  const selectCategoryState = (state) => state.Category;
  const CategoryProperties = createSelector(
    selectCategoryState,
    (Category) => ({
      categories: Category.categories
    })
  );

  const { categories } = useSelector(CategoryProperties);

  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(onGetCategories());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(categories) && !!isEdit) {
      setIsEdit(false);
    }
  }, [categories]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setCategory(null);
    } else {
      setModal(true);
    }
  };

  const handleCategoryClick = arg => {
    const category = arg;
    setCategory({
      _id: category._id,
      status: '' + category.status,
      name: category.name,
    });

    setIsEdit(true);

    toggle();
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (category) => {
    setCategory(category);
    setDeleteModal(true);
  };

  const handleDeleteCategory = () => {
    if (category && category._id) {
      dispatch(onDeleteCategory(category._id));
      setDeleteModal(false);
    }
  };
  const handleCategoryClicks = () => {
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
        Header: 'Name',
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
            {cellProps?.row?.original?.name}
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
                  const categoryData = cellProps.row.original;
                  handleCategoryClick(categoryData);
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
        onDeleteClick={handleDeleteCategory}
        onCloseClick={() => setDeleteModal(false)}
        title="Category"
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Masters" breadcrumbItem="Categories" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>

                    <TableContainer
                      columns={columns}
                      data={categories}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      handleOrderClicks={handleCategoryClicks}
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
              {!!isEdit ? "Edit Category" : "Add Category"}
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
                      <Label>Category Name</Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Category Name"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.name || ''}
                        invalid={
                          validation.touched.name && validation.errors.name ? true : false
                        }
                      />
                      {validation.touched.name && validation.errors.name ? (
                        <FormFeedback type="invalid">{validation.errors.name}</FormFeedback>
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
Category.propTypes = {
  preGlobalFilteredRows: PropTypes.any,

};


export default Category;