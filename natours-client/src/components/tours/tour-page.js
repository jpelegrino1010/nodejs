import { findTourBySlug } from './../../store/actions/tour-action';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../layout/layout';
import moment from 'moment';

const TourPage = (props) => {
  useEffect(() => {
    loadTourBySlug();
  }, []);

  const { tourSlug } = useParams();

  const loadTourBySlug = () => {
    console.log('PARAMS', tourSlug);
    props.onLoadTourBySlug(tourSlug);
  };

  const { tour } = props.tour;
  const theTour = tour ? tour[0] : [];

  return (
    <Layout>
      {theTour.id && (
        <section>
          <h1>{theTour.name}</h1>
          <p>{theTour.startLocation.address}</p>
          <ul>
            {theTour.startDates.map((date) => (
              <li key={theTour.id}>{moment(date).format('MMM, yyyy')}</li>
            ))}
          </ul>
        </section>
      )}
    </Layout>
  );
};

const mapStateToProps = (state) => {
  return {
    tour: state.tour.tour
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoadTourBySlug: (slug) => dispatch(findTourBySlug(slug))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TourPage);
