import styles from "./SearchField.module.css";


const SearchField = ({filter, setFilter}) => {

  return (
    <div className={styles.wrapper}>
      <input
        placeholder="Filter dishes..."
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      />
    </div>
  );
};

export default SearchField;
