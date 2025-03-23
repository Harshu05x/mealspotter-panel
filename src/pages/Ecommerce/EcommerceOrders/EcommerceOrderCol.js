import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from 'reactstrap';

const Status = (cell) => {
    return (
        <Link to="#" className="text-body fw-bold">{cell.value ? cell.value : ''}</Link>
    );
};

const ToyName = (cell) => {
    return cell.value ? cell.value : '';
};

const Catagory = (cell) => {
    return cell.value ? cell.value : '';
};

const AgeGroup = (cell) => {
    return cell.value ? cell.value : '';
};

const MRP = (cell) => {
    // return (
    //     <Badge
    //         className={"font-size-12 badge-soft-" +
    //             (cell.value === "Paid" ? "success" : "danger" && cell.value === "Refund" ? "warning" : "danger")}
    //     >
    //         {cell.value}
    //     </Badge>
    // );
    return cell.value ? cell.value : '';
};
const Purchase = (cell) => {
    return (
        <span>
            <i
                className={
                    (cell.value === "Paypal" ? "fab fa-cc-paypal me-1" : "" ||
                        cell.value === "COD" ? "fab fas fa-money-bill-alt me-1" : "" ||
                            cell.value === "Mastercard" ? "fab fa-cc-mastercard me-1" : "" ||
                                cell.value === "Visa" ? "fab fa-cc-visa me-1" : ""
                    )}
            />{" "}
            {cell.value}
        </span>
    );
};
export {
    Status,
    ToyName,
    Catagory,
    AgeGroup,
    MRP,
    Purchase
};