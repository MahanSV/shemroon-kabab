//Script.js
document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.querySelector('.product-grid');

    // تابع برای بارگذاری محصولات از API
    async function loadProducts() {
        try {
            const response = await fetch('/products'); // درخواست به سرور برای دریافت محصولات
            const products = await response.json(); // تبدیل پاسخ به JSON

            // پاک کردن محتویات قبلی
            productGrid.innerHTML = '';

            // اضافه کردن هر محصول به گرید
            products.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';

                productCard.innerHTML = `
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h3 class="product-title">${product.name}</h3>
                    <div class="product-footer">
                        <button class="add-button">+</button>
                        <span class="product-price">قیمت: ${product.price} تومان</span>
                    </div>
                `;

                productGrid.appendChild(productCard);
            });
        } catch (error) {
            console.error('Error loading products:', error);
        }
    }

    // بارگذاری محصولات هنگام بارگذاری صفحه
    loadProducts();
});
