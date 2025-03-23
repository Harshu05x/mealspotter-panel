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
  getMessOwners as onGetMessOwners,
  addNewMessOwner as onAddNewMessOwner,
  updateMessOwner as onUpdateMessOwner,
  deleteMessOwner as onDeleteMessOwner,
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

function MessOwner() {

  //meta title
  document.title = "Master >> Mess Owners";

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [messOwner, setMessOwner] = useState(null);

  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      status: (messOwner && messOwner.status) || '',
      email: (messOwner && messOwner.email) || '',
      password: (messOwner && messOwner.password) || '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required("Please Enter Email"),
      password: !isEdit ? Yup.string().required("Please Enter Password") : Yup.string(),
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateMessOwner = {
          _id: messOwner ? messOwner._id : '',
          status: values.status == 'true' ? true : false,
          email: values.email,
          password: values.password,
        };
        // update order
        dispatch(onUpdateMessOwner(updateMessOwner));
        validation.resetForm();
      } else {

        const newMessOwner = {
          status: values["status"] == "true" ? true : false,
          email: values["email"],
          password: values["password"],
        };
        dispatch(onAddNewMessOwner(newMessOwner));
        validation.resetForm();
      }
      toggle();
    },
  });


  const toggleViewModal = () => setModal1(!modal1);

  const dispatch = useDispatch();

  const selectMessOwnerState = (state) => state.MessOwner;
  const MessOwnerProperties = createSelector(
    selectMessOwnerState,
    (MessOwner) => ({
      messOwners: MessOwner.messOwners
    })
  );

  const { messOwners } = useSelector(MessOwnerProperties);

  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(onGetMessOwners());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(messOwners) && !!isEdit) {
      setIsEdit(false);
    }
  }, [messOwners]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setMessOwner(null);
    } else {
      setModal(true);
    }
  };

  const handleMessOwnerClick = arg => {
    const messOwner = arg;
    setMessOwner({
      _id: messOwner._id,
      status: '' + messOwner.status,
      email: messOwner.email,
      password: messOwner.password,
    });

    setIsEdit(true);

    toggle();
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (messOwner) => {
    setMessOwner(messOwner);
    setDeleteModal(true);
  };

  const handleDeleteMessOwner = () => {
    if (messOwner && messOwner._id) {
      dispatch(onDeleteMessOwner(messOwner._id));
      setDeleteModal(false);
    }
  };
  const handleMessOwnerClicks = () => {
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
        Header: 'Password',
        accessor: 'password',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          return <>
            {/* {cellProps?.row?.original?.password } */}
            *********
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
            {cellProps?.row?.original?.status ? <span className="badge bg-success p-2">Active</span> : <span className="badge bg-danger p-2">Inactive</span>}
          </>;  
        }
      },
      {
        Header: 'Register Date',
        accessor: 'registerDate',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          const date = cellProps?.row?.original?.createdAt ? moment(cellProps?.row?.original?.createdAt).format('DD-MM-YYYY hh:mm A') : 'N/A';
          return <>
            {date}
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
                  const messOwnerData = cellProps.row.original;
                  handleMessOwnerClick(messOwnerData);
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
                  const orderData = cellProps.row.original;
                  onClickDelete(orderData);
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
        onDeleteClick={handleDeleteMessOwner}
        onCloseClick={() => setDeleteModal(false)}
        title="Mess Owner"
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Masters" breadcrumbItem="Mess Owners" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      columns={columns}
                      data={messOwners}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      handleOrderClicks={handleMessOwnerClicks}
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
              {!!isEdit ? "Edit Mess Owner" : "Add Mess Owner"}
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
                      <Label>Email</Label>
                      <Input
                        name="email"
                        type="text"
                        placeholder="Email"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.email || ''}
                        invalid={
                          validation.touched.email && validation.errors.email ? true : false
                        }
                      />
                      {validation.touched.email && validation.errors.email ? (
                        <FormFeedback type="invalid">{validation.errors.email}</FormFeedback>
                      ) : null}
                    </div>



                    <div className="mb-3">
                      <Label>Password</Label>
                      <Input
                        name="password"
                        type="text"
                        placeholder="Password"
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={isEdit ? "********" : validation.values.password}
                        disabled={!!isEdit}
                      >
                      </Input>
                      {validation.touched.password && validation.errors.password ? (
                        <FormFeedback type="invalid" className="d-block">{validation.errors.password}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>Status</Label>
                      <Input
                        name="status"
                        type="select"
                        placeholder="Status"
                        className="form-select"
                        value={validation.values.status}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                      >
                        <option value="false">Inactive</option>
                        <option value="true">Active</option>
                      </Input>
                      {validation.touched.status && validation.errors.status ? (
                        <FormFeedback type="invalid">{validation.errors.status}</FormFeedback>
                      ) : null}
                    </div>
                    
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="text-end mt-2">
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
MessOwner.propTypes = {
  preGlobalFilteredRows: PropTypes.any,

};


export default MessOwner;