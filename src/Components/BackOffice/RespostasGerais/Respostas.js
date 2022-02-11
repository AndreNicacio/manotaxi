import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import * as AWS from "aws-sdk";
import Divider from "@mui/material/Divider";
import { Button, Stack, Paper } from "@mui/material";
import { useUsersContext } from "../../../Context/UserContext";
import AvaliacoesFatoresDoencasGerais from "../../Table/AvaliacoesFatoresDoencasGerais";
require("dotenv").config({ path: require("find-config")(".env") });
export let questions = [];
export let resposta = [];
export let cpfAvaliacao = [];

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
    marginBottom: "2px",
    /* identical to box height */

    color: "#535354",
  },
}));

/* const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
})); */

function getRespostas(cpf, getAnswers, getQuestions) {
  console.log("chegou");
  let awsConfig2 = {
    region: process.env.REACT_APP_LOCATION_KEY,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  };
  AWS.config.update(awsConfig2);

  var params = {
    ExpressionAttributeNames: {
      "#Titulo": "Titulo",
      "#Resposta": "Resposta",
    },
    ExpressionAttributeValues: {
      ":a": {
        S: cpf,
      },
    },
    FilterExpression: "id = :a",
    ProjectionExpression: "#Titulo, #Resposta",
    TableName: "respostaUser-prd",
  };

  var dynamodb = new AWS.DynamoDB();

  dynamodb.scan(params, function (err, data) {
    if (err) {
      console.log(err, err.stack);
    } else {
      getQuestions(data.Items[0].Titulo.L);
      getAnswers(data.Items[0].Resposta.L);

      /* for (let i = 0; i < data?.Items[0]?.Titulo.L.length; i++) {
        questions[i] = data?.Items[0]?.Titulo.L[i].S;
        resposta[i] = data?.Items[0]?.Resposta.L[i].S;
      } */

      //questions = data.Items[0].Titulo.L
      //respostas = data.Items[0].Resposta.L
    }
  });
}

export default function RespostasGerais() {
  const [questionsClean, setQuestion] = React.useState([]);
  const {
    rowAvaliacao,
    getQuestions,
    titleQuestions,
    answers,
    getAnswers,
    changeActive,
  } = useUsersContext();

  useEffect(() => {
    getRespostas(rowAvaliacao.cpf, getAnswers, getQuestions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  function handleClickBack() {
    changeActive("menuavaliacoes");
    getAnswers([]);
    getQuestions([]);
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
        onClick={() => handleClickBack()}
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
        <span className={classes.perfil}>Respostas do usuário</span>
      </Box>
      <Grid container spacing={4} padding={4}>
        <Box sx={{ marginTop: "3%", marginLeft: "4%" }}>
          <span className={classes.perfil}>Respostas</span>
        </Box>
        <Grid container item spacing={3}>
          <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
            {titleQuestions.map((quest, i) => {
              const teste = answers[i]?.S;

              return (
                <>
                  <span key={i} className={classes.titleDados}>
                    {quest.S}
                  </span>
                  <Paper
                    variant="outlined"
                    elevation={2}
                    sx={{ backgroundColor: "#C0C0C0", marginBottom: "2px" }}
                  >
                    {teste}
                  </Paper>
                </>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
      <Divider variant="middle" />
      <Stack
        direction="row"
        spacing={4}
        sx={{ marginTop: "2.5%", marginLeft: "5%" }}
      >
        <Button
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
        {/* <Button
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
         URSULA
       </Button> */}
      </Stack>
      <AvaliacoesFatoresDoencasGerais />
      <br></br>
      <br></br>
    </Box>

    /*fatores de risco e respostas*/
  );
}
