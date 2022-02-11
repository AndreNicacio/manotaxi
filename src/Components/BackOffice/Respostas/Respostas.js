import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { makeStyles } from "@mui/styles";
import * as AWS from "aws-sdk";
import Divider from "@mui/material/Divider";
import { Button, Stack } from "@mui/material";
import { useUsersContext } from "../../../Context/UserContext";
import Avaliacoes from "../../Table/AvaliacoesFatoresDoencas";
require('dotenv').config({ path: require('find-config')('.env') })
export let questions = [];
export let resposta = [];

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

/* const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
})); */

export default function Respostas() {
  const { row } = useUsersContext();
  const [questionsClean, setQuestion] = React.useState([])

  React.useEffect(() => {
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
          S: row.cpf
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
        for (let i = 0; i < data?.Items[0]?.Titulo.L.length; i++) {
          questions[i] = data?.Items[0]?.Titulo.L[i].S;
          resposta[i] = data?.Items[0]?.Resposta.L[i].S;
        }
        setQuestion(questions)

        //questions = data.Items[0].Titulo.L
        //respostas = data.Items[0].Resposta.L
      }
    });
  }, [])

  console.log(questionsClean)
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
      <Box sx={{ marginTop: "5%", marginLeft: "2%" }}>
        <span className={classes.perfil}>Respostas do usuário</span>
      </Box>
      <Grid container spacing={4} padding={4}>
        <Box sx={{ marginTop: "3%", marginLeft: "4%" }}>
          <span className={classes.perfil}>Respostas</span>
        </Box>
        <Grid container item spacing={3}>
          <Grid sx={{ display: "flex", flexDirection: "column" }} item xs>
            {questions.map((quest, i) => {
              console.log(quest)
              return (
                <>
                  <span className={classes.titleDados}>{quest}</span>
                  <TextField
                    id="outlined-basic"
                    hiddenLabel
                    variant="filled"
                    size="small"
                    defaultValue={resposta[i]}
                  />
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
      <Avaliacoes/>
      <br></br>
      <br></br>
    </Box>

    /*fatores de risco e respostas*/
  );
}