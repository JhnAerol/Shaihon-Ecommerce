document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            if (window.activeFilters) {
                window.activeFilters.query = e.target.value.toLowerCase().trim();
                if (typeof window.renderFilteredProducts === 'function') {
                    window.renderFilteredProducts();
                }
            }
        });
    }

    if(searchBtn) {
        searchBtn.addEventListener('click', () => {
            // Triggered on input anyway, but handles explicit click logic if needed
            if (window.activeFilters && typeof window.renderFilteredProducts === 'function') {
                window.renderFilteredProducts();
            }
        });
    }
});
