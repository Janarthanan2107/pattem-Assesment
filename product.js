let productsData = [];
let categoriesData = [];
let currentIndex = 0;
const itemsPerPage = 10;

// Show loading indicator
function showLoading(isLoading) {
    const loadingIndicator = document.getElementById('loading-indicator');
    if (isLoading) {
        loadingIndicator.classList.add('show');
    } else {
        loadingIndicator.classList.remove('show');
    }
}

// Fetch products data
showLoading(true);
fetch('https://fakestoreapi.com/products')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        showLoading(false);
        productsData = data;
        loadMoreProducts();
    })
    .catch(error => {
        showLoading(false);
        console.error('Error fetching data:', error);
        document.querySelector('.products').innerHTML = '<p>Error loading products. Please try again later.</p>';
    });

// Fetch categories data
fetch('https://fakestoreapi.com/products/categories')
    .then(res => res.json())
    .then(categories => {
        categoriesData = categories;
        renderCategories(categories);
    });

// Update product count
function updateProductCount(count) {
    const productCountElement = document.getElementById('product-count');
    productCountElement.textContent = `${count} Results`;
}

// Render products
function renderProducts(products, append = false) {
    const productContainer = document.querySelector('.product-item');

    const productCardsHTML = products.map(product => {
        return `
            <div class="product-card">
                <img src="${product.image}" alt="${product.title}">
                <b>${product.title}</b>
                <p>$${product.price}</p>
            </div>
        `;
    }).join('');

    if (append) {
        productContainer.innerHTML += productCardsHTML;
    } else {
        productContainer.innerHTML = productCardsHTML;
    }
}

// Load more products
function loadMoreProducts() {
    const remainingProducts = productsData.slice(currentIndex, currentIndex + itemsPerPage);
    currentIndex += itemsPerPage;
    renderProducts(remainingProducts, true);
    if (currentIndex >= productsData.length) {
        document.getElementById('load-more').style.display = 'none';
    } else {
        document.getElementById('load-more').style.display = 'block';
    }
}

// Render categories with filters
function renderCategories(categories) {
    const categoriesContainer = document.getElementById('categories-container');
    const selectedCategories = [];

    categories.forEach(category => {
        const checkboxContainer = document.createElement('div');
        checkboxContainer.classList.add('checkbox-container');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.name = category;
        checkbox.id = category;
        const label = document.createElement('p');
        label.textContent = category;
        checkboxContainer.appendChild(checkbox);
        checkboxContainer.appendChild(label);
        categoriesContainer.appendChild(checkboxContainer);

        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                selectedCategories.push(category);
            } else {
                selectedCategories.splice(selectedCategories.indexOf(category), 1);
            }

            if (selectedCategories.length === 0) {
                renderProducts(productsData);
            } else {
                const filteredProducts = productsData.filter(product => selectedCategories.includes(product.category));
                renderProducts(filteredProducts);
            }
        });
    });
}

// Sorting and filtering products by price
document.querySelector('.price').addEventListener('change', (event) => {
    const sortOption = event.target.value;
    let sortedProducts = [...productsData];

    if (sortOption === 'low-to-high') {
        sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-to-low') {
        sortedProducts.sort((a, b) => b.price - a.price);
    }

    renderProducts(sortedProducts);
});

// Search functionality
document.getElementById('search-bar').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    const filteredProducts = productsData.filter(product => product.title.toLowerCase().includes(query));
    renderProducts(filteredProducts);
});

// Initial load
document.getElementById('load-more').addEventListener('click', loadMoreProducts);
