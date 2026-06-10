import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { HttpStatusCode } from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from '../contexts/authContext';
import Snackbar from '@mui/material/Snackbar';

const defaultTheme = createTheme();

export default function Authentication() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [name, setName] = React.useState("");
    const [error, setError] = React.useState("");
    const [message, setMessage] = React.useState("");

    const[formState, setFormState] = React.useState(0);
    const [open,setOpen] = React.useState(false);

    const {handelRegister, handelLogin } = React.useContext(AuthContext);

    let handelAuth = async()=>{
      try{
        if(formState === 0){
          let result = await handelLogin(username,password);
          setMessage(result.message);

          setOpen(true);

          router("/home");
        }

        if(formState === 1){
          let result = await handelRegister(name,username,password);
          setMessage(result);
          setOpen(true);
          setUsername("");
          console.log(result);
          setError("");
          setFormState(0);
          setPassword("")
        }
      }catch(err){
        let message = err.response?.data?.message || err.message;
        setError(message);
      }
    }

  return (

    <ThemeProvider theme={defaultTheme}>

      <Grid container component="main" sx={{ height: '100vh' }}>

        <CssBaseline />

        {/* LEFT SIDE IMAGE */}

        <Grid
          size={{ xs: 0, sm: 4, md: 7 }}
          sx={{
            backgroundImage: 'url("/log.jpg")',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
            backgroundPosition: 'center', 
          }}
        />

        {/* RIGHT SIDE LOGIN */}

        <Grid
          size={{ xs: 12, sm: 8, md: 5 }}
          component={Box}
        >

          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>

            <div style={{display:'flex',gap:'10px'}}>
                <Button variant ={formState === 0 ?  "contained" : "outlined"} onClick={()=>setFormState(0)}>
                    Sign In
                </Button>  

                <Button variant = {formState === 1 ? "contained" : "outlined"}onClick={()=>setFormState(1)}>
                    Sign Up
                </Button>
            </div>

            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
            >
              {formState === 1 ? <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                value={name}
                name="name"
                autoFocus
                onChange={(e)=> setName(e.target.value)}
              /> : <></> }
              

              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="username"
                name="username"
                value={username}
                autoFocus
                onChange={(e)=> setUsername(e.target.value)}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                value={password}
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e)=> setPassword(e.target.value)}
              />

                <p style={{color:"red"}}>{error}</p>

              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}

                onClick={handelAuth}
              >
                {formState ===0 ? "Login" : "Register" }
              </Button>

            </Box>

          </Box>

        </Grid>

      </Grid>
                <Snackbar
                
                open={open}
                autoHideDuration={4000}
                message={message}

                />
    </ThemeProvider>

  );
}