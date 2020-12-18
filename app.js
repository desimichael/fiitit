// Varialbles
const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-btn');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// This is the main cart
let cart = [];

// Buttons
let buttonsDOM = [];

// Getting the products
class Products {
	// es6 async (always return promise) await (wait for promise) (2)
	async getProducts() {
		// // (4) gets the items
		let result = await fetch('products.json');
		let data = await result.json();

		// (5) Looping through json data to pull products
		let products = data.items;
		products = products.map((item) => {
			const { title, price } = item.fields;
			const { id } = item.sys;
			const image = item.fields.image.fields.file.url;
			return { title, price, id, image };
		});
		return products;
	}
}

// Display products to screen(bulk of methods here)
class UI {
	// (6)
	displayProducts(products) {
		// (7)
		let result = '';
		products.forEach((product) => {
			// (8) we can add data dynamically within this section (using template literals)
			result += `
    <!-- single product -->
        <article class="product">
          <div class="img-container">
            <img src=${product.image} alt="product" class="product-img">
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to cart
            </button>
            <button class="details-btn" data-id=${product.id}>
							<link rel="stylesheet" href="./pages/flannel.html"/>
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>
        <!-- end of single product -->
    `;
		});
		// (9) After forEach is ran set up cart items (still in the products-center section)
		productsDOM.innerHTML = result;
	}
	// (11) Calling this Method after Displaying the product
	getBagButtons() {
		// spread operator turns this into an array instead of nodelist(0)
		const buttons = [
			...document.querySelectorAll('.bag-btn')
		];
		buttonsDOM = buttons;
		// (12) For all the buttons I want to get the id and loop
		buttons.forEach((button) => {
			let id = button.dataset.id;
			// (13) Check if item is in cart
			let inCart = cart.find((item) => item.id === id);
			if (inCart) {
				button.innerText = 'In Cart';
				button.disabled = true;
			}
			button.addEventListener('click', (event) => {
				// (14) If item is placed in cart button disabled
				event.target.innerText = 'In Cart';
				event.target.disabled = true;
				// (15) Get product from products & add amount to cart
				let cartItem = { ...Storage.getProducts(id), amount: 1 };
				// (16) Add products from products
				cart = [
					...cart,
					cartItem
				];
				// (17) Save cart in local storage
				Storage.saveCart(cart);
				// (18) Set cart values
				this.setCartValues(cart);
				// (19) display cart item
				this.addCartItem(cartItem);
				// (20) Show the cart
				this.showCart();
			});
		});
	}
	setCartValues(cart) {
		let tempTotal = 0;
		let itemsTotal = 0;
		cart.map((item) => {
			tempTotal += item.price * item.amount;
			itemsTotal += item.amount;
		});
		cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
		cartItems.innerText = itemsTotal;
	}
	addCartItem(item) {
		const div = document.createElement('div');
		div.classList.add('cart-item');
		div.innerHTML = `<img src=${item.image} alt="product">
        <div>
          <h4>${item.title}</h4>
          <h5>$${item.price}</h5>
          <span class="remove-item" data-id=${item.id}>remove</span>
        </div>
        <div>
          <i class="fas fa-chevron-up" data-id=${item.id}></i>
          <p class="item-amount">${item.amount}</p>
          <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>`;
		cartContent.appendChild(div);
	}
	showCart() {
		cartOverlay.classList.add('showCartBcg');
		cartDOM.classList.add('showCart');
	}
	setupAPP() {
		cart = Storage.getCart();
		this.setCartValues(cart);
		this.populateCart(cart);
		cartBtn.addEventListener('click', this.showCart);
		closeCartBtn.addEventListener('click', this.hideCart);
	}
	populateCart(cart) {
		cart.forEach((item) => this.addCartItem(item));
	}
	hideCart() {
		cartOverlay.classList.remove('showCartBcg');
		cartDOM.classList.remove('showCart');
	}
	cartLogic() {
		// Clear Cart Button
		clearCartBtn.addEventListener('click', () => {
			this.clearCart();
		});
		// Event Bubbling: Setting up event listener for the whole cart content
		// Cart Functionality (23)
		cartContent.addEventListener('click', (event) => {
			if (event.target.classList.contains('remove-item')) {
				let removeItem = event.target;
				let id = removeItem.dataset.id;
				// Traverse the DOM (moves up two parents) parent item of parent item
				cartContent.removeChild(removeItem.parentElement.parentElement);
				// This removes item from the cart
				this.removeItem(id);
			} else if (event.target.classList.contains('fa-chevron-up')) {
				let addAmount = event.target;
				let id = addAmount.dataset.id;
				// Use find method to update the value
				let tempItem = cart.find((item) => item.id === id);
				tempItem.amount = tempItem.amount + 1;
				Storage.saveCart(cart);
				this.setCartValues(cart);
				// Traversing the DOM
				addAmount.nextElementSibling.innerText = tempItem.amount;
			} else if (event.target.classList.contains('fa-chevron-down')) {
				let lowerAmount = event.target;
				let id = lowerAmount.dataset.id;
				// Use find method to update the value
				let tempItem = cart.find((item) => item.id === id);
				tempItem.amount = tempItem.amount - 1;
				if (tempItem.amount > 0) {
					Storage.saveCart(cart);
					this.setCartValues(cart);
					lowerAmount.previousElementSibling.innerText = tempItem.amount;
				} else {
					cartContent.removeChild(lowerAmount.parentElement.parentElement);
					this.removeItem(id);
				}
			}
		});
	}
	clearCart() {
		// Get all the id's of the items in cart
		let cartItems = cart.map((item) => item.id);
		cartItems.forEach((id) => this.removeItem(id));

		console.log(cartContent.children);

		while (cartContent.children.length > 0) {
			cartContent.removeChild(cartContent.children[0]);
		}
		this.hideCart();
	}
	// This method removes item from the cart inside of the content
	removeItem(id) {
		cart = cart.filter((item) => item.id !== id);
		this.setCartValues(cart);
		Storage.saveCart(cart);
		let button = this.getSingleButton(id);
		button.disabled = false;
		button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to cart`;
	}
	getSingleButton(id) {
		return buttonsDOM.find((button) => button.dataset.id === id);
	}
}

// Local storage
class Storage {
	// (9) Create a static method
	static saveProduct(products) {
		localStorage.setItem('products', JSON.stringify(products));
	}
	static getProducts(id) {
		let products = JSON.parse(localStorage.getItem('products'));
		return products.find((product) => product.id === id);
	}
	static saveCart(cart) {
		localStorage.setItem('cart', JSON.stringify(cart));
	}
	static getCart() {
		// terinary operator instead of if/else
		return localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [];
	}
}

document.addEventListener('DOMContentLoaded', () => {
	// Add Event Listener with Callback function (1)
	const ui = new UI();
	const products = new Products();
	// set up App (21)
	ui.setupAPP();

	// Get all Products (3)
	products
		.getProducts()
		.then((products) => {
			ui.displayProducts(products);
			// (10) Saved products in local storage
			Storage.saveProduct(products);
		})
		.then(() => {
			ui.getBagButtons();
			// Adding logic to the cart (22)
			ui.cartLogic();
		});
});
