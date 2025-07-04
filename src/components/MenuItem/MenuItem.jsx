import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import styles from "./MenuItem.module.css";
import { faHeart as faSolidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MenuItem = ({ dish, isOnWishlist, handleToggleWishlist }) => {
  const { strMeal: name, strMealThumb: image } = dish;
  const navigate = useNavigate();

  return (
    <div className={styles.menuItem}>
      <h3>{name}</h3>
      <FontAwesomeIcon className={styles.wishlistIcon}
        onClick={() => handleToggleWishlist(dish)}
        icon={isOnWishlist ? faSolidHeart : faHeart} />
      <img src={image} alt={name} />
      <div className={styles.menuItemBtnContainer}>
        <Button onClick={() => navigate(`/meals/${dish.idMeal}`)}>
          Details
        </Button>
      </div>
    </div>
  );
};

export default MenuItem;
