import { useEffect, useMemo, useState } from "react";
import "./App.css";

import ShoppingForm from "./components/ShoppingForm";
import ShoppingList from "./components/ShoppingList";
import Filter from "./components/Filter";

import { BarcodeScanner } from "@capacitor-mlkit/barcode-scanning";

function App() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("Janeiro");
  const [quickProduct, setQuickProduct] = useState("");

  const months = [
    "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
    "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
  ];

  // 💾 LOAD STORAGE
  useEffect(() => {
    try {
      const saved = localStorage.getItem("shopping_items");
      setItems(saved ? JSON.parse(saved) : []);
    } catch (e) {
      setItems([]);
    }
  }, []);

  // 💾 SAVE STORAGE
  useEffect(() => {
    try {
      localStorage.setItem("shopping_items", JSON.stringify(items));
    } catch (e) {
      console.log("storage error", e);
    }
  }, [items]);

  // ➕ ADD ITEM
  const addItem = (text, category, month = selectedMonth, price = 0) => {
    if (!text || !text.trim()) return;
    const newItem = {
      id: Date.now(),
      text,
      category,
      month,
      price,
      completed: false,
    };
    setItems((prev) => [...prev, newItem]);
  };

  // ➕ ADD QUICK PRODUCT
  const addQuickProduct = () => {
    if (!quickProduct.trim()) return;
    addItem(quickProduct, "Geral", selectedMonth, 0);
    setQuickProduct("");
  };

  // ❌ REMOVE
  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // ✔ TOGGLE
  const toggleCompleted = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // 📷 SCANNER
  const startScan = async () => {
    try {
      const permission = await BarcodeScanner.checkPermissions();
      if (permission.camera !== "granted") {
        const req = await BarcodeScanner.requestPermissions();
        if (req.camera !== "granted") {
          alert("Permissão de câmera negada.");
          return;
        }
      }
      const result = await BarcodeScanner.scan();
      const code = result?.barcodes?.[0]?.rawValue;
      if (code) {
        await handleBarcode(code);
      }
    } catch (error) {
      console.log("scanner error:", error);
      alert("Erro ao abrir scanner: " + error.message);
    }
  };

  // 🔎 API PRODUTO
  const handleBarcode = async (barcode) => {
    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const data = await res.json();
      if (data?.status === 1) {
        const p = data.product;
        addItem(p.product_name || "Produto sem nome", "Mercado", selectedMonth, 0);
      } else {
        addItem(`Produto ${barcode}`, "Mercado", selectedMonth, 0);
      }
    } catch (e) {
      console.log("API error:", e);
      addItem(`Produto ${barcode}`, "Mercado", selectedMonth, 0);
    }
  };

  // 🔎 FILTER
  const filteredItems = items.filter((item) => {
    const matchSearch = item.text?.toLowerCase().includes(search.toLowerCase());
    const matchMonth = item.month === selectedMonth;
    if (filter === "completed") return item.completed && matchSearch && matchMonth;
    if (filter === "pending") return !item.completed && matchSearch && matchMonth;
    return matchSearch && matchMonth;
  });

  // 💰 TOTAL
  const total = useMemo(() => {
    return filteredItems.reduce((acc, item) => acc + (item.price || 0), 0);
  }, [filteredItems]);

  return (
    <div className="app">
      <h1>🛒 Shopping List Ronei e Laís</h1>

      <ShoppingForm addItem={addItem} />

      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {months.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>

      <Filter filter={filter} setFilter={setFilter} />

      <input
        placeholder="Pesquisar item..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="scan-btn" onClick={startScan}>
        📷 Escanear Código de Barras
      </button>

      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <input
          placeholder="Adicionar produto rápido..."
          value={quickProduct}
          onChange={(e) => setQuickProduct(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addQuickProduct()}
        />
        <button onClick={addQuickProduct}>➕</button>
      </div>

      <h2>💰 Total: R$ {total.toFixed(2)}</h2>

      <ShoppingList
        items={filteredItems}
        removeItem={removeItem}
        toggleCompleted={toggleCompleted}
      />
    </div>
  );
}

export default App;