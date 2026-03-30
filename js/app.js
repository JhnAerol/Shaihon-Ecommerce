document.addEventListener('DOMContentLoaded', () => {
    // Determine the base path based on current folder
    const basePath = window.location.pathname.includes('/views/') ? '../' : './';
    window.AppBasePath = basePath;

    // Load common components if needed, or initialize global scripts
    initApp();
});

async function initApp() {
    try {
        window.productsData = await fetchProducts();
        // Dispatch an event so other scripts know products are loaded
        document.dispatchEvent(new Event('productsLoaded'));
    } catch (error) {
        console.error("Error loading products:", error);
    }
}

async function fetchProducts() {
    const url = `${window.AppBasePath}data/products.json`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch from ${url}`);
    }
    return await response.json();
}

// Global utility for computing current stock
function getAvailableStock(product) {
    const purchased = JSON.parse(localStorage.getItem('purchasedStock')) || {};
    const boughtAmount = purchased[product.id] || 0;
    return Math.max(0, product.stock - boughtAmount);
}

// Global utility for generating product cards (used in index, products pages)
function createProductCard(product, returnHtml = false) {
    const stockInfo = getAvailableStock(product);
    const stockBadge = stockInfo > 0 
        ? (stockInfo < 10 ? `<span class="badge bg-warning text-dark position-absolute top-0 start-0 m-3">Low Stock: ${stockInfo}</span>` : `<span class="badge bg-success position-absolute top-0 start-0 m-3">In Stock</span>`)
        : `<span class="badge bg-danger position-absolute top-0 start-0 m-3">Out of Stock</span>`;

    const imgUrl = (product.images && product.images.length > 0) ? product.images[0] : 'https://via.placeholder.com/300x300?text=No+Image';
    const detailLink = `${window.AppBasePath}views/product-details.html?id=${product.id}`;

    const html = `
        <div class="col-md-4 col-sm-6 mb-4">
            <div class="card product-card text-center position-relative">
                ${stockBadge}
                <a href="${detailLink}">
                    <img src="${imgUrl}" class="card-img-top product-img" alt="${product.name}">
                </a>
                <div class="card-body d-flex flex-column">
                    <p class="text-muted small mb-1">${product.brand}</p>
                    <a href="${detailLink}" class="text-decoration-none text-dark">
                        <h5 class="card-title product-title">${product.name}</h5>
                    </a>
                    <div class="mb-2">
                        <i class="fas fa-star text-warning small"></i>
                        <span class="small text-muted">${product.rating} (${product.reviewCount})</span>
                    </div>
                    <div class="mt-auto">
                        <span class="product-price">$${product.price.toFixed(2)}</span>
                        ${product.oldPrice ? `<span class="old-price">$${product.oldPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="btn btn-outline-primary mt-3 w-100 add-to-cart-btn" data-id="${product.id}" ${stockInfo === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-basket me-2"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
    
    if (returnHtml) return html;
    
    const div = document.createElement('div');
    div.innerHTML = html.trim();
    return div.firstChild;
}
