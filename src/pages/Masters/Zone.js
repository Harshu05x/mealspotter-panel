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
import { toast, ToastContainer } from "react-toastify";
import { DeliveryDays, weekDays } from "constants/AppConstants";
import { post } from "helpers/api_helper";
import PincodeDeleteModal from "./pincodeDeleteModal";
import PincodeShiftModal from "./pincodeShiftModal";

function Zone() {

  //meta title
  document.title = "Master >> Zones";

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [zone, setZone] = useState(null);
  const [deliveryDays, setDeliveryDays] = useState([]);
  const [homeDelivery, setHomeDelivery] = useState(true);
  const [pincode, setPincode] = useState();
  const [pincodes, setPincodes] = useState([]);
  const [pincodeError, setPincodeError] = useState(false);
  const [searchedPincodes, setSearchedPincodes] = useState([]);
  const [searchedValue, setSearchedValue] = useState("");

  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      status: (zone && zone.status) || '',
      name: (zone && zone.name) || '',
      city: (zone && zone.city) || '',
      deliveryFee: (zone && zone.deliveryFee || 0) || 0,
      // pincodes: zone?.pincodes || "" //Node version 16 syntax conflict: optional chaining not supported.
      homeDelivery: zone ? zone.homeDelivery || false : true
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Please Enter Zone Name"),
      city: Yup.string().required("Please Select City"),
      deliveryFee: Yup.string().required("Please Enter Delivery Fee"),
      status: Yup.string().required("Please Enter Status"),
    }),
    onSubmit: (values) => {
      if (!deliveryDays || (deliveryDays && deliveryDays.length == 0) || pincodeError) {
        return;
      }

      const selectedCity = cities.find(city => city._id === values.city);
      if (selectedCity) {
        const offDay = selectedCity.weeklyOff;
        if (offDay && offDay !== -1 && deliveryDays.includes(offDay)) {
          toast.error(`${selectedCity.name} has weekly off on ${weekDays[offDay]}`);
          return;
        }
      }


      if (isEdit) {
        const updateZone = {
          _id: zone ? zone._id : '',
          status: values.status == 'true' ? true : false,
          name: values.name,
          city: values.city,
          deliveryFee: values.deliveryFee,
          deliveryDays: deliveryDays,
          pincodes: pincodes && pincodes.length > 0 && cleanPinCodes(pincodes),
          homeDelivery: homeDelivery
        };
        // update order
        dispatch(onUpdateZone(updateZone));
        validation.resetForm();
      } else {

        const newZone = {
          status: values["status"] == "true" ? true : false,
          name: values["name"],
          city: values["city"],
          deliveryFee: values["deliveryFee"],
          deliveryDays: deliveryDays,
          pincodes: pincodes && pincodes.length > 0 && cleanPinCodes(pincodes),
        };
        // save new order
        dispatch(onAddNewZone(newZone));
        validation.resetForm();
      }
      toggle();
    },
  });


  const toggleViewModal = () => setModal1(!modal1);

  const dispatch = useDispatch();

  const selectZoneState = (state) => state.Zone;
  const ZoneProperties = createSelector(
    selectZoneState,
    (Zone) => ({
      zones: Zone.zones
    })
  );

  const { zones } = useSelector(ZoneProperties);

  const selectCityState = (state) => state.City;
  const CityProperties = createSelector(
    selectCityState,
    (City) => ({
      cities: City.cities
    })
  );

  const { cities } = useSelector(CityProperties);
  const [isLoading, setLoading] = useState(true);
  const [pincodeDeleteModal, setPincodeDeleteModal] = useState(false);
  const [pincodeDelete, setPincodeDelete] = useState(false);
  const [pincodeDeleteModalLoading, setPincodeDeleteModalLoading] = useState(false);
  const [canDelete, setCanDelete] = useState(false);
  const [resaon, setReason] = useState("");

  const addPincode = async () => {
    setLoading(true);
    if (pincode) {
      if(/^[1-9][0-9]{5}$/.test(pincode)){
        if(!pincodes.includes(pincode)){
          try {
            const res = await post("/zones/canAddPincode", { pincode });
            if(res && res.canAdd){
              setPincodes([...pincodes, pincode]);
              setPincode("");
              setPincodeError("");
            }
            else{
              setPincodeError(res.message);
            }
          } catch (error) {
            console.log(error);
            setPincodeError("Failed to add pincode");
          }
        }
        else{
          setPincodeError("Pincode already exists in current list");
        }
      }
      else{
        setPincodeError("Please enter valid pincode");
      } 
    }
    else{
      setPincodeError("Please enter pincode");
    }
    setLoading(false);
  }

  const onPincodeDeleteClick = async (pincode) => {
    setPincodeDeleteModalLoading(true);
    console.log("pincode", pincode);
    console.log("zone", zone);
    try {
      if(pincode && ((zone && zone.pincodes && !zone.pincodes.includes(pincode)) || (!zone))){
        setCanDelete(true);
      }
      else{
        const res = await post("/zones/canRemovePincode", { zoneId: zone._id, pincode });
        if(res && res.canRemove){
          setCanDelete(true);
        }
        else{
          setCanDelete(false);
          setReason(res.message);
        }
      }
    } catch (error) {
      setCanDelete(false);
      console.log(error);
    }
    setPincodeDeleteModalLoading(false);
  }

  const onPincodeDelete = async (pincode) => {
    setPincodeDeleteModalLoading(true);
    try {
      if(pincode && ((zone && zone.pincodes && !zone.pincodes.includes(pincode)) || (!zone))){
        setPincodes(pincodes.filter(p => p !== pincode));
        toast.success("Pincode removed successfully");
      }
      else{
        const res = await post("/zones/removePincode", {pincode});
          toast.success("Pincode removed successfully");
          setPincodeDeleteModal(false);
          setPincodes(pincodes.filter(p => p !== pincode));
          dispatch(onGetZones());
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove pincode");
    }
    setPincodeDeleteModal(false);
    setPincodeDeleteModalLoading(false);
  }
  
  const [pincodeShiftModal, setPincodeShiftModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);


  const onShiftClick = async () => {
    try {
      if(selectedZone && selectedZone._id){
        const res = await post("/zones/shiftPincode", {pincode: pincodeDelete, fromZoneId: zone._id, toZoneId: selectedZone._id});
        toast.success("Pincode shifted successfully");
        setPincodeShiftModal(false);
        setSelectedZone(null);
        setPincodes(pincodes.filter(p => p !== pincodeDelete));
        dispatch(onGetZones());
      }
      else{
        toast.error("Select zone to shift pincode");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to shift pincode");
    }
  }
  

  useEffect(() => {
    dispatch(onGetZones());
    dispatch(onGetCities({ status: true }));

  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(zones) && !!isEdit) {
      setIsEdit(false);
    }
  }, [zones]);

  const toggle = () => {
    if (modal) {
      setModal(false);
      setZone(null);
    } else {
      setModal(true);
    }
  };
  const handleZoneClick = arg => {
    const zone = arg;
    setZone({
      _id: zone._id,
      status: '' + zone.status,
      name: zone.name,
      city: zone.city?._id,
      deliveryFee: zone.deliveryFee,
      pincodes: (zone && zone.pincodes && zone.pincodes.length > 0) ? zone.pincodes : [],
      homeDelivery: zone.homeDelivery
    });
    setPincodes(zone.pincodes);
    setHomeDelivery(zone.homeDelivery);
    setDeliveryDays(zone.deliveryDays);

    setIsEdit(true);
    setModal(true);
    // toggle();
  };

  //delete order
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (zone) => {
    setZone(zone);
    setDeleteModal(true);
  };

  const handleDeleteZone = () => {
    if (zone && zone._id) {
      dispatch(onDeleteZone(zone._id));
      setDeleteModal(false);
    }
  };
  const handleZoneClicks = () => {
    setIsEdit(false);
    setZone(null);
    setPincodes([]);
    setDeliveryDays([]);
    toggle();
  };

  const changeDeliveryDays = (day) => {
    day = parseInt(day);
    let days = [...deliveryDays];
    const index = days.indexOf(day);
    if (index > -1) {
      days.splice(index, 1);
    }
    else {
      days.push(day);
    }
    setDeliveryDays(days);
  }

  const cleanPinCodes = (pincodeArray) => {
    if (!pincodeArray || !Array.isArray(pincodeArray)) {
      return "";
    }
    const cleanedPincodes = pincodeArray.map(pincode => pincode.trim());
    return cleanedPincodes.join(", ");
  };

  const handlePinCodeSearch = (e) => {
    const inputValue = e.target.value;
    if (inputValue === "" || /^[0-9\b]+$/.test(inputValue)){
      setSearchedValue(inputValue);
      setSearchedPincodes(pincodes.filter(p => p.startsWith(inputValue)));
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
        Header: 'Delivery Fee',
        accessor: 'deliveryFee',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          return <>
            {cellProps?.row?.original?.deliveryFee}
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
        Header: 'Pincodes',
        accessor: 'pincodes',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          const rawPincodes = cellProps?.row?.original?.pincodes;
          const cleanedPincodes = cleanPinCodes(rawPincodes);
          return <>{cleanedPincodes}</>;
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
                  const zoneData = cellProps.row.original;
                  handleZoneClick(zoneData);
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
        onDeleteClick={handleDeleteZone}
        onCloseClick={() => setDeleteModal(false)}
        title="Zone"
      />
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Masters" breadcrumbItem="Zones" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>

                    <TableContainer
                      columns={columns}
                      title="Zone"
                      data={zones}
                      isGlobalFilter={true}
                      isAddOptions={true}
                      handleOrderClicks={handleZoneClicks}
                      customPageSize={10}
                      isPagination={true}
                      filterable={false}
                      iscustomPageSizeOptions={true}
                      tableClass="align-middle  table-check"
                      theadClass="table-light"
                      pagination="pagination pagination-rounded justify-content-end mb-2"
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
          <Modal size="xl" isOpen={modal} toggle={toggle}>
            <PincodeDeleteModal 
              show={pincodeDeleteModal}
              onCloseClick={() => setPincodeDeleteModal(false)}
              onDeleteClick={() => 
                onPincodeDelete(pincodeDelete)
              }
              pincode={pincodeDelete}
              zone={zone}
              loading={pincodeDeleteModalLoading}
              canDelete={canDelete}
              resaon={resaon}
            />

            <PincodeShiftModal 
              show={pincodeShiftModal}
              pincode={pincodeDelete}
              loading={pincodeDeleteModalLoading}
              onShiftClick={onShiftClick}
              onCloseClick={() => {
                setPincodeShiftModal(false);
                setSelectedZone(null);
              }}
              zone={zone}
              zones={zones}
              selectedZone={selectedZone}
              setSelectedZone={setSelectedZone}
            />
            <ModalHeader toggle={toggle} tag="h4">
              {!!isEdit ? "Edit Zone" : "Add Zone"}
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
                      <Label>Zone Name</Label>
                      <Input
                        name="name"
                        type="text"
                        placeholder="Zone Name"
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
                  </Col>
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
                </Row>

                <Row>
                  <Col col={6}>
                    <div className="mb-3">
                      <Label>Delivery Fee</Label>
                      <Input
                        name="deliveryFee"
                        type="text"
                        placeholder="Delivery Fee"
                        validate={{
                          required: { value: true },
                        }}
                        onChange={validation.handleChange}
                        onBlur={validation.handleBlur}
                        value={validation.values.deliveryFee || ''}
                        invalid={
                          validation.touched.deliveryFee && validation.errors.deliveryFee ? true : false
                        }
                      />
                      {validation.touched.deliveryFee && validation.errors.deliveryFee ? (
                        <FormFeedback type="invalid">{validation.errors.deliveryFee}</FormFeedback>
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
                  <Col className="col-12">
                    <div className="mb-3">
                      <Label>Delivery Days</Label>

                      <Row>
                        <Col>
                          <DayCheckBox
                            day={DeliveryDays.MONDAY}
                            label="Mon"
                            data={deliveryDays}
                            onChange={changeDeliveryDays}
                          />
                        </Col>
                        <Col>
                          <DayCheckBox
                            day={DeliveryDays.TUESDAY}
                            label="Tue"
                            data={deliveryDays}
                            onChange={changeDeliveryDays}
                          />
                        </Col>
                        <Col>
                          <DayCheckBox
                            day={DeliveryDays.WEDNESDAY}
                            label="Wed"
                            data={deliveryDays}
                            onChange={changeDeliveryDays}
                          />
                        </Col>
                        <Col>
                          <DayCheckBox
                            day={DeliveryDays.THURSDAY}
                            label="Thu"
                            data={deliveryDays}
                            onChange={changeDeliveryDays}
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <DayCheckBox
                            day={DeliveryDays.FRIDAY}
                            label="Fri"
                            data={deliveryDays}
                            onChange={changeDeliveryDays}
                          />
                        </Col>

                        <Col>
                          <DayCheckBox
                            day={DeliveryDays.SATURDAY}
                            label="Sat"
                            data={deliveryDays}
                            onChange={changeDeliveryDays}
                          />
                        </Col>
                        <Col>
                          <DayCheckBox
                            day={DeliveryDays.SUNDAY}
                            label="Sun"
                            data={deliveryDays}
                            onChange={changeDeliveryDays}
                          />
                        </Col>
                        <Col>
                        </Col>
                      </Row>
                    </div>
                  </Col>
                </Row>

                {/* Add toggle for Home Delivery Available or not  */}
                <Row className="mb-3 d-flex align-items-center">
                  <Label className="col-sm-3 col-form-label">Home Delivery Available: </Label>
                  <Col sm={9}>
                    <div className="form-check form-switch">
                      <Input
                        name="homeDelivery"
                        type="checkbox"
                        className="form-check-input"
                        checked={homeDelivery}
                        value={validation.values.homeDelivery || true}
                        onChange={() => setHomeDelivery(!homeDelivery)}
                      />
                      <Label className="form-check-label">{homeDelivery ? "Yes" : "No"}</Label>
                    </div>
                  </Col>
                </Row>

                <Row className="">
                  <Col col={3}>
                    <div className="col-5">
                        <Label>Pincode</Label>
                        <div className=" d-flex gap-2">
                          <Input
                            name="deliveryFee"
                            type="text"
                            placeholder="Enter Pincode"
                            onChange={(e) => {
                              const inputValue = e.target.value;
                              if (inputValue === "" || /^[0-9\b]+$/.test(inputValue)){
                                setPincode(inputValue);
                                setPincodeError("");
                              }
                            }}
                            value={pincode || ""}
                          />
                          <Button type="button"
                            disabled={isLoading}
                            onClick={addPincode}
                          >
                            {
                              isLoading ? <i className="mdi mdi-loading mdi-spin mdi-16px" /> : "Add"
                            }
                          </Button>
                      </div>
                    </div>
                      {
                        pincodeError && <span className="text-danger">{pincodeError}</span>
                      }
                  </Col>
                  <Col className="d-flex justify-content-end align-items-end">
                    <div className="col-6">
                        <div className=" d-flex gap-2 align-items-center">
                          <Label>Search</Label>
                          <Input
                            name="deliveryFee"
                            type="text"
                            placeholder="Search PIN Code"
                            onChange={handlePinCodeSearch}
                            value={searchedValue || ""}
                          />
                      </div>
                    </div>
                  </Col>
                </Row>

                {
                  searchedValue && searchedPincodes.length === 0 ? 
                  <div style={{
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    marginTop: "10px",
                    padding: "10px",
                    textAlign: "center",
                    fontSize: "20px",
                    color: "#ff0000"
                  }}>
                    No Pincodes Found
                  </div>
                  :
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
                    maxHeight: "350px",
                    overflowY: "scroll",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    marginTop: "10px",
                    scrollbarColor: '#c7c7c7 #f5f5f5',
                    scrollbarWidth: 'thin'
                  }}>
                    {
                      (searchedValue ? searchedPincodes : pincodes).map((pincode, index) => {
                        return (
                          <div key={index} className="d-flex align-items-center justify-content-between border" style={{
                            padding: "3px 5px",
                            margin: "5px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            background: "#f5f5f5",
                          }}>
                            <span>
                              {
                                searchedValue ? <>
                                  <span style={{
                                        background: "#ffeb38",
                                        borderRadius: "3px"
                                      }}
                                  >{searchedValue}</span>{pincode.replace(searchedValue, "")}
                                </> : pincode
                              }
                            </span>
                            <div className="d-flex">
                              <i className="mdi mdi-trash-can-outline text-danger" 
                              onClick={() => {
                                setPincodeDelete(pincode);
                                setPincodeDeleteModal(true);
                                onPincodeDeleteClick(pincode);
                              }}
                              style={{
                                cursor: 'pointer',
                                fontSize: '20px'
                              }} />
                              <i className="mdi mdi-sync text-info"
                                onClick={() => {
                                  setPincodeDelete(pincode);
                                  setPincodeShiftModal(true);
                                }}
                                style={{
                                  cursor: 'pointer',
                                  fontSize: '20px',
                                  fontWeight: 'bold'
                                }}
                              />
                            </div>
                          </div>
                        );
                      })
                    }
                  </div>
                }


                <Row>
                  <Col>
                    <div className="text-end">
                      <button
                        type="submit"
                        className="btn btn-success save-user mt-2"
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
Zone.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

export default Zone;