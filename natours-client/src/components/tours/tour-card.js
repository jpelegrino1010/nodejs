import { useNavigate, Link } from 'react-router-dom';
import classes from './tour-card.module.css';
import moment from 'moment';

import {
  FaLocationDot,
  FaFlag,
  FaCalendarCheck,
  FaPerson
} from 'react-icons/fa6';

const TourCard = (props) => {
  const { tour } = props;
  const navigate = useNavigate();

  return (
    <div className={classes.card}>
      <div className={classes['card-header']}>
        <img
          src={require(`./../../images/tours/${tour.imageCover}`)}
          alt={tour.name}
        />
        <h3>{tour.name}</h3>
      </div>

      <div className={classes['card-body']}>
        <h2>{`${tour.difficulty} ${tour.duration}-day tour`}</h2>
        <p>{tour.summary}</p>

        <section className={classes['tour-details']}>
          <div className={classes.info}>
            <FaLocationDot className={classes.icon} />
            <span>{tour.startLocation.description}</span>
          </div>

          <div className={classes.info}>
            <FaCalendarCheck className={classes.icon} />
            <span>{moment(tour.startDates[0]).format('MMM, yyyy')}</span>
          </div>

          <div className={classes.info}>
            <FaFlag className={classes.icon} />
            <span>{`${tour.locations.length} stops`}</span>
          </div>

          <div className={classes.info}>
            <FaPerson className={classes.icon} />
            <span>{`${tour.maxGroupSize} people`}</span>
          </div>
        </section>
      </div>

      <div className={classes['card-footer']}>
        <div className={classes.ratings}>
          <span>
            <strong>{`$${tour.price}`}</strong> per person
          </span>
          <span>
            <strong>{tour.ratingsAverage}</strong> ratings(
            {tour.ratingsQuantity})
          </span>
        </div>
        <Link to={`/tours/${tour.slug}`} className={classes['btn-details']}>
          DETAILS
        </Link>
      </div>
    </div>
  );
};

export default TourCard;
