document.getElementById('phone-btn').addEventListener('click', function() {
    document.getElementById('phone-modal').style.display = 'block';
});

document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('phone-modal').style.display = 'none';
});

window.addEventListener('click', function(event) {
    if (event.target == document.getElementById('phone-modal')) {
        document.getElementById('phone-modal').style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const grids = [
        document.querySelector('.first-grid'),
        document.querySelector('.second-grid'),
        document.querySelector('.third-grid'),
        document.querySelector('.fourth-grid'),
    ];

    let totalPrice = 0;
    const selectedProducts = {};
    let currentPage = 1;
    const productsPerPage = 5;

    async function loadProducts(page = 1) {
        try {
            const response = await fetch(`/products?page=${page}&limit=${productsPerPage}`);
            const data = await response.json();

            grids.forEach(grid => grid.innerHTML = '');

            data.products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-footer">
                        <button class="add-button" data-name="${product.name}" data-price="${product.price}">+</button>
                        <span class="product-price">قیمت: ${product.price} تومان</span>
                    </div>
                `;
                grids[Math.floor((data.currentPage - 1) / productsPerPage)].appendChild(productCard);
            });

            setupPagination(Math.min(data.totalPages, 5)); // محدود کردن به ۵ صفحه
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    function setupPagination(totalPages) {
        const pagination = document.getElementById('pagination');
        pagination.innerHTML = '';

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.textContent = i;
            button.onclick = () => {
                currentPage = i;
                loadProducts(currentPage);
            };
            pagination.appendChild(button);
        }
    }

    function addToCart(event) {
        const button = event.target;
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price'));

        if (selectedProducts[name]) {
            selectedProducts[name].count += 1;
        } else {
            selectedProducts[name] = { price, count: 1 };
        }

        totalPrice += price;
        displayCart();
    }

    function displayCart() {
        const cartDisplay = document.getElementById('cart-display');
        cartDisplay.innerHTML = '';

        for (const name in selectedProducts) {
            const { price, count } = selectedProducts[name];
            cartDisplay.innerHTML += `${name}: ${count} عدد - ${price * count} تومان<br>`;
        }

        const totalDisplay = document.getElementById('total-price');
        totalDisplay.innerHTML = `مجموع: ${totalPrice} تومان`;
    }

    loadProducts();

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('add-button')) {
            addToCart(event);
        }
    });
});
