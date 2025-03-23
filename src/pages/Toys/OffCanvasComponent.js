import React, { useEffect } from "react";
import propTypes from 'prop-types';

import {
    Offcanvas,
    OffcanvasBody,
    OffcanvasHeader,
    Table
} from "reactstrap";
import { formatDate } from "helpers/date_helper";
import axios from "axios";
import { post } from "helpers/api_helper";

function OffCanvasComponent(props) {
    const [loading, setLoading] = React.useState(false);
    const [toyHistory, setToyHistory] = React.useState([]);
    const fetchToyHistory = async () => {
        setLoading(true);
        try {
            const res = await post(`toys/history`, {toyId: props.selectedToy._id});
            setToyHistory(res);
        } catch (error) {
            console.log("Error: ", error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchToyHistory();
    }, [props.selectedToy]);
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
                    Toy History
                </OffcanvasHeader>
                <OffcanvasBody>
                <p className="mb-4">
                    Toy Name: <span className="text-primary">{props?.selectedToy?.name} </span>
                </p>

                <div className="table-responsive">
                    <Table className="table align-middle table-nowrap">
                    <thead>
                        <tr>
                        <th scope="col">Toy Image</th>
                        <th scope="col">Toy Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <th scope="row">
                            <div>
                            <img src={props?.selectedToy?.defaultPhoto} alt="toyImage" className="avatar-sm"/>
                            </div>
                        </th>
                        <td>
                            <div>
                            <h5 className="text-truncate font-size-14">{props?.selectedToy?.name} </h5>
                            </div>
                        </td>
                        </tr>
                    </tbody>
                </Table>
                <Table className="table align-middle table-nowrap">
                    <tbody>
                        {
                            loading ?
                            <tr>
                                <td colSpan="2" className="text-center">
                                    <div className="spinner-border spinner-border-sm" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </td>
                            </tr>
                            :
                            <>
                                {
                                    <>
                                        {
                                            toyHistory.length > 0 ?
                                            toyHistory.map((history, index) => (
                                                <div className="p-2 border border-dark" key={index}>
                                                    <tr key={index} className="border-bottom" >
                                                    <tr>
                                                        <th scope="row">Order ID:</th>
                                                        <td>{history.orderId}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Rent: </th>
                                                        <td>{history.rent}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Delivery Fee: </th>
                                                        <td>{history.deliveryFee}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Created At: </th>
                                                        <td>{formatDate(history.createdAt)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Delivery Date: </th>
                                                        <td>{formatDate(history.deliveryDate)}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">Return Date: </th>
                                                        <td>{formatDate(history.returnDate)}</td>
                                                    </tr>
                                                </tr>
                                                </div>
                                            ))
                                            :
                                            <tr>
                                                <td colSpan="2" className="text-center">No history found</td>
                                            </tr>
                                        }
                                    </>
                                }
                            </>
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
    selectedToy : propTypes.object,
    isCanvasOpen: propTypes.bool, 
    toggleCanvas: propTypes.func
};

export default OffCanvasComponent;

