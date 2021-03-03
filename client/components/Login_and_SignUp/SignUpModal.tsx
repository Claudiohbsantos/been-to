/* eslint-disable react/jsx-filename-extension */
import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import styled from "styled-components";

export default function SignUpModal() {
  const [open, setOpen] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const StyledButton = styled(Button)`
     {
      margin-top: 20%;
      }
    }
  `;
  // const handleLogin = (username, password) => {
  //   if (username.length > 0 && password.length > 0) {
  //     fetch("___", {
  //       Method: "POST",
  //       headers: {
  //         "Content-Type": "Application/JSON",
  //       },
  //       body: JSON.stringify({
  //         username: username,
  //         password: password,
  //       }),
  //     })
  //       .then((res) => {})
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  return (
    <div className='user-option'>
      <StyledButton
        variant='contained'
        color='primary'
        onClick={handleClickOpen}
      >
        Sign Up
      </StyledButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Sign up</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Username'
            type='text'
            onChange={(event) => setUsername(event.target.value)}
            fullWidth
          />
          <TextField
            autoFocus
            margin='dense'
            id='name'
            label='Password'
            onChange={(event) => setPassword(event.target.value)}
            type='password'
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleClose} color='primary'>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
