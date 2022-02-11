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
import Jornada from "../Jornada/Jornada";
import MaskedInput from "../utils/MaskedInput";

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
  telefone: "",
  cpf: "",
  datavenda: "",
  datanota: "",
  gateway: "",
  idvenda: "",
  categoria: "",
  produto: "",
  valor: "",
  status: "1",
};

export default function NewVenda() {
  const { row, isLoja, getType, address, getAddress, changeActive } =
    useUsersContext();

  const [formValues, setFormValues] = useState(defaultValues);
  const [value, setValue] = React.useState(null);

  console.log(formValues);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  console.log(formValues.cpf.length)

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
        "#TEL": "telefone",
        "#C": "cpf",
        "#DV": "dataVenda",
        "#G": "gateway",
        "#IDV": "idVenda",
        "#CAT": "categoria",
        "#PRO": "produto",
        "#S": "status",
        "#D": "dias",
        "#V": "valor",
        "#DP": "dataProcessado",
        "#IE": "infosExtras",
        "#DN": "dataNota",
      },
      ExpressionAttributeValues: {
        ":n": {
          S: submit.nome,
        },
        ":t": {
          S: submit.telefone,
        },
        ":c": {
          S: submit.cpf,
        },
        ":dv": {
          S: submit.datavenda.toString(),
        },
        ":g": {
          S: submit.gateway,
        },
        ":i": {
          S: submit.idvenda,
        },
        ":cat": {
          S: submit.categoria,
        },
        ":p": {
          S: submit.produto,
        },
        ":s": {
          S: "1",
        },
        ":d": {
          S: "",
        },
        ":v": {
          S: submit.valor,
        },
        ":dp": {
          S: "nothing",
        },
        ":ie": {
          SS: [""],
        },
        ":dn": {
          S: "nothing",
        },
      },
      Key: {
        id: {
          S: submit.idvenda,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: "vendasMonitoramentoVix2022-prd",
      UpdateExpression:
        "SET #Nome = :n, #TEL = :t, #C = :c,#DV = :dv,#G = :g, #IDV = :i, #CAT = :cat, #PRO = :p, #S = :s, #D = :d, #V = :v, #DP = :dp, #IE = :ie, #DN = :dn",
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

  function handleMask(number){
      if (number < 11){
          return "999.999.999-99"
      } else if (number > 11){
          return "99.999.999/9999-99"
      }
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
        onClick={() => changeActive("vendas")}
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
                id="telefone-input"
                name="telefone"
                label="Telefone"
                type="text"
                value={formValues.telefone}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <MaskedInput
                name="cpf"
                mask={formValues.cpf.length <= 11  ? "999.999.999-999" : "99.999.999/9999-99"}
                
                value={formValues.cpf}
                onChange={handleInputChange}
              />
              {/* <TextField
                id="cpf-input"
                name="cpf"
                label="CPF (Somente números)"
                type="text"
                inputProps={{ maxLength: 11 }}
                value={formValues.cpf}
                onChange={handleInputChange}
              /> */}
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <LocalizationProvider
                dateAdapter={AdapterDateFns}
                locale={ptLocale}
              >
                <DatePicker
                  label="Data da venda"
                  value={(formValues.datavenda = value)}
                  onChange={(newValue) => {
                    setValue(newValue);
                  }}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <TextField
                id="gateway"
                name="gateway"
                label="Gateway"
                type="text"
                value={formValues.gateway}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <TextField
                id="idvenda-input"
                name="idvenda"
                label="Id da venda"
                type="text"
                value={formValues.idvenda}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          <Grid container item spacing={3}>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <TextField
                id="categoria"
                name="categoria"
                label="Categoria"
                type="text"
                value={formValues.categoria}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
            <FormControl>
                <InputLabel id="prod">
                  Produto
                </InputLabel>
                <Select
                  name="produto"
                  label="Produto"
                  value={formValues.produto ? formValues.produto : ""}
                  onChange={handleInputChange}
                >
                  <MenuItem key="cov" value="COVID">
                    COVID
                  </MenuItem>
                  <MenuItem key="rec" value="Reconstrução Familiar">
                    Reconstrução Familiar
                  </MenuItem>
                  <MenuItem key="prev" value="Prevenção">
                    Prevenção
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
              <TextField
                id="valor"
                name="valor"
                label="Valor"
                type="text"
                value={formValues.valor}
                onChange={handleInputChange}
              />
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
