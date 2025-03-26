document.addEventListener("DOMContentLoaded", () => {
    const productForm = document.getElementById("productForm");
    const productTable = document.getElementById("productTable");
    const searchInput = document.getElementById("searchInput");
    const saveButton = document.getElementById("saveButton");
    const updateButton = document.getElementById("updateButton");
    const exportPDFButton = document.getElementById("exportPDF");
  
    let products = JSON.parse(localStorage.getItem("products")) || [];
    let editIndex = null; // Índice del producto que se está editando
  
    const saveToLocalStorage = () => {
      localStorage.setItem("products", JSON.stringify(products));
    };
  
    const renderProducts = (filteredProducts = products) => {
      productTable.innerHTML = "";
      filteredProducts.forEach((product, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.price}</td>
            <td>${product.description}</td>
            <td><img src="${product.image}" alt="${product.name}" width="50"></td>
            <td>
                <button class="btn btn-warning btn-sm edit-btn" data-index="${index}">Editar</button>
                <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Eliminar</button>
            </td>
        `;
        productTable.appendChild(row);
      });
    };
  
    const validateForm = () => {
      const name = document.getElementById("productName").value.trim();
      const price = document.getElementById("productPrice").value.trim();
      const description = document.getElementById("productDescription").value.trim();
      const image = document.getElementById("productImage").value.trim();
  
      if (!name || !price || !description || !image) {
        alert("Todos los campos son obligatorios.");
        return false;
      }
      return true;
    };
  
    productForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm()) return;
  
      const name = document.getElementById("productName").value;
      const price = parseFloat(document.getElementById("productPrice").value);
      const description = document.getElementById("productDescription").value;
      const image = document.getElementById("productImage").value;
  
      if (editIndex !== null) {
        // Actualizar producto
        products[editIndex] = { name, price, description, image };
        editIndex = null;
        updateButton.classList.add("d-none");
        saveButton.classList.remove("d-none");
      } else {
        // Agregar nuevo producto
        products.push({ name, price, description, image });
      }
  
      saveToLocalStorage();
      renderProducts();
      productForm.reset();
    });
  
    productTable.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
        const index = e.target.getAttribute("data-index");
        const confirmDelete = confirm(`¿Desea eliminar el producto "${products[index].name}"?`);
        if (confirmDelete) {
          products.splice(index, 1);
          saveToLocalStorage();
          renderProducts();
        }
      } else if (e.target.classList.contains("edit-btn")) {
        const index = e.target.getAttribute("data-index");
        const product = products[index];
        document.getElementById("productName").value = product.name;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productDescription").value = product.description;
        document.getElementById("productImage").value = product.image;
  
        editIndex = index;
        saveButton.classList.add("d-none");
        updateButton.classList.remove("d-none");
      }
    });
  
    searchInput.addEventListener("input", () => {
      const query = searchInput.value.toLowerCase();
      const filteredProducts = products.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.price.toString().includes(query) ||
          product.description.toLowerCase().includes(query)
      );
      renderProducts(filteredProducts);
    });
  
    updateButton.addEventListener("click", () => {
      if (!validateForm()) return;
  
      const name = document.getElementById("productName").value;
      const price = parseFloat(document.getElementById("productPrice").value);
      const description = document.getElementById("productDescription").value;
      const image = document.getElementById("productImage").value;
  
      products[editIndex] = { name, price, description, image };
      editIndex = null;
      saveToLocalStorage();
      renderProducts();
      productForm.reset();
      updateButton.classList.add("d-none");
      saveButton.classList.remove("d-none");
    });
  
    exportPDFButton.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
  
      html2canvas(document.querySelector(".table")).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        doc.addImage(imgData, "PNG", 10, 10);
        doc.save("productos.pdf");
      });
    });
  
    renderProducts();
  });