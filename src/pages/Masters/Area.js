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
import DayCheckBox from "./DayCheckbox";

import {
  getAreas as onGetAreas,
  addNewArea as onAddNewArea,
  updateArea as onUpdateArea,
  deleteArea as onDeleteArea,
  getCities as onGetCities,
  getZones as onGetZones,
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


function Area() {

  //meta title
  document.title = "Master >> Areas";

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [area, setArea] = useState(null);
  


  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      status: (area && area.status) || '',
      name: (area && area.name) || '',
      city: (area && area.city) || '',
      zone: (area && area.zone) || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Area Name"),
      city: Yup.string().required("Please Select City"),
      zone: Yup.string().required("Please Select Zone"),
      status: Yup.string().required("Please Enter Status")
    }),
    onSubmit: (values) => {

      if (isEdit) {
        const updateArea = {
          _id: area ? area._id : '',
          status: values.status == 'true' ? true : false,
          areaName: values.name,
          city: values.city,
          zone: values.zone,
        };
        // update order
        dispatch(onUpdateArea(updateArea));
        validation.resetForm();
      } else {

        const newArea = {
          status: values["status"] == "true" ? true : false,
          areaName: values["name"],
          city: values["city"],
          zone: values["zone"],
        };
        // save new order
        dispatch(onAddNewArea(newArea));
        validation.resetForm();
      }
      toggle();
    },
  });



  const dispatch = useDispatch();

  const selectAreaState = (state) => state.Area;
  const AreaProperties = createSelector(
    selectAreaState,
    (Area) => ({
      areas: Area.areas
    })
  );

  const { areas } = useSelector(AreaProperties);

  const selectCityState = (state) => state.City;
  const CityProperties = createSelector(
    selectCityState,
    (City) => ({
      cities: City.cities
    })
  );

  const { cities } = useSelector(CityProperties);


  const selectZoneState = (state) => state.Zone;
  const ZoneProperties = createSelector(
    selectZoneState,
    (Zone) => ({
      zones: Zone.zones
    })
  );

  const { zones } = useSelector(ZoneProperties);


  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    dispatch(onGetAreas());
    dispatch(onGetCities({ status: true }));
    dispatch(onGetZones({ status: true }));

  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(areas) && !!isEdit) {
      setIsEdit(false);
    }
  }, [areas]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setArea(null);
    } else {
      setModal(true);
    }
  };

  const handleAreaClick = arg => {
    const area = arg;
    setArea({
      _id: area._id,
      status: '' + area.status,
      name: area.name,
      city : area.city, 
      zone: area.zone
    });


    setIsEdit(true);

    toggle();
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (area) => {
    setArea(area);
    setDeleteModal(true);
  };

  const handleDeleteArea = () => {
    if (area && area._id) {
      dispatch(onDeleteArea(area._id));
      setDeleteModal(false);
    }
  };
  const handleAreaClicks = () => {
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
        accessor: 'areaName',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          return <>
            {cellProps?.row?.original?.areaName}
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
            {cellProps?.row?.original?.zone}
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
            {cellProps?.row?.original?.city}
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
                  const areaData = cellProps.row.original;
                  handleAreaClick(areaData);
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
        onDeleteClick={handleDeleteArea}
        onCloseClick={() => setDeleteModal(false)}
        title="Area"
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Masters" breadcrumbItem="Areas" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>

                    <TableContainer
                      columns={columns}
                      title="Area"
                      data={areas}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      handleOrderClicks={handleAreaClicks}
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
              {!!isEdit ? "Edit Area" : "Add Area"}
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
                      <Label>Area Name</Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Area Name"
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


                    <div className="mb-3">
                      <Label>Zone</Label>
                      <Input
                        name="zone"
                        type="select"
                        placeholder="Zone"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.zone || ''}
                        invalid={
                          validation.touched.zone && validation.errors.zone ? true : false
                        }
                      >
                        <option value="">Select Zone</option>
                        {zones.map((zone) => (
                          <option key={zone._id} value={zone._id}>{zone.name}</option>
                        ))}
                      </Input>
                      {validation.touched.zone && validation.errors.zone ? (
                        <FormFeedback type="invalid">{validation.errors.zone}</FormFeedback>
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
Area.propTypes = {
  preGlobalFilteredRows: PropTypes.any,

};


export default Area;