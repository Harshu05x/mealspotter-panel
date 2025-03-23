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

import {
  getAgeGroups as onGetAgeGroups,
  addNewAgeGroup as onAddNewAgeGroup,
  updateAgeGroup as onUpdateAgeGroup,
  deleteAgeGroup as onDeleteAgeGroup,
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

function AgeGroup() {

  //meta title
  document.title = "Master >> Age Groups";

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [ageGroup, setAgeGroup] = useState(null);

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      status: (ageGroup && ageGroup.status) || false,
      fromAge: (ageGroup && ageGroup.fromAge) || '',
      toAge: (ageGroup && ageGroup.toAge) || '',
    },
    validationSchema: Yup.object({
      fromAge: Yup.number().min(0, 'Enter valid age').required("Please Enter AgeGroup Name"),
      toAge: Yup
        .number()
        .min(0, 'Enter valid age')
        .moreThan(Yup.ref("fromAge"), "To age should be greater than from age")
        .required("Please Enter AgeGroup Name"),

      status: Yup.boolean().required("Please Enter Status")
    }),
    onSubmit: (values) => {
      if (isEdit) {
        const updateAgeGroup = {
          _id: ageGroup ? ageGroup._id : '',
          status: values.status,
          fromAge: values.fromAge,
          toAge: values.toAge,
        };
        // update AgeGroup
        dispatch(onUpdateAgeGroup(updateAgeGroup));
        setIsEdit(false);
        validation.resetForm();
      } else {

        const newAgeGroup = {
          status: values["status"],
          fromAge: values["fromAge"],
          toAge: values["toAge"],
        };
        // save new order
        dispatch(onAddNewAgeGroup(newAgeGroup));
        validation.resetForm();
      }
      toggle();
    },
  });


  const toggleViewModal = () => setModal1(!modal1);

  const dispatch = useDispatch();

  const selectAgeGroupState = (state) => state.AgeGroup;
  const AgeGroupProperties = createSelector(
    selectAgeGroupState,
    (AgeGroup) => ({
      ageGroups: AgeGroup.ageGroups
    })
  );

  const { ageGroups } = useSelector(AgeGroupProperties);

  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(onGetAgeGroups());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(ageGroups) && isEdit) {
      setIsEdit(false);
      toggle();
    }
  }, [ageGroups]);

  const toggle = () => {
    if (modal) {
      setModal(!modal);
      setAgeGroup(null);
      validation.resetForm();
    } else {
      setModal(!modal);
      validation.setValues({
        status: '',
        fromAge: '',
        toAge: '',
      });
    }
  };

  const handleAgeGroupClick = (arg) => {
    const ageGroup = arg;
    setAgeGroup({
      _id: ageGroup._id,
      status: '' + ageGroup.status,
      fromAge: ageGroup.fromAge,
      toAge: ageGroup.toAge,
    });
    setIsEdit(true);
    validation.setValues({
      status: '' + ageGroup.status,
      fromAge: ageGroup.fromAge,
      toAge: ageGroup.toAge,
    });
    toggle();
  };


  //delete order
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (ageGroup) => {
    setAgeGroup(ageGroup);
    setDeleteModal(true);
  };

  const handleDeleteAgeGroup = () => {
    if (ageGroup && ageGroup._id) {
      dispatch(onDeleteAgeGroup(ageGroup._id));
      setDeleteModal(false);
    }
  };
  const handleAgeGroupClicks = () => {
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
        Header: 'Age Group',
        accessor: 'fromAge',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          return <>
            {cellProps?.row?.original?.fromAge} - {cellProps?.row?.original?.toAge} Years
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
            {cellProps?.row?.original?.status ? "Active" : "Inactive"}
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
                onClick={(e) => {
                  e.preventDefault();
                  const ageGroupData = cellProps.row.original;
                  handleAgeGroupClick(ageGroupData);
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
        onDeleteClick={handleDeleteAgeGroup}
        onCloseClick={() => setDeleteModal(false)}
        title="Age-Group"
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Masters" breadcrumbItem="Age-Groups" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>

                    <TableContainer
                      title="Age Group"
                      columns={columns}
                      data={ageGroups}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      handleOrderClicks={handleAgeGroupClicks}
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
              {isEdit ? "Edit AgeGroup" : "Add AgeGroup"}
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
                      <Label>From (Age)</Label>
                      <Input
                        name="fromAge"
                        type="number"
                        placeholder="from Age"
                        min={0}
                        validate={{
                          required: { value: true },
                          min: 0
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.fromAge || 0}
                        invalid={
                          validation.touched.fromAge && validation.errors.fromAge ? true : false
                        }
                      />
                      {validation.touched.fromAge && validation.errors.fromAge ? (
                        <FormFeedback type="invalid">{validation.errors.fromAge}</FormFeedback>
                      ) : null}
                    </div>

                    <div className="mb-3">
                      <Label>To (Age)</Label>
                      <Input
                        name="toAge"
                        type="number"
                        placeholder="to Age"
                        min={0}
                        validate={{
                          required: { value: true },
                          min: 0
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.toAge || 0}
                        invalid={
                          validation.touched.toAge && validation.errors.toAge ? true : false
                        }
                      />
                      {validation.touched.toAge && validation.errors.toAge ? (
                        <FormFeedback type="invalid">{validation.errors.toAge}</FormFeedback>
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
AgeGroup.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default AgeGroup;