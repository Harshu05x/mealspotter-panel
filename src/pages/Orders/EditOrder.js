import Spinners from "components/Common/Spinner"
import { formatDate, formatDateWithDay } from "helpers/date_helper"
import PropTypes from "prop-types"
import React from "react"
import Select from "react-select"
import {
  Button,
  Col,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap"

const EditOrderModal = ({
  show,
  onCloseClick,
  selectedOrder,
  duration,
  setDuration,
  pickupPointSelected,
  pickupPoints,
  availabilityLoading,
  saveOrder,
  toyError,
  toys,
  selectedToy,
  setPickupPointSelected,
  setPickupPoint,
  availableDates,
  setToyError,
  setAvailabilityLoading,
  deliveryDate,
  setDeliveryDate,
  pickupPoint,
  setSelectedToy
}) => {
  return (
    <Modal size="lg" isOpen={show} toggle={onCloseClick} centered={true}>
      <ModalHeader toggle={onCloseClick}>Edit Order</ModalHeader>
      <ModalBody>
        <h5>Old Data</h5>
        <div className=" d-flex flex-column border border-1 border-primary rounded-3 px-4 py-2 mb-4 gap-1">
          <div className="d-flex gap-2 align-items-center">
            <strong>Order ID: </strong>
            <span>{selectedOrder?.orderId}</span>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <strong>Customer Name: </strong>
            <span>
              {selectedOrder?.customer?.fname +
                " " +
                selectedOrder?.customer?.lname}
            </span>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <strong>Current Toy: </strong>
            <strong className="text-primary">{selectedOrder?.toy?.name}</strong>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <strong>Delivery Date: </strong>
            <strong className="text-primary">
              {formatDate(selectedOrder?.deliveryDate)}
            </strong>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <strong>Return Date: </strong>
            <strong className="text-primary">
              {formatDate(selectedOrder?.returnDate)}
            </strong>
          </div>
          <div className="d-flex gap-2 align-items-center">
            <strong>Duration: </strong>
            <span>{selectedOrder?.duration} Weeks</span>
          </div>
          <div>
            <strong>Self Pickup: </strong>
            <strong className="text-primary">
              {selectedOrder?.selfPickup ? "Yes" : "No"}{" "}
              {selectedOrder?.selfPickup ? (
                <strong className="text-primary font-bold">
                  ({selectedOrder?.selfPickup?.storeName})
                </strong>
              ) : null}
            </strong>
          </div>
        </div>
        <h5>New Data</h5>
        {
          selectedOrder?.returnDate < new Date().toISOString() ? <div className="alert alert-danger text-center">Order is already completed. You can't edit this order.</div> : 
          <div className=" d-flex flex-column border border-1 border-primary rounded-3 p-4 mb-4 gap-1">
            <Row className="mb-4">
              <Col md="6">
                <Label>Select Toy</Label>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={toys.map(toy => {
                    return {
                      value: toy._id,
                      label: toy.name,
                    }
                  })}
                  value={{
                    value: selectedToy?._id || selectedOrder?.toy?._id,
                    label: selectedToy?.name || selectedOrder?.toy?.name,
                  }}
                  onChange={e => {
                    setSelectedToy(toys.find(toy => toy._id === e.value))
                  }}
                />
              </Col>
              <Col md="6">
                <Label>Select Duration</Label>
                <Select
                  className="react-select-container"
                  classNamePrefix="react-select"
                  options={[
                    { value: 2, label: "2 Week" },
                    { value: 3, label: "3 Week" },
                    { value: 4, label: "4 Week" },
                  ]}
                  value={{ value: duration, label: duration + " Week" }}
                  onChange={e => {
                    setDuration(e.value)
                  }}
                />
              </Col>
              {toyError && (
                <Col md="12" className="text-danger">
                  {toyError}
                </Col>
              )}
            </Row>
            <Row className="mb-4">
              <Col className="md-6">
                <div className="d-flex gap-2">
                  <Input
                    className="pe-auto"
                    type="checkbox"
                    id="selfPickup"
                    checked={pickupPointSelected}
                    onClick={e => {
                      setPickupPointSelected(prev => !prev)
                      if (e.target.checked) {
                        setPickupPoint({
                          _id: selectedOrder?.selfPickup?._id,
                          storeName: selectedOrder?.selfPickup?.storeName,
                          city: selectedOrder?.selfPickup?.city,
                          status: selectedOrder?.selfPickup?.status,
                        })
                      }
                    }}
                  />
                  <Label for="selfPickup" className="pe-auto">
                    Self PickUp from Store/Centre
                  </Label>
                </div>
              </Col>
              {pickupPointSelected && (
                <Col md="6">
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    options={pickupPoints.map(point => {
                      return {
                        value: point._id,
                        label: point.storeName,
                      }
                    })}
                    value={{
                      value: pickupPoint?._id,
                      label: pickupPoint?.storeName,
                    }}
                    onChange={e => {
                      setPickupPoint({
                        _id: e.value,
                        storeName: e.label,
                        city: pickupPoints.find(point => point._id === e.value)
                          ?.city,
                        status: pickupPoints.find(point => point._id === e.value)
                          ?.status,
                      })
                    }}
                  />
                </Col>
              )}
            </Row>
            <Row>
              <Col md="12">
                <Label>Select Date: </Label>
                {availabilityLoading ? (
                  <Spinners setLoading={setAvailabilityLoading} />
                ) : availableDates &&
                  availableDates["w" + duration]?.length > 0 ? (
                  <div className="row gap-2 mx-auto">
                    {availableDates["w" + duration]?.map(date => {
                      return (
                        <button
                          className={`col-2 border border-1 border-primary rounded-3 p-2 ${
                            deliveryDate === date ? "bg-primary text-white" : ""
                          }`}
                          key={date}
                          onClick={() => {
                            if (deliveryDate === date) {
                              setDeliveryDate("")
                              return
                            }
                            setToyError("")
                            setDeliveryDate(date)
                          }}
                        >
                          <span>{formatDateWithDay(date)}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : (
                  <div className=" border border-1 border-danger rounded-3 p-2">
                    <span className="text-danger">
                      <strong>Delivery Slots Not Available!</strong> <br />
                      Slots not available for selected duration for the toy.Our
                      pre-booking slots open 60 days before.
                    </span>
                  </div>
                )}
              </Col>
            </Row>
          </div>
        }
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={saveOrder}>
          Save
        </Button>{" "}
        <Button color="secondary" onClick={onCloseClick}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

EditOrderModal.propTypes = {
  onCloseClick: PropTypes.func,
  show: PropTypes.any,
}

export default EditOrderModal
