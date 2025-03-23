import { ORDER_STATUS } from 'constants/AppConstants'
import PropTypes from 'prop-types'
import React from "react"
import { Input, Modal, ModalBody } from "reactstrap"

const ChangeToyStatusModal = ({ show, onUpdateClick, onCloseClick, toysStatus, setToysStatus }) => {
  return (
    <Modal size="md" isOpen={show} toggle={onCloseClick} centered={true}>
      <div className="modal-content">
        <ModalBody className="px-4 py-5 text-center">
          <button type="button" onClick={onCloseClick} className="btn-close position-absolute end-0 top-0 m-3"></button>

            <p className="text-muted font-size-16 mb-4">Are you sure you want to update the status of this toy?</p>

            <Input
                name="status"
                type="select"
                className="form-select"
                onChange={(e) => setToysStatus(e.target.value)}
                value={toysStatus}
            >
                <option value="">Select Availability</option>
                <option value={ORDER_STATUS.AVAILABLE}>{ORDER_STATUS.AVAILABLE}</option>
                <option value={ORDER_STATUS.RENTED}>{ORDER_STATUS.RENTED}</option>
                <option value={ORDER_STATUS.ONHOLD}>{ORDER_STATUS.ONHOLD}</option>
                <option value={ORDER_STATUS.CLEANING}>{ORDER_STATUS.CLEANING}</option>
                <option value={ORDER_STATUS.BROKEN}>{ORDER_STATUS.BROKEN}</option>
                <option value={ORDER_STATUS.MAINTENANCE}>{ORDER_STATUS.MAINTENANCE}</option>
            </Input>

          <div className="hstack gap-2 justify-content-center mb-0 mt-2">
            <button type="button" className="btn btn-success" onClick={onUpdateClick}>Update Now</button>
            <button type="button" className="btn btn-secondary" onClick={onCloseClick}>Close</button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  )
}

ChangeToyStatusModal.propTypes = {
  onCloseClick: PropTypes.func,
  onUpdateClick: PropTypes.func,
  show: PropTypes.any,
  toysStatus: PropTypes.any,
  setToysStatus: PropTypes.any
}

export default ChangeToyStatusModal
