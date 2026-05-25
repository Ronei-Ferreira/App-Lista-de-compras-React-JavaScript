function Filter({
  filter,
  setFilter,
}) {
  return (
    <div className="filter">
      <button
        onClick={() =>
          setFilter("all")
        }
      >
        Todos
      </button>

      <button
        onClick={() =>
          setFilter(
            "completed"
          )
        }
      >
        Comprados
      </button>

      <button
        onClick={() =>
          setFilter("pending")
        }
      >
        Pendentes
      </button>
    </div>
  );
}

export default Filter;