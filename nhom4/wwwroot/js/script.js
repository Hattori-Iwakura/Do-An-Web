// Sample product data
const products = [
    {
        id: 1,
        name: "Whey Protein Isolate",
        price: 49.99,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1593097132127-866ab7b8b9e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "BCAA Powder",
        price: 29.99,
        rating: 4.3,
        image: "https://images.unsplash.com/photo-1593097132127-866ab7b8b9e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Pre-Workout Energy",
        price: 39.99,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1593097132127-866ab7b8b9e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Creatine Monohydrate",
        price: 24.99,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1593097132127-866ab7b8b9e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    }
];

// Cart functionality
let cart = [];
let cartCount = 0;

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMobile = document.querySelector('.nav-mobile');
const cartCountElement = document.querySelector('.cart-count');
const productsGrid = document.querySelector('.products-grid');
const carousel = document.querySelector('.carousel');
const prevButton = document.querySelector('.carousel-arrow.prev');
const nextButton = document.querySelector('.carousel-arrow.next');
const newsletterForm = document.getElementById('newsletter-form');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    navMobile.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Generate star rating HTML
function generateStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Create product card
function createProductCard(product) {
    return `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${generateStarRating(product.rating)}
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
}

// Initialize featured products
function initializeProducts() {
    productsGrid.innerHTML = products.map(product => createProductCard(product)).join('');
    
    // Add event listeners to "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        });
    });
}

// Add to cart functionality
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        cartCount++;
        updateCartCount();
        showAddedToCartMessage(product.name);
    }
}

// Update cart count display
function updateCartCount() {
    cartCountElement.textContent = cartCount;
}

// Show "Added to cart" message
function showAddedToCartMessage(productName) {
    const message = document.createElement('div');
    message.className = 'cart-message';
    message.textContent = `${productName} added to cart!`;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

// Carousel functionality
let currentSlide = 0;
const slideWidth = 300; // Width of each slide including gap

function initializeCarousel() {
    // Create carousel items
    const carouselItems = products.map(product => `
        <div class="carousel-item">
            ${createProductCard(product)}
        </div>
    `).join('');
    
    carousel.innerHTML = carouselItems;
    
    // Add event listeners to carousel buttons
    prevButton.addEventListener('click', () => {
        currentSlide = Math.max(currentSlide - 1, 0);
        updateCarousel();
    });
    
    nextButton.addEventListener('click', () => {
        currentSlide = Math.min(currentSlide + 1, products.length - 1);
        updateCarousel();
    });
    
    // Auto-play functionality
    let autoPlayInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % products.length;
        updateCarousel();
    }, 5000);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoPlayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
        autoPlayInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % products.length;
            updateCarousel();
        }, 5000);
    });
}

function updateCarousel() {
    const offset = -currentSlide * slideWidth;
    carousel.style.transform = `translateX(${offset}px)`;
}

// Newsletter form validation
newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (validateEmail(email)) {
        showNewsletterMessage('Thank you for subscribing!');
        e.target.reset();
    } else {
        showNewsletterMessage('Please enter a valid email address.', true);
    }
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showNewsletterMessage(message, isError = false) {
    const messageElement = document.createElement('div');
    messageElement.className = `newsletter-message ${isError ? 'error' : 'success'}`;
    messageElement.textContent = message;
    
    const newsletterContent = document.querySelector('.newsletter-content');
    newsletterContent.appendChild(messageElement);
    
    setTimeout(() => {
        messageElement.remove();
    }, 3000);
}

// Scroll animation
function initializeScrollAnimation() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.featured-products, .top-deals, .goal-categories, .newsletter').forEach(section => {
        observer.observe(section);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeProducts();
    initializeCarousel();
    initializeScrollAnimation();
}); 