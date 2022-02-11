import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import Divider from "@mui/material/Divider";
import PaymentTable from "../../Table/PaymentTable";
import { useUsersContext } from "../../../Context/UserContext";
import { Button, Stack } from "@mui/material";
import Ursula from "../../Table/Ursula";
import { useEffect } from "react";
import * as AWS from "aws-sdk";
require('dotenv').config({ path: require('find-config')('.env') })
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

/* function createDataAddress(
  street,
  number,
  neighborhood,
  city,
  stateInitials,
  zipCode
) {
  return {
    street,
    number,
    neighborhood,
    city,
    stateInitials,
    zipCode,
  };
} */

function getFullAddress(cpf, getAddress) {
  let awsConfig2 = {
    region: process.env.REACT_APP_LOCATION_KEY,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  };
  AWS.config.update(awsConfig2);

  var params = {
    ExpressionAttributeNames: {
      "#RUA": "street",
      "#num": "number",
      "#bairro": "neighborhood",
      "#cidade": "city",
      "#estado": "stateInitials",
      "#CEP": "zipCode",
    },
    ExpressionAttributeValues: {
      ":a": {
        S: cpf,
      },
    },
    FilterExpression: "id = :a",
    ProjectionExpression: "#RUA, #num, #bairro, #cidade, #estado, #CEP",
    TableName: "Address-3tn77dv2gbag7ibwijizdpc7sa-prd",
  };

  var dynamodb = new AWS.DynamoDB();

  dynamodb.scan(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      //LOCAL ADICIONADO PARA CAPTURA DOS ITEMS RETORNADOS PELO BANCO DE DADOS
      //CAPTURAR O (DATA.ITEMS) E RENDERIZAR DENTRO DE ROWS!!!!! <===========
      //PARA A CAPTURA UTILIZAR USESTATE( OU QUALQUER FATOR DE SUA PREFERENCIA)
      //NESTA FUNÇAO *ExpressionAttributeNames = RETORNA OS ATRIBUTOS DO BANCO DE DADOS QUE EU QUERO, **ExpressionAttributeValues = RECEBE O "FILTRO/PARAMETRO" UTILIZADO NA BUSCA
      // **FilterExpression = EXPRESSAO DE FILTRO, **ProjectionExpression = EXIBIÇAO DE RETORNO DOS DADOS, **TableName == TABELA DE BUSCA
      // AO CAPTURAR OS DADOS DO RETORNO DE EXPRESSAO, A RENDERIZAÇÃO ESTARA COMPLETA DESDE QUE A VARIAVEL GLOBAL DE RENDERIZAÇÅO SEJA A MESMA QUE ESTEJA RENDERIZANDO
      // REPTIR ESSE MODELO PARA TODOS OS METODOS DE RENDERIZAÇAO
      getAddress(data.Items);
    }
  });
}

export default function UserForm() {
  const { row, isLoja, getType, address, getAddress, changeActive } =
    useUsersContext();
  
   console.log(address);

  useEffect(() => {
    getFullAddress(row.cpf, getAddress);
    getType("loja");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* const rowsAddress = address.map((result) => {
    return createDataAddress(
      result.street.S,
      result.number.S,
      result.neighborhood.S,
      result.city.S,
      result.stateInitials.S,
      result.zipCode.S,
    );
  });
  console.log(Object.values(rowsAddress)); */

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
        onClick={() => changeActive("usuarios")}
        variant="contained"
        sx={{
          width: "78px",
          height: "29px",
          marginTop: '2%',
          marginLeft: '2%',
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
        <span className={classes.perfil}>Perfil do usuário</span>
      </Box>
      <Grid container spacing={4} padding={4}>
        <Box sx={{ marginTop: "3%", marginLeft: "4%" }}>
          <span className={classes.perfil}>Usuário</span>
        </Box>
        <Grid container item spacing={3}>
          <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
            <span className={classes.titleDados}>Nome</span>
            <TextField
              id="outlined-basic"
              hiddenLabel
              variant="filled"
              size="small"
              defaultValue={row?.name}
            />
          </Grid>
          <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
            <span className={classes.titleDados}>CPF</span>
            <TextField
              id="outlined-basic"
              hiddenLabel
              variant="filled"
              size="small"
              defaultValue={row?.cpf}
            />
          </Grid>
          <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
            <span className={classes.titleDados}>Email</span>
            <TextField
              id="filled-basic"
              hiddenLabel
              variant="filled"
              size="small"
              defaultValue={row?.email}
            />
          </Grid>
          <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
            <span className={classes.titleDados}>Telefone</span>
            <TextField
              id="filled-basic"
              hiddenLabel
              variant="filled"
              size="small"
              defaultValue={row?.cellphone}
            />
          </Grid>
        </Grid>
        {address.map((ad) => {
          return (
            <>
              <Grid container item spacing={4}>
                <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
                  <span className={classes.titleDados}>Rua</span>
                  <TextField
                    id="filled-basic"
                    hiddenLabel
                    variant="filled"
                    size="small"
                    defaultValue={ad.street.S}
                  />
                </Grid>
                <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
                  <span className={classes.titleDados}>Número</span>
                  <TextField
                    id="filled-basic"
                    hiddenLabel
                    variant="filled"
                    size="small"
                    defaultValue={ad.number.S}
                  />
                </Grid>
                <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
                  <span className={classes.titleDados}>Bairro</span>
                  <TextField
                    id="filled-basic"
                    hiddenLabel
                    variant="filled"
                    size="small"
                    defaultValue={ad.neighborhood.S}
                  />
                </Grid>
              </Grid>
              <Grid container item spacing={3}>
                <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
                  <span className={classes.titleDados}>Cidade</span>
                  <TextField
                    id="filled-basic"
                    hiddenLabel
                    variant="filled"
                    size="small"
                    defaultValue={ad.city.S}
                  />
                </Grid>
                <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
                  <span className={classes.titleDados}>Estado</span>
                  <TextField
                    id="filled-basic"
                    hiddenLabel
                    variant="filled"
                    size="small"
                    defaultValue={ad.stateInitials.S}
                  />
                </Grid>

                <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
                  <span className={classes.titleDados}>CEP</span>
                  <TextField
                    id="filled-basic"
                    hiddenLabel
                    variant="filled"
                    size="small"
                    defaultValue={ad.zipCode.S}
                  />
                </Grid>
              </Grid>
            </>
          );
        })}
      </Grid>
      <Divider variant="middle" />
      <Stack
        direction="row"
        spacing={4}
        sx={{ marginTop: "2.5%", marginLeft: "5%" }}
      >
        <Button
          onClick={() => getType("loja")}
          variant="contained"
          sx={{
            width: "158px",
            height: "49px",
            background: "#744CB6",
            border: "0.5px solid #E5E5E5",
            boxSizing: "border-box",
            borderRadius: "12px",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "21px",
          }}
        >
          LOJA
        </Button>
        <Button
          onClick={() => getType("ursula")}
          variant="contained"
          sx={{
            width: "158px",
            height: "49px",
            background: "#744CB6",
            border: "0.5px solid #E5E5E5",
            boxSizing: "border-box",
            borderRadius: "12px",
            fontSize: "18px",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "21px",
          }}
        >
          AVALIAÇÕES
        </Button>
      </Stack>
      {isLoja === "loja" && <PaymentTable />}
      {isLoja === "ursula" && <Ursula />}
    </Box>

    /*fatores de risco e respostas*/
  );
}