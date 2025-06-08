// ===== DOM Elements =====
const toggleMenuBtn = document.getElementById('toggleMenu');
const header = document.querySelector('.header');
const cartButton = document.getElementById('cart-button');
const cartContent = document.getElementById('cart-content');
const backButton = document.getElementById('backButton');
const scrollBtn = document.getElementById('scrollBtn');

// ===== Product Data =====
const items = {
  jeans1: { name: "Jeans 1", price: 30, stock: 10 },
  jeans2: { name: "Jeans 2", price: 20, stock: 10 },
  jeans3: { name: "Jeans 3", price: 10, stock: 10 },
  jeans4: { name: "Jeans 4", price: 15, stock: 10 },
  tshirt1: { name: "T-shirt 1", price: 20, stock: 10 },
  tshirt2: { name: "T-shirt 2", price: 15, stock: 10 },
  tshirt3: { name: "T-shirt 3", price: 10, stock: 10 },
  tshirt4: { name: "T-shirt 4", price: 10, stock: 10 },
  perfume1: { name: "Perfume 1", price: 5, stock: 10 },
  perfume2: { name: "Perfume 2", price: 8, stock: 10 },
  perfume3: { name: "Perfume 3", price: 9, stock: 10 },
  perfume4: { name: "Perfume 4", price: 7, stock: 10 },
  sando1: { name: "Sando 1", price: 8, stock: 10 },
  sando2: { name: "Sando 2", price: 10, stock: 10 },
  sando3: { name: "Sando 3", price: 11, stock: 10 },
  sando4: { name: "Sando 4", price: 10, stock: 10 },
  toy1: { name: "Toy 1", price: 5, stock: 10 },
  toy2: { name: "Toy 2", price: 6, stock: 10 },
  toy3: { name: "Toy 3", price: 8, stock: 10 },
  toy4: { name: "Toy 4", price: 5, stock: 10 }
};

// ===== Cart State =====
let cart = {
  items: [],
  total: 0
};

// ===== Initialize App =====
document.addEventListener('DOMContentLoaded', function() {
  setupEventListeners();
  updateCartCount();
});

function setupEventListeners() {
  // Menu Toggle
  toggleMenuBtn.addEventListener('click', toggleSidebar);
  
  // Cart Toggle
  cartButton.addEventListener('click', toggleCart);
  
  // Scroll to Top
  scrollBtn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

setupEventListeners(); // ✅ this is required


// ===== Core Functions =====
function toggleSidebar() {
  header.classList.toggle('show');
}

function toggleCart() {
  cartContent.classList.toggle('show');
}

// ===== Navigation Functions =====
function displayJeans() {
  document.getElementById('jeans').scrollIntoView({ behavior: 'smooth' });
  header.classList.remove('show');
}

function displayTshirt() {
  document.getElementById('tshirt').scrollIntoView({ behavior: 'smooth' });
  header.classList.remove('show');
}

function displayPerfume() {
  document.getElementById('perfume').scrollIntoView({ behavior: 'smooth' });
  header.classList.remove('show');
}

function displaySando() {
  document.getElementById('sando').scrollIntoView({ behavior: 'smooth' });
  header.classList.remove('show');
}

function displayToy() {
  document.getElementById('toy').scrollIntoView({ behavior: 'smooth' });
  header.classList.remove('show');
}

// ===== Cart Functions =====
function addToCart(itemName, itemKey) {
  if (items[itemKey].stock > 0) {
    items[itemKey].stock--;
    updateStockDisplay(itemKey);
    
    // Add to cart or increase quantity
    const existingItem = cart.items.find(item => item.id === itemKey);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.items.push({
        id: itemKey,
        name: itemName,
        price: items[itemKey].price,
        quantity: 1
      });
    }
    
    updateCart();
  } else {
    alert(`Sorry, ${itemName} is out of stock.`);
  }
}

function updateStockDisplay(itemKey) {
  const stockElement = document.getElementById(`${itemKey}-stock`);
  if (stockElement) {
    stockElement.textContent = items[itemKey].stock;
  }
}

function updateCart() {
  // Calculate total
  cart.total = cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Update UI
  document.getElementById('cart-count-summary').textContent = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-total').textContent = cart.total.toFixed(2);
  
  // Render cart items
  const cartItemsElement = document.getElementById('cart-items');
  cartItemsElement.innerHTML = '';
  
  cart.items.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <span>${item.name} x${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
      <div>
        <button onclick="changeQuantity('${item.id}', -1)">-</button>
        <button onclick="changeQuantity('${item.id}', 1)">+</button>
      </div>
    `;
    cartItemsElement.appendChild(cartItem);
  });
}

function changeQuantity(itemId, change) {
  const item = cart.items.find(i => i.id === itemId);
  if (!item) return;
  
  if (change > 0) {
    // Increase quantity
    if (items[itemId].stock > 0) {
      item.quantity++;
      items[itemId].stock--;
    } else {
      alert("No more stock available!");
      return;
    }
  } else {
    // Decrease quantity
    item.quantity--;
    items[itemId].stock++;
    if (item.quantity <= 0) {
      cart.items = cart.items.filter(i => i.id !== itemId);
    }
  }
  
  updateStockDisplay(itemId);
  updateCart();
}

function increaseStock(itemKey) {
  items[itemKey].stock++;
  updateStockDisplay(itemKey);
}

function checkout() {
  // Apply discount
  const discountRadio = document.querySelector('input[name="discount"]:checked');
  let discount = 0;
  if (discountRadio) {
    discount = parseFloat(discountRadio.value);
  }
  
  const discountedTotal = cart.total * (1 - discount);
  
  alert(`Thank you for your purchase!\nTotal: $${discountedTotal.toFixed(2)}`);
  
  // Reset cart
  cart.items.forEach(item => {
    items[item.id].stock += item.quantity;
    updateStockDisplay(item.id);
  });
  
  cart.items = [];
  cart.total = 0;
  updateCart();
  
  // Hide cart
  cartContent.classList.remove('show');
}

// ===== Helper Functions =====
function updateCartCount() {
  const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById('cart-count-summary').textContent = count;
}

window.addEventListener('resize', function() {
  const header = document.querySelector('.header');
  if (window.innerWidth >= 900) {
    header.classList.remove('show');
  }
});
