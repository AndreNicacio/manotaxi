import React from "react";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import UserTable from "../../Table/UserTable";
import IconMenu from "../Menu/Menu";
import UserForm from "./Perfil";
import { useUsersContext } from "../../../Context/UserContext";
import Respostas from "../Respostas/Respostas";
import RespostasAvaliacoes from "../RespostasGerais/Respostas";
import Ursula from "../../Table/Ursula";
import UrsulaGeneral from "../../Table/UrsulaGeneral.js";
import Jornada from "../Jornada/Jornada";
import Avaliacoes from "../../Table/Avaliacoes";
import NewUser from "../Jornada/NewUser"
import AvaliacoesGeral from "../../Table/AvaliacoesGeral";
import Vendas from "../Vendas/Vendas";
import NewVenda from "../Vendas/NewVenda";
import RespostasGerais from "../RespostasGerais/Respostas";


const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    height: "100vh",
    backgroundColor: "#fff",
  },
  leftBox: {
    width: "20%",
  },
  rightBox: {
    width: "80%",
    height: "100vh",
    backgroundColor: "#F4F4F4",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  tableUser: {
    width: "95%",
    height: "533px",
    marginBottom: '20%'
  },
  imgLogo: {
    width: 102,
    height: 29,
    marginTop: 71,
    marginLeft: 27,
  },
  titleBack: {
    marginLeft: 27,
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "16px",
    lineHeight: "19px",
    /* identical to box height */

    color: "#535354",
  },
}));

export default function Usuario() {
  const { active } = useUsersContext();

  const classes = useStyles();
  return (
    <Box className={classes.main}>
      <Box className={classes.leftBox}>
        <Stack>
          <img
            src="/images/uDNA_logo_extenso_roxo.svg"
            alt="logo"
            className={classes.imgLogo}
          />
          <span className={classes.titleBack}>backoffice</span>
          <IconMenu />
        </Stack>
        
      </Box>
      <Box className={classes.rightBox}>
        <Box className={classes.tableUser}>

          {active === "usuarios" && <UserTable />}
          {active === "menuavaliacoes" && <AvaliacoesGeral />}
          {active === "perfil" && <UserForm />} 
          {active === "respostas" && <Respostas />}
          {active === "respostasGerais" && <RespostasGerais />}
          {active === "jornada" && <Jornada/>}
          {active === "newuser" &&  <NewUser/>}
          {active === "vendas" &&  <Vendas/>}
          {active === "newvenda" && <NewVenda/>}

          
        </Box>
      </Box>
    </Box>
  );
}

/* import React, { useState } from "react";
import Box from '@mui/material/Box';
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
    main: {
        display: 'flex',
        width: '100%',
        height: '100vh',
        backgroundColor: '#fff'
    }
  }));


export default function Usuario() {
    const classes = useStyles();
    return (
        <Box className={classes.main}>
            <div><span>TESTE</span></div>


        </Box>
    )

}     */
