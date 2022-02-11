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
import ModalInfoVendas from "./ModalInfoVendas";

require("dotenv").config({ path: require("find-config")(".env") });

function getTableVendas(getVendas) {
  let awsConfig2 = {
    region: process.env.REACT_APP_LOCATION_KEY,
    accessKeyId: process.env.REACT_APP_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_SECRET_KEY,
  };
  AWS.config.update(awsConfig2);

  var params = {
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
      console.log(data);
      getVendas(data.Items);
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
    },
    ExpressionAttributeValues: {
      ":n": {
        S: "Lucas",
      },
      ":t": {
        S: "27981562356",
      },
      ":c": {
        S: "234.567.891-01",
      },
      ":dv": {
        S: "31/01/2022",
      },
      ":g": {
        S: "gateway",
      },
      ":i": {
        S: "809661",
      },
      ":cat": {
        S: "categoria",
      },
      ":p": {
        S: "kit paternidade",
      },
      ":s": {
        S: "1",
      },
      ":d": {
        S: "",
      },
      ":v": {
        S: "valor",
      },
      ":dp": {
        S: "nothing",
      },
      ":ie": {
        SS: [""],
      },
    },
    Key: {
      id: {
        S: "809661",
      },
    },
    ReturnValues: "ALL_NEW",
    TableName: "vendasMonitoramentoVix2022-prd",
    UpdateExpression:
      "SET #Nome = :n, #TEL = :t, #C = :c,#DV = :dv,#G = :g, #IDV = :i, #CAT = :cat, #PRO = :p, #S = :s, #D = :d, #V = :v, #DP = :dp, #IE = :ie",
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
  telefone,
  cpf,
  dataVenda,
  gateway,
  idVenda,
  categoria,
  produto,
  status,
  dias,
  valor,
  dataProcessado,
  infosExtras,
  acoes,
  dataNota
) {
  return {
    name,
    telefone,
    cpf,
    dataVenda,
    gateway,
    idVenda,
    categoria,
    produto,
    status,
    dias,
    valor,
    dataProcessado,
    infosExtras,
    acoes,
    dataNota
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
        S: "123456",
      },
    },

    TableName: "vendasMonitoramentoVix2022-prd",
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
        "#DN": "dataNota",
      },
      ExpressionAttributeValues: {
        ":s": {
          S: status,
        },
        ":dn": {
          S: date.toString(),
        },
      },
      Key: {
        id: {
          S: id,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: "vendasMonitoramentoVix2022-prd",
      UpdateExpression: "SET #S = :s, #DN = :dn",
    };
  } 

  if (status === "3") {
    params = {
      ExpressionAttributeNames: {
        "#S": "status",
        "#DP": "dataProcessado",
      },
      ExpressionAttributeValues: {
        ":s": {
          S: status,
        },
        ":dp": {
          S: date.toString(),
        },
      },
      Key: {
        id: {
          S: id,
        },
      },
      ReturnValues: "ALL_NEW",
      TableName: "vendasMonitoramentoVix2022-prd",
      UpdateExpression: "SET #S = :s, #DP = :dp",
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
      "#DN": "dataNota",
    },
    ExpressionAttributeValues: {
      ":dn": {
        S: "2022-02-09",
      },
    },
    Key: {
      id: {
        S: "521939248",
      },
    },
    ReturnValues: "ALL_NEW",
    TableName: "vendasMonitoramentoVix2022-prd",
    UpdateExpression: "SET #DN = :dn",
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
      return "Não Processado";
      break;
    case "2":
      return "Nota Emitida";
      break;
    case "3":
      return "Processado";
      break;  
  }
}

function changeDays(day) {
  const actualDate = new Date();

  var date;
  if (day.status === "1") {
    date = new Date(day.dataVenda);
  } else if (day.status === "2") {
    date = new Date(day.dataNota);
  }
  else if (day.status === "3") {
    date = new Date(day.dataProcessado);
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
    id: "telefone",
    numeric: false,
    disablePadding: true,
    label: "Telefone",
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
    id: "gateway",
    numeric: false,
    disablePadding: true,
    label: "Gateway",
  },
  {
    id: "id",
    numeric: false,
    disablePadding: false,
    label: "ID",
  },
  {
    id: "cat",
    numeric: false,
    disablePadding: false,
    label: "Categoria",
  },
  {
    id: "pro",
    numeric: false,
    disablePadding: false,
    label: "Produto",
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Status",
  },
  {
    id: "dias",
    numeric: false,
    disablePadding: false,
    label: "Dias",
  },
  {
    id: "valor",
    numeric: false,
    disablePadding: false,
    label: "Valor",
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

export default function Vendas() {
  const [search, setSearch] = useState("");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const divRef = React.useRef();
  const {
    changeActive,
    getRow,
    users,
    getUsers,
    getAddress,
    getVendas,
    vendas,
    rowStatus,
    getRowStatus,
    handleModal,
    openModal,
    jornada,
  } = useUsersContext();
  const [refresh, setRefresh] = useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const open = Boolean(anchorEl);

  
  function handleClickMenu(evt,row) {
   
    setAnchorEl(evt.currentTarget);
    getRowStatus(row);
    setRefresh(false);
  }
  
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  function handleStatus(rowStatus) {
    if (rowStatus.status <= 2) {
      updateStatus(
        rowStatus.idVenda,
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
    getTableVendas(getVendas);
    /* updateData(); */
    /*  createTable(); */
    /* deleteItem(); */
    /* getAddress(); */
  }, [refresh]);


  const rows = vendas.map((result) => {
    return createData(
      result.nome.S,
      result.telefone.S,
      result.cpf.S,
      result.dataVenda.S,
      result.gateway.S,
      result.idVenda.S,
      result.categoria.S,
      result.produto.S,
      result.status.S,
      result.dias.S,
      result.valor.S,
      result.dataProcessado.S,
      result.infosExtras.SS,
      "acoes",
      result.dataNota.S
      
    );
  });

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
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%" }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <Box sx={{ display: "flex", flexDirection: "row", marginBottom: "2%" }}>
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
            Vendas
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
              onClick={() => changeActive("newvenda")}
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
              Incluir venda
            </Button>
          </Box>
        </Box>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="medium"
          >
            <EnhancedTableHead
              key={rows}
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
                          {row.telefone}
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
                            color: "#535354"
                           
                          }}
                          align="left"
                        >
                          {row.gateway}
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
                          {row.idVenda}
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
                          {row.categoria}
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
                          {row.produto}
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
                            color:
                              parseInt(changeDays(row)) <= 7
                                ? "#00FF7F"
                                : "#FF0000",
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
                          {row.valor}
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
                              ref={divRef}
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
                              MenuListProps={{
                                "aria-labelledby": "basic-button",
                              }}
                            >
                              <MenuItem onClick={() => handleStatus(rowStatus)}>
                                Avançar status
                              </MenuItem>
                              {/* <MenuItem onClick={handleCloseMenu}>
                                Subir laudo
                              </MenuItem> */}
                              <MenuItem onClick={() => handleInfo()}>
                                Informações extras
                              </MenuItem>
                            </Menu>
                            {openModal === true && <ModalInfoVendas/>}
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
  );
}
