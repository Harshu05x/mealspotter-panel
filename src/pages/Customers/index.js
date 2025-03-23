import React, { useEffect, useMemo, useState } from "react";
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from "lodash";
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import TableContainer from '../../components/Common/TableContainer';
import { mkConfig, generateCsv, download } from "export-to-csv";

//import components
import Breadcrumbs from '../../components/Common/Breadcrumb';

import {
  getZones,
  getCustomers as onGetCustomers,
  getCities,
} from "store/actions";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";

import {
  Col,
  Row,
  UncontrolledTooltip,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Spinners from "components/Common/Spinner";
import { ToastContainer, toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { get, put } from "helpers/api_helper";
import moment from "moment";
import { formatDate } from "helpers/date_helper";
function Customers() {

  //meta title
  document.title = "Customers";

  const [isEdit, setIsEdit] = useState(false);
  const [zone, setZone] = useState("All");
  const [query, setQuery] = useState("");
  const [customerData, setCustomerData] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pageNumber, setPage] = useState(1);

  const [limit, setLimit] = useState(10)

  const dispatch = useDispatch();

  const selectCustomerState = (state) => state.Customer;
  const CustomerProperties = createSelector(
    selectCustomerState,
    (Customer) => ({
      customers: Customer.customers,
      totalCustomers: Customer.totalCustomers,
    })
  );
  const { customers,totalCustomers } = useSelector(CustomerProperties);


  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      fname: customer ? customer.fname : "",
      lname: customer ? customer.lname : "",
      email: customer ? customer.email : "",
      mobile: customer ? customer.mobile : "",
      addressLine1: customer ? customer.address.addressLine1 : "",
      addressLine2: customer ? customer.address.addressLine2 : "",
      city: customer ? customer?.city?._id : "",
      zone: customer ? customer?.zone?._id : "",
      pincode: customer ? customer.pincode : "",
      isActive: customer ? customer.isActive : "",
    },
    validationSchema: Yup.object({
      fname: Yup.string().required("First Name is required"),
      lname: Yup.string().required("Last Name is required"),
      email: Yup.string().required("Email is required"),
      mobile: Yup.string()
        .required("Mobile Number is required")
        .matches(/^[6-9]\d{9}$/, "Invalid Mobile Number"),
      addressLine1: Yup.string().required("Address Line 1 is required"),
      addressLine2: Yup.string().required("Address Line 2 is required"),
      city: Yup.string().required("City is required"),
      zone: Yup.string().required("Zone is required"),
      pincode: Yup.string()
        .required("Pincode is required")
        .matches(/^[1-9][0-9]{5}$/, "Invalid Pincode"),
      isActive: Yup.string().required("Status is required"),
    }),

    onSubmit: (values) => {
      const { addressLine1, addressLine2, ...rest } = values;
      const data = {
        ...rest,
        _id: customer._id,
        address: {
          addressLine1,
          addressLine2,
        },
      };
      if (isEdit) {
        updateCustomer(data);
      }

      setIsEdit(false);
      validation.resetForm();
    },
  });


  const updateCustomer = async (customerData) => {
    setLoading(true);
    try {
      const response = await put(`customers/update/${customerData?._id}`, customerData);
      toast.success("Customer updated successfully");
      dispatch(onGetCustomers(false,pageNumber, limit, query));
    }
    catch (error) {
      let msg = error?.response?.data?.message || "Error in updating customer";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  const handlePasswordUpdate = async (customerId) => {
    if (validation.values.password !== validation.values.confirmPassword) {
        toast.error("Passwords do not match");
        return;
    }
    const data = {
      password: validation.values.password,
    }
    try {
      const response = await put(`customers/update-password/${customerId}`, data);

      toast.success("Password updated successfully");
        setIsPasswordModalOpen(false);
    } catch (error) {
        let msg = error?.response?.data?.message || "Error in updating password";
        toast.error(msg);
    } finally {
        setLoading(false);
        setIsPasswordModalOpen(false);
        validation.resetForm();
    }
};

  const selectCityState = (state) => state.City;
  const CityProperties = createSelector(
    selectCityState,
    (City) => ({
      cities: City.cities
    })
  )
  const { cities } = useSelector(CityProperties);

  const selectZoneState = (state) => state.Zone;
  const ZoneProperties = createSelector(
    selectZoneState,
    (Zone) => ({
      zones: Zone.zones
    })
  )
  const { zones } = useSelector(ZoneProperties);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(onGetCustomers(false,pageNumber, limit, query));
  }, [dispatch,pageNumber, limit, query]);
  
  useEffect(() => {
    dispatch(getZones());
    dispatch(getCities());
  }, [dispatch]);

  useEffect(() => {
    if (!isEmpty(customers) && !!isEdit) {
      setIsEdit(false);
    }
  }, [customers]);

  useEffect(() => {
    let data = [];
    if (zone === "All") {
      data = customers;
    }
    else {
      data = customers.filter((customer) => customer?.zone?.name === zone);
    }
    setCustomerData(data);
  }, [zone])

  const handleCustomerClick = (customerData) => {
    setIsEdit(true);
    const updatedCustomerData = { ...customerData };
    setCustomer(updatedCustomerData);
    setSelectedCity({
      label: updatedCustomerData?.city?.name,
      value: updatedCustomerData?.city?._id,
    });
    setSelectedZone(updatedCustomerData?.zone);
  };

  const csvConfig = mkConfig({ useKeysAsHeaders: true });
    
  const exportToCSVButtonClicked = async () => {
    try {
      const res = await get(`customers?enquiry=${false}&query=${query}&csvTrue=${true}`, );
      if(res.success === false){
        toast.error("Error in exporting data");
        return;
      }
      const csvData = res?.customers?.map((customer) => {
        return {
          customerId: customer?._id,
          name: customer?.fname + " " + customer?.lname,
          email: customer?.email,
          mobile: customer?.mobile,
          address: customer?.address?.addressLine1 ? customer?.address?.addressLine1 : 
            "" + " " + customer?.address?.addressLine2 ? customer?.address?.addressLine2 : "",
          pincode: customer?.pincode,
          city: customer?.city?.name,
          zone: customer?.zone?.name,
          registeredOn: formatDate(customer?.createdAt),
          isActive: customer?.isActive ? "Active" : "Inactive",
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

  const columns = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'fname',
        width: '10%',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          return <>
            <Link className="text-dark"
              to={`/customer-details?customerId=${cellProps?.row?.original?._id}`}
            >
              {cellProps?.row?.original?.fname?.charAt(0).toUpperCase() + cellProps?.row?.original?.fname?.slice(1) + " " + cellProps?.row?.original?.lname?.charAt(0).toUpperCase() + cellProps?.row?.original?.lname?.slice(1)}
            </Link>
          </>;
        }
      },
      {
        Header: 'Email',
        accessor: 'email',
        width: '10%',
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
        width: '10%',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
          return <>
            {cellProps?.row?.original?.mobile}
          </>;
        }
      },
      {
        Header: 'Registered On',
        accessor: 'createdAt',
        width: '150px',
        style: {
            textAlign: "center",
            width: "10%",
            background: "#0000",
        },
        filterable: true,
        Cell: (cellProps) => {
            return <>
                { moment(cellProps?.row?.original?.createdAt).format("DD/MM/YYYY")}
            </>;
        }
    },
      {
        Header: 'Address',
        accessor: 'address',
        width: '10%',
        style: {
          textAlign: 'center',
          width: '10%',
          background: '#0000',
        },
        filterable: true,
        Cell: ({ row }) => {
          const { address, pincode } = row.original;
          return <>
            <div>{address?.addressLine1},</div>
            <div>{address?.addressLine2},</div>
            <div>Pincode: {pincode}</div>
          </>;
        },
      },
      {
        Header: 'Zone',
        accessor: 'zone',
        width: '10%',
        style: {
          textAlign: 'center',
          width: '10%',
          background: '#0000',
        },
        filterable: true,
        Cell: ({ row }) => {
          return <>{row?.original?.zone?.name}</>;
        },
      },
      {
        Header: 'City',
        accessor: 'city',
        width: '10%',
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
        Header: 'Action',
        accessor: 'action',
        width: '10%',
        disableFilters: true,
        Cell: (cellProps) => {
          return (
            <div className="d-flex gap-3">
              <Link
                to="#"
                className="text-success"
                onClick={() => {
                  const customerData = cellProps.row.original;
                  handleCustomerClick(customerData);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
              <Link
                to={`/customer-details?customerId=${cellProps.row.original._id}`}
              >
                <i className="mdi mdi-eye font-size-18" id="eyetooltip" />
                <UncontrolledTooltip placement="top" target="eyetooltip">
                  Customer Details
                </UncontrolledTooltip>
              </Link>
              <Link
                to="#"
                className="text-primary"
                onClick={() => {
                  const customerData = cellProps.row.original;
                  setCustomer(customerData);
                  setIsPasswordModalOpen(true);
                }}
              >
                <i className="mdi mdi-account-key font-size-18" id="passwordtooltip" />
                <UncontrolledTooltip placement="top" target="passwordtooltip">
                  Update Password
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


      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Home" breadcrumbItem="Customers" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>

                    <TableContainer
                      columns={columns}
                      data={zone === "All" ? customers : customerData}
                      // isGlobalFilter={true}
                      isCustomGlobalFilter={true}
                      setQuery={setQuery}
                      csvExport={true}
                      exportToCSVButtonClicked={exportToCSVButtonClicked}
                      handleOrderClicks={() => { }}
                      isZoneOptions={true}
                      zones={zones}
                      zone={zone}
                      setZone={setZone}
                      customPageSize={10}
                      isPagination={false}
                      filterable={false}
                      iscustomPageSizeOptions={true}
                      tableClass="align-middle table-check"
                      theadClass="table-light"
                      pagination="pagination pagination-rounded justify-content-end mb-2"
                      isCustomPagination={true}
                      setPage={setPage}
                      pageNumber={pageNumber}
                      totals={totalCustomers}
                      setLimit={setLimit}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>

          {isEdit && (
            <Modal
              isOpen={isEdit}
              role="dialog"
              autoFocus={true}
              centered={true}
              size="lg"
              id="verificationModal"
              tabIndex="-1"
              toggle={() => {
                setIsEdit(!isEdit);
                const customerData = customer; //currrent data
                // Set the selected city based on the customer data for the Zone.
                setSelectedCity(customerData.city);
              }}
            >
              <ModalHeader toggle={() => setIsEdit(!isEdit)}>
                Edit Customer
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
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="lname">First Name</Label>
                        <Input
                          type="text"
                          id="fname"
                          name="fname"
                          placeholder="Enter Name"
                          value={validation.values.fname}
                          onChange={validation.handleChange}
                        />
                        {validation.errors.fname && validation.touched.fname && (
                          <p className="text-danger mt-1">{validation.errors.fname}</p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="lname">Last Name</Label>
                        <Input
                          type="text"
                          id="lname"
                          name="lname"
                          placeholder="Enter Name"
                          value={validation.values.lname}
                          onChange={validation.handleChange}
                        />
                        {validation.errors.lname && validation.touched.lname && (
                          <p className="text-danger mt-1">{validation.errors.lname}</p>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="email">Email </Label>
                        <Input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Enter Email"
                          value={validation.values.email}
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="mobile">Mobile</Label>
                        <Input
                          type="text"
                          id="mobile"
                          name="mobile"
                          placeholder="Enter Mobile No."
                          value={validation.values.mobile}
                          onChange={
                            (e) => {
                              const inputValue = e.target.value;
                              if (inputValue === "" || /^[0-9\b]+$/.test(inputValue))
                                validation.setFieldValue("mobile", inputValue);
                            }
                          }
                        />
                        {validation.errors.mobile && validation.touched.mobile && (
                          <p className="text-danger mt-1">{validation.errors.mobile}</p>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="addressLine1">Address line 1</Label>
                        <Input
                          type="text"
                          id="addressLine1"
                          name="addressLine1"
                          placeholder="Enter Address"
                          value={validation.values.addressLine1}
                          onChange={validation.handleChange}
                        />
                        {validation.errors.addressLine1 && validation.touched.addressLine1 && (
                          <p className="text-danger mt-1">{validation.errors.addressLine1}</p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="addressLine2">Address line 2</Label>
                        <Input
                          type="text"
                          id="addressLine2"
                          name="addressLine2"
                          placeholder="Enter Address"
                          value={validation.values.addressLine2}
                          onChange={validation.handleChange}
                        />
                        {validation.errors.addressLine2 && validation.touched.addressLine2 && (
                          <p className="text-danger mt-1">{validation.errors.addressLine2}</p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="city">City</Label>
                        <Select
                          name="city"
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={cities.map((city) => ({ label: city.name, value: city._id }))}
                          value={{
                            label: cities.find((city) => city._id === validation.values.city)?.name,
                            value: validation.values.city,
                          }}
                          onChange={(selectedOption) => {
                            validation.setFieldValue("city", selectedOption.value);
                            setSelectedCity(selectedOption);
                            validation.setFieldValue("zone", "");
                          }}
                        />
                        {validation.errors.city && validation.touched.city && (
                          <p className="text-danger mt-1">{validation.errors.city}</p>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="zone">Zone</Label>
                        <Select
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={zones
                            .filter((zone) => selectedCity && zone.city._id === selectedCity?.value)
                            .map((zone) => ({ label: zone.name, value: zone._id }))
                          }
                          name="zone"
                          value={{
                            label: zones.find((zone) => zone._id === validation.values.zone)?.name,
                            value: validation.values.zone,
                          }}
                          onChange={(selectedOption) => {
                            validation.setFieldValue("zone", selectedOption.value)
                            setSelectedZone(selectedOption)
                          }}
                        />
                        {validation.errors.zone && validation.touched.zone && (
                          <p className="text-danger mt-1">{validation.errors.zone}</p>
                        )}
                      </FormGroup>
                    </Col>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          type="text"
                          id="pincode"
                          name="pincode"
                          placeholder="Enter Pincode"
                          value={validation.values.pincode}
                          onChange={
                            (e) => {
                              const inputValue = e.target.value;
                              if (inputValue === "" || /^[0-9\b]+$/.test(inputValue))
                                validation.setFieldValue("pincode", inputValue);
                            }
                          }
                        />
                        {validation.errors.pincode && validation.touched.pincode && (
                          <p className="text-danger mt-1">{validation.errors.pincode}</p>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <FormGroup>
                        <Label htmlFor="status">Status</Label>
                        <Select
                          className="text-success"
                          options={[
                            { label: "Active", value: true },
                            { label: "Inactive", value: false },
                          ]}
                          name="status"
                          value={{
                            label: validation.values.isActive ? "Active" : "Inactive",
                            value: validation.values.isActive
                          }}
                          onChange={(selectedOption) => validation.setFieldValue("isActive", selectedOption.value)}
                        />
                        {validation.errors.isActive && validation.touched.isActive && (
                          <p className="text-danger mt-1">{validation.errors.status}</p>
                        )}
                      </FormGroup>
                    </Col>
                  </Row>
                  <ModalFooter>
                    <Button type="submit" color="primary">
                      Save
                    </Button>
                    <Button
                      type="button"
                      color="secondary"
                      onClick={() => setIsEdit(!isEdit)}
                    >
                      Cancel
                    </Button>
                  </ModalFooter>
                </Form>
              </ModalBody>
            </Modal>
          )
          }
          {/* Update Password Modal. */}
          {isPasswordModalOpen && (
            <Modal
                isOpen={isPasswordModalOpen}
                role="dialog"
                autoFocus={true}
                centered={true}
                size="md"
                id="passwordModal"
                tabIndex="-1"
                toggle={() => setIsPasswordModalOpen(true)}
            >
                <ModalHeader toggle={() => setIsPasswordModalOpen(!isPasswordModalOpen)}>
                    Update Password
                </ModalHeader>
                <ModalBody>
                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            return false;
                        }}
                    >
                        <Col md={6}>
                            <FormGroup>
                                <Label htmlFor="newPassword">New Password </Label>
                                <Input
                                    type="password"
                                    id="newPassword"
                                    name="password"
                                    placeholder="Enter New Password"
                                    value={validation.values.password}
                                    onChange={validation.handleChange}
                                />
                                {validation.errors.password && validation.touched.password && (
                                    <p className="text-danger mt-1">{validation.errors.password}</p>
                                )}
                            </FormGroup>
                        </Col>
                        <Col md={6}>
                            <FormGroup>
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Enter Confirm Password"
                                    value={validation.values.confirmPassword}
                                    onChange={validation.handleChange}
                                />
                                {validation.errors.confirmPassword && validation.touched.confirmPassword && (
                                    <p className="text-danger mt-1">{validation.errors.confirmPassword}</p>
                                )}
                            </FormGroup>
                        </Col>
                    </Form>
                </ModalBody>
                <ModalFooter>
                <Button type="button" onClick={() => handlePasswordUpdate(customer?._id)} color="primary"
                  disabled={!customer?._id}
                >
                  Update Password
                </Button>
                    <Button
                        type="button"
                        color="secondary"
                        onClick={() => setIsPasswordModalOpen(!isPasswordModalOpen)}
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        )}
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
}

Customers.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};


export default Customers;