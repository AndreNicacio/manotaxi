import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import AddCircleIcon from "@mui/icons-material/AddCircle";

import { makeStyles } from "@mui/styles";
import { TextField } from "@mui/material";
import * as AWS from "aws-sdk";

import { useUsersContext } from "../../../Context/UserContext";
import DataFormatter from "../utils/DataFormatter";
import ModalInfo from "./ModalInfo";
import Indicadores from "./Indicadores";
require("dotenv").config({ path: require("find-config")(".env") });

function getTableJornada(getJornada) {
  let awsConfig2 = {
    region: process.env.REACT_APP_LOCATION_KEY,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  };
  AWS.config.update(awsConfig2);

  var params = {
    TableName: "JornadaUdnaVix_2022",
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
      console.log(data);
      getJornada(data.Items);
    }
  });
}

function createTable() {
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
    },
    ExpressionAttributeValues: {
      ":n": {
        S: "Lucas",
      },
      ":c": {
        S: "234.567.891-01",
      },
      ":dv": {
        S: "31/01/2022",
      },
      ":ik": {
        S: "809661",
      },
      ":d": {
        S: "1",
      },
      ":s": {
        S: "1",
      },
      ":dl": {
        S: "31/01/2022",
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
    },
    Key: {
      id: {
        S: "12345",
      },
    },
    ReturnValues: "ALL_NEW",
    TableName: "JornadaUdnaVix_2022",
    UpdateExpression:
      "SET #Nome = :n, #C = :c,#DV = :dv, #IDK = :ik, #DS = :d, #S = :s, #DL = :dl, #DEC = :dec, #DA = :da, #DEL = :del, #DLA = :dla, #IE = :ie",
  };

  var dynamodb = new AWS.DynamoDB();
  dynamodb.updateItem(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
  });
}

function createData(
  name,
  cpf,
  dataVenda,
  idKit,
  dias,
  status,
  acoes,
  dataEnvioCasa,
  dataAtivacao,
  dataEnvioLab,
  dataLaudo,
  infoGerais,
  nomeTeste,
  laboratorio,
  tipo,
  dataFinalizado
) {
  return {
    name,
    cpf,
    dataVenda,
    idKit,
    dias,
    status,
    acoes,
    dataEnvioCasa,
    dataAtivacao,
    dataEnvioLab,
    dataLaudo,
    infoGerais,
    nomeTeste,
    laboratorio,
    tipo,
    dataFinalizado,
  };
}

function deleteItem() {
  let awsConfig2 = {
    region: process.env.REACT_APP_LOCATION_KEY,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  };
  AWS.config.update(awsConfig2);

  var params = {
    Key: {
      id: {
        S: "123",
      },
    },

    TableName: "JornadaUdnaVix_2022",
  };

  var dynamodb = new AWS.DynamoDB();
  dynamodb.deleteItem(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
  });
}

function updateStatus(id, status) {
  const date = new Date();
  let awsConfig2 = {
    region: process.env.REACT_APP_LOCATION_KEY,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  };
  AWS.config.update(awsConfig2);

  var params;

  if (status === "2") {
    params = {
      ExpressionAttributeNames: {
        "#S": "status",
        "#DEC": "dataEnvioCasa",
      },
      ExpressionAttributeValues: {
        ":s": {
          S: status,
        },
        ":dec": {
          S: date.toString(),
        },
      },
      Key: {
        id: {
          S: id,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: "JornadaUdnaVix_2022",
      UpdateExpression: "SET #S = :s, #DEC = :dec",
    };
  } else if (status === "3") {
    params = {
      ExpressionAttributeNames: {
        "#S": "status",
        "#DA": "dataAtivacao",
      },
      ExpressionAttributeValues: {
        ":s": {
          S: status,
        },
        ":da": {
          S: date.toString(),
        },
      },
      Key: {
        id: {
          S: id,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: "JornadaUdnaVix_2022",
      UpdateExpression: "SET #S = :s, #DA = :da",
    };
  } else if (status === "4") {
    params = {
      ExpressionAttributeNames: {
        "#S": "status",
        "#DEL": "dataEnvioLab",
      },
      ExpressionAttributeValues: {
        ":s": {
          S: status,
        },
        ":del": {
          S: date.toString(),
        },
      },
      Key: {
        id: {
          S: id,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: "JornadaUdnaVix_2022",
      UpdateExpression: "SET #S = :s, #DEL = :del",
    };
  } else if (status === "5") {
    params = {
      ExpressionAttributeNames: {
        "#S": "status",
        "#DLA": "dataLaudo",
      },
      ExpressionAttributeValues: {
        ":s": {
          S: status,
        },
        ":dla": {
          S: date.toString(),
        },
      },
      Key: {
        id: {
          S: id,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: "JornadaUdnaVix_2022",
      UpdateExpression: "SET #S = :s, #DLA = :dla",
    };
  } else if (status === "6") {
    params = {
      ExpressionAttributeNames: {
        "#S": "status",
        "#DF": "dataFinalizado",
      },
      ExpressionAttributeValues: {
        ":s": {
          S: status,
        },
        ":df": {
          S: date.toString(),
        },
      },
      Key: {
        id: {
          S: id,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: "JornadaUdnaVix_2022",
      UpdateExpression: "SET #S = :s, #DF = :df",
    };
  }

  var dynamodb = new AWS.DynamoDB();
  dynamodb.updateItem(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else {
      console.log(data);
      alert("Status alterado com sucesso!");
    } // successful response
  });
}

function updateData() {
  let awsConfig2 = {
    region: process.env.REACT_APP_LOCATION_KEY,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  };
  AWS.config.update(awsConfig2);

  var params = {
    ExpressionAttributeNames: {
      "#DF": "dataFinalizado",
    },
    ExpressionAttributeValues: {
      ":df": {
        S: "nothing",
      },
    },
    Key: {
      id: {
        S: "158560",
      },
    },
    ReturnValues: "ALL_NEW",
    TableName: "JornadaUdnaVix_2022",
    UpdateExpression: "SET #DF = :df",
  };

  var dynamodb = new AWS.DynamoDB();
  dynamodb.updateItem(params, function (err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else {
      console.log(data);
      alert("Status alterado com sucesso!");
    } // successful response
  });
}

function changeStatusName(status) {
  switch (status) {
    case "1":
      return "Kit em Preparação";
      break;
    case "2":
      return "Envio Casa";
      break;
    case "3":
      return "Recebido";
      break;
    case "4":
      return "Envio Lab";
      break;
    case "5":
      return "Recebido Lab";
      break;
    case "6":
      return "Finalizado";
      break;
  }
}

function changeDays(day) {
  const actualDate = new Date();

  var date;
  if (day.status === "1") {
    date = new Date(day.dataVenda);
  } else if (day.status === "2") {
    date = new Date(day.dataEnvioCasa);
  } else if (day.status === "3") {
    date = new Date(day.dataAtivacao);
  } else if (day.status === "4") {
    date = new Date(day.dataEnvioLab);
  } else if (day.status === "5") {
    date = new Date(day.dataLaudo);
  } else if (day.status === "6") {
    date = new Date(day.dataFinalizado);
  }
  const diff = Math.abs(actualDate.getTime() - date.getTime());
  const daysCount = Math.ceil(diff / (1000 * 60 * 60 * 24));
  return daysCount;
}

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
  },
}));

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// This method is created for cross-browser compatibility, if you don't
// need to support IE11, you can use Array.prototype.sort() directly
function stableSort(array, comparator) {
  const stabilizedThis = array?.map((el, index) => [el, index]);
  stabilizedThis?.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis?.map((el) => el[0]);
}

const headCells = [
  {
    id: "name",
    numeric: false,
    disablePadding: true,
    label: "Nome",
  },
  {
    id: "cpf",
    numeric: false,
    disablePadding: true,
    label: "CPF",
  },
  {
    id: "data",
    numeric: false,
    disablePadding: true,
    label: "Data da venda",
  },
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID do Kit",
  },
  {
    id: "nometeste",
    numeric: false,
    disablePadding: false,
    label: "Nome do Teste",
  },
  {
    id: "lab",
    numeric: false,
    disablePadding: false,
    label: "Laboratório",
  },
  {
    id: "tipo",
    numeric: false,
    disablePadding: false,
    label: "Tipo",
  },
  {
    id: "dias",
    numeric: false,
    disablePadding: false,
    label: "Dias",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "acoes",
    numeric: false,
    disablePadding: false,
    label: "Ações",
  },
];

function EnhancedTableHead(props) {
  const classes = useStyles();
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              "aria-label": "select all desserts",
            }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="left"
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
              className={classes.headerTable}
              sx={{ color: "#5A3D8A" }}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{
            flex: "1 1 100%",
            fontSize: "20px",
            fontStyle: "normal",
            fontWeight: "",
          }}
          variant="h6"
          id="tableTitle"
          component="div"
        ></Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function Jornada() {
  const [search, setSearch] = useState("");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const classes = useStyles();
  const {
    changeActive,
    getRow,
    users,
    getUsers,
    getAddress,
    getJornada,
    jornada,
    rowStatus,
    getRowStatus,
    handleModal,
    openModal,
  } = useUsersContext();
  const [refresh, setRefresh] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  function handleClickMenu(evt, row) {
    setAnchorEl(evt.currentTarget);
    getRowStatus(row);
    setRefresh(false);
  }
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  function handleStatus(rowStatus) {
    if (rowStatus.status <= 5) {
      updateStatus(
        rowStatus.idKit,
        (parseInt(rowStatus.status) + 1).toString()
      );
      setRefresh(true);
    } else {
      alert("O status não pode mais ser alterado!");
    }
    handleCloseMenu();
  }
  function handleInfo() {
    handleModal(true);
    handleCloseMenu();
  }

  function setColor(row) {
    console.log(row);
    return parseInt(row.dias) <= 7 ? "#00FF7F" : "#FF0000";
  }

  useEffect(() => {
    getTableJornada(getJornada);

    /* updateData(); */
    /*  createTable(); */
   /*  deleteItem(); */
    /* getAddress(); */
  }, [refresh]);

  const rows = jornada.map((result) => {
    return createData(
      result.nome.S,
      result.cpf.S,
      result.dataVenda.S,
      result.idKit.S,
      result.diasStatus.S,
      result.status.S,
      "acoes",
      result.dataEnvioCasa.S,
      result.dataAtivacao.S,
      result.dataEnvioLab.S,
      result.dataLaudo.S,
      result.infosExtras.SS,
      result.nomeTeste.S,
      result.laboratorio.S,
      result.tipo.S,
      result.dataFinalizado.S
    );
  });

  console.log(rows)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClickTeste = (event) => {
    console.log(event.currentTarget);
    setAnchorEl(event.currentTarget);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  return (
    <>
     <Indicadores>{rows}</Indicadores>
      <Box sx={{ width: "100%" }}>
        <Paper sx={{ width: "100%" }}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <Box
            sx={{ display: "flex", flexDirection: "row", marginBottom: "2%" }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                fontStyle: "normal",
                fontWeight: "",
                marginLeft: "5%",
              }}
              variant="h6"
              id="tableTitle"
              component="div"
            >
              Laudos
            </Typography>
            <Box sx={{ marginLeft: "10%" }}>
              <TextField
                sx={{ width: "274px" }}
                id="outlined-search"
                label="Pesquise pelo cpf"
                type="search"
                size="small"
                onChange={(event) => {
                  setSearch(event.target.value);
                }}
              />
            </Box>
            <Box sx={{ marginLeft: "35%" }}>
              <Button
                onClick={() => changeActive("newuser")}
                color="primary"
                aria-label="add user"
                size="large"
                variant="contained"
                endIcon={<AddCircleIcon fontSize="inherit" />}
                sx={{
                  width: "94px",
                  height: "37px",
                  background: "rgba(116, 76, 182, 0.19)",
                  borderRadius: "5px",
                  fontSize: "10px",
                  color: "#744CB6",
                  fontStyle: "bold",
                  fontWeight: "normal",
                }}
              >
                Incluir laudo
              </Button>
              {/* <IconButton onClick={() => changeActive("newuser")} color="primary" aria-label="add user" size="large">
              <AddCircleIcon fontSize="inherit"/>
            </IconButton> */}
            </Box>
          </Box>
          <TableContainer>
            <Table
              sx={{ minWidth: 750 }}
              aria-labelledby="tableTitle"
              size="medium"
            >
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody>
                {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                 rows.slice().sort(getComparator(order, orderBy)) */}
                {stableSort(rows, getComparator(order, orderBy))
                  .filter((row) => {
                    if (search === "") {
                      return row;
                    } else if (row.cpf.includes(search)) {
                      return row;
                    }
                  })
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row.name);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <>
                        <TableRow
                          hover
                          /* onClick={(event) => handleClick(event, row.name)} */
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.name}
                          selected={isItemSelected}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              onClick={(event) => handleClick(event, row.name)}
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            sx={{
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "16px",
                              lineHeight: "19px",
                              color: "#535354",
                            }}
                          >
                            {row.name}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "16px",
                              lineHeight: "19px",
                              color: "#535354",
                            }}
                            align="left"
                          >
                            {row.cpf}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "16px",
                              lineHeight: "19px",
                              color: "#535354",
                            }}
                            align="left"
                          >
                            {DataFormatter(row.dataVenda)}
                          </TableCell>

                          <TableCell
                            sx={{
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "16px",
                              lineHeight: "19px",
                              color: "#535354",
                            }}
                            align="left"
                          >
                            {row.idKit}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "16px",
                              lineHeight: "19px",
                              color: "#535354",
                            }}
                            align="left"
                          >
                            {row.nomeTeste}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "16px",
                              lineHeight: "19px",
                              color: "#535354",
                            }}
                            align="left"
                          >
                            {row.laboratorio}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "16px",
                              lineHeight: "19px",
                              color: "#535354",
                            }}
                            align="left"
                          >
                            {row.tipo}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "16px",
                              lineHeight: "19px",
                              color:
                                parseInt(changeDays(row)) <= 7
                                  ? "#00FF7F"
                                  : "#FF0000",
                              /* color: "#00FF7F", */
                            }}
                            align="left"
                          >
                            {changeDays(row)}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "16px",
                              lineHeight: "19px",
                              color: "#535354",
                            }}
                            align="left"
                          >
                            {changeStatusName(row.status)}
                          </TableCell>
                          <TableCell
                            sx={{
                              fontStyle: "normal",
                              fontWeight: 500,
                              fontSize: "16px",
                              lineHeight: "19px",
                              color: "#535354",
                            }}
                            align="left"
                          >
                            <div>
                              <Button
                                id="basic-button"
                                aria-controls={open ? "basic-menu" : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? "true" : undefined}
                                sx={{
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
                                onClick={(event) => handleClickMenu(event, row)}
                              >
                                Ações
                              </Button>
                              <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleCloseMenu}
                                /*  MenuListProps={{
                                "aria-labelledby": "basic-button",
                              }} */
                                disableAutoFocusItem

                                /* MenuListProps={{
                                style: {
                                  padding: 0,
                                  top: 'auto',
                                },
                              }} */
                              >
                                <MenuItem
                                  onClick={() => handleStatus(rowStatus)}
                                >
                                  Avançar status
                                </MenuItem>
                                <MenuItem onClick={handleCloseMenu}>
                                  Subir laudo
                                </MenuItem>
                                <MenuItem onClick={() => handleInfo()}>
                                  Informações extras
                                </MenuItem>
                              </Menu>
                              {openModal === true && <ModalInfo />}
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Páginas"
          />
        </Paper>
      </Box>
    </>
  );
}
