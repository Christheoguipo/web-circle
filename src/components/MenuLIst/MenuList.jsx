import MenuItem from "../MenuItem/MenuItem";
import styles from "./MenuList.module.css";

const MenuList = ({ dishes, isOnWishlist, handleToggleWishlist }) => {


    return (
        <div className={styles.restaurantWrapper}>
            <div className={styles.menu}>
                {dishes.length > 0 ? (
                    dishes.map((dish) => (
                        <MenuItem
                            dish={dish}
                            key={dish.idMeal}
                            isOnWishlist={isOnWishlist(dish.idMeal)}
                            handleToggleWishlist={handleToggleWishlist}
                        />
                    ))
                ) : (
                    <p>No dishes found :(</p>
                )}
            </div>
        </div>);
}

export default MenuList;