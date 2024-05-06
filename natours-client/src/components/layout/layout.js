import Footer from '../footer/footer';
import Header from '../header/header';
import classes from './layout.module.css';
import logoGreen from './../../images/logo-green.png';

const Layout = (props) => (
  <>
    <Header />
    <div role="layout" className={classes.layout}>
      <main className={`${props.className} ${classes.main}`}>
        {props.children}
      </main>
      <footer className={classes.footer}>
        <img src={logoGreen} alt="Logo Green" />
        <section>
          <ul>
            <li>About Us</li>
            <li>Download apps</li>
            <li>Become a guide</li>
            <li>Careers</li>
            <li>Contact</li>
          </ul>
          <p>
            &copy; by Julio Luis Pelegrino, feel free to use this project for
            your own, EXCEPT producing your own course or tutorial
          </p>
        </section>
      </footer>
    </div>
  </>
);

export default Layout;
