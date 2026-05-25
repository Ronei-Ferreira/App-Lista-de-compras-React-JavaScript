function ShoppingItem({
  item,
  removeItem,
  toggleCompleted,
}) {
  return (
    <div
      className={`item ${
        item.completed
          ? "completed"
          : ""
      }`}
    >
      <div>
        <h3>{item.text}</h3>

        <p>
          📁 {item.category}
        </p>

        <p>
          📅 {item.month}
        </p>
      </div>

      <div className="buttons">
        <button
          onClick={() =>
            toggleCompleted(
              item.id
            )
          }
        >
          ✔
        </button>

        <button
          onClick={() =>
            removeItem(item.id)
          }
        >
          ✖
        </button>
      </div>
    </div>
  );
}

export default ShoppingItem;