import PropTypes from 'prop-types'
import React from "react"
import { Modal, ModalBody } from "reactstrap"

const CancelOrderModal = ({ show, onCancelClick, onCloseClick, setReason , isAbaondoned = false}) => {
  return (
    <Modal size="md" isOpen={show} toggle={onCloseClick} centered={true}>
      <div className="modal-content">
        <ModalBody className="px-4 py-5 text-center">
          <button type="button" onClick={onCloseClick} className="btn-close position-absolute end-0 top-0 m-3"></button>
          <div className="avatar-sm mb-4 mx-auto">
            <div className="avatar-title bg-primary text-primary bg-opacity-10 font-size-20 rounded-3">
              <i className="mdi mdi-trash-can-outline"></i>
            </div>
          </div>
          {/* take a field which we also for reason to cancel */}
            <p className="text-muted font-size-16 mb-4">Are you sure you want to cancel this order?</p>
            {/* take a field which we also for reason to cancel */}
            {
              !isAbaondoned &&
              <div className="mb-3">
              <label htmlFor="reason" className="form-label">Enter Reason to cancel the order: </label>
                  <textarea className="form-control" id="reason" rows="3" onChange={(e) => setReason(e.target.value)}
                  ></textarea>
              </div>
            }



          <div className="hstack gap-2 justify-content-center mb-0">
            <button type="button" className="btn btn-danger" onClick={onCancelClick}>Cancel</button>
            <button type="button" className="btn btn-secondary" onClick={onCloseClick}>Close</button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  )
}

CancelOrderModal.propTypes = {
  onCloseClick: PropTypes.func,
  onCancelClick: PropTypes.func,
  show: PropTypes.any
}

export default CancelOrderModal
