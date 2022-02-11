import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import Divider from "@mui/material/Divider";
import PaymentTable from "../../Table/PaymentTable";
import { useUsersContext } from "../../../Context/UserContext";
import {
  Button,
  Stack,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import Ursula from "../../Table/Ursula";
import { useEffect } from "react";
import * as AWS from "aws-sdk";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import ptLocale from "date-fns/locale/pt";
import Jornada from "./Jornada";

require("dotenv").config({ path: require("find-config")(".env") });

const useStyles = makeStyles((theme) => ({
  eachForm: {
    display: "flex",
    flexDirection: "column",
  },
  perfil: {
    fontSize: "20px",
    fontStyle: "normal",
    fontWeight: 500,
    lineHeight: "24px",
    color: "#5A3D8A",
    marginTop: "5%",
  },
  titleDados: {
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: "16px",
    lineHeight: "19px",
    /* identical to box height */

    color: "#535354",
  },
}));

const defaultValues = {
  nome: "",
  cpf: "",
  idkit: "",
  status: "1",
  datalogistica: "",
  datavenda: "",
  nometeste: "",
  laboratorio: "",
  tipo: "",
};

export default function NewUser() {
  const { row, isLoja, getType, address, getAddress, changeActive } =
    useUsersContext();

  const [formValues, setFormValues] = useState(defaultValues);
  const [value, setValue] = React.useState(null);

  console.log(formValues)

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formValues);
    createTable(formValues);
  };

  function createTable(submit) {
    let awsConfig2 = {
      region: process.env.REACT_APP_LOCATION_KEY,
      accessKeyId: process.env.REACT_APP_ACCESS_KEY,
      secretAccessKey: process.env.REACT_APP_SECRET_KEY,
    };
    AWS.config.update(awsConfig2);

    var params = {
      ExpressionAttributeNames: {
        "#Nome": "nome",
        "#C": "cpf",
        "#DV": "dataVenda",
        "#IDK": "idKit",
        "#DS": "diasStatus",
        "#S": "status",
        "#DL": "dataLogistica",
        "#DEC": "dataEnvioCasa",
        "#DA": "dataAtivacao",
        "#DEL": "dataEnvioLab",
        "#DLA": "dataLaudo",
        "#IE": "infosExtras",
        "#NT": "nomeTeste",
        "#LAB": "laboratorio",
        "#T": "tipo",
        "#DF": "dataFinalizado",
      },
      ExpressionAttributeValues: {
        ":n": {
          S: submit.nome,
        },
        ":c": {
          S: submit.cpf,
        },
        ":dv": {
          S: submit.datavenda.toString(),
        },
        ":ik": {
          S: submit.idkit,
        },
        ":d": {
          S: "1",
        },
        ":s": {
          S: "1",
        },
        ":dl": {
          S: submit.datavenda.toString(),
        },
        ":dec": {
          S: "nothing",
        },
        ":da": {
          S: "nothing",
        },
        ":del": {
          S: "nothing",
        },
        ":dla": {
          S: "nothing",
        },
        ":ie": {
          SS: [""],
        },
        ":nt": {
          S: submit.nometeste,
        },
        ":lab": {
          S: submit.laboratorio,
        },
        ":t": {
          S: submit.tipo,
        },
        ":df": {
          S: "nothing",
        },
      },
      Key: {
        id: {
          S: submit.idkit,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: "JornadaUdnaVix_2022",
      UpdateExpression:
        "SET #Nome = :n, #C = :c,#DV = :dv, #IDK = :ik, #DS = :d, #S = :s, #DL = :dl, #DEC = :dec, #DA = :da, #DEL = :del, #DLA = :dla, #IE = :ie, #NT = :nt, #LAB = :lab, #T = :t, #DF = :df",
    };
    var dynamodb = new AWS.DynamoDB();
    dynamodb.updateItem(params, function (err, data) {
      if (err) console.log(err, err.stack);
      // an error occurred
      else {
        console.log(data);
        alert("Venda criada com sucesso!");
      } // successful response
    });
  }

  const classes = useStyles();
  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: "#fff",
        borderRadius: "12px 12px 0px 0px",
        overflowY: "scroll",
        height: "100%",
      }}
    >
      <Button
        onClick={() => changeActive("jornada")}
        variant="contained"
        sx={{
          width: "78px",
          height: "29px",
          marginTop: "2%",
          marginLeft: "2%",
          background: "#744CB6",
          border: "0.5px solid #E5E5E5",
          boxSizing: "border-box",
          borderRadius: "12px",
          fontSize: "16px",
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "21px",
        }}
      >
        voltar
      </Button>
      <Box sx={{ marginTop: "5%", marginLeft: "2%" }}>
        <span className={classes.perfil}>Formulário</span>
      </Box>

      
      <Box sx={{ marginTop: "3%", marginLeft: "4%" }}>
        <span className={classes.perfil}>Venda</span>
      </Box>
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={4}
          padding={4}
          alignItems="center"
          justifyContent="center"
        >
          <Grid container item spacing={3}>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <TextField
                id="nome-input"
                name="nome"
                label="Nome"
                type="text"
                value={formValues.nome}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <TextField
                id="cpf-input"
                name="cpf"
                label="CPF (Somente números)"
                type="text"
                inputProps={{ maxLength: 11 }}
                value={formValues.cpf}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <TextField
                id="idkit-input"
                name="idkit"
                label="Id do Kit"
                type="text"
                value={formValues.idkit}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <TextField
                id="nometeste"
                name="nometeste"
                label="Nome do Teste"
                type="text"
                value={formValues.nometeste}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <FormControl>
                <InputLabel id="labo">
                  Laboratório
                </InputLabel>
                <Select
                  name="laboratorio"
                  label="Laboratório"
                  value={formValues.laboratorio ? formValues.laboratorio : ""}
                  onChange={handleInputChange}
                >
                  <MenuItem key="bio" value="Biogenetics">
                    Biogenetics
                  </MenuItem>
                  <MenuItem key="med" value="MedGen">
                    MedGen
                  </MenuItem>
                  <MenuItem key="dg" value="DGLab">
                    DGLab
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <FormControl>
                <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
                <Select
                  name="tipo"
                  label="Tipo"
                  value={formValues.tipo ? formValues.tipo : ""}
                  onChange={handleInputChange}
                >
                  <MenuItem key="prin" value="Kit Principal">
                    Kit Principal
                  </MenuItem>
                  <MenuItem key="ext" value="Kit Extra">
                    Kit Extra
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={ptLocale}
              >
                <DatePicker
                  label="Data da venda"
                  value={
                    ((formValues.datavenda = value),
                    (formValues.datalogistica = value))
                  }
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
          <Button
            sx={{
              marginTop: "8%",
              width: "74px",
              height: "27px",
              background: "rgba(116, 76, 182, 0.19)",
              borderRadius: "5px",
              fontSize: "16px",
              color: "#744CB6",
              fontStyle: "normal",
              fontWeight: "normal",
              lineHeight: "19px",
            }}
            variant="contained"
            color="primary"
            type="submit"
          >
            Criar
          </Button>
        </Grid>
      </form>
    </Box>

    /*fatores de risco e respostas*/
  );
}
