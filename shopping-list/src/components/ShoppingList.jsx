import ShoppingItem from "./ShoppingItem";

function ShoppingList({
  items,
  removeItem,
  toggleCompleted,
}) {
  return (
    <div className="list">
      {items.length === 0 && (
        <p>
          Nenhum item encontrado.
        </p>
      )}

      {items.map((item) => (
        <ShoppingItem
          key={item.id}
          item={item}
          removeItem={removeItem}
          toggleCompleted={
            toggleCompleted
          }
        />
      ))}
    </div>
  );
}

export default ShoppingList;