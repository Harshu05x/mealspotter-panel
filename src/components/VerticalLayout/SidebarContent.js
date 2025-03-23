import React, { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";


// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import withRouter from "components/Common/withRouter";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

const SidebarContent = props => {
  const ref = useRef();
  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];

    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const path = useLocation();
  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <React.Fragment>
      <SimpleBar className="h-100" ref={ref}>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{props.t("Menu")} </li>

          {/* Dashboard link */}
            <li>
              <Link to="/dashboard">
                <i className="bx bx-home-circle"></i>
                <span style={{color: "white"}}>{props.t("Dashboard")}</span>
              </Link>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-package"></i>
                <span>{props.t("Orders")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/completed-orders">{props.t("Completed Orders")}</Link>
                </li>
                <li>
                  <Link to="/all-orders">{props.t("All Orders")}</Link>
                </li>
                <li>
                  <Link to="/pre-bookings">
                    {props.t("Pre Bookings")}
                  </Link>
                </li>
                <li>
                  <Link to="/upcoming-orders">{props.t("Upcoming Orders")}</Link>
                </li>
                <li>
                  <Link to="/ongoing-orders">{props.t("Ongoing Orders")}</Link>
                </li>
                <li>
                  <Link to="/due-returns">{props.t("Due for Return")}</Link>
                </li>
                {/* <li>
                  <Link to="/cancelled-orders">{props.t("Cancelled Orders")}</Link>
                </li> */}
                <li>
                  <Link to="/refunded-orders">{props.t("Refunded / Cancelled Orders")}</Link>
                </li>
                <li>
                  <Link to="/failed-carts">{props.t("Failed Carts")}</Link>
                </li>
                <li>
                  <Link to="/abandoned-carts">{props.t("Abandoned Carts")}</Link>
                </li>
              </ul>
            </li>

            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-user"></i>
                <span>{props.t("Customers")}</span>
              </Link>
              <ul className="sub-menu">
                <li>
                  <Link to="/customers">{props.t("Customers")}</Link>
                </li>
                <li>
                  <Link to="/new-registration">{props.t("New Registration")}</Link>
                </li>
                <li>
                  <Link to="/enquiries">{props.t("Enquiries")}</Link>
                </li>
                <li>
                  <Link to="/email-verification">{props.t("Pending Email Verification")}</Link>
                </li>
              </ul>
            </li>


            <li>
              <Link to="/#" className="has-arrow">
                <i className="bx bx-money"></i>
                <span>{props.t("Payments")}</span>
              </Link>
              <ul className="sub-menu">

                <li>
                  <Link to="/payment-history">
                    {props.t("Payment History")}
                  </Link>
                </li>
              </ul>
            </li>




            <li>
              <Link to="/#" className="has-arrow ">
                <i className="bx bx-cog"></i>
                <span>{props.t("Masters")}</span>
              </Link>
              <ul className="sub-menu">
                {/* <li>
                  <Link to="/toys">{props.t("Toys")}</Link>
                </li>
                <li>
                  <Link to="/categories">{props.t("Categories")}</Link>
                </li>
                <li>
                  <Link to="/agegroups">{props.t("Age Groups")}</Link>
                </li> */}
                <li>
                  <Link to="/mess-owners">{props.t("Mess Owners")}</Link>
                </li>
                {/* <li>
                  <Link to="/zones">{props.t("Zones")}</Link>
                </li>
                <li>
                  <Link to="/areas">{props.t("Areas")}</Link>
                </li>
                <li>
                  <Link to="/coupons">{props.t("Coupons")}</Link>
                </li>
                <li>
                  <Link to="/pickup-points">{props.t("Pick Up Points")}</Link>
                </li> */}
                {/*<li>
                  <Link to="/#" className="has-arrow">
                    {props.t("Level 1.2")}
                  </Link>
                  <ul className="sub-menu">
                    <li>
                      <Link to="/#">{props.t("Level 2.1")}</Link>
                    </li>
                    <li>
                      <Link to="/#">{props.t("Level 2.2")}</Link>
                    </li>
                  </ul>
                </li>*/}

              </ul>
            </li>
          </ul>
        </div>
      </SimpleBar>
    </React.Fragment>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
