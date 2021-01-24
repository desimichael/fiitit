const cartBtn = document.querySelector('.navbar__cart-btn');
const closeCartBtn = document.querySelector('.cart__close-cart');
const clearCartBtn = document.querySelector('.cart__clear-cart');
const cartDOM = document.querySelector('.cart');
const cartItems = document.querySelector('.navbar__cart-items');
const cartTotal = document.querySelector('.cart__footer-total');
const cartContent = document.querySelector('.cart__content');
const productsDOM = document.querySelector('.products__center');


// cart 
let cart = [];
// buttons
let buttonsDOM = [];


// getting the products
class Products {
  async getProducts() {
    try {
      let result = await fetch('products.json')
      let data = await result.json();
      let products = data.items;
      products = products.map(item => {
        const { id, title, price, image } = item;
        return { id, title, price, id, image }
      })
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
				<article class="products__product">
					<div class="products__img-container">
						<img
							src=${product.image}
							class="products__img"
						/>
						<button class="products__bag-btn data-id=${product.id}>
							<i class="fas fa-shopping-cart"></i>
							add to cart
						</button>
					</div>
					<div class="products__group">
						<h3 class="products__group-title">${product.title}</h3>
						<h4 class="products__group-price">
							<i class="fas fa-dollar-sign"></i>${product.price}
						</h4>
					</div>
        </article>
      `
    });
    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll('.products__bag-btn')];
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id === id)
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      }
      button.addEventListener("click", event => {
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        // get product from products
        // add product to the cart
        // save cart in local storage
        // set cart values
        // display cart item
        // show the cart 
      });
    });
  }
}

// local storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();


  // get all products
  products.getProducts().then(products => {

    ui.displayProducts(products);
    Storage.saveProducts(products)
  }).then(() => {
    ui.getBagButtons();
  })
});