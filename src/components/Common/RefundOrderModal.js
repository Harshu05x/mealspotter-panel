import PropTypes from 'prop-types'
import React from "react"
import { Modal, ModalBody } from "reactstrap"
import { Button, Col, Form, FormFeedback, Input, Label, Row } from "reactstrap"
import { useFormik } from "formik"
import * as Yup from "yup"
import { useDispatch } from "react-redux"


const RefundOrderModal = ({ show, onRefundClick, onCloseClick, data }) => {
    
    const validation = useFormik({
        enableReinitialize: true,

        initialValues: {
            reason: "",
            method: "",
            amount: "",
        },
        validationSchema: Yup.object({
            reason: Yup.string().required("Please enter Reason"),
            method: Yup.string().required("Please enter Refund Method"),
            amount: Yup.string().matches(/^[0-9]*$/, 'Please enter valid amount').required("Please enter Amount to be refunded)"),
        }),
        onSubmit: (values) => {
            onRefundClick(values);
            validation.resetForm();
            onCloseClick();
        },
    });
    
    return (
        <Modal size="md" isOpen={show} toggle={onCloseClick} centered={true}>
            <div className="modal-content">
                <ModalBody className="px-4 py-5 text-center">
                    <button type="button" onClick={onCloseClick} className="btn-close position-absolute end-0 top-0 m-3"></button>
                    <div className="avatar-sm mb-4 mx-auto">
                        <div className="avatar-title bg-primary text-primary bg-opacity-10 font-size-20 rounded-3">
                            <i className="mdi mdi-cash-refund"></i>
                        </div>
                    </div>
                    <p className="text-muted font-size-16 mb-4">Refund / Cancel Selected Order</p>

                    <div className=' d-flex flex-column border border-1 border-primary rounded-3 p-2 mb-4 gap-1'>
                        <div className="d-flex gap-2 align-items-center">
                            <strong>Order ID: </strong>
                            <span>{data?.orderId}</span>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            <strong>Customer Name: </strong>
                            <span>{data?.customerName}</span>
                        </div>
                        <div className="d-flex gap-2 align-items-center">
                            <strong>Toy Name: </strong>
                            <span>{data?.toyName}</span>
                        </div>
                    </div>

                    <Form
                        onSubmit={(e) => {
                            e.preventDefault();
                            validation.handleSubmit();
                            return false;
                        }}
                    >
                        <Row>
                            <Col className="col-12">
                                <div className="mb-3 d-flex flex-column align-items-start">
                                    <Label>Reason</Label>
                                    <Input
                                        name="reason"
                                        type="text"
                                        placeholder="Enter Reason"
                                        validate={{
                                            required: { value: true },
                                        }}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.reason || ''}
                                        invalid={
                                            validation.touched.reason && validation.errors.reason ? true : false
                                        }
                                    />
                                    {validation.touched.reason && validation.errors.reason ? (
                                        <FormFeedback type="invalid" className=' text-start'>{validation.errors.reason}</FormFeedback>
                                    ) : null}
                                </div>

                                <div className="mb-3 d-flex flex-column align-items-start">
                                    <Label>Method of Refund</Label>
                                    <Input
                                        name="method"
                                        type="text"
                                        placeholder="Enter Refund Method"
                                        validate={{
                                            required: { value: true },
                                        }}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.method || ''}
                                        invalid={
                                            validation.touched.method && validation.errors.method ? true : false
                                        }
                                    />
                                    {validation.touched.method && validation.errors.method ? (
                                        <FormFeedback type="invalid" className=' text-start' >{validation.errors.method}</FormFeedback>
                                    ) : null}
                                </div>

                                <div className="mb-3 d-flex flex-column align-items-start">
                                    <Label>Refund Amount</Label>
                                    <Input
                                        name="amount"
                                        type="text"
                                        placeholder="Enter Amount to be refunded"
                                        validate={{
                                            required: { value: true },
                                        }}
                                        onChange={validation.handleChange}
                                        onBlur={validation.handleBlur}
                                        value={validation.values.amount || ''}
                                        invalid={
                                            validation.touched.amount && validation.errors.amount ? true : false
                                        }
                                    />
                                    {validation.touched.amount && validation.errors.amount ? (
                                        <FormFeedback type="invalid" className=' text-start'>{validation.errors.amount}</FormFeedback>
                                    ) : null}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <div className="">
                                    <Button
                                        type="submit"
                                        className="btn btn-danger save-user"
                                    >
                                        Refund / Cancel 
                                    </Button>
                                    <Button
                                        type="button"
                                        className="btn btn-light ms-2"
                                        onClick={onCloseClick}
                                    >
                                        Close
                                    </Button>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </ModalBody>
            </div>
        </Modal>
    )
}

RefundOrderModal.propTypes = {
    onCloseClick: PropTypes.func,
    onRefundClick: PropTypes.func,
    show: PropTypes.any
}

export default RefundOrderModal
