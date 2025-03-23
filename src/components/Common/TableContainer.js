import React, { Fragment, useEffect } from "react"
import PropTypes from "prop-types"
import {
  useTable,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  useExpanded,
  usePagination,
} from "react-table"
import { Table, Row, Col, Button } from "reactstrap"
import JobListGlobalFilter from "../../components/Common/GlobalSearchFilter"
import { Link } from "react-router-dom"
import { ORDER_STATUS } from "constants/AppConstants"
import TableSkeletonLoader from "./TabelSkeletionLoader"
import { createSelector } from "reselect"
import { useSelector } from "react-redux"
import { setSystemError } from "store/actions"
import { useDispatch } from "react-redux"

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
  isJobListGlobalFilter,
  gotoPage,
  setPage,
  setInputVal
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined);
    setInputVal(value);
  }, 200)

  return (
    <React.Fragment>
      <Col xxl={3} lg={6}>
        <input type="search" className="form-control" id="search-bar-0" value={value || ""} placeholder={`${count} records...`} 
        onChange={e => { 
          gotoPage(0); 
          setPage(1);
          setValue(e.target.value); 
          onChange(e.target.value) 
        }} />
      </Col>
      {isJobListGlobalFilter && <JobListGlobalFilter setGlobalFilter={setGlobalFilter} />}
    </React.Fragment>
  )
}
function CustomGlobalFilter({
  setQuery,
  gotoPage,
  limit,
  setPage
}) {
  // const count = preGlobalFilteredRows.length
  const [value, setValue] = React.useState();
  const onChange = useAsyncDebounce(value => {
    setQuery(value || "")
  }, 200)
  
  return (
    <React.Fragment>
      <Col xxl={3} lg={6}>
        <input type="search" className="form-control" id="search-bar-0" value={value || ""} placeholder={`${limit} records...`} 
        onChange={e => { 
          gotoPage(0); 
          setPage(1);
          setValue(e.target.value); 
          onChange(e.target.value) 
        }} />
      </Col>
    </React.Fragment>
  )
}



