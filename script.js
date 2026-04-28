// LinkVault - Main JavaScript file

// Default websites data
const defaultWebsites = [
    { name: "Arsenio", url: "https://adminweb09.github.io/Protofolio_Zen/" },
    { name: "Anggara", url: "https://anggarapd16-ai.github.io/portofolio/" },
    { name: "Alif", url: "https://alland-glitch.github.io/Web-Portofolio-Alland-Freda/" }
];

// Local storage key
const STORAGE_KEY = 'linkvault_websites';

// DOM elements
const navbarMenu = document.getElementById('navbar-menu');
const websitesGrid = document.getElementById('websites-grid');
const searchInput = document.getElementById('search-input');
const addWebsiteBtn = document.getElementById('add-website-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose = document.getElementById('modal-close');
const modalIframe = document.getElementById('modal-iframe');
const modalLoading = document.getElementById('modal-loading');
const formOverlay = document.getElementById('form-overlay');
const addWebsiteForm = document.getElementById('add-website-form');
const formClose = document.getElementById('form-close');
const hamburger = document.getElementById('hamburger');
const toast = document.getElementById('toast');

// Current websites data
let websites = [];

// Initialize the application
function init() {
    loadWebsites();
    renderNavbar();
    renderWebsitesGrid();
    setupEventListeners();
}

// Load websites from localStorage or use defaults
function loadWebsites() {
    const stored = localStorage.getItem(STORAGE_KEY);
    websites = stored ? JSON.parse(stored) : [...defaultWebsites];
    if (!stored) {
        saveWebsites();
    }
}

// Save websites to localStorage
function saveWebsites() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(websites));
}

// Render navbar with websites
function renderNavbar() {
    navbarMenu.innerHTML = '';
    websites.forEach((website, index) => {
        const navbarItem = document.createElement('div');
        navbarItem.className = 'navbar-item';
        navbarItem.innerHTML = `
            <span>${website.name}</span>
            <button class="delete-btn" data-index="${index}">&times;</button>
        `;
        navbarItem.addEventListener('click', (e) => {
            if (!e.target.classList.contains('delete-btn')) {
                openModal(website.url);
                setActiveNavbarItem(navbarItem);
            }
        });
        navbarMenu.appendChild(navbarItem);
    });
}

// Render websites grid
function renderWebsitesGrid(filteredWebsites = websites) {
    websitesGrid.innerHTML = '';
    filteredWebsites.forEach(website => {
        const card = document.createElement('div');
        card.className = 'website-card';
        card.innerHTML = `
            <h3>${website.name}</h3>
            <p>${website.url}</p>
        `;
        card.addEventListener('click', () => openModal(website.url));
        websitesGrid.appendChild(card);
    });
}

// Set active navbar item
function setActiveNavbarItem(activeItem) {
    document.querySelectorAll('.navbar-item').forEach(item => {
        item.classList.remove('active');
    });
    activeItem.classList.add('active');
}

// Open modal with iframe
function openModal(url) {
    modalOverlay.style.display = 'flex';
    modalLoading.style.display = 'block';
    modalIframe.style.display = 'none';
    modalIframe.src = '';

    // Timeout for loading
    const timeout = setTimeout(() => {
        modalLoading.innerHTML = '<p>Failed to load website</p>';
    }, 10000);

    modalIframe.onload = () => {
        clearTimeout(timeout);
        modalLoading.style.display = 'none';
        modalIframe.style.display = 'block';
    };

    modalIframe.src = url;
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modalOverlay.style.display = 'none';
    modalIframe.src = '';
    document.body.style.overflow = 'auto';
}

// Show toast notification
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.style.background = type === 'success' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)';
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

// Validate URL
function isValidUrl(url) {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    return urlRegex.test(url);
}

// Sanitize input
function sanitizeInput(input) {
    return input.replace(/[<>]/g, '');
}

// Setup event listeners
function setupEventListeners() {
    // Modal close events
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalOverlay.style.display === 'flex') closeModal();
    });

    // Form events
    addWebsiteBtn.addEventListener('click', () => {
        formOverlay.style.display = 'flex';
    });
    formClose.addEventListener('click', () => {
        formOverlay.style.display = 'none';
    });
    formOverlay.addEventListener('click', (e) => {
        if (e.target === formOverlay) formOverlay.style.display = 'none';
    });

    // Add website form
    addWebsiteForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = sanitizeInput(document.getElementById('website-name').value.trim());
        const url = document.getElementById('website-url').value.trim();

        if (!name || !url) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        if (!isValidUrl(url)) {
            showToast('Please enter a valid URL', 'error');
            return;
        }

        // Ensure URL has protocol
        const fullUrl = url.startsWith('http') ? url : `https://${url}`;

        websites.push({ name, url: fullUrl });
        saveWebsites();
        renderNavbar();
        renderWebsitesGrid();
        formOverlay.style.display = 'none';
        addWebsiteForm.reset();
        showToast('Website added successfully!');
    });

    // Delete website
    navbarMenu.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = parseInt(e.target.dataset.index);
            websites.splice(index, 1);
            saveWebsites();
            renderNavbar();
            renderWebsitesGrid();
            showToast('Website deleted successfully!');
        }
    });

    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filtered = websites.filter(website =>
            website.name.toLowerCase().includes(query)
        );
        renderWebsitesGrid(filtered);
    });

    // Hamburger menu
    hamburger.addEventListener('click', () => {
        navbarMenu.classList.toggle('active');
    });

    // Smooth scroll for hero
    document.querySelector('.hero').addEventListener('click', () => {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    });
}

// Initialize the app
init();