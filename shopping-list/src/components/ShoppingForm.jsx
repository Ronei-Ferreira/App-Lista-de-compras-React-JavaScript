import { useState } from "react";

function ShoppingForm({ addItem }) {
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Mercado");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!text.trim()) return;

    addItem(text, category);

    setText("");
  };

  return (
    <form className="form" onSubmit={handleSubmit}>

      <input
        type="text"
        placeholder="Digite um item..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Mercado">Mercado</option>
        <option value="Limpeza">Limpeza</option>
        <option value="Farmácia">Farmácia</option>
        <option value="Bebidas">Bebidas</option>
      </select>

      <button type="submit">
        Adicionar
      </button>

    </form>
  );
}

export default ShoppingForm;