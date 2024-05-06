import classes from './footer.module.css';
import logoGreen from './../../images/logo-green.png';

const Footer = (props) => (
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
      <p>&copy; by Julio Luis Pelegrino, All rights reserved.</p>
    </section>
  </footer>
);

export default Footer;
