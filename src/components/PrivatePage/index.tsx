import React, { ReactNode } from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import AccountBalanceIcon from "@material-ui/icons/AccountBalanceWallet";
import CreditCardIcon from "@material-ui/icons/CreditCard";
import DateRangeIcon from "@material-ui/icons/DateRange";
import StorefrontIcon from "@material-ui/icons/Storefront";
import CategoryIcon from "@material-ui/icons/Category";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    backgroundColor: theme.palette.grey["200"],
    flexGrow: 1,
    height: "100vh",
    overflow: "auto",
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  drawerLink: {
    color: theme.palette.text.primary,
    textDecoration: "none",
  },
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    overflow: "auto",
    flexDirection: "column",
  },
}));

interface PrivatePageProps {
  children: ReactNode;
  title: string;
}

interface DrawerLinkProps {
  Icon: ReactNode;
  pathname: string;
  text: string;
}

function PrivatePage({ children, title }: PrivatePageProps) {
  const classes = useStyles();

  function DrawerLink({ pathname, Icon, text }: DrawerLinkProps) {
    return (
      <Link to={{ pathname }} className={classes.drawerLink}>
        <ListItem>
          <ListItemIcon>{Icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      </Link>
    );
  }

  return (
    <div className={classes.root}>
      <AppBar position="absolute" className={classes.appBar}>
        <Toolbar>
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            className={classes.title}
          >
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
        open
      >
        <List>
          <DrawerLink
            pathname="/accounts"
            text="Accounts"
            Icon={<AccountBalanceIcon />}
          />
          <DrawerLink
            pathname="/credit_cards"
            text="Credit Card"
            Icon={<CreditCardIcon />}
          />
          <DrawerLink pathname="/bills" text="Bills" Icon={<DateRangeIcon />} />
          <DrawerLink
            pathname="/places"
            text="Places"
            Icon={<StorefrontIcon />}
          />
          <DrawerLink
            pathname="/categories"
            text="Categories"
            Icon={<CategoryIcon />}
          />
          <DrawerLink
            pathname="/receipts"
            text="Receipts"
            Icon={<AttachMoneyIcon />}
          />
          <DrawerLink
            pathname="/expenses"
            text="Expenses"
            Icon={<ShoppingCartIcon />}
          />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>
          {children}
        </Container>
      </main>
    </div>
  );
}

export default PrivatePage;
