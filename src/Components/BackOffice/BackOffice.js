import SignIn from "./Login/Login";
import RightScreen from "./Login/RightScreen";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { makeStyles } from "@mui/styles";


const useStyles = makeStyles((theme) => ({
  loginHome: {
    backgroundColor: '#FFFEFE',
    padding: 0,
  }
}));

function BackOffice() {
  const classes = useStyles();
  return (
    <Container maxW="cointainer.xl" className={classes.loginHome}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          
        }}
      >
        <SignIn />
        <RightScreen />
      </Box>
    </Container>
  );
}

export default BackOffice;
