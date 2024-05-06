import { useEffect } from 'react';
import Layout from '../layout/layout';
import TourCard from '../tours/tour-card';
import { findAllTours } from './../../store/actions/tour-action';
import { connect } from 'react-redux';
import classes from './home.module.css';

const Home = (props) => {
  useEffect(() => {
    load();
  }, []);

  const load = () => {
    props.onLoadTours();
  };

  const cards = props.tours.map((tour) => (
    <TourCard key={tour.id} tour={tour} />
  ));

  return <Layout className={classes['main-container']}>{cards}</Layout>;
};

const mapStateToProps = (state) => {
  return {
    tours: state.tour.tours
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoadTours: () => dispatch(findAllTours())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
