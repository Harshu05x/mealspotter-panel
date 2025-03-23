import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react"
import { Modal, ModalBody } from "reactstrap"

const PincodeShiftModal = ({ show, onCloseClick, zone, zones, pincode, loading, selectedZone, setSelectedZone, onShiftClick }) => {

  return (
    <Modal size="md" isOpen={show} toggle={onCloseClick} centered={true} >
      <div className="modal-content">
        {
            loading ? <div className="spinner-border text-primary d-block mx-auto my-4"></div>
            :
            <ModalBody className="px-4 py-5 text-center">
            <button type="button" onClick={onCloseClick} className="btn-close position-absolute end-0 top-0 m-3"></button>
            <div className="avatar-sm mb-4 mx-auto">
                <div className="avatar-title bg-primary text-primary bg-opacity-10 font-size-20 rounded-3">
                <i className="mdi mdi-trash-can-outline"></i>
                </div>
            </div>
            <p className="text-muted font-size-16 mb-4">
                shift <strong>{pincode}</strong> {" "}
                from <strong>{zone?.name}</strong> to {" "} <strong>{selectedZone?.name || "___"}</strong> zone?
            </p>

            <div className="form-group mb-4">
                <select className="form-select" id="zone" name="zone" required
                    value={selectedZone?._id}
                    onChange={(e) => setSelectedZone(zones.find(z => z._id === e.target.value))}
                >
                    <option value="">Select Zone</option>
                    {
                        zones.map((z, index) => {
                            if(zone?._id !== z?._id) {
                                return <option key={index} value={z?._id}>{z?.name}</option>
                            }
                        })
                    }
                </select>
            </div>
        
            <div className="hstack gap-2 justify-content-center mb-0">
                <button type="button" className="btn btn-success" onClick={onShiftClick}>Shift</button>
                <button type="button" className="btn btn-secondary" onClick={onCloseClick}>Close</button>
            </div>
            </ModalBody>
        }
      </div>
    </Modal>
  )
}

PincodeShiftModal.propTypes = {
    onCloseClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    show: PropTypes.any,
    pincode: PropTypes.any,
    zoneId: PropTypes.any
}

export default PincodeShiftModal
