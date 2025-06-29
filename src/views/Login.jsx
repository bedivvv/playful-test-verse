
import React, { useState, useEffect } from "react";
import { withTranslation } from "react-i18next";
import { useMutation, gql } from "@apollo/client";
import { ownerLogin } from "../apollo";
import { validateFunc } from "../constraints/constraints";
import { LoginContainer, RightSection } from "../components/Login/LoginStyles";
import BrandSection from "../components/Login/BrandSection";
import LoginForm from "../components/Login/LoginForm";

const LOGIN = gql`
  ${ownerLogin}
`;

const Login = (props) => {
  const [stateData, setStateData] = useState({
    email: "admin@gmail.com",
    password: "123123",
    emailError: null,
    passwordError: null,
    error: null,
    type: null,
    redirectToReferrer: !!localStorage.getItem("user-enatega"),
  });
  const [isLogged, setIsLogged] = useState(false);
  const { t } = props;

  const onBlur = (event, field) => {
    setStateData({
      ...stateData,
      [field + "Error"]: !validateFunc({ [field]: stateData[field] }, field),
    });
  };

  const validate = () => {
    const emailError = !validateFunc({ email: stateData.email }, "email");
    const passwordError = !validateFunc(
      { password: stateData.password },
      "password"
    );
    setStateData({ ...stateData, emailError, passwordError });
    return emailError && passwordError;
  };

  const { redirectToReferrer, type } = stateData;

  useEffect(() => {
    if (isLogged) {
      if (redirectToReferrer && type === 0) {
        props.history.replace("/restaurant/list");
      }
      if (redirectToReferrer && type === 1) {
        props.history.replace("/super_admin/vendors");
      }
    }
  }, [isLogged, redirectToReferrer, type, props.history]);

  const onCompleted = (data) => {
    localStorage.setItem("user-enatega", JSON.stringify(data.ownerLogin));
    const userType = data.ownerLogin.userType;
    if (userType === "VENDOR") {
      setStateData({
        ...stateData,
        redirectToReferrer: true,
        type: 0,
        emailError: null,
        passwordError: null,
      });
    } else {
      setStateData({
        ...stateData,
        redirectToReferrer: true,
        type: 1,
        emailError: null,
        passwordError: null,
      });
    }
    setIsLogged(true);
    setTimeout(hideAlert, 5000);
  };

  const hideAlert = () => {
    setStateData({
      ...stateData,
      emailError: null,
      passwordError: null,
      error: null,
    });
  };

  const onError = (error) => {
    if (error.graphQLErrors.length) {
      setStateData({
        ...stateData,
        error: error.graphQLErrors[0].message,
      });
    }
    if (error.networkError) {
      setStateData({
        ...stateData,
        error: error.message,
      });
    }
    setIsLogged(false);
    setTimeout(hideAlert, 5000);
  };

  const [mutate] = useMutation(LOGIN, { onError, onCompleted });

  const loginFunc = async () => {
    if (validate()) {
      mutate({ variables: { ...stateData } });
    }
  };

  return (
    <LoginContainer>
      <BrandSection />
      <RightSection>
        <LoginForm
          stateData={stateData}
          setStateData={setStateData}
          onBlur={onBlur}
          loginFunc={loginFunc}
          t={t}
        />
      </RightSection>
    </LoginContainer>
  );
};

export default withTranslation()(Login);
