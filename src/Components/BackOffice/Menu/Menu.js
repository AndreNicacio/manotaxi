import * as React from "react";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";

import { makeStyles } from "@mui/styles";
import { useUsersContext } from "../../../Context/UserContext";

const useStyles = makeStyles((theme) => ({
  menuItens: {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "19px",
    /* identical to box height */

    color: "#744CB6",
  },
}));

export default function IconMenu() {
  const classes = useStyles();
  const {changeActive} = useUsersContext();

  function handleClickUser () {
    changeActive('usuarios');
    /* getAddress(''); */
  }

  function handleClickJornada() {
    changeActive('jornada');
  }
  return (
    <Paper
      sx={{
        width: 320,
        maxWidth: "100%",
        boxShadow: 0,
        marginTop: "248px",
        marginLeft: "13px",
      }}
    >
      <MenuList>
        <MenuItem
          onClick={handleClickUser }
        >
          <ListItemIcon>
            <img src="/images/imgUsuario.svg" alt="usuario"/>
          </ListItemIcon>
          <ListItemText><span className={classes.menuItens}>Usuários</span></ListItemText>
          {/* <Typography variant="body2" color="text.secondary">
            ⌘X
          </Typography> */}
        </MenuItem>
        <MenuItem onClick={handleClickJornada}>
          <ListItemIcon>
            <img src="/images/imgJornada.svg" />
          </ListItemIcon>
          <ListItemText><span className={classes.menuItens}>Laudos</span></ListItemText>
        </MenuItem>
        <MenuItem onClick={() => changeActive('vendas')}>
          <ListItemIcon>
            <img src="/images/imgCupom.svg" />
          </ListItemIcon>
          <ListItemText><span className={classes.menuItens}>Vendas</span></ListItemText>
          
        </MenuItem>
        <MenuItem onClick={() => changeActive('menuavaliacoes')}>
          <ListItemIcon>
            <img src="/images/imgFormulario.svg" alt="avaliacoes"/>
          </ListItemIcon>
          <ListItemText><span className={classes.menuItens}>Avaliações</span></ListItemText>
          {/* <Typography variant="body2" color="text.secondary">
            ⌘V
          </Typography> */}
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <img src="/images/imgLogout.svg" alt="logout"/>
          </ListItemIcon>
          <ListItemText ><span className={classes.menuItens}>Sair da conta</span></ListItemText>
          {/* <Typography variant="body2" color="text.secondary">
            ⌘V
          </Typography> */}
        </MenuItem>
      </MenuList>
    </Paper>
  );
}
