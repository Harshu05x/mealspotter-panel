import React from "react";
import propTypes from 'prop-types';

import {
    Offcanvas,
    OffcanvasBody,
    OffcanvasHeader,
    Table
} from "reactstrap";
import { formatDate } from "helpers/date_helper";

function OffCanvasComponent(props) {
    return (
        <div>
            
            <Offcanvas
                direction="end"
                scrollable
                isOpen={props.isCanvasOpen}
                toggle={props.toggleCanvas}
                
            >
                <OffcanvasHeader
                    closeAriaLabel="Close"
                    className="d-flex justify-content-between"
                    toggle={props.toggleCanvas}
                >
                    Order Details ({props?.selectedOrder?.orderId})
                </OffcanvasHeader>
                <OffcanvasBody>
                <p className="mb-4">
                    Toy Name: <span className="text-primary">{props?.selectedOrder?.toy?.name} </span>
                </p>

                <div className="table-responsive">
                    <Table className="table align-middle table-nowrap">
                    <thead>
                        <tr>
                        <th scope="col">Toy Image</th>
                        <th scope="col">Toy Name</th>
                        <th scope="col">Rental</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">
                            <div>
                            <img src={props?.selectedOrder?.toy?.defaultPhoto} alt="toyImage" className="avatar-sm"/>
                            </div>
                        </th>
                        <td>
                            <div>
                            <h5 className="text-truncate font-size-14">{props?.selectedOrder?.toy?.name} </h5>
                            </div>
                        </td>
                        <td>₹ {props?.selectedOrder?.rent}</td>
                        </tr>
                    </tbody>
                </Table>
                <Table className="table align-middle table-nowrap">
                    <tbody>
                        <tr>
                        <td >
                            <h6 className="m-0 text-right">Customer Name:</h6>
                        </td>
                        <td>
                            {props?.selectedOrder?.customer?.fname} {props?.selectedOrder?.customer?.lname}
                        </td>
                        </tr>
                        <tr>
                        <td >
                            <h6 className="m-0 text-right">Mobile Number:</h6>
                        </td>
                        <td>
                            {props?.selectedOrder?.customer?.mobile}
                        </td>
                        </tr>
                        <tr>
                        <td >
                            <h6 className="m-0 text-right">Created Date:</h6>
                        </td>
                        <td>
                            {formatDate(props?.selectedOrder?.createdAt)}
                        </td>
                        </tr>
                        <tr>
                        <td >
                            <h6 className="m-0 text-right">Delivery Date:</h6>
                        </td>
                        <td>
                            {formatDate(props?.selectedOrder?.deliveryDate)}
                        </td>
                        </tr>
                        <tr>
                        <td >
                            <h6 className="m-0 text-right">Return Date: </h6>
                        </td>
                        <td>
                            {formatDate(props?.selectedOrder?.returnDate)}
                        </td>
                        </tr>
                        <tr>
                        <td >
                            <h6 className="m-0 text-right">Sub Total:</h6>
                        </td>
                        <td>
                            ₹ {props?.selectedOrder?.rent}
                        </td>
                        </tr>
                        <tr>
                        <td >
                            <h6 className="m-0 text-right">Deposit:</h6>
                        </td>
                        <td>
                            ₹ {props?.selectedOrder?.deposit || 0}
                        </td>
                        </tr>

                        {
                            props?.selectedOrder?.discount > 0 && (
                                <tr>
                                    <td style={{backgroundColor: '#defad2'}}>
                                        <h6 className="m-0 text-right">Discount:</h6>
                                    </td>
                                    <td style={{backgroundColor: '#defad2'}}>
                                        ₹ {props?.selectedOrder?.discount}
                                    </td>
                                </tr>   
                            )
                        }

                        <tr>
                        <td >
                            <h6 className="m-0 text-right">Duration:</h6>
                        </td>
                        <td>
                            {props?.selectedOrder?.duration} Week(s)
                        </td>
                        </tr>
                        <tr>
                        <td >
                            <h6 className="m-0 text-right">Shipping:</h6>
                        </td>
                        <td>
                            ₹ {props?.selectedOrder?.deliveryFee}
                        </td>
                        </tr>
                        <tr>
                                    {props?.selectedOrder?.coupon &&
                                        <><td >
                                            <h6 className="m-0 text-right">Discount:</h6>
                                        </td>
                                            <td>
                                                ₹ {props?.selectedOrder?.discount || 0}
                                            </td>
                                        </>
                                    }             
                        </tr>
                        <tr>
                                    {props?.selectedOrder?.coupon &&
                                        <><td >
                                            <h6 className="m-0 text-right">Coupon:</h6>
                                        </td>
                                            <td>
                                                {props?.selectedOrder?.coupon?.code || "No Coupon"}
                                            </td>
                                        </>
                                    }             
                        </tr>
                        <tr>
                        <td>
                            <h6 className="m-0 text-right">Total:</h6>
                        </td>
                        <td>
                            ₹ {props?.selectedOrder?.orderTotal}
                        </td>
                        </tr>
                        <tr>
                        <td >
                            <h6 className="m-0 text-right">Paid:</h6>
                        </td>
                        <td>
                         {props?.selectedOrder?.paid ? <i className="mdi mdi-check text-success font-size-18"></i>: <i className="mdi mdi-close text-danger fw-b font-size-18"></i>}
                        </td>
                        </tr>
                        <tr>
                        <td style={
                            props?.selectedOrder?.selfPickup ? {backgroundColor: '#b0cbf7'} : {}
                        }>
                            <h6 className="m-0 text-right">Self PickUp:</h6>
                        </td>
                        <td style={
                            props?.selectedOrder?.selfPickup ? {backgroundColor: '#b0cbf7'} : {}
                        }
                        >
                         {props?.selectedOrder?.selfPickup ? <>{props?.selectedOrder?.selfPickup?.storeName}</>: <i className="mdi mdi-close text-danger fw-b font-size-18"></i>} 
                        </td>
                        </tr>
                        {
                            props?.selectedOrder?.updatedBy && (
                                <>
                                    <tr>
                                    <td >
                                        <h6 className="m-0 text-right">Updated By:</h6>
                                    </td>
                                    <td>
                                        {props?.selectedOrder?.user?.email}
                                    </td>
                                    </tr>
                                    <tr>
                                    <td >
                                        <h6 className="m-0 text-right">Updated At:</h6>
                                    </td>
                                    <td>
                                        {formatDate(props?.selectedOrder?.updatedAt)}
                                    </td>
                                    </tr>
                                </>
                            )
                        }
                    </tbody>
                    </Table>
                </div>
                </OffcanvasBody>
            </Offcanvas>
        </div>
    );
}

OffCanvasComponent.propTypes = {
    selectedOrder : propTypes.object,
    isCanvasOpen: propTypes.bool, 
    toggleCanvas: propTypes.func
};

export default OffCanvasComponent;

