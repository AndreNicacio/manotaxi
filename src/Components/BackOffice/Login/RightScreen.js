import React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box'

import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: "#f1f1f1",
    marginTop: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: "2%",
  },
  avatar: {
    margin: 1,
    backgroundColor: "purple",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: 1,
  },
  submit: {
    margin: 3,
  },
  imgDna: {
    width: "100%",
    height: "100vh",
  },
  rightStack: {
    width: "100%",
    height: '100vh',
    alignItems: 'center',
    background: '#fff',
  }
}));

export default function RightScreen() {
  const classes = useStyles();
    
  
    return (
      
        <Stack className={classes.rightStack}>
          <Box>
            <img
              src="/images/dna-backoffice.svg"
              alt='Tarefas Logo'
              className={classes.imgDna}
              
            />
          </Box>
          {/* <Text>Gerencie as suas tarefas</Text> */}
        </Stack>
      
    );
  }