import React, { useState, useEffect } from "react";
import { useUsersContext } from "../../../Context/UserContext";
import * as AWS from "aws-sdk";
import { makeStyles } from "@mui/styles";
import {
  TextField,
  Grid,
  Button,
  Box,
  Typography,
  Modal,
  Card,
  CardContent,
  Paper
} from "@mui/material";
require('dotenv').config({ path: require('find-config')('.env') })

const useStyles = makeStyles((theme) => ({
    headerTable: {
      color: "#5A3D8A",
      fontStyle: "normal",
      fontWeight: "normal",
      fontSize: "16px",
      lineHeight: "19px",
    },
    rowTable: {
      fontSize: "16px",
    },
    papers: {
      width: "129px",
      height: "88px",
      background: "#FFFEFE",
      borderRadius: "12px",
      textAlign: "center",
      marginRight: '20px'
    },
  }));

  

export default function Indicadores({children}) {
  
    const classes = useStyles();
  return (
    <Box sx={{ marginBottom: "23px", display: 'flex', flexDirection: "row" }}>
        <Paper className={classes.papers}>
          <Typography
            sx={{
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              padding: "10px",
              
            }}
          >
            Total de laudos ativos
          </Typography>{" "}
          <Typography sx={{
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              
            }}>{children.length}</Typography>
        </Paper>

        <Paper className={classes.papers}>
          <Typography
            sx={{
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              padding: "10px"
            }}
          >
            Kit em Preparação
          </Typography>{" "}
          <Typography sx={{
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              
            }}>{children.filter(row => row.status === '1').length}</Typography>
        </Paper>

        <Paper className={classes.papers}>
          <Typography
            sx={{
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              padding: "10px"
            }}
          >
            Envio Casa
          </Typography>{" "}
          <Typography sx={{
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              
            }}>{children.filter(row => row.status === '2').length}</Typography>
        </Paper>

        <Paper className={classes.papers}>
          <Typography
            sx={{
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              padding: "10px"
            }}
          >
            Recebido
          </Typography>{" "}
          <Typography sx={{
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              
            }}>{children.filter(row => row.status === '3').length}</Typography>
        </Paper>

        <Paper className={classes.papers}>
          <Typography
            sx={{
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              padding: "10px"
            }}
          >
            Envio Lab
          </Typography>{" "}
          <Typography sx={{
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              
            }}>{children.filter(row => row.status === '4').length}</Typography>
        </Paper>

        <Paper className={classes.papers}>
          <Typography
            sx={{
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              padding: "10px"
            }}
          >
            Recebido Lab
          </Typography>{" "}
          <Typography sx={{
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              
            }}>{children.filter(row => row.status === '5').length}</Typography>
        </Paper>

        <Paper className={classes.papers}>
          <Typography
            sx={{
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              padding: "10px"
            }}
          >
            Finalizado
          </Typography>{" "}
          <Typography sx={{
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "19px",
              color: "#535354",
              
            }}>{children.filter(row => row.status === '6').length}</Typography>
        </Paper>
      </Box>
  );
}