const TableContainer = ({
  title,
  columns,
  data,
  isGlobalFilter,
  isCustomGlobalFilter,
  setQuery,
  isJobListGlobalFilter,
  isAddOptions,
  isAddUserList,
  handleOrderClicks,
  handleUserClick,
  handleCustomerClick,
  isAddCustList,
  customPageSize,
  customPageSizeOptions,
  iscustomPageSizeOptions,
  isPagination,
  isShowingPageLength,
  paginationDiv,
  pagination,
  tableClass,
  theadClass,
  isZoneOptions,
  zones,
  zone,
  setZone,
  isWeekOptions,
  week,
  setWeek,
  csvExport,
  exportToCSVButtonClicked,
  pickUpType,
  setPickUpType,
  pickUpPoints,
  pickUpPoint,  
  isPickUpPointOptions,
  setpickUpPoint,
  orderChecked = [],
  setOrderChecked,
  allChecked = false,
  setAllChecked,
  isCheckable = false,
  setOrderStatus,
  orderStatus = "pending",
  toyPage = false,
  setOpenChangeStatusModal,
  isStartDate,
  startDate,
  setStartDate,
  isEndDate,
  endDate,
  DateFilterTitle,
  setEndDate,
  isCustomPagination,
  setPage,
  pageNumber,
  totals = 0,
  toyStatusFilter,
  setToyStatusFilter,
  categories,
  toyCategoryFilter,
  setToyCategoryFilter,
  setLimit,
  isDate,
  date,
  setDate,
  addOrder, 
  handleAddOrderClick,
}) => {
  const [inputVal, setInputVal] = React.useState("");
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      // defaultColumn: { Filter: DefaultColumnFilter },
      initialState: {
        pageIndex: isCustomPagination?0:(pageNumber || 0),
        pageSize: customPageSize,
        globalFilter: inputVal || "",
        // sortBy: [
        //   {
        //     desc: true,
        //   },
        // ],
      },
    },
    useGlobalFilter,
    // useFilters,
    useSortBy,
    useExpanded,
    usePagination
  )

  const generateSortingIndicator = column => {
    return column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""
  }

  const onChangeInSelect = event => {
    setPageSize(Number(event.target.value))
    if(setLimit){
      setLimit(Number(event.target.value))
    }
  }
  
  const paginationArray = [];
  for (let i = 0; i < Math.ceil(totals / pageSize); i++) {
    paginationArray.push(i+1);
  }

  useEffect(() => {
    if(setPage && typeof(setPage) == "function" && isCustomPagination !== true){
      setPage(pageIndex);
    }
  }, [pageIndex])

  const systemState = (state) => state.systemState;
  const systemStateProperties = createSelector(
    systemState,
    systemState => ({
      loading: systemState.loading,
      error: systemState.error
    })
  );
  const { loading, error} = useSelector(systemStateProperties);
  const dispatch = useDispatch();
  return (
    <Fragment>
      <Row className="mb-2">
        {iscustomPageSizeOptions &&
          <Col md={customPageSizeOptions ? 2 : 1}>
            <select
              className="form-select"
              value={pageSize}
              onChange={onChangeInSelect}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </Col>
        }

        {isGlobalFilter && (
          <GlobalFilter
            preGlobalFilteredRows={preGlobalFilteredRows}
            globalFilter={state.globalFilter}
            setGlobalFilter={setGlobalFilter}
            isJobListGlobalFilter={isJobListGlobalFilter}
            gotoPage={gotoPage}
            setPage={setPage ? setPage : () => {}}
            setInputVal={setInputVal}
            />
          )}
        
        {isCustomGlobalFilter && (
          <CustomGlobalFilter
            setQuery={setQuery}
            gotoPage={gotoPage}
            limit={pageSize}
            setPage={setPage ? setPage : () => {}}
          /> 
        )}

        {isZoneOptions && <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex align-items-center justify-content-center gap-2">
            <label htmlFor="zone" className="form-label"> Zone: </label>
            <select
              id="zone"
              className="form-select"
              value={zone}
              onChange={(event) => setZone(event.target.value)}
            >
              <option value="All">All</option>
              {zones?.map(zone => (
                <option key={zone?._id} value={zone?.name}>
                  {zone?.name}
                </option>
              ))}
            </select>
          </Col>}

        {/*isStartDate to filter upcoming orders between start and end date */}
        {isStartDate && <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex flex-column align-items-center justify-content-center">
          <div className=" d-flex align-items-center justify-content-center gap-2 ">
            <label htmlFor="startDate" className="form-label">From: </label>
            <div className="form-label">
              <input
                type="date"
                id="startDate"
                className="form-control"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
            </div>
          </div>
          {
            DateFilterTitle && <small className="text-primary">*Filtered by {DateFilterTitle} </small>
          }
        </Col>
        }
        {isEndDate && <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex align-items-center justify-content-center gap-2">
          <label htmlFor="endDate" className="form-label"> To: </label>
          <div className="form-label">
            <input
              type="date"
              id="endDate"
              className="form-control"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
            {/* {
              DateFilterTitle && <small htmlFor="endDate" className="text-primary">*Filtered by Order {DateFilterTitle} </small>
            } */}
          </div>
        </Col>
        }

        {isDate && <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex flex-column align-items-center justify-content-center">
          <div className=" d-flex align-items-center justify-content-center gap-2 ">
            <label htmlFor="date" className="form-label"> Date: </label>
            <div className="form-label">
              {/* {
                DateFilterTitle && <label htmlFor="date" className="form-label">Filter by {DateFilterTitle}: </label>
              } */}
              <input
                type="date"
                id="date"
                className="form-control"
                value={date}
                onChange={(event) => setDate(event.target.value)}
              />
            </div>
          </div>
          {
            DateFilterTitle && <small className="text-primary">*Filtered by {DateFilterTitle} </small>
          }
        </Col>
        }

        {isWeekOptions && <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex align-items-center justify-content-center gap-2">
            <label htmlFor="week" className="form-label"> Orders: </label>
            <select
              id="week"
              className="form-select"
              value={week}
              onChange={(event) => setWeek(event.target.value)}
            >
              {[{
                name: "All",
                value: 0
              },{
                name: "This Week",
                value: 1
              },{
                name: "Next Week",
                value: 2
              } ,
              {
                name: "Next to Next Week",
                value: 3
              }
              ].map((week,i) => (
                <option key={i} value={Number (week.value)}>
                  {week.name}
                </option>
              ))}
            </select>
          </Col>}
        {
          isPickUpPointOptions && (
            <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex align-items-center justify-content-center gap-2">
              <label htmlFor="pickUpType" className="form-label"> Pick-up Type: </label>
              <select
                id="pickUpType"
                className="form-select"
                value={pickUpType}
                onChange={(event) => setPickUpType(event.target.value)}
              >
                <option value="All">All</option>
                <option value="Self">Self</option>
                <option value="Company">Company</option>
              </select>
            </Col>
          )
        }
       
        {
            isPickUpPointOptions && pickUpType === "Self" && (
              <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex align-items-center justify-content-center gap-2">
                <label htmlFor="pickUpPoint" className="form-label"> Pick-up Point: </label>
                <select
                  id="pickUpPoint"
                  className="form-select"
                  value={pickUpPoint}
                  onChange={(event) => setpickUpPoint(event.target.value)}
                >
                  <option value="All">All</option>
                  {
                    pickUpPoints?.map((point, i) => (
                      <option key={i} value={point?.storeName}>
                        {point?.storeName}
                      </option>
                    ))
                  }
                </select>
              </Col>
            )
        }

        {
          toyStatusFilter && (
            <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex align-items-center justify-content-center gap-2">
              <label htmlFor="toyStatusFilter" className="form-label"> Status: </label>
              <select
                id="toyStatusFilter"
                className="form-select"
                value={toyStatusFilter}
                onChange={(event) => {
                  setToyStatusFilter(event.target.value);
                  setPage(1);
                }}
              >
                <option value="all">All</option>
                <option value={ORDER_STATUS.AVAILABLE}>{ORDER_STATUS.AVAILABLE}</option>
                <option value={ORDER_STATUS.RENTED}>{ORDER_STATUS.RENTED}</option>
                <option value={ORDER_STATUS.ONHOLD}>{ORDER_STATUS.ONHOLD}</option>
                <option value={ORDER_STATUS.CLEANING}>{ORDER_STATUS.CLEANING}</option>
                <option value={ORDER_STATUS.BROKEN}>{ORDER_STATUS.BROKEN}</option>
                <option value={ORDER_STATUS.MAINTENANCE}>{ORDER_STATUS.MAINTENANCE}</option>
              </select>
            </Col>
          )
          }

        {
          toyCategoryFilter && (
              <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex align-items-center justify-content-center gap-2">
                <label htmlFor="toyCategoryFilter" className="form-label"> Category: </label>
                <select
                  id="toyCategoryFilter"
                  className="form-select"
                  value={toyCategoryFilter}
                  onChange={(event) => {
                    setToyCategoryFilter(event.target.value);
                    setPage(1);
                  }}
                >
                  <option value="all">All</option>
                  {
                    categories.map((cat,i) => 
                      <option value={cat._id} key={i}>
                        {cat.name}
                      </option>
                    )
                  }
                </select>
              </Col>
            )
        }

        {
          (orderChecked?.length !== 0 || allChecked) && (
            toyPage ?
            <>
              <Col>
                <Button onClick={() => setOpenChangeStatusModal(true)}>
                  Change Status
                </Button>
              </Col>
            </>
            :
            <>
            <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex align-items-center justify-content-center gap-2">
                <input type="checkbox" id="markAsDelivered" className="form-check-input m-0" 
                  onChange={(e) => {
                    setOrderStatus(e.target.checked ? "delivered" : "pending");
                  }}
                  checked={orderStatus === "delivered"}
                />
                <label htmlFor="markAsDelivered" className="form-label m-0"> Mark As Delivered</label>
            </Col>
            <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex align-items-center justify-content-center gap-2">
                <input type="checkbox" id="markAsReturned" className="form-check-input m-0" 
                  onChange={(e) => {
                    setOrderStatus(e.target.checked ? "returned" : "pending");
                  }}
                  checked={orderStatus === "returned"}
                />
                <label htmlFor="markAsReturned" className="form-label m-0"> Mark As Returned</label>
            </Col>
            </>
          )
        }

        {isAddOptions && (
          <Col>
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded  mb-2 me-2"
                onClick={handleOrderClicks}
              >
                <i className="mdi mdi-plus me-1" />
                Add New {title}
              </Button>
            </div>
          </Col>
        )}


        {
          addOrder && (
            <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex align-items-center justify-content-center gap-2" style={{width:"16%"}}>
              <Button
                type="button"
                color="success"
                className="btn mb-2 me-2"
                onClick={() => {
                  handleAddOrderClick();
                }}
              >
                <i className="mdi mdi-plus me-1" />
                Add Order
              </Button>
            </Col>
          )
        }

        {
          csvExport && (
            <Col md={customPageSizeOptions ? 4 : 2} className=" d-flex align-items-center justify-content-center gap-2 mt-1">
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={() => {
                  exportToCSVButtonClicked();
                }}
              >
                <i className="mdi mdi-file-excel me-1" />
                Export
              </Button>
            </Col>
          )
        }

        {isAddUserList && (
          <Col sm="7" xxl="8">
            <div className="text-sm-end">
              <Button
                type="button"
                color="primary"
                className="btn mb-2 me-2"
                onClick={handleUserClick}
              >
                <i className="mdi mdi-plus-circle-outline me-1" />
                Create New User
              </Button>
            </div>
          </Col>
        )}
        {isAddCustList && (
          <Col sm="7" xxl="8">
            <div className="text-sm-end">
              <Button
                type="button"
                color="success"
                className="btn-rounded mb-2 me-2"
                onClick={handleCustomerClick}
              >
                <i className="mdi mdi-plus me-1" />
                New Customers
              </Button>
            </div>
          </Col>
        )}
      </Row>

      <div className="table-responsive">
        {
          error && 
          <div className="alert alert-danger alert-dismissible fade show text-center" role="alert">
            <i className="fas fa-exclamation-circle"></i> {error}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close" 
              onClick={() => {
                dispatch(setSystemError(false));
              }}
            />
        </div>
        }
        <Table {...getTableProps()} className={tableClass}>
          <thead className={theadClass}>
            {headerGroups.map(headerGroup => (
              <>
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {
                    isCheckable === true && 
                    <td>
                      <input type="checkbox" className="m-0" key={1}
                        checked={allChecked}
                        onChange={(e) => {
                          setAllChecked(e.target.checked);
                          setOrderChecked(e.target.checked ? data?.map((item) => item._id) : []);
                        }}
                      />
                    </td>
                  }
                  {headerGroup.headers.map(column => (
                    <th key={column.id} className={column.isSort ? "sorting" : ''}>
                      <div className="m-0" {...column.getSortByToggleProps()}>
                        {column.render("Header")}
                      </div>
                      {/* <Filter column={column} /> */}
                    </th>
                  ))}
                </tr>
              </>
            ))}
          </thead>
          {
            loading ?
            <tbody>
              <tr>
                <td colSpan="100%">
                  <TableSkeletonLoader length={10}/>
                </td>
              </tr>
            </tbody>
            :
            <tbody {...getTableBodyProps()}>
              {
                data.length === 0 && !loading &&(
                  <tr>
                      <td colSpan="100%">
                          <div className="text-center py-4 bg-light border rounded">
                              <i className="fas fa-times-circle fa-2x mb-2 text-danger"></i>
                              <div className="text-danger">No data found</div>
                          </div>
                      </td>
                  </tr>
                )
              }
              {page.map(row => {
                prepareRow(row)
                return (
                  <Fragment key={row.getRowProps().key}>
                    <tr>
                      {
                        (isCheckable === true) &&
                        <td>
                          <input type="checkbox" className="m-0"
                            checked={allChecked || orderChecked?.includes(row.original._id)}
                            onChange={(e) => {
                              if(e.target.checked){
                                setOrderChecked([...orderChecked, row.original._id]);
                                if(allChecked === true){
                                  setAllChecked(false);
                                }
                              }else{
                                setOrderChecked(orderChecked?.filter((item) => item !== row.original._id));
                                if(allChecked === true){
                                  setAllChecked(false);
                                }
                              }
                            }}
                          />
                      </td>
                      }
                      {row.cells.map(cell => {
                        return (
                          <td key={cell.column.id} {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        )
                      })}
                    </tr>
                  </Fragment>
                )
              })}
            </tbody>
          }
        </Table>
      </div>
      
      {
        loading || page.length === 0 ? null : (
          <>
            {
              isPagination && (
                <Row className="justify-content-between align-items-center">
                  {isShowingPageLength && <div className="col-sm">
                    <div className="text-muted">Showing <span className="fw-semibold">{page.length}</span> of <span className="fw-semibold">{data.length}</span> entries</div>
                  </div>}
                  <div className={paginationDiv}>
                    <ul className={pagination}>
                      <li className={`page-item ${!canPreviousPage ? "disabled" : ''}`}>
                        <Link to="#" className="page-link" onClick={previousPage}>
                          <i className="mdi mdi-chevron-left"></i>
                        </Link>
                      </li>
                      {pageOptions.map((item, key) => (
                        <React.Fragment key={key}>
                          <li className={pageIndex === item ? "page-item active" : "page-item"}>
                            <Link to="#" className="page-link" onClick={() => gotoPage(item)}>{item + 1}</Link>
                          </li>
                        </React.Fragment>
                      ))}
                      <li className={`page-item ${!canNextPage ? "disabled" : ''}`}>
                        <Link to="#" className="page-link" onClick={nextPage}>
                          <i className="mdi mdi-chevron-right"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Row>
              )
            }
      
            {
              isCustomPagination && (
                <Row className="justify-content-between align-items-center">
                  <div className="col-sm">
                    <div className="text-muted">Showing <span className="fw-semibold">{page.length}</span> of <span className="fw-semibold">{totals}</span> entries</div>
                  </div>
                  <div className={paginationDiv}>
                    <ul className={pagination}>
                      <li className={`page-item ${totals === 0 || pageNumber === 1 ? "disabled" : ''}`}>
                        <Link to="#" className="page-link" onClick={() => setPage(pageNumber - 1)}>
                          <i className="mdi mdi-chevron-left"></i>
                        </Link>
                      </li>
                      {
                        paginationArray.length <= 6 ? paginationArray.map((item, key) => (
                          <React.Fragment key={key}>
                            <li className={pageNumber === item ? "page-item active" : "page-item"}>
                              <Link to="#" className="page-link" onClick={() => setPage(item)}>{item}</Link>
                            </li>
                          </React.Fragment>
                        )) : (
                          <>
                            {
                              pageNumber <= 3 ? (
                                <>
                                  {paginationArray.slice(0, 5).map((item, key) => (
                                    <React.Fragment key={key}>
                                      <li className={pageNumber === item ? "page-item active" : "page-item"}>
                                        <Link to="#" className="page-link" onClick={() => setPage(item)}>{item}</Link>
                                      </li>
                                    </React.Fragment>
                                  ))}
                                  <li className="page-item">
                                    <Link to="#" className="page-link">...</Link>
                                  </li>
                                  <li className="page-item">
                                    <Link to="#" className="page-link" onClick={() => setPage(paginationArray.length)}>{paginationArray.length}</Link>
                                  </li>
                                </>
                              ) : pageNumber >= paginationArray.length - 2 ? (
                                <>
                                  <li className="page-item">
                                    <Link to="#" className="page-link" onClick={() => setPage(1)}>1</Link>
                                  </li>
                                  <li className="page-item">
                                    <Link to="#" className="page-link">...</Link>
                                  </li>
                                  {paginationArray.slice(paginationArray.length - 5, paginationArray.length).map((item, key) => (
                                    <React.Fragment key={key}>
                                      <li className={pageNumber === item ? "page-item active" : "page-item"}>
                                        <Link to="#" className="page-link" onClick={() => setPage(item)}>{item}</Link>
                                      </li>
                                    </React.Fragment>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <li className="page-item">
                                    <Link to="#" className="page-link" onClick={() => setPage(1)}>1</Link>
                                  </li>
                                  <li className="page-item">
                                    <Link to="#" className="page-link">...</Link>
                                  </li>
                                  {paginationArray.slice(pageNumber - 2, pageNumber + 1).map((item, key) => (
                                    <React.Fragment key={key}>
                                      <li className={pageNumber === item ? "page-item active" : "page-item"}>
                                        <Link to="#" className="page-link" onClick={() => setPage(item)}>{item}</Link>
                                      </li>
                                    </React.Fragment>
                                  ))}
                                  <li className="page-item">
                                    <Link to="#" className="page-link">...</Link>
                                  </li>
                                  <li className="page-item">
                                    <Link to="#" className="page-link" onClick={() => setPage(paginationArray.length)}>{paginationArray.length}</Link>
                                  </li>
                                </>
                              )
                            }
                          </>
                        )
                      }
                      <li className={`page-item ${totals === 0 || pageNumber === Math.ceil(totals / pageSize) ? "disabled" : ''}`}>
                        <Link to="#" className="page-link" onClick={() => setPage(pageNumber + 1)}>
                          <i className="mdi mdi-chevron-right"></i>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Row>
              )
            }
          </>
        )
      }
    </Fragment>
  )
}

TableContainer.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
}

export default TableContainer
