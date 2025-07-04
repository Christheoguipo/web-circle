import { useEffect, useState } from "react";
import { useDebouncedCallback } from 'use-debounce';
import MenuItem from "../components/MenuItem/MenuItem.jsx";

import styles from "./RestaurantView.module.css";
import NavBar from "../components/NavBar/NavBar.jsx";
import SearchField from "../components/SearchField/SearchField.jsx";
import MenuList from "../components/MenuLIst/MenuList.jsx";

const RestaurantView = () => {
  const [dishes, setDishes] = useState([]);

  // I added a filter state variable here to be used as props for the SearchField component. 
  // I then bound the value and onChange of the input box inside the Searchfield component 
  // with the filter and setFilter, respectively. 
  // This will then hold the user input which then I concatenated at the end of the fetch function to make use of 
  // the API's search/filter functionality.
  // I then added the filter to the useEffect dependency so that it fetches new data from the API everytime the filter value changes.
  const [filter, setFilter] = useState('');

  // This controls the toggle to show/hide wishlisted dishes.
  const [isWishListShown, setIsWishlistShown] = useState(false);

  // This is where we store the wishlisted dishes.
  const [wishlist, setWishlist] = useState([]);

  // Function to add or remove a dish from the wishlist triggered by the heart icon
  const handleToggleWishlist = (dish) => {
    // If the dish exists in the wishlist array then remove.
    if (isOnWishlist(dish.idMeal)) {
      setWishlist(wishlist.filter(d => d.idMeal !== dish.idMeal));
      // If it doesn't, then add.
    } else {
      setWishlist([...wishlist, dish]);
    }
  };

  // Function to check if the dish exists in the wishlist. 
  // I made it into a function because I will also use this to change the heart icon to solid heart icon if it's in the wishlist.
  const isOnWishlist = (id) => {
    return wishlist.some((w) => w.idMeal === id) ?? false;
  }

  // useDebouncedCallback takes a function as a parameter and as the second parameter
  // the number of milliseconds it should wait until it is actually called so a user
  // can type freely and as long as they are typing a letter quicker than 500ms, the function won't fire yet.
  // This is to optimize user experience and communication with the server
  const debouncedEffectHook = useDebouncedCallback(() => {
    let currentEffect = true;
    fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${filter}`
    ).then(res => {
      if (!res.ok) {
        return { meals: null };
      }
      return res.json();
    }).then(result => {
      if (!currentEffect) {
        return;
      }
      // The ?? operator turns 'undefined' or 'null' values into a preferred default value on the right side
      // We know that result.meals can be null if there are no results, so in that case, we provide an empty array for safety
      setDishes(result.meals ?? []);
    }).catch(() => {
      if (!currentEffect) {
        return;
      }
      setDishes([]);
    })

    // This cleanup function is to prevent multiple API calls coming back out of sequence and setting the value of our dishes list.
    // Example:
    // 1. First search query is pizza -> Network request takes 5 seconds to fetch data
    // 2. In the meantime, the user types burger instead -> Network request takes 1 second and shows burgers in the list
    // 3. Then, finally, the first data fetch comes back and overwrites the results, so the search box shows 'burger'
    //    but the results show pizzas. This is called "stale data"
    return () => {
      currentEffect = false;
    }
  }, 500);

  // useEffect can take a variable that is a function and does not need to be defined as an anonymous () => {} arrow function
  // This is especially important when using more controlled techniques like debouncing
  useEffect(debouncedEffectHook, [debouncedEffectHook, filter]);

  return (
    <>
      <NavBar>
        <h1>ReDI React Restaurant</h1>

        <SearchField filter={filter} setFilter={setFilter} />
        {/* The toggle button */}
        <button onClick={() => setIsWishlistShown(!isWishListShown)} >{isWishListShown ? "Hide" : "Show"} Wishlist</button>
      </NavBar>

      {/* Made this part into a component so it looks cleaner and easier for me to read. 
       For simplicity, I made use of the existing list of dishes to show the wishlist just by changing passed data (dishes or wishlist). */}
      <MenuList dishes={isWishListShown ? wishlist : dishes} isOnWishlist={isOnWishlist} handleToggleWishlist={handleToggleWishlist} />

    </>
  );
};

export default RestaurantView;
