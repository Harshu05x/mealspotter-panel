import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  CardBody,
  Button,
  Label,
  Input,
  FormFeedback,
  Form,
} from "reactstrap";

// Formik Validation
import * as Yup from "yup";
import { useFormik } from "formik";

//redux
import { useSelector, useDispatch } from "react-redux";
import { createSelector } from "reselect";
import withRouter from "components/Common/withRouter";

//Import Breadcrumb
import Breadcrumb from "../../components/Common/Breadcrumb";

import avatar from "../../assets/images/users/avatar-1.jpg";
import userImg from "../../assets/images/users/avatar-0.png";

// actions
import { editProfile, getUserProfile, resetProfileFlag, updateUserPassword } from "../../store/actions";
import Spinners from "components/Common/Spinner";
import { ToastContainer } from "react-toastify";

const UserProfile = () => {

  //meta titley
  document.title = "Profile | Meals Spotter"  ;

  const dispatch = useDispatch();

  const [email, setemail] = useState("");
  const [name, setname] = useState("");
  const [idx, setidx] = useState(1);

  const selectProfileState = (state) => state.Profile;
    const ProfileProperties = createSelector(
      selectProfileState,
        (profile) => ({
          error: profile.error,
          success: profile.success,
          user: profile.user,
          loading: profile.loading,
        })
    );

    const {
      error,
      success,
      user,
      loading
  } = useSelector(ProfileProperties);


  useEffect(() => {
    if (localStorage.getItem("authUser")) {
      const obj = JSON.parse(localStorage.getItem("authUser"));
      if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
        setname(obj.displayName);
        setemail(obj.email);
        setidx(obj.uid);
      } else if (
        process.env.REACT_APP_DEFAULTAUTH === "fake" ||
        process.env.REACT_APP_DEFAULTAUTH === "jwt"
      ) {
        setname(obj.username);
        setemail(obj.email);
        setidx(obj.uid);
      }
      setTimeout(() => {
        dispatch(resetProfileFlag());
      }, 3000);
    }
  }, [dispatch, success]);

  const validation = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,

    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Required"),
      newPassword: Yup.string().required("Required"),
      confirmPassword: Yup.string().required("Required").oneOf(
        [Yup.ref("newPassword"), null],
        "Passwords must match"
      ),
    }),
    onSubmit: (values) => {
      dispatch(updateUserPassword(values));
      validation.resetForm();
    }
  });

  useEffect(() => {
    dispatch(getUserProfile());
  },[dispatch])


  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          {/* Render Breadcrumb */}
          <Breadcrumb title="Meals Spotter" breadcrumbItem="Profile" />

          <div>
            {
              loading ? <Spinners /> :
              <>
                <Row>
                  <Col lg="12">
                    {error && error ? <Alert color="danger">{error}</Alert> : null}
                    {success ? <Alert color="success">{success}</Alert> : null}

                    <Card>
                      <CardBody>
                        <p>Logged in as:</p>
                        <div className="d-flex gap-2">
                          <div className="ms-3">
                            <img
                              src={userImg}
                              alt=""
                              className="avatar-md rounded-circle img-thumbnail"
                            />
                          </div>
                          <div className="flex-grow-1 align-self-center">
                            <div className="text-muted">
                              <h5>{user?.email}</h5>
                              <p className="mb-0"><strong>Role: </strong> {user?.usertype}</p>
                              <p className="mb-1"><strong>Status: </strong> 
                                {
                                  user?.status ? " Active" : " Inactive"
                                }
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>

                <h4 className="card-title mb-4">Change User Password</h4>

                <Card>
                  <CardBody>
                    <Form
                      className="form-horizontal d-flex flex-column gap-2"
                      onSubmit={(e) => {
                        e.preventDefault();
                        validation.handleSubmit();
                        return false;
                      }}
                    >
                      <div className="form-group">
                        <Label className="form-label">Old Password</Label>
                        <Input
                          name="oldPassword"
                          // value={name}
                          className="form-control"
                          placeholder="Enter Old Password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.oldPassword || ""}
                          invalid={
                            validation.touched.oldPassword && validation.errors.oldPassword ? true : false
                          }
                        />
                        {validation.touched.oldPassword && validation.errors.oldPassword ? (
                          <FormFeedback type="invalid">{validation.errors.oldPassword}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="form-group">
                        <Label className="form-label">New Password</Label>
                        <Input
                          name="newPassword"
                          // value={name}
                          className="form-control"
                          placeholder="Enter New Password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.newPassword || ""}
                          invalid={
                            validation.touched.newPassword && validation.errors.newPassword ? true : false
                          }
                        />
                        {validation.touched.newPassword && validation.errors.newPassword ? (
                          <FormFeedback type="invalid">{validation.errors.newPassword}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="form-group">
                        <Label className="form-label">Confirm Password</Label>
                        <Input
                          name="confirmPassword"
                          // value={name}
                          className="form-control"
                          placeholder="Confirm Password"
                          type="password"
                          onChange={validation.handleChange}
                          onBlur={validation.handleBlur}
                          value={validation.values.confirmPassword || ""}
                          invalid={
                            validation.touched.confirmPassword && validation.errors.confirmPassword ? true : false
                          }
                        />
                        {validation.touched.confirmPassword && validation.errors.confirmPassword ? (
                          <FormFeedback type="invalid">{validation.errors.confirmPassword}</FormFeedback>
                        ) : null}
                      </div>

                      <div className="text-center mt-4">
                        <Button type="submit" color="danger">
                          Change User Password
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </>
            }
          </div>

        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
