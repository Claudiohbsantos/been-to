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

const StyledButton = styled(Button)`
   {
  }
`;

const StyledDialog = styled(Dialog)`
   {
    background-color: none;
  }
`;

const LoginModal: React.FC<any> = ({ setCurrentUser, setVisited }) => {
  const [open, setOpen] = React.useState<boolean>(false);
  const [username, setUsername] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    fetch("/user/get", {
      method: "POST",
      headers: {
        "Content-Type": "Application/JSON",
      },
      body: JSON.stringify({
        userName: username,
        passWord: password,
      }),
    })
      .then((data) => data.json())
      .then((res) => {
        console.log("this is the res", res);
        setCurrentUser(username);
        setVisited(res.countryCodes);
      })
      .catch((err) => {
        console.log("this is the error from trying to login", err);
      });
  };

  return (
    <div className='user-option'>
      <Button variant='contained' color='primary' onClick={handleClickOpen}>
        Sign in
      </Button>
      <StyledDialog
        open={open}
        onClose={handleClose}
        aria-labelledby='form-dialog-title'
      >
        <DialogTitle id='form-dialog-title'>Sign in</DialogTitle>
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
      </StyledDialog>
    </div>
  );
};

export default LoginModal;
