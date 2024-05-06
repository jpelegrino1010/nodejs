import natoursLogo from './../../images/logo-white.png';
import classes from './header.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { logedIn, logingOut } from './../../store/actions/user-action';
import { useEffect } from 'react';
import Cookies from 'js-cookie';

const Header = (props) => {
  const navigate = useNavigate();
  const goHome = () => navigate('/home');
  const { success: isLogin } = props.login;

  useEffect(() => {
    props.onGetSession();
  }, []);

  const logoutHandler = () => {
    props.onLogout();
    Cookies.remove('jwt');

    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    console.log('Logging out');
  };

  return (
    <header className={classes.header}>
      <h1 onClick={goHome}>All Tours</h1>
      <img src={natoursLogo} alt="Natours logo" />
      <section className={classes.user}>
        {!isLogin && (
          <>
            <Link to="/login">Log In</Link>
            <a href="#">Sign up</a>
          </>
        )}
        {isLogin && (
          <Link to="/login" onClick={logoutHandler}>
            Logout
          </Link>
        )}
      </section>
    </header>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.user.login
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetSession: () => dispatch(logedIn()),
    onLogout: () => dispatch(logingOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
