import PropTypes from 'prop-types'
import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { 
    Col,
    Row,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Form,
    Label,
    Input,
    Spinner,
} from "reactstrap";

import {
    getAllCustomers,
    getToys,
} from "store/actions";
import Select from "react-select"
import { createSelector } from "reselect";
import { get, post } from 'helpers/api_helper';
import moment from 'moment';
import { toast } from 'react-toastify';
import { debounce } from 'lodash';


const AddOrderModal = ({ show, getAllOrders, onCloseClick }) => {
    const dispatch = useDispatch();
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [selectedToy, setSelectedToy] = useState(null);
    const [selectedDuration, setSelectedDuration] = useState({
        value: 2,
        label: "2 weeks",
    });
    const [toyAvailabilty, setToyAvailabilty] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [rent, setRent] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(null);
    const [pickupPointSelected, setPickupPointSelected] = useState(false);
    const [pickupPoint, setPickupPoint] = useState(null);
    const [pickupPoints, setPickupPoints] = useState([]);
    const [loading, setLoading] = useState(false);

    const resetStates = () => {
        setSelectedToy(null);
        setQuery("");
        setSelectedDuration(null);
        setToyAvailabilty(null);
        setSelectedTimeSlot(null);
        setRent(null);
        setPickupPointSelected(false);
        setPickupPoint(null);
        setPickupPoints([]);
    }

    const handleCustomerChange = (selectedOption) => {
        const customer = allCustomers.find(c => c._id === selectedOption.value);
        setSelectedCustomer({ value: customer._id, label: `${customer.fname} ${customer.lname}`, customer: customer });
        setSelectedEmail({ value: customer._id, label: customer.email });
        resetStates();
    };

    const handleEmailChange = (selectedOption) => {
        const customer = allCustomers.find(c => c._id === selectedOption.value);
        setSelectedCustomer({ value: customer._id, label: `${customer.fname} ${customer.lname}`, customer: customer });
        setSelectedEmail({ value: customer._id, label: customer.email });
        setPickupPointSelected(false);
        resetStates();
    };

    const calculateRent = () => {
        if (!selectedCustomer || !selectedToy || !selectedDuration) {
            setRent(null);
            return;
        }

        const { cityPricing, deliveryFee } = selectedCustomer;
        if (!cityPricing) {
            setRent("Toy Not Available in this city");
            return;
        }

        let calculatedRent = 0;
        switch (selectedDuration.value) {
            case 2:
                calculatedRent = cityPricing.w2;
                break;
            case 3:
                calculatedRent = cityPricing.w3;
                break;
            case 4:
                calculatedRent = cityPricing.w4;
                break;
            default:
                calculatedRent = 0;
                break;
        }
        setRent(calculatedRent);
        setDeliveryFee(deliveryFee || 0);
    };

    const selectTimeSlot = (slot) => {
        setSelectedTimeSlot(slot);
    };

    useEffect(() => {
        calculateRent(); 
    }, [ selectedDuration]);

    const handleToyChange = async (selectedOption) => {
        setSelectedToy(selectedOption);
        const toy = selectedOption?.value;
        const customerId = selectedCustomer?.value;
        const customer = allCustomers.find(c => c._id === customerId);
        const customerCity = customer?.city.name;
        const toyDetails = toys.find(t => t._id === toy);
        const cityPricing = toyDetails?.cityPricing.find(cp => cp.city.name === customerCity);

        if (!cityPricing) {
            setRent(null);
            return;
        }

        setSelectedCustomer((prev) => ({
            ...prev,
            cityPricing,
            deliveryFee: customer?.zone?.deliveryFee || 0
        }));
    };

    const getToyAvailablilty = async (toy, customerId) => {
        setLoading(true);
        try {
            const pickupPoint = pickupPointSelected;
            const res = await post(`/toys/getToyAvailablilty`, { toy, customerId, pickupPoint, duration: selectedDuration?.value });
            if (res.success === false) {
                toast.error(res.message);
                return;
            }
            const { availability } = res;
            setToyAvailabilty(availability);
            setSelectedTimeSlot(null);
        } catch (error) {
            console.log("Failed to get toy availability", error);
        }
        setLoading(false);
    }

    useEffect(() => {
        if (selectedToy && selectedCustomer && selectedDuration) {
            getToyAvailablilty(selectedToy?.value, selectedCustomer?.value);
        }
    }, [selectedDuration, selectedToy, pickupPointSelected]);

    const handleDurationChange = (selectedOption) => {
        setSelectedDuration(selectedOption);
        calculateRent();
    };

    const Duration = [2, 3, 4]; //Duration in weeks
    //Select tag CSS:
    const customStyles = {
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#007bff' : state.isFocused ? '#f1f1f1' : null,
            color: state.isSelected ? '#fff' : '#333',
            padding: 10,
        }),
        control: (provided) => ({
            ...provided,
            border: '1px solid #ced4da',
            borderRadius: '4px',
            boxShadow: 'none',
            '&:hover': {
                border: '1px solid #007bff',
            },
        }),
        menu: (provided) => ({
            ...provided,
            zIndex: 9999,
        }),
    };

    const selectCustomerState = (state) => state.Customer;
    const ExistingCustomers = createSelector(
        selectCustomerState,
        (Customer) => ({
            allCustomers: Customer.allCustomers,
        })
    );
    const { allCustomers } = useSelector(ExistingCustomers);

    const selectToyState = (state) => state.Toy;
    const ToyProperties = createSelector(
        selectToyState,
        (Toy) => ({
            toys: Toy.toys
        })
    );
    const { toys } = useSelector(ToyProperties);;

    const handleSave = async () => {
        if (!selectedCustomer || !selectedToy || !selectedDuration || !selectedTimeSlot) {
            toast.error("Please fill all the fields");
            return;
        }

        if(pickupPointSelected && ( !pickupPoint || !pickupPoint.value)) {
            toast.error("Please select a pickup point");
            return;
        }

        if (!toyAvailabilty[`w${selectedDuration.value}`].includes(selectedTimeSlot)) {
            toast.error("Toy not available for the selected time slot");
            return;
        }

        const newOrder = {
            customerId: selectedCustomer?.value,
            toyId: selectedToy?.value,
            duration: selectedDuration?.value,
            deliveryDate: new Date(selectedTimeSlot).toISOString(),
            selfPickup: pickupPointSelected ? pickupPoint?.value : null,
        };

        setLoading(true);
        try {
            const res = await post(`orders/add`, newOrder);
            toast.success("Order added successfully");
            getAllOrders();
            closeModal();
        } catch (error) {
            console.log("Failed to add order", error);
            let msg = error?.response?.data?.message || "Failed to add order";
            toast.error(msg);
        }
        setLoading(false);
    };


    const [query, setQuery] = useState("");
    const [searchType, setSearchType] = useState('name');
    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };
    useEffect(() => {
        dispatch(getToys(1, 100, "", "all", "all", "all"));
    }, [dispatch]);

    useEffect(() => {
        if(query?.length > 0) {
            dispatch(getAllCustomers(query, searchType));
        }
    }, [query, searchType, dispatch]);

    const debouncedSetQuery = useCallback(
        debounce((inputValue) => {
            setQuery(inputValue);
        }, 300), 
        []
    );

    const fetchPickUpPoints = async () => {
        try {
          const res = await get(`orders/pickup-points/${selectedCustomer?.value}`);
          setPickupPoints(res?.pickUpPoints);
        } catch (error) {
          console.log("Error in fetching pick up points", error);
        }
    }

    useEffect(() => {
        if (selectedCustomer) {
          fetchPickUpPoints();
        }
    }, [selectedCustomer]);

    useEffect(() => {
        handleToyChange(selectedToy);
    }, [pickupPointSelected]);

    const closeModal = () => {
        onCloseClick();
        setSelectedCustomer(null);
        setSelectedEmail(null);
        resetStates();
    };

    return (
        <Modal size="lg" isOpen={show} toggle={closeModal} centered={true}>
            <ModalHeader toggle={closeModal}>Add Order</ModalHeader>
            <ModalBody>
                <Form>
                    <Row className="mb-3">
                        <Col md={6} className=' d-flex gap-2 align-items-center'>
                            <Label>Search By:</Label>
                            <div className=' d-flex gap-4'>
                                <label htmlFor="searchByName" style={{cursor: "pointer"}} className=' d-flex gap-1 align-items-center'>
                                    <input
                                        type="radio"
                                        id="searchByName"
                                        name="searchType"
                                        value="name"
                                        checked={searchType === 'name'}
                                        onClick={handleSearchTypeChange}
                                        style={{cursor: "pointer"}}
                                    /> Name
                                </label>
                                <label htmlFor="searchByEmail" style={{cursor: "pointer"}} className=' d-flex gap-1 align-items-center'>
                                    <input
                                        type="radio"
                                        id="searchByEmail"
                                        name="searchType"
                                        value="email"
                                        checked={searchType === 'email'}
                                        onClick={handleSearchTypeChange}
                                        style={{cursor: "pointer"}}
                                    /> Email
                                </label>
                            </div>
                        </Col>
                        {
                            searchType === "name" ?
                            <Col md={6}>
                                <Label>Customer:</Label>
                                <Select
                                    styles={customStyles}
                                    value={selectedCustomer}
                                    onChange={handleCustomerChange}
                                    options={allCustomers.map((customer) => ({ value: customer?._id, label: customer?.fname + " " + customer?.lname }))}
                                    placeholder="Select Customer"
                                    onInputChange={debouncedSetQuery}
                                />
                            </Col>
                            :
                            <Col md={6}>
                                <Label>Email:</Label>
                                <Select
                                    styles={customStyles}
                                    value={selectedEmail}
                                    onChange={handleEmailChange}
                                    options={allCustomers.map((customer) => ({ value: customer?._id, label: customer?.email}))}
                                    placeholder="Select Email"
                                    onInputChange={debouncedSetQuery}
                                />
                            </Col>
                        }
                    </Row>
                    <Row className="mb-3">
                    </Row>
                    <Row className="mb-3">
                        {
                            selectedCustomer && (
                                <Col md={12}>
                                    <Label> 
                                        Selected Customer : 
                                    </Label>
                                    <div className='border border-1 border-primary rounded-3 p-2 d-flex flex-column flex-md-row'>
                                        <Col md={6} className=' d-flex flex-column'>
                                            <Label><strong>Name:</strong> {selectedCustomer?.customer?.fname} {selectedCustomer?.customer?.lname}</Label>
                                            <Label><strong>Email:</strong> {selectedCustomer?.customer?.email}</Label>
                                            <Label><strong>Mobile:</strong> {selectedCustomer?.customer?.mobile}</Label>
                                        </Col>
                                        <Col md={6}  className=' d-flex flex-column'>
                                            <Label><strong>City:</strong> {selectedCustomer?.customer?.city?.name}</Label>
                                            <Label><strong>Zone:</strong> {selectedCustomer?.customer?.zone?.name}
                                                <span style={{fontStyle: "italic"}} className=' text-secondary'>
                                                    { " (Home Delivery: "}{selectedCustomer?.customer?.zone?.homeDelivery ? 
                                                    <i className="fas fa-check text-success"></i> : 
                                                    <i className="fas fa-times text-danger"></i>} {")"}
                                                </span>
                                            </Label>
                                            <Label><strong>Pincode:</strong> {selectedCustomer?.customer?.pincode}</Label>
                                        </Col>
                                    </div>
                                </Col>
                            )
                        }
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Label>Toy:</Label>
                            <Select
                                styles={customStyles}
                                value={selectedToy}
                                onChange={handleToyChange}
                                options={toys.map((toy) => ({ value: toy._id, label: toy.name }))}
                                placeholder="Select Toy"
                                isDisabled={!selectedCustomer && !selectedEmail}
                            />
                        </Col>
                        <Col md={6}>
                            <Label>Duration:</Label>
                            <Select
                                styles={customStyles}
                                value={selectedDuration}
                                onChange={handleDurationChange}
                                options={Duration.map((duration) => ({ value: duration, label: duration + " weeks" }))}
                                placeholder="Select Duration (weeks)"
                                isDisabled={!selectedToy}
                            />
                        </Col>
                    </Row>
                    <Row className="mb-4">
                        {
                            selectedToy && (
                                <Col className="md-6">
                                    <div className="d-flex gap-2">
                                        <Input className="pe-auto" type="checkbox" id="selfPickup" checked={pickupPointSelected}
                                            onClick={(e) => {
                                                setPickupPointSelected((prev) => !prev);
                                                setSelectedTimeSlot(null);
                                                setPickupPoint(null);
                                            }}
                                        />
                                        <Label for="selfPickup" className="pe-auto">Self PickUp from Store/Centre</Label>
                                    </div>
                                </Col>
                            )
                        }
                        {
                            pickupPointSelected && (
                                <Col md="6">
                                    <Select
                                        styles={customStyles}
                                        placeholder="Select Pickup Point"
                                        options={pickupPoints.map((point) => {
                                            return {
                                                value: point._id,
                                                label: point.storeName,
                                            };
                                        })}
                                        value={pickupPoint}
                                        onChange={(e) => {
                                            setPickupPoint({
                                                value: e.value,
                                                label: e.label,
                                            });
                                        }}
                                    />
                                </Col>
                            )

                        }
                    </Row>
                    {
                        selectedToy && selectedDuration &&
                        <Row >
                            <Col md="12">
                                <Label>Delivery Slots:</Label>
                                {
                                    loading ? 
                                    <div className=' my-4'>
                                        <Spinner color="primary" className='position-absolute top-50 start-50' />
                                    </div>
                                    :
                                    <div className="row gap-2 mx-auto">
                                    {
                                        toyAvailabilty && toyAvailabilty[`w${selectedDuration.value}`] && toyAvailabilty[`w${selectedDuration.value}`].length > 0 ? (
                                            toyAvailabilty[`w${selectedDuration.value}`].map((item, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => selectTimeSlot(item)}
                                                    // variant={item == selectedTimeSlot ? 'primary' : 'outline-secondary'}
                                                    className={`col-2 border border-1 border-primary rounded-3 p-2 ${item === selectedTimeSlot ? "bg-primary text-white" : ""}`}
                                                >
                                                    <div>{moment(item).format("ddd")}</div>
                                                    <div>{moment(item).format("DD MMM")}</div>
                                                </button>
                                            ))
                                        ) : (
                                            <div className=" border border-1 border-danger rounded-3 p-2">
                                                <span className="text-danger"><strong >Delivery Slots Not Available!</strong> <br />Slots not available for selected duration for the toy.Our pre-booking slots open 60 days before.</span>
                                            </div>
                                        )
                                    }
                                </div>
                                }
                            </Col>
                        {
                            selectedTimeSlot &&
                            <Col md={6} className=' mt-4 d-flex flex-column'>
                                <Label><strong>Rent:</strong> {rent !== null ? `₹ ${rent} (for ${selectedDuration?.label})` : "Select Toy and Duration."}</Label>
                                {
                                    deliveryFee !== null && <Label><strong>Delivery Fee:</strong> ₹ {
                                        pickupPointSelected ? 0 : deliveryFee
                                    }</Label>
                                }
                            </Col>
                        }
                    </Row>
                    }
                </Form>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={closeModal}>Cancel</Button>
                <Button color="primary" onClick={handleSave} disabled={loading}>Save</Button>
            </ModalFooter>
        </Modal>
    )
}

AddOrderModal.propTypes = {
    show: PropTypes.bool,
    getAllOrders: PropTypes.func,
    onCloseClick: PropTypes.func,
}

export default AddOrderModal
