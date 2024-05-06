import { connect } from 'react-redux';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../layout/layout';
import classes from './login.module.css';
import { logIn, logedIn } from './../../store/actions/user-action';

const Login = (props) => {
  const [user, setUser] = useState({ email: '', password: '' });
  const navigation = useNavigate();
  const { success } = props.login;

  useEffect(() => {
    if (success) {
      navigation('/home');
    }
  }, [success]);

  const changeHandler = (e) => {
    const { name, value } = e.target;

    setUser((prev) => {
      return { ...prev, [name]: value };
    });
  };

  const sendLogin = async (e) => {
    e.preventDefault();
    await props.onLogIn(user.email, user.password);
    props.onGetSession();
  };
  return (
    <Layout>
      <section className={classes.login}>
        <h1>LOG INTO YOUR ACCOUNT</h1>
        <form onSubmit={sendLogin}>
          <div className={classes['form-group']}>
            <label>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={changeHandler}
            />
          </div>

          <div className={classes['form-group']}>
            <label>Password</label>

            <input
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={changeHandler}
            />
          </div>
          <button className="btn-login">Login</button>
        </form>
      </section>
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    login: state.user.login
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLogIn: async (email, password) => await dispatch(logIn(email, password)),
    onGetSession: () => dispatch(logedIn())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
