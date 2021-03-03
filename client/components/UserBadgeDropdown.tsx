/* eslint-disable react/jsx-filename-extension */
import UserBadges from "./Badges/UserBadges";
import CountryList from "./Badges/CountryList";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Popover from "@material-ui/core/Popover";
import styled from "styled-components";
import React from "react";

const UserBadgeDropdown = (props: any) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const StyledPopover = styled(Popover)`
    & .MuiPopover-paper {
      background-color: transparent;
      box-shadow: none;
      margin-top: 10%;
    }
  `;

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <div>
      <UserBadges aria-describedby={id} handleClick={handleClick} />
      <StyledPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <CountryList />
      </StyledPopover>
    </div>
  );
};

export default UserBadgeDropdown;
