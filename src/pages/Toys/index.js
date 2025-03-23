import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { toast } from "react-toastify";

import {
  getToys as onGetToys,
  addNewToy as onAddNewToy,
  updateToy as onUpdateToy,
  deleteToy as onDeleteToy,
  getCategories as onGetCategories,
  getAgeGroups as onGetAgeGroups,
  getCities as onGetCities,
  updateToy,
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
import { ORDER_STATUS } from "constants/AppConstants";
import { post } from "helpers/api_helper";

//react-select for multi select.
import Select from 'react-select';
import ChangeToyStatusModal from "components/Common/ChangeToyStatusModal";

function Toys() {

  //meta title
  document.title = "Toys List";

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [toyStatusFilter, setToyStatusFilter] = useState("all");
  const [toyCategoryFilter, setToyCategoryFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [activeTab, setactiveTab] = useState("1");

  const [toy, setToy] = useState(null);
  const [cityPricing, setCityPricing] = useState([]);


  const [defaultPhoto, setDefaultPhoto] = useState({
    src: null,
    error: null,
    uploading: false
  });
  const [secondPhoto, setSecondPhoto] = useState({
    src: null,
    error: null,
    uploading: false
  });
  const [thirdPhoto, setThirdPhoto] = useState({
    src: null,
    error: null,
    uploading: false
  });


  // validation
  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      status: (toy && toy.status) || '',
      toyName: (toy && toy.name) || '',
      category: (toy && toy.category?._id) || [],
      ageGroup: (toy && toy.ageGroup && toy.ageGroup.map(age => age._id)) || '',
      mrp: (toy && toy.mrp) || '',
      purchase: (toy && toy.purchase) || '',
      description: (toy && toy.description) || '',
      brand: (toy && toy.brand) || '',
      youtubeUrl: (toy && toy.youtubeUrl) || '',
      showOnWebsite: (toy && toy.showOnWebsite) || false,
      featured: (toy && toy.featured) || false,
      categories: (toy && toy.category && toy.category.map(category => category._id)) || [],
      deposit: (toy && toy.deposit) || '',
      purchaseSource: (toy && toy.purchaseSource) || '',
      purchaseDate: (toy && toy.purchaseDate) || '',

    },
    validationSchema: Yup.object({
      status: Yup.string().required("Please select status"),
      toyName: Yup.string().required("Please Enter Your Toy Name"),
      categories: Yup.array()
        .required("Please select at least one category")
        .min(1, "Please select at least one category"),
      ageGroup: Yup.array().required("Age Group").min(1, "Please select at least one Age Group"),
      showOnWebsite: Yup.boolean(),
      featured: Yup.boolean(),
    }),
    onSubmit: async (values) => {
      const categoryString = values.categories.join(',');
      if (isEdit) {

        const _cityPricing = cityPricing.map((city) => {
          return { ...city, city: city?.city?._id }
        });

        const updateToyData = {
          _id: toy ? toy._id : 0,
          status: values.status,
          name: values.toyName,
          category: categoryString,
          ageGroup: values.ageGroup.join(","), //multiple groups are array, we need string.
          mrp: values.mrp,
          purchase: values.purchase,
          description: values.description,
          brand: values.brand,
          youtubeUrl: values.youtubeUrl,
          cityPricing: _cityPricing,
          showOnWebsite: showOnWebsite,
          deposit: values.deposit,
          purchaseSource: values.purchaseSource,
          purchaseDate: values.purchaseDate,
          featured: featured
        };

        // update toy
        dispatch(updateToy(updateToyData));
        validation.resetForm();
        toggle();
      } else {
        const newToy = {
          status: values["status"],
          name: values["toyName"],
          category: Array.isArray(values["categories"]) ? values["categories"] : [values["categories"]],
          ageGroup: Array.isArray(values["ageGroup"]) ? values["ageGroup"] : [values["ageGroup"]],
          mrp: values["mrp"],
          purchase: values["purchase"],
          description: values["description"],
          brand: values["brand"],
          showOnWebsite: showOnWebsite,
          featured: featured
        };


        // save new toy
        dispatch(onAddNewToy(newToy));
      }

      setFeatured(false);
      setShowOnWebsite(false);
    },
  });


  //Toy availability Toggle:
  const [showOnWebsite, setShowOnWebsite] = useState(validation.values.showOnWebsite || false);
  const [featured, setFeatured] = useState(validation.values.featured || false);

  const toggleViewModal = () => setModal1(!modal1);

  const dispatch = useDispatch();

  const selectToyState = (state) => state.Toy;
  const ToyProperties = createSelector(
    selectToyState,
    (Toy) => ({
      toys: Toy.toys,
      totalPages: Toy.totalPages,
      loading: Toy.loading,
      addedToy: Toy.addedToy,
      showOnWebsite: Toy.showOnWebsite,
      featured: Toy.featured
    })
  );

  const { toys, loading, addedToy, totalPages } = useSelector(ToyProperties);

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
  const { categories } = useSelector(CategoryProperties);
  const options = categories.map(category => ({ label: category.name, value: category._id }));


  //Get Age Groups
  const selectAgeGroupState = (state) => state.AgeGroup;
  const AgeGroupProperties = createSelector(
    selectAgeGroupState,
    (AgeGroup) => ({
      ageGroups: AgeGroup.ageGroups
    })
  );
  const { ageGroups } = useSelector(AgeGroupProperties);

  const ageGroupOptions = ageGroups.map(age => ({
    label: `${age.fromAge} - ${age.toAge} Years`,
    value: age._id
  }));


  const [isLoading, setLoading] = useState(loading)

  useEffect(() => {
    dispatch(onGetCategories())
    dispatch(onGetAgeGroups())
    dispatch(onGetCities())
  }, [dispatch]);

  useEffect(() => {
    dispatch(onGetToys(page, limit, query, toyStatusFilter, toyCategoryFilter));
  }, [page, limit, query, toyStatusFilter, toyCategoryFilter, dispatch]);

  useEffect(() => {
    if (!isEmpty(toys) && !!isEdit) {
      setIsEdit(false);
      setModal(false);
    }
  }, [toys]);


  useEffect(() => {
    if (addedToy) {
      setToy(addedToy);
      setIsEdit(true);
      setactiveTab("photoVideo")
    }
  }, [addedToy])

  useEffect(() => {

    let _cityPricing = [];
    cities.forEach((city) => {

      const price = toy?.cityPricing?.filter(price => price.city?._id?.toString() == city._id?.toString());
      if (price && price.length > 0) {
        _cityPricing.push(price[0])
      }
      else {
        _cityPricing.push({
          city: city,
          w2: 0,
          w3: 0,
          w4: 0
        })
      }
    })

    setCityPricing(_cityPricing);

  }, [cities, toy])

  //reset modal content once pop up closed
  useEffect(() => {
    if (!modal) {
      setModal(false);
      setToy(null);
      setDefaultPhoto({});
      setSecondPhoto({});
      setThirdPhoto({});
    }
  }, [modal])

  const toggle = () => {
    setModal(!modal);
  };



  const handleToyClick = arg => {
    const IMAGE_URL = process.env.REACT_APP_IMAGEBASEURL;

    const toy = arg;

    setToy({
      _id: toy._id,
      status: toy.status,
      name: toy.name,
      category: toy.category,
      ageGroup: toy.ageGroup,
      mrp: toy.mrp,
      purchase: toy.purchase,
      description: toy.description,
      brand: toy.brand,
      youtubeUrl: toy.youtubeUrl,
      cityPricing: toy.cityPricing,
      showOnWebsite: toy.showOnWebsite,
      deposit: toy.deposit, 
      featured: toy.featured,
      showOnWebsite: toy.showOnWebsite,
      purchaseSource: toy.purchaseSource, 
      purchaseDate: toy.purchaseDate?moment(toy.purchaseDate).format("YYYY-MM-DD"): null
    });

    setFeatured(toy.featured);
    setShowOnWebsite(toy.showOnWebsite);
    

    if (toy.defaultPhoto) {
      setDefaultPhoto({
        src: toy?.defaultPhoto,
        error: "",
        uploading: false
      })
    }

    if (toy.photo2) {
      setSecondPhoto({
        src: toy?.photo2,
        error: "",
        uploading: false
      })
    }

    if (toy.photo3) {
      setThirdPhoto({
        src: toy?.photo3,
        error: "",
        uploading: false
      })
    }
    setIsEdit(true);
    toggle();
    setactiveTab("details")
  };

  //delete toy
  const [deleteModal, setDeleteModal] = useState(false);

  const onClickDelete = (toy) => {
    setToy(toy);
    setDeleteModal(true);
  };

  const handleDeleteToy = () => {
    if (toy && toy._id) {
      dispatch(onDeleteToy(toy._id));
      setDeleteModal(false);
    }
  };
  const handleToyClicks = () => {
    setactiveTab("details");
    setToy({
      _id: 0,
      status: "",
      name: "",
      category: [],
      ageGroup: [],
      mrp: "",
      purchase: "",
      description: "",
      brand: "",
      youtubeUrl: "",
      cityPricing: [],
      showOnWebsite: false,
      deposit: "",
      featured: false,
      purchaseSource: "",
      purchaseDate: ""
    });
    setIsEdit(false);
    toggle();
  };

  const toggleTab = tab => {
    if (activeTab !== tab) {
      setactiveTab(tab);
    }
  };

  const handleFileInputChange = async (event, setPhotoState, key, data) => {
    const file = event.target.files[0];
    if (file) {
      if (validateFileType(file) && validateFileSize(file)) {
        try {
          const formData = new FormData();
          formData.append('image', file);
          formData.append('_id', toy._id);
          formData.append('key', key);

          setPhotoState({ ...data, uploading: true })
          const response = await post('toys/uploadImage', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.status === 200) {
            setPhotoState({
              src: URL.createObjectURL(file),
              error: "",
              uploading: false
            });
            setToy({ ...toy, [key]: URL.createObjectURL(file) })
          } else {
            setPhotoState({
              ...data,
              error: "Error in uploading image",
              uploading: false
            });
          }
        } catch (error) {
          setPhotoState({
            ...data,
            error: "Error in uploading image",
            uploading: false
          });
        }
      } else {
        setPhotoState({
          ...data,
          error: "Please select a valid image file (png, jpg, jpeg) with a maximum size of 2MB.",
          uploading: false
        });

      }
    }
  };

  const validateFileType = (file) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    return allowedTypes.includes(file.type);
  };

  const validateFileSize = (file) => {
    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    return file.size <= maxSize;
  };

  const changeCityPricing = (e, week, city) => {
    let price = parseFloat(e.target.value);
    if (isNaN(price)) {
      price = 0
    }

    const _cityPricing = [...cityPricing];
    const index = _cityPricing.findIndex(cityPrice => cityPrice?.city?._id?.toString() == city?.toString())
    _cityPricing[index][week] = price;

    setCityPricing(_cityPricing);

  }

  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [selectedToy, setSelectedToy] = useState({});

  

  const toggleCanvas = () => {
      setIsCanvasOpen(!isCanvasOpen);
  };

  const onToyClick= (toyDetails) => {
    toggleCanvas();
    setSelectedToy(toyDetails);
}

  const [orderChecked, setOrderChecked] = useState([]);
  const [allChecked, setAllChecked] = useState(false);
  const [openChangeStatusModal, setOpenChangeStatusModal] = useState(false);
  const [toysStatus, setToysStatus] = useState("");

  const handleToyStatusClick = async () => {
    try {
      if(toysStatus === "") {
        toast.error("Please select status");
        return;
      }
      const res = await post("toys/updateStatus", { toys: orderChecked, status: toysStatus });
      if (res.success) {
        toast.success("Status updated successfully");
        setOpenChangeStatusModal(false);
        dispatch(onGetToys(page, limit, query, toyStatusFilter, toyCategoryFilter));
        setToysStatus("");
        setOrderChecked([]);
        setAllChecked(false);
      }
    } catch (error) {
      let msg = error.response.data.error || "Error in updating toy status";
      toast.error(msg);
      console.log("Error in updating toy status::", error);
    }
    
  }


  const columns = useMemo(
    () => [
      {
        Header: 'Toy ID',
        accessor: 'toyId',
        width: '150px',
        style: {
          textAlign: "center",
          width: "10%",
          background: "#0000",
        },
        filterable: true,
        Cell: (row) => {
          return <>{`TTRC${row?.row?.original?.toyId||0}`}</>
        }
      },
      {
        Header: 'Toy Name',
        accessor: 'name',
        filterable: true,
        Cell: (row) => {
          return <>{row?.row?.original?.name}</>
        }
      },
      {
        Header: 'Category',
        accessor: 'category',
        filterable: true,
        Cell: (row) => {
          return <>
            {
              row?.row?.original?.category?.map((category, index) => 
                <div key={index}>
                  {
                    index === row?.row?.original?.category?.length - 1 ? category.name : category.name + ", "
                  }
                </div>
              )
            }
          </>
        }
      },
      {
        Header: 'Age Group',
        accessor: 'ageGroup',
        filterable: true,
        Cell: (row) => {
          return <>
            {
              row?.row?.original?.ageGroup?.map((age, index) => 
                <div key={index}>
                  {
                    index === row?.row?.original?.ageGroup?.length - 1 ? `${age.fromAge} - ${age.toAge} Years` : `${age.fromAge} - ${age.toAge} Years, `
                  }
                </div>
              )
            }
          </>
        }
      },
      {
        Header: "2 Week's Rent",
        accessor: 'mrp',
        filterable: true,
        Cell: (row) => {
          const price= row?.row?.original?.cityPricing[0]?.w2;
          return `₹ ${price||0}`;
        }
      },
      {
        Header: 'Deposit',
        accessor: 'deposit',
        Cell: (row) => {
          return `₹ ${row?.row?.original?.deposit||0}`;
        }
      },
      {
        Header: 'Purchase',
        accessor: 'purchase',
        Cell: (row) => {
          return `₹ ${row?.row?.original?.purchase||0}`;
        }
      },
      {
        Header: 'Purchase Date',
        accessor: 'purchaseDate',
        Cell: (row) => {
          return row?.row?.original?.purchaseDate?(moment(row?.row?.original?.purchaseDate).format("DD-MM-YYYY")): "";
        }
      },
      {
        Header: 'Status',
        accessor: "status", 
        Cell: (row) => {
          return <>
            {row?.row?.original?.status}
          </>
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
                  const toyData = cellProps.row.original;
                  handleToyClick(toyData);
                }}
              >
                <i className="mdi mdi-pencil font-size-18" id="edittooltip" />
                <UncontrolledTooltip placement="top" target="edittooltip">
                  Edit
                </UncontrolledTooltip>
              </Link>
              <Link
                to={`/order-history?toyId=${cellProps.row.original._id}`}
              >
                <i className="mdi mdi-eye font-size-18" id="eyetooltip" />
                <UncontrolledTooltip placement="top" target="eyetooltip">
                  Order History
                </UncontrolledTooltip>
              </Link>
              <Link
                to="#"
                className="text-danger"
                onClick={() => {
                  const toyData = cellProps.row.original;
                  onClickDelete(toyData);
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
      // {
      //   Header: "Order History",
      //   accessor: "orderHistory",
      //   width: "150px",
      //   style: {
      //       textAlign: "center",
      //       width: "10%",
      //       background: "#0000",
      //   },
      //   filterable: true,
      //   Cell: ({ row }) => {
            
      //       return (
      //           <Button
      //               color="primary"
      //               onClick={() => onToyClick(row?.original)}
      //           >
      //               View
      //           </Button>
      //       );
      //   }
      // }
    ],
    []
  );

  return (
    <React.Fragment>

      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteToy}
        onCloseClick={() => setDeleteModal(false)}
        title={"Toy"}
      />

      <ChangeToyStatusModal 
        show={openChangeStatusModal}
        onUpdateClick={() => handleToyStatusClick()}
        onCloseClick={() => {
          setOpenChangeStatusModal(false);
          setToysStatus("");
        }}
        toysStatus={toysStatus}
        setToysStatus={setToysStatus}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Masters" breadcrumbItem="Toys" />
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <TableContainer
                      title={"Toy"}
                      columns={columns}
                      data={toys}
                      // isGlobalFilter={true}
                      isAddOptions={true}
                      isCustomGlobalFilter={true}
                      setQuery={setQuery}
                      handleOrderClicks={handleToyClicks}
                      customPageSize={limit}
                      setLimit={setLimit}
                      // isPagination={true}
                      filterable={false}
                      iscustomPageSizeOptions={true}
                      isCustomPagination={true}
                      tableClass="align-middle table-check"
                      theadClass="table-light"
                      pagination="pagination pagination-rounded justify-content-end mb-2"
                      setPage={setPage}
                      pageNumber={page}
                      totals={totalPages}
                      orderChecked={orderChecked}
                      setOrderChecked={setOrderChecked}
                      allChecked={allChecked}
                      setAllChecked={setAllChecked}
                      isCheckable={true}
                      // setOrderStatus,
                      toyPage={true}
                      setOpenChangeStatusModal={setOpenChangeStatusModal}
                      toyStatusFilter={toyStatusFilter}
                      setToyStatusFilter={setToyStatusFilter}
                      toyCategoryFilter={toyCategoryFilter}
                      setToyCategoryFilter={setToyCategoryFilter}
                      categories={categories}
                    />
                  </CardBody>
                </Card>
              </Col>
            </Row>
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
                <Nav tabs className="nav-tabs-custom">
                  <NavItem>
                    <NavLink
                      style={{ cursor: "pointer" }}
                      className={classnames({
                        active: activeTab === "details",
                      })}
                      onClick={() => {
                        toggleTab("details");
                      }}
                    >
                      Toy Details
                    </NavLink>
                  </NavItem>
                  {isEdit ?
                    <>
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
                            active: activeTab === "pricing",
                          })}
                          onClick={() => {
                            toggleTab("pricing");
                          }}
                        >
                          Pricing
                        </NavLink>
                      </NavItem>
                    </>
                    : null}

                </Nav>

                <TabContent activeTab={activeTab} className="p-3 text-muted">
                  {/*save in availability field of backend */}
                  <TabPane tabId="details">
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
                        className="col-sm-3 col-form-label">Category</Label>
                      <Col sm={9}>
                        <Select
                          isMulti
                          className="react-select-container"
                          classNamePrefix="react-select"

                          name="categories"
                          options={options}
                          value={options.filter((option) => validation.values.categories.includes(option.value))}
                          onChange={(selectedOptions) => {
                            validation.setFieldValue("categories", selectedOptions.map((option) => option.value));
                          }}
                        />
                        {validation.touched.categories && validation.errors.categories ? (
                          <FormFeedback type="invalid" className="d-block">{validation.errors.categories}</FormFeedback>
                        ) : null}
                      </Col>

                    </Row>
                    <Row className="mb-4">
                      <Label className="col-sm-3 col-form-label">Age Group</Label>
                      <Col sm={9}>
                        {/* Multiple options */}
                        <Select
                          isMulti
                          name="ageGroup"
                          className="react-select-container"
                          classNamePrefix="react-select"
                          options={ageGroupOptions}
                          value={ageGroupOptions.filter(option => validation.values.ageGroup.includes(option.value))}
                          onChange={selectedOptions => validation.setFieldValue('ageGroup', selectedOptions.map(option => option.value))}
                        />
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
                          <option value="">Select Availability</option>
                          <option value={ORDER_STATUS.AVAILABLE}>{ORDER_STATUS.AVAILABLE}</option>
                          <option value={ORDER_STATUS.RENTED}>{ORDER_STATUS.RENTED}</option>
                          <option value={ORDER_STATUS.ONHOLD}>{ORDER_STATUS.ONHOLD}</option>
                          <option value={ORDER_STATUS.CLEANING}>{ORDER_STATUS.CLEANING}</option>
                          <option value={ORDER_STATUS.BROKEN}>{ORDER_STATUS.BROKEN}</option>
                          <option value={ORDER_STATUS.MAINTENANCE}>{ORDER_STATUS.MAINTENANCE}</option>
                        </Input>
                        {validation.touched.status && validation.errors.status ? (
                          <FormFeedback type="invalid" className="d-block">{validation.errors.status}</FormFeedback>
                        ) : null}
                      </Col>
                    </Row>
                    {/* Toy Toggle: */}
                    <Row className="mb-3">
                      <Label className="col-sm-3 col-form-label">Show on Website</Label>
                      <Col sm={9}>
                        <div className="form-check form-switch">
                          <Input
                            name="showOnWebsite"
                            type="checkbox"
                            className="form-check-input"
                            checked={showOnWebsite}
                            value={validation.values.showOnWebsite || false}
                            onChange={() => setShowOnWebsite(!showOnWebsite)}
                          />
                          <Label className="form-check-label">{showOnWebsite ? "Yes" : "No"}</Label>
                        </div>
                      </Col>
                    </Row>
                    {/* Featured Toy Toggle  */}
                    <Row className="mb-3">
                      <Label className="col-sm-3 col-form-label">Featued</Label>
                      <Col sm={9}>
                        <div className="form-check form-switch">
                          <Input
                            name="featured"
                            type="checkbox"
                            className="form-check-input"
                            checked={featured}
                            value={validation.values.featured || false} 
                            onChange={() => setFeatured(!featured)}
                          />
                          <Label className="form-check-label">{featured ? "Yes" : "No"}</Label>
                        </div>
                      </Col>
                    </Row>

                  </TabPane>
                  <TabPane tabId="photoVideo">
                    <Row className="mb-3">
                      <Label className="col-sm-3 col-form-label"><strong>Default Photo</strong></Label>
                      <Col sm={9}>
                        <Input
                          name="image"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"

                          placeholder="Select toy photo"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={(e) => handleFileInputChange(e, setDefaultPhoto, 'defaultPhoto', defaultPhoto)}

                        />

                        {defaultPhoto?.src && (
                          <img src={defaultPhoto?.src} alt="Default" className="preview-image" />
                        )}
                        {defaultPhoto.uploading && (
                          <span className="text-warning">Uploading <i className="fa fas-spinner spin"></i></span>
                        )}
                        {defaultPhoto.error && (
                          <span className="text-danger">{defaultPhoto.error}</span>
                        )}
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Label className="col-sm-3 col-form-label"><strong>Photo 2</strong></Label>
                      <Col sm={9}>
                        <Input
                          name="image"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"

                          placeholder="Select toy photo"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={(e) => handleFileInputChange(e, setSecondPhoto, 'photo2', secondPhoto)}

                        />
                        {secondPhoto?.src && (
                          <img src={secondPhoto?.src} alt="Default" className="preview-image" />
                        )}
                        {secondPhoto.uploading && (
                          <span className="text-warning">Uploading <i className="fa fas-spinner spin"></i></span>
                        )}
                        {secondPhoto.error && (
                          <span className="text-danger">{secondPhoto.error}</span>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Label className="col-sm-3 col-form-label"><strong>Photo 3</strong></Label>
                      <Col sm={9}>
                        <Input
                          name="image"
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"

                          placeholder="Select toy photo"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={(e) => handleFileInputChange(e, setThirdPhoto, 'photo3', thirdPhoto)}

                        />
                        {thirdPhoto?.src && (
                          <img src={thirdPhoto?.src} alt="Default" className="preview-image" />
                        )}
                        {thirdPhoto.uploading && (
                          <span className="text-warning">Uploading <i className="fa fas-spinner spin"></i></span>
                        )}
                        {thirdPhoto.error && (
                          <span className="text-danger">{thirdPhoto.error}</span>
                        )}
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Label className="col-sm-3 col-form-label">YouTube Video</Label>
                      <Col sm={9}>
                        <Input
                          name="youtubeUrl"
                          type="text"
                          placeholder="Paste youtube video link here"
                          validate={{
                            required: { value: true },
                          }}
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.youtubeUrl || ""}
                          invalid={
                            validation.touched.youtubeUrl && validation.errors.youtubeUrl ? true : false
                          }
                        />
                        {validation.touched.youtubeUrl && validation.errors.youtubeUrl ? (
                          <FormFeedback type="invalid">{validation.errors.youtubeUrl}</FormFeedback>
                        ) : null}
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tabId="pricing">
                    <Row>
                      <Col>
                        <div className="table-responsive">
                          <Table className="table table-bordered border-primary mb-0">
                            <thead>
                              <tr>
                                <th>City</th>
                                <th>2 Week</th>
                                <th>3 Week</th>
                                <th>4 Week</th>
                              </tr>
                            </thead>
                            <tbody>

                              {cityPricing.map((pricing) => (
                                <tr key={pricing.city?._id}>
                                  <td>{pricing.city?.name}</td>
                                  <td>
                                    <Input
                                      name="price"
                                      type="text"
                                      placeholder=""
                                      validate={{
                                        required: { value: true },
                                      }}

                                      value={pricing?.w2}
                                      onChange={(e) => changeCityPricing(e, "w2", pricing?.city?._id)}

                                    />
                                  </td>
                                  <td>
                                    <Input
                                      name="price"
                                      type="text"
                                      placeholder=""
                                      validate={{
                                        required: { value: true },
                                      }}

                                      value={pricing?.w3}
                                      onChange={(e) => changeCityPricing(e, "w3", pricing?.city?._id)}
                                    />
                                  </td>
                                  <td>
                                    <Input
                                      name="price"
                                      type="text"
                                      placeholder=""
                                      validate={{
                                        required: { value: true },
                                      }}

                                      value={pricing?.w4}
                                      onChange={(e) => changeCityPricing(e, "w4", pricing?.city?._id)}
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
                        <Col sm={3}>
                          <Label className="col-form-label">MRP</Label>
                          
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
                          <Col sm={3}>
                          <Label className="col-form-label text-end">Purchase</Label>
                          
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

                          <Col sm={3}>
                          <Label className="col-form-label text-end">Purchase Date</Label>
                          
                            <Input
                              name="purchaseDate"
                              type="date"
                              placeholder="Purchase Date"
                              validate={{
                                required: { value: true },
                              }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.purchaseDate || ""}
                              invalid={
                                validation.touched.purchaseDate && validation.errors.purchaseDate ? true : false
                              }
                            />
                            {validation.touched.purchaseDate && validation.errors.purchaseDate ? (
                              <FormFeedback type="invalid">{validation.errors.purchaseDate}</FormFeedback>
                            ) : null}
                          </Col>

                          <Col sm={3}>
                          <Label className="col-form-label text-end">Purchase Source</Label>
                          
                            <Input
                              name="purchaseSource"
                              type="text"
                              placeholder="Purchase Source"
                              validate={{
                                required: { value: true },
                              }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.purchaseSource || ""}
                              invalid={
                                validation.touched.purchaseSource && validation.errors.purchaseSource ? true : false
                              }
                            />
                            {validation.touched.purchaseSource && validation.errors.purchaseSource ? (
                              <FormFeedback type="invalid">{validation.errors.purchaseSource}</FormFeedback>
                            ) : null}
                          </Col>

                        </Row>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                    <Col sm={3}>
                          <Label className="col-form-label text-end">Deposit</Label>
                          
                            <Input
                              name="deposit"
                              type="text"
                              placeholder="Deposit"
                              validate={{
                                required: { value: true },
                              }}
                              onChange={validation.handleChange}
                              onBlur={validation.handleBlur}
                              value={validation.values.deposit || ""}
                              invalid={
                                validation.touched.deposit && validation.errors.deposit ? true : false
                              }
                            />
                            {validation.touched.deposit && validation.errors.deposit ? (
                              <FormFeedback type="invalid">{validation.errors.deposit}</FormFeedback>
                            ) : null}
                          </Col>
                        </Row>
                  </TabPane>


                </TabContent>

                <Row>
                  <Col>
                    <div className="text-end">
                      {loading ?
                        <button
                          type="button"
                          className="btn btn-success"
                          disabled
                        >
                          Processing...
                        </button> :
                        <button
                          type="submit"
                          className="btn btn-success save-user"
                        >
                          {isEdit ? "Update" : "Save"} Toy
                        </button>
                      }
                      <button
                        type="button"
                        className="btn btn-secondary ms-2"
                        onClick={() => setModal(false)}
                      >
                        Close
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
Toys.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};


export default Toys;