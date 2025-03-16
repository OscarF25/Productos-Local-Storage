document.addEventListener("DOMContentLoaded", () => {
  const productForm = document.getElementById("productForm");
  const productTable = document.getElementById("productTable");
  let products = JSON.parse(localStorage.getItem("products")) || [];

  const saveToLocalStorage = () => {
      localStorage.setItem("products", JSON.stringify(products));
  };

  const renderProducts = () => {
      productTable.innerHTML = "";
      products.forEach((product, index) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${product.name}</td>
              <td>${product.price}</td>
              <td>${product.description}</td>
              <td>
                  <button class="btn btn-warning btn-sm edit-btn" data-index="${index}">Editar</button>
                  <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Eliminar</button>
              </td>
          `;
          productTable.appendChild(row);
      });
  };

  productForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("productName").value;
      const price = document.getElementById("productPrice").value;
      const description = document.getElementById("productDescription").value;
      
      products.push({ name, price: parseFloat(price), description });
      saveToLocalStorage();
      renderProducts();
      productForm.reset();
  });

  productTable.addEventListener("click", (e) => {
      if (e.target.classList.contains("delete-btn")) {
          const index = e.target.getAttribute("data-index");
          products.splice(index, 1);
          saveToLocalStorage();
          renderProducts();
      }
      if (e.target.classList.contains("edit-btn")) {
          const index = e.target.getAttribute("data-index");
          const product = products[index];
          document.getElementById("productName").value = product.name;
          document.getElementById("productPrice").value = product.price;
          document.getElementById("productDescription").value = product.description;
          
          products.splice(index, 1);
          saveToLocalStorage();
          renderProducts();
      }
  });

  renderProducts();
});
