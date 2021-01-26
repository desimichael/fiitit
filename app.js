const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');


// cart 
let cart = [];
// buttons
let buttonsDOM = [];


// getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json")
      let data = await result.json();

      let products = data.items;
      products = products.map(item => {
        const { id, title, price, image } = item;
        return { id, title, price, id, image }
      });
      return products
    } catch (error) {
      console.log(error);
    }
  }
}

// display products
class UI {
  displayProducts(products) {
    let result = '';
    products.forEach(product => {
      result += ` 
				<!-- single product start  -->
				<article class="product">
					<div class="img-container">
						<img
							src=${product.image}
							class="product-img"
						/>
						<button class="bag-btn" data-id=${product.id}>
							<i class="fas fa-shopping-cart"></i>
							add to cart
						</button>
					</div>
					<div class="product-group">
						<h3 class="product-title">${product.title}</h3>
						<h4 class="product-price">
							<i class="fas fa-dollar-sign"></i>${product.price}
						</h4>
					</div>
        </article>
				<!-- single product end  -->
      `
    });
    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll('.bag-btn')];
    buttonsDOM = buttons;

    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", (event) => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;

        // get product from products
        let cartItem = Storage.getProduct(id);
        // add product to the cart 
        // save cart in local storage
        // set cart values 
        // display cart item 
        // show the cart

      })
    });
  }
}

// local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();


  // get all products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
    });
});