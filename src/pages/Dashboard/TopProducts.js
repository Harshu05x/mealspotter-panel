import Spinners from "components/Common/Spinner";
import React, { useEffect } from "react"
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Card, CardBody, CardTitle, Progress } from "reactstrap"
import { createSelector } from "reselect";
import { getDashboardTopRentedToys } from "store/actions";

const TopProducts = () => {

    const selectTopRentedToys = (state) => state.Dashboard;
    const TopRentedToysProperties = createSelector(
        selectTopRentedToys,
        (dashboard) => ({
            TopRentedToys: dashboard.topRentedToys,
            loading: dashboard.loading
        })
    );

    const { TopRentedToys, loading } = useSelector(TopRentedToysProperties);
    
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getDashboardTopRentedToys());
    },[dispatch]);

    const getRandomColor = () => {
        const colors = ["primary", "secondary", "success", "info", "warning", "danger", "dark"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    return (
        <React.Fragment>
            <Card>
                <CardBody>
                    <CardTitle className="mb-4">Top Renting Products</CardTitle>
                    {
                        loading ? <Spinners />
                        :
                        <>
                            {
                                TopRentedToys?.topCount && TopRentedToys?.topCount?.length !== 0 ?
                                <>
                                    <div className="text-center">
                                        <div className="mb-4">
                                            <img src={TopRentedToys?.mostRented?._id?.[0]?.defaultPhoto} alt="toyImage" className="avatar-lg"/> 
                                        </div>
                                        <h3>{TopRentedToys?.mostRented?.count || 0}</h3>
                                        <p>{TopRentedToys?.mostRented?._id?.[0]?.name}</p>
                                    </div>

                                    <div className="table-responsive mt-4">
                                        <table className="table align-middle table-nowrap">
                                            <tbody>
                                                {
                                                    (TopRentedToys?.topCount || []).map((item, index) => (
                                                        <tr key={index}>
                                                            <td style={{ width: "30%" }}>
                                                                <p className="mb-0">{item?._id?.[0]?.name}</p>
                                                            </td>
                                                            <td style={{ width: "25%" }}>
                                                                <h5 className="mb-0">{item?.count}</h5>
                                                            </td>
                                                            <td>
                                                                <Progress
                                                                    max={TopRentedToys?.totalOrders || 0}
                                                                    value={item?.count}
                                                                    color={getRandomColor()}
                                                                    className="bg-transparent progress-sm"
                                                                    size="sm"
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                                :
                                <div className="text-center d-flex gap-2 flex-column align-items-center">
                                    <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12 0C9.62663 0 7.30655 0.703788 5.33316 2.02236C3.35977 3.34094 1.8217 5.21509 0.913451 7.4078C0.00519943 9.60051 -0.232441 12.0133 0.230582 14.3411C0.693605 16.6689 1.83649 18.8071 3.51472 20.4853C5.19295 22.1635 7.33115 23.3064 9.65892 23.7694C11.9867 24.2324 14.3995 23.9948 16.5922 23.0866C18.7849 22.1783 20.6591 20.6402 21.9776 18.6668C23.2962 16.6935 24 14.3734 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2349 1.26428 15.1826 0 12 0ZM12 22C10.0222 22 8.0888 21.4135 6.4443 20.3147C4.79981 19.2159 3.51809 17.6541 2.76121 15.8268C2.00433 13.9996 1.8063 11.9889 2.19215 10.0491C2.578 8.10929 3.53041 6.32746 4.92894 4.92893C6.32746 3.53041 8.10929 2.578 10.0491 2.19215C11.9889 1.8063 13.9996 2.00433 15.8268 2.7612C17.6541 3.51808 19.2159 4.79981 20.3147 6.4443C21.4135 8.08879 22 10.0222 22 12C22 13.3132 21.7413 14.6136 21.2388 15.8268C20.7363 17.0401 19.9997 18.1425 19.0711 19.0711C18.1425 19.9997 17.0401 20.7362 15.8268 21.2388C14.6136 21.7413 13.3132 22 12 22Z" fill="#F24E1E" />
                                        <path d="M12.0002 14.07C11.6554 14.07 11.3248 13.933 11.081 13.6892C10.8372 13.4454 10.7002 13.1148 10.7002 12.77V6.77C10.7002 6.42522 10.8372 6.09456 11.081 5.85076C11.3248 5.60697 11.6554 5.47 12.0002 5.47C12.345 5.47 12.6756 5.60697 12.9194 5.85076C13.1632 6.09456 13.3002 6.42522 13.3002 6.77V12.77C13.3002 13.1148 13.1632 13.4454 12.9194 13.6892C12.6756 13.933 12.345 14.07 12.0002 14.07Z" fill="#F24E1E" />
                                        <path d="M11.9502 18.52C12.7786 18.52 13.4502 17.8484 13.4502 17.02C13.4502 16.1916 12.7786 15.52 11.9502 15.52C11.1218 15.52 10.4502 16.1916 10.4502 17.02C10.4502 17.8484 11.1218 18.52 11.9502 18.52Z" fill="#F24E1E" />
                                    </svg>
                                    <h4>No Toys Found</h4>
                                </div>
                            }
                        
                        </>
                    }
                </CardBody>
            </Card>
        </React.Fragment>
    )
}

export default TopProducts
