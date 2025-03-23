import PropTypes from 'prop-types'
import React, { useEffect, useState } from "react"
import { Modal, ModalBody } from "reactstrap"

const PincodeDeleteModal = ({ show, onDeleteClick, onCloseClick, pincode, zone, loading, canDelete, resaon }) => {

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
            {
                canDelete ? 
                <p className="text-muted font-size-16 mb-4">Are you sure you want to 
                    remove <br /> <strong>{pincode}</strong> from <strong>{zone?.name}</strong> zone?
                </p>
                :
                <p className="text-muted font-size-16 mb-4">{resaon}</p>
            }
        
            <div className="hstack gap-2 justify-content-center mb-0">
                {canDelete && <button type="button" className="btn btn-danger" onClick={onDeleteClick}>Delete</button> }
                <button type="button" className="btn btn-secondary" onClick={onCloseClick}>Close</button>
            </div>
            </ModalBody>
        }
      </div>
    </Modal>
  )
}

PincodeDeleteModal.propTypes = {
    onCloseClick: PropTypes.func,
    onDeleteClick: PropTypes.func,
    show: PropTypes.any,
    pincode: PropTypes.any,
    zoneId: PropTypes.any
}

export default PincodeDeleteModal
