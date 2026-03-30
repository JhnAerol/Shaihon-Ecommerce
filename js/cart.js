// Cart Logic for "Yellow Basket"

let cart = JSON.parse(localStorage.getItem('yellowBasket')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
    
    // Listen for add to cart clicks globally
    document.body.addEventListener('click', (e) => {
        if (e.target.closest('.add-to-cart-btn')) {
            const btn = e.target.closest('.add-to-cart-btn');
            const productId = parseInt(btn.getAttribute('data-id'));
            addToCart(productId);
        }
    });
});

function saveCart() {
    localStorage.setItem('yellowBasket', JSON.stringify(cart));
    updateCartBadge();
}

function addToCart(productId, quantity = 1) {
    if (!window.productsData) return;
    
    const product = window.productsData.find(p => p.id === productId);
    if (!product) return;

    const availableStock = getAvailableStock(product);
    if (availableStock <= 0) {
        alert("Sorry, this item is out of stock.");
        return;
    }

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        if (existingItem.quantity + quantity > availableStock) {
             alert(`You can only add up to ${availableStock} of this item.`);
             return;
        }
        existingItem.quantity += quantity;
    } else {
        if (quantity > availableStock) {
             alert(`You can only add up to ${availableStock} of this item.`);
             return;
        }
        cart.push({ id: productId, quantity: quantity, price: product.price, name: product.name, image: product.images[0] });
    }
    
    saveCart();
    
    // Simple toast notification or alert
    // In a real app we'd use a bootstrap toast, using alert to keep it simple for now
    console.log(`${product.name} added to Yellow Basket. Total items:`, getCartTotalItems());
    
    // Give visual feedback
    const btn = document.querySelector(`.add-to-cart-btn[data-id="${productId}"]`);
    if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Added!';
        btn.classList.replace('btn-outline-primary', 'btn-primary');
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.classList.replace('btn-primary', 'btn-outline-primary');
        }, 1500);
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
}

function updateQuantity(productId, newQuantity) {
    if(!window.productsData) return;
    const product = window.productsData.find(p => p.id === productId);
    if(!product) return;
    
    const availableStock = getAvailableStock(product);
    
    const item = cart.find(i => i.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else if (newQuantity <= availableStock) {
            item.quantity = newQuantity;
            saveCart();
        } else {
            alert(`Only ${availableStock} items available in stock.`);
            item.quantity = availableStock;
            saveCart();
        }
    }
}

function getCartTotalItems() {
    return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotalAmount() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-badge');
    const total = getCartTotalItems();
    badges.forEach(badge => {
        badge.textContent = total;
        // Optionally flash the badge
        badge.style.transform = 'scale(1.2)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
    });
}

function clearCart() {
    cart = [];
    saveCart();
}

// Function to officially decrease stock globally upon successful checkout
function processCheckoutToDecreaseStock() {
    let purchased = JSON.parse(localStorage.getItem('purchasedStock')) || {};
    cart.forEach(item => {
        if (purchased[item.id]) {
            purchased[item.id] += item.quantity;
        } else {
            purchased[item.id] = item.quantity;
        }
    });
    localStorage.setItem('purchasedStock', JSON.stringify(purchased));
    clearCart();
}
