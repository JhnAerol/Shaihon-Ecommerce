window.activeFilters = { query: '', categories: [], brands: [] };

document.addEventListener('productsLoaded', () => {
    if (!document.getElementById('allProductsContainer')) return;
    buildFilters();
    renderFilteredProducts();

    const resetBtn = document.getElementById('resetFiltersBtn');
    if(resetBtn) {
        resetBtn.addEventListener('click', () => {
            window.activeFilters = { query: '', categories: [], brands: [] };
            document.getElementById('searchInput').value = '';
            document.querySelectorAll('input[type="checkbox"]').forEach(cb => cb.checked = false);
            renderFilteredProducts();
        });
    }
});

function buildFilters() {
    const products = window.productsData;
    const catContainer = document.getElementById('categoryFilters');
    const brandContainer = document.getElementById('brandFilters');
    
    // Extract unique labels
    const categories = [...new Set(products.map(p => p.category))];
    const brands = [...new Set(products.map(p => p.brand))];

    // Build Category Checkboxes
    if(catContainer) {
        catContainer.innerHTML = categories.map(cat => `
            <div class="form-check mb-2">
                <input class="form-check-input filter-checkbox" type="checkbox" value="${cat}" data-type="categories" id="cat_${cat.replace(/\s+/g,'')}">
                <label class="form-check-label" for="cat_${cat.replace(/\s+/g,'')}">${cat}</label>
            </div>
        `).join('');
    }

    // Build Brand Checkboxes
    if(brandContainer) {
        brandContainer.innerHTML = brands.map(brand => `
            <div class="form-check mb-2">
                <input class="form-check-input filter-checkbox" type="checkbox" value="${brand}" data-type="brands" id="brand_${brand.replace(/\s+/g,'')}">
                <label class="form-check-label" for="brand_${brand.replace(/\s+/g,'')}">${brand}</label>
            </div>
        `).join('');
    }

    // Listen to changes
    document.querySelectorAll('.filter-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const type = e.target.getAttribute('data-type');
            const val = e.target.value;
            if (e.target.checked) {
                window.activeFilters[type].push(val);
            } else {
                window.activeFilters[type] = window.activeFilters[type].filter(item => item !== val);
            }
            renderFilteredProducts();
        });
    });
}

window.renderFilteredProducts = function() {
    const container = document.getElementById('allProductsContainer');
    const counter = document.getElementById('resultsCount');
    if(!container) return;

    const { query, categories, brands } = window.activeFilters;
    let filtered = window.productsData;

    // Apply search query
    if (query) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(query) || 
            p.description.toLowerCase().includes(query)
        );
    }

    // Apply category filters
    if (categories.length > 0) {
        filtered = filtered.filter(p => categories.includes(p.category));
    }

    // Apply brand filters
    if (brands.length > 0) {
        filtered = filtered.filter(p => brands.includes(p.brand));
    }

    counter.innerHTML = `Showing ${filtered.length} products`;
    container.innerHTML = '';

    if (filtered.length === 0) {
        container.innerHTML = `<div class="col-12 text-center py-5">
            <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
            <h4 class="text-muted">No products found matching your criteria</h4>
        </div>`;
        return;
    }

    filtered.forEach(product => {
        container.appendChild(createProductCard(product));
    });
};
