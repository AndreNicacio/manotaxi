import React, { useState, useEffect } from "react";
import { useUsersContext } from "../../../Context/UserContext";
import * as AWS from "aws-sdk";
import {
  TextField,
  Grid,
  Button,
  Box,
  Typography,
  Modal,
  Card,
  CardContent,
} from "@mui/material";
require('dotenv').config({ path: require('find-config')('.env') })

const style = {

  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

function createInfo(text, id, setRefresh) {
  let awsConfig2 = {
    region: process.env.REACT_APP_LOCATION_KEY,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  };
  AWS.config.update(awsConfig2);

  var params = {
    ExpressionAttributeNames: {
      "#IE": "infosExtras",
    },
    ExpressionAttributeValues: {
      ":ie": {
        SS: [text.info],
      },
    },
    Key: {
      id: {
        S: id,
      },
    },
    /* Action: "ADD", */
    ReturnValues: "ALL_NEW",
    TableName: "vendasMonitoramentoVix2022-prd",
    UpdateExpression: "ADD #IE :ie",
  };

  var dynamodb = new AWS.DynamoDB();
  dynamodb.updateItem(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else {
    
      alert("Concluído!");
      setRefresh(false);

    } // successful response
  });
}

function getInfos(id, setInfos) {

  let awsConfig2 = {
    region: process.env.REACT_APP_LOCATION_KEY,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  };
  AWS.config.update(awsConfig2);

  var params = {
    ExpressionAttributeNames: {
      "#IE": "infosExtras",
    },
    ExpressionAttributeValues: {
      ":a": {
        S: id,
      },
    },
    FilterExpression: "id = :a",
    ProjectionExpression: "#IE",
    TableName: "vendasMonitoramentoVix2022-prd",
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
      setInfos(data.Items[0].infosExtras.SS);
    }
  });
}

export default function ModalInfoVendas() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { handleModal, openModal, rowStatus } = useUsersContext();
  const [formValues, setFormValues] = useState([""]);
  const [value, setValue] = React.useState(null);
  const [infos, setInfos] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    getInfos(rowStatus.idVenda, setInfos);

    /* updateData(); */
    /*  createTable(); */
    /* deleteItem(); */
    /* getAddress(); */
  }, [refresh]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    createInfo(formValues, rowStatus.idVenda , setRefresh);
    setRefresh(true);
  };

  return (
    <div>
      {/* <Button onClick={openModal}>Open modal</Button> */}
      <Modal
        
        open={openModal}
        onClose={() => handleModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {infos.map((value) => {
            if (value === ''){
              return 
            }
            else{
            return (
              <Card>
                <CardContent>
                  <Typography
                    id="modal-modal-title"
                    variant="h6"
                    component="h2"
                  >
                    {value}
                  </Typography>
                </CardContent>
              </Card>
            );
          }
          })}

          <form onSubmit={handleSubmit}>
            <Grid
              container
              alignItems="center"
              justify="center"
              direction="column"
              spacing={2}
              marginTop={2}
            >
              <Grid item>
                <TextField
                  id="info-input"
                  name="info"
                  label="Informações (max. 280)"
                  type="text"
                  value={formValues.name}
                  onChange={handleInputChange}
                  multiline
                />
              </Grid>
            </Grid>
            <Button
              sx={{
                marginLeft:"35%",
                marginTop: "10%",
                width: "84px",
                height: "37px",
                background: "rgba(116, 76, 182, 0.19)",
                borderRadius: "5px",
                fontSize: "10px",
                color: "#744CB6",
                fontStyle: "normal",
                fontWeight: "normal",
                lineHeight: "19px",
              }}
              variant="contained"
              color="primary"
              type="submit"
            >
              Adicionar Informação
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
