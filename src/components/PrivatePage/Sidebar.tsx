import React, { ReactNode } from "react";
import { Link, useHistory } from "react-router-dom";
import Cookie from "js-cookie";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import AccountBalanceWalletIcon from "@material-ui/icons/AccountBalanceWallet";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import CardGiftcardIcon from "@material-ui/icons/CardGiftcard";
import DateRangeIcon from "@material-ui/icons/DateRange";
import HomeIcon from "@material-ui/icons/Home";
import StorefrontIcon from "@material-ui/icons/Storefront";
import CategoryIcon from "@material-ui/icons/Category";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import PowerOffIcon from "@material-ui/icons/PowerOff";
import ShowChartIcon from "@material-ui/icons/ShowChart";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerLink: {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
}));

interface DrawerLinkProps {
  Icon: ReactNode;
  pathname?: string;
  text: string;
  onClick?: () => void;
}

function Sidebar() {
  const history = useHistory();
  const classes = useStyles();

  function DrawerLink({ pathname, Icon, text, onClick }: DrawerLinkProps) {
    if (pathname) {
      return (
        <Link to={{ pathname }} className={classes.drawerLink}>
          <ListItem button>
            <ListItemIcon>{Icon}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        </Link>
      );
    }

    return (
      <ListItem onClick={onClick} button>
        <ListItemIcon>{Icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItem>
    );
  }

  return (
    <Drawer
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      open
    >
      <List>
        <DrawerLink pathname="/" text="Home" Icon={<HomeIcon />} />
        <DrawerLink
          pathname="/resume"
          text="Resume"
          Icon={<AccountBalanceIcon />}
        />
        <DrawerLink
          pathname="/accounts"
          text="Accounts"
          Icon={<AccountBalanceWalletIcon />}
        />
        <DrawerLink
          pathname="/credit_cards"
          text="Credit Card"
          Icon={<CreditCardIcon />}
        />
        <DrawerLink
          pathname="/nubank"
          text="Nubank"
          Icon={<CardGiftcardIcon />}
        />
        <DrawerLink
          pathname="/categories"
          text="Categories"
          Icon={<CategoryIcon />}
        />
        <DrawerLink pathname="/bills" text="Bills" Icon={<DateRangeIcon />} />
        <DrawerLink
          pathname="/expenses/list"
          text="Expenses"
          Icon={<ShoppingCartIcon />}
        />
        <DrawerLink
          pathname="/month_expenses"
          text="Month Expenses"
          Icon={<CalendarTodayIcon />}
        />
        <DrawerLink
          pathname="/year_expenses"
          text="Year Expenses"
          Icon={<ShowChartIcon />}
        />
        <DrawerLink
          pathname="/receipts"
          text="Receipts"
          Icon={<AttachMoneyIcon />}
        />
        <DrawerLink
          onClick={() => {
            Cookie.remove("user");
            history.push("/login");
          }}
          text="Logout"
          Icon={<PowerOffIcon />}
        />
      </List>
    </Drawer>
  );
}

export default Sidebar;
