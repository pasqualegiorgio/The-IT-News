/* Navbar component template da Material UI */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MoreIcon from '@material-ui/icons/MoreVert';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Zoom from '@material-ui/core/Zoom';

// uso di makeStyles per gli stili
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2)
  },
  title: {
    fontWeight: 'bold',
    fontFamily: 'Belgrano, serif',
    fontSize: '20px',
    display: 'block',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
      fontSize: '40px'
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  iconButton: {
    marginRight: '5px',
  }
}));

function ScrollTop(props) {
  const { children, window } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 100,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector('#back-to-top-anchor');

    if (anchor) {
      anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.root}>
        {children}
      </div>
    </Zoom>
  );
}

ScrollTop.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

export default function Navbar(props) {
  const classes = useStyles();
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const mobileMenuId = 'primary-search-account-menu-mobile';
  // layout del menu' icone social da mostrare su mobile
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        {/* Icona Facebook */}
        <IconButton 
          edge="end" 
          color="inherit" 
          className={classes.iconButton}
          href="https://www.facebook.com/pasquale.giorgio.92"
          target="_blank"
          rel="noopener"
        >
          <FacebookIcon />
        </IconButton>
      </MenuItem>
      {/* Icona Instagram */}
      <MenuItem>
        <IconButton 
          edge="end" 
          color="inherit" 
          className={classes.iconButton}
          href="https://www.instagram.com/pasquale__giorgio/"
          target="_blank"
          rel="noopener"
        >
          <InstagramIcon />
        </IconButton>
      </MenuItem>
      {/* Icona LinkedIn */}
      <MenuItem>
        <IconButton 
          edge="end" 
          color="inherit" 
          className={classes.iconButton}
          href="https://www.linkedin.com/in/pasqualegiorgio/"
          target="_blank"
          rel="noopener"
        >
          <LinkedInIcon />
        </IconButton>
      </MenuItem>
    </Menu>
  );

  return (
    <React.Fragment>
      <div className={classes.grow}>
        {/* Navbar fissa lungo tutto lo scrolling della pagina */}
        <AppBar position="fixed">
          {/* Navbar */}
          <Toolbar id="back-to-top-anchor">
            {/* Titolo del sito */}
            <Typography className={classes.title}>
              The IT News
            </Typography>
            {/* Spazio tra titolo e icone social */}
            <div className={classes.grow} />
            {/* Icone social */}
            <div className={classes.sectionDesktop}>
              {/* Icona Facebook */}
              <IconButton 
                edge="end" 
                color="inherit" 
                className={classes.iconButton}
                href="https://www.facebook.com/pasquale.giorgio.92"
                target="_blank"
                rel="noopener"
              >
                <FacebookIcon />
              </IconButton>
              {/* Icona Instagram */}
              <IconButton 
                edge="end" 
                color="inherit" 
                className={classes.iconButton}
                href="https://www.instagram.com/pasquale__giorgio/"
                target="_blank"
                rel="noopener"
              >
                <InstagramIcon />
              </IconButton>
              {/* Icona LinkedIn */}
              <IconButton 
                edge="end" 
                color="inherit" 
                className={classes.iconButton}
                href="https://www.linkedin.com/in/pasqualegiorgio/"
                target="_blank"
                rel="noopener"
              >
                <LinkedInIcon />
              </IconButton> 
            </div>
            {/* Menu' opener da mostrare su mobile per le icone social */}
            <div className={classes.sectionMobile}>
              <IconButton
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
        {/* Button Torna sopra */}
        <ScrollTop {...props}>
          <Fab color="secondary" size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </ScrollTop>
        {/* Layout da mostrare solo se su mobile */}
        {renderMobileMenu}
      </div>
    </React.Fragment>
  );
}