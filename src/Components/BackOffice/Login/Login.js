import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import * as AmazonCognitoIdentity from "amazon-cognito-identity-js";
import jwt_decode from "jwt-decode";
import AWS from "aws-sdk";
import { useNavigate } from "react-router-dom";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://udna.life/">
        uDNA
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  body: {
    background: "#FFFEFE",

    height: "100vh",
    maxWidth: "50%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    width: 300,
    height: 300,
    backgroundColor: "#fff",
    marginTop: "26%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "2%",
  },
  avatar: {
    margin: 1,
    backgroundColor: "purple",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: 1,
  },
  submit: {
    margin: 3,
  },
}));

export default function SignIn() {
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [valuePassword, setValuePassword] = useState("");
  let navigate = useNavigate();

  const getData = (e) => {
    setValue(e.target.value);
  };

  const getDataPassword = (e) => {
    setValuePassword(e.target.value);
  };

  const email = value;
  const password = valuePassword;

  //awsConfig.js
  let cognitoAttributeList = [];

  const poolData = {
    UserPoolId: process.env.REACT_APP_POOL_KEY,
    ClientId: process.env.REACT_APP_CLIENT_KEY,
  };

  const attributes = (key, value) => {
    return {
      Name: key,
      Value: value,
    };
  };

  function setCognitoAttributeList(email, agent) {
    let attributeList = [];
    attributeList.push(attributes("email", email));
    attributeList.forEach((element) => {
      cognitoAttributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute(element)
      );
    });
  }

  function getCognitoAttributeList() {
    return cognitoAttributeList;
  }

  function getCognitoUser(email) {
    const userData = {
      Username: email,
      Pool: getUserPool(),
    };
    return new AmazonCognitoIdentity.CognitoUser(userData);
  }

  function getUserPool() {
    return new AmazonCognitoIdentity.CognitoUserPool(poolData);
  }

  function getAuthDetails(email, password) {
    const authenticationData = {
      Username: email,
      Password: password,
    };
    return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  }

  function initAWS(
    region = process.env.AWS_COGNITO_REGION,
    identityPoolId = process.env.AWS_COGNITO_IDENTITY_POOL_ID
  ) {
    AWS.config.region = region;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: identityPoolId,
    });
  }

  function decodeJWTToken(token) {
    const { email, exp, auth_time, token_use, sub } = jwt_decode(token.idToken);
    return { token, email, exp, uid: sub, auth_time, token_use };
  }
  //Cognito
  function failureCallback(error) {
    console.log("It failed with " + error);
  }

  function signIn(email, password) {
    return new Promise((resolve) => {
      getCognitoUser(email).authenticateUser(getAuthDetails(email, password), {
        onSuccess: (result) => {
          const token = {
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          };

          return resolve({ statusCode: 201, response: decodeJWTToken(token) });
        },

        onFailure: (err) => {
          return resolve({
            statusCode: 400,
            response: err.message || JSON.stringify(err),
          });
        },
      });
    }).catch(failureCallback);
  }

  const SignInVerify = async (e) => {
    e.preventDefault();
    const resolve = await signIn(email, password);
    if (resolve.statusCode === 400) {
      alert("Usuário/Senha Incorretos");
    } else {
      navigate('/backoffice/usuario');
    }
  };

  return (
    <Container className={classes.body} maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <img
          src="/images/uDNA_logo_extenso_roxo.svg"
          alt="logo"
          className={classes.img}
          width="174px"
          height="50px"
          backgroundColor=" #000"
          color=" #fff"
          border-radius="100%"
        />
        <img
          src="/images/backofficeTitle.svg"
          alt="logo"
          className={classes.img}
          width="97px"
          height="26px"
          backgroundColor=" #000"
          color=" #fff"
          border-radius="100%"
        />

        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            autoFocus
            onChange={getData}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            onChange={getDataPassword}
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={SignInVerify}
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}
