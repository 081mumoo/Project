// ==================== API-BASED DATABASE CLASS ====================
class Database {
    constructor() {
        this.API_URL = 'http://localhost:3000/api';
        this.token = localStorage.getItem('token');
    }

    // Helper method for API calls
    async apiCall(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        
        const response = await fetch(`${this.API_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API error');
        }
        
        return response.json();
    }

    // Auth methods
    async login(email, password) {
        const result = await this.apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        this.token = result.token;
        localStorage.setItem('token', result.token);
        return result.user;
    }

    async register(userData) {
        const result = await this.apiCall('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        return result.user;
    }

    // Pet methods
    async getPets(userId = null) {
        return this.apiCall('/pets');
    }

    async addPet(petData) {
        return this.apiCall('/pets', {
            method: 'POST',
            body: JSON.stringify(petData)
        });
    }

    async updatePet(petId, petData) {
        return this.apiCall(`/pets/${petId}`, {
            method: 'PUT',
            body: JSON.stringify(petData)
        });
    }

    async deletePet(petId) {
        return this.apiCall(`/pets/${petId}`, {
            method: 'DELETE'
        });
    }

    // Adoption methods
    async getAdoptionListings() {
        return this.apiCall('/adoptions');
    }

    async submitAdoptionApplication(applicationData, userId) {
        return this.apiCall('/adoptions/apply', {
            method: 'POST',
            body: JSON.stringify(applicationData)
        });
    }

    // Shop/Cart methods
    async getCart(userId) {
        return this.apiCall('/cart');
    }

    async addToCart(userId, productId, quantity = 1) {
        return this.apiCall('/cart', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    }

    async removeFromCart(userId, productId) {
        return this.apiCall(`/cart/${productId}`, {
            method: 'DELETE'
        });
    }

    async updateCartItem(userId, productId, quantity) {
        return this.apiCall(`/cart/${productId}`, {
            method: 'PUT',
            body: JSON.stringify({ quantity })
        });
    }

    // Appointment methods
    async getAppointments(userId) {
        return this.apiCall('/appointments');
    }

    async bookAppointment(appointmentData) {
        return this.apiCall('/appointments', {
            method: 'POST',
            body: JSON.stringify(appointmentData)
        });
    }

    // Forum methods
    async getForumPosts() {
        return this.apiCall('/forum');
    }

    async createForumPost(postData) {
        return this.apiCall('/forum', {
            method: 'POST',
            body: JSON.stringify(postData)
        });
    }

    // User methods
    async getUserProfile() {
        return this.apiCall('/users/profile');
    }

    async updateUserProfile(userData) {
        return this.apiCall('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    // Health records
    async getHealthRecords(petId) {
        return this.apiCall(`/pets/${petId}/health-records`);
    }

    async addHealthRecord(petId, recordData) {
        return this.apiCall(`/pets/${petId}/health-records`, {
            method: 'POST',
            body: JSON.stringify(recordData)
        });
    }
}

// ==================== PET CARE PLATFORM CLASS ====================

class PetCarePlatform {
    constructor() {
        this.currentUser = null;
        this.pets = [];
        this.appointments = [];
        this.adoptionListings = [];
        this.forumPosts = [];
        this.notifications = [];
        this.currentTheme = 'light';
        this.shopProducts = [];
        this.init();
    }

    async init() {
        this.initializeData();
        this.setupEventListeners();
        this.initializeAnimations();
        this.initializeKenyaTheme();
        await this.loadUserData(); // Made async
        this.startNotificationSystem();
        this.initializeTheme();
        this.setupUserDropdown();
        this.updateCartCounter();
    }

    // Initialize sample data for demonstration
    initializeData() {
        // Sample pets data - only for demo user
        this.pets = [
            {
                id: 1,
                name: "Luna",
                species: "Cat",
                breed: "Maine Coon",
                age: { years: 3, months: 2 },
                weight: 12.5,
                profilePicture: "https://kimi-web-img.moonshot.cn/img/www.dailypaws.com/b68bc9902f47dc70f3ce7e9b91177189f2a29a36.jpg",
                healthRecords: [
                    { date: "2024-11-15", type: "checkup", title: "Annual Checkup", veterinarian: "Dr. Smith" },
                    { date: "2024-10-20", type: "vaccination", title: "Rabies Vaccine", veterinarian: "Dr. Johnson" }
                ],
                nextAppointment: "2024-12-20"
            },
            {
                id: 2,
                name: "Max",
                species: "Dog",
                breed: "Golden Retriever",
                age: { years: 5, months: 6 },
                weight: 28.3,
                profilePicture: "https://kimi-web-img.moonshot.cn/img/d3544la1u8djza.cloudfront.net/acea66805b4b70839102add1ea6f98453f5afaa3.jpg",
                healthRecords: [
                    { date: "2024-11-10", type: "grooming", title: "Full Grooming", veterinarian: "Pet Spa" },
                    { date: "2024-09-15", type: "surgery", title: "Dental Cleaning", veterinarian: "Dr. Wilson" }
                ],
                nextAppointment: "2024-12-25"
            },
            {
                id: 3,
                name: "Kiwi",
                species: "Bird",
                breed: "Cockatiel",
                age: { years: 2, months: 4 },
                weight: 0.1,
                profilePicture: "https://kimi-web-img.moonshot.cn/img/www.petdhw.com/7f1c4ebcb73a85fc746c858824666fa7a2cf6d56.png",
                healthRecords: [
                    { date: "2024-11-05", type: "checkup", title: "Wing Clip", veterinarian: "Dr. Brown" }
                ],
                nextAppointment: "2025-01-15"
            }
        ];

        // Sample adoption listings - Kenyan adoption fees in KES
        this.adoptionListings = [
            {
                id: 1,
                name: "Bella",
                species: "Dog",
                breed: "Mixed Breed",
                age: { years: 2, months: 1 },
                gender: "Female",
                description: "Gentle and loving mixed breed looking for her forever home. Great with children and other pets. Vaccinated and spayed.",
                photos: [
                    "https://kimi-web-img.moonshot.cn/img/greenfamilyvet.com/594bb86719060eb25b8abc5ca519e3ce32c16fd1.jpg"
                ],
                shelter: "Happy Tails Rescue - Nairobi",
                adoptionFee: 8500,
                isSpayedNeutered: true,
                isVaccinated: true,
                status: "available"
            },
            {
                id: 2,
                name: "Oliver",
                species: "Cat",
                breed: "Tabby",
                age: { years: 1, months: 8 },
                gender: "Male",
                description: "Playful and curious tabby kitten. Loves to play with toys and cuddle with humans. Perfect for families.",
                photos: [
                    "https://kimi-web-img.moonshot.cn/img/www.dailypaws.com/b68bc9902f47dc70f3ce7e9b91177189f2a29a36.jpg"
                ],
                shelter: "Purrfect Haven - Mombasa",
                adoptionFee: 6500,
                isSpayedNeutered: true,
                isVaccinated: true,
                status: "available"
            },
            {
                id: 3,
                name: "Rex",
                species: "Dog",
                breed: "German Shepherd",
                age: { years: 4, months: 3 },
                gender: "Male",
                description: "Loyal and protective German Shepherd. Excellent guard dog and family companion. Well-trained.",
                photos: [
                    "https://kimi-web-img.moonshot.cn/img/images.squarespace-cdn.com/9b3e2b5b8f7c1a2c3d4e5f6a7b8c9d0e1f2a3b4.jpg"
                ],
                shelter: "Guardian Angels Rescue - Nakuru",
                adoptionFee: 12000,
                isSpayedNeutered: true,
                isVaccinated: true,
                status: "available"
            },
            {
                id: 4,
                name: "Whiskers",
                species: "Cat",
                breed: "Persian",
                age: { years: 3, months: 0 },
                gender: "Female",
                description: "Elegant Persian cat with beautiful long fur. Calm and affectionate lap cat. Great for apartments.",
                photos: [
                    "https://kimi-web-img.moonshot.cn/img/www.catster.com/8b7c6d5e4f3a2b1c9d8e7f6a5b4c3d2e1f0a9b8.jpg"
                ],
                shelter: "Furry Friends Sanctuary - Kisumu",
                adoptionFee: 9500,
                isSpayedNeutered: true,
                isVaccinated: true,
                status: "available"
            },
            {
                id: 5,
                name: "Simba",
                species: "Dog",
                breed: "Local Breed",
                age: { years: 1, months: 6 },
                gender: "Male",
                description: "Energetic young dog with lots of love to give. Great with kids and loves outdoor activities.",
                photos: [
                    "https://kimi-web-img.moonshot.cn/img/local-dog-kenya.jpg"
                ],
                shelter: "Kenya Animal Shelter - Eldoret",
                adoptionFee: 7500,
                isSpayedNeutered: true,
                isVaccinated: true,
                status: "available"
            },
            {
                id: 6,
                name: "Luna",
                species: "Cat",
                breed: "Siamese Mix",
                age: { years: 2, months: 4 },
                gender: "Female",
                description: "Beautiful Siamese mix with striking blue eyes. Very vocal and loves attention. Good with other cats.",
                photos: [
                    "https://kimi-web-img.moonshot.cn/img/siamese-cat-kenya.jpg"
                ],
                shelter: "Nairobi Cat Rescue",
                adoptionFee: 7200,
                isSpayedNeutered: true,
                isVaccinated: true,
                status: "available"
            }
        ];

        // Sample shop products - Kenyan market prices in KES
        this.shopProducts = [
            {
                id: 1,
                name: "Premium Dog Food (5kg)",
                category: "Food",
                price: 2850,
                image: "https://kimi-web-img.moonshot.cn/img/www.petmd.com/sites/default/files/styles/article_image/public/2021-01/premium-dog-food.jpg",
                description: "High-quality protein-rich dog food for optimal health - Made in Kenya",
                rating: 4.8,
                inStock: true
            },
            {
                id: 2,
                name: "Interactive Cat Toy",
                category: "Toys",
                price: 1200,
                image: "https://kimi-web-img.moonshot.cn/img/www.petmd.com/7e8f9a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0.jpg",
                description: "Keep your cat entertained for hours with this interactive toy",
                rating: 4.6,
                inStock: true
            },
            {
                id: 3,
                name: "Comfortable Pet Bed",
                category: "Bedding",
                price: 4200,
                image: "https://kimi-web-img.moonshot.cn/img/images-iherb.com/1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0.jpg",
                description: "Orthopedic memory foam bed for ultimate comfort - Suitable for Kenyan climate",
                rating: 4.9,
                inStock: true
            },
            {
                id: 4,
                name: "Pet Grooming Kit",
                category: "Grooming",
                price: 1800,
                image: "https://kimi-web-img.moonshot.cn/img/petco.com/9f8e7d6c5b4a39281716051436581567a9b8c7d.jpg",
                description: "Complete grooming set for at-home pet care - Professional quality",
                rating: 4.5,
                inStock: true
            },
            {
                id: 5,
                name: "Premium Cat Food (3kg)",
                category: "Food",
                price: 1950,
                image: "https://kimi-web-img.moonshot.cn/img/cat-food-kenya.jpg",
                description: "Nutritious cat food with local ingredients - Perfect for Kenyan cats",
                rating: 4.7,
                inStock: true
            },
            {
                id: 6,
                name: "Pet Carrier (Airline Approved)",
                category: "Travel",
                price: 6500,
                image: "https://kimi-web-img.moonshot.cn/img/pet-carrier-kenya.jpg",
                description: "Safe and comfortable pet carrier for travel - Meets international standards",
                rating: 4.8,
                inStock: true
            },
            {
                id: 7,
                name: "Pet Vitamins & Supplements",
                category: "Health",
                price: 850,
                image: "https://kimi-web-img.moonshot.cn/img/pet-vitamins-kenya.jpg",
                description: "Essential vitamins for healthy pets - Veterinary recommended",
                rating: 4.6,
                inStock: true
            },
            {
                id: 8,
                name: "Pet Training Pads (30pcs)",
                category: "Training",
                price: 750,
                image: "https://kimi-web-img.moonshot.cn/img/training-pads-kenya.jpg",
                description: "Absorbent training pads for puppies - Easy cleanup solution",
                rating: 4.4,
                inStock: true
            }
        ];

        // Sample forum posts
        this.forumPosts = [
            {
                id: 1,
                title: "Best food for senior dogs?",
                author: "Sarah M.",
                content: "My 12-year-old golden retriever is getting picky with food. Any recommendations?",
                category: "Nutrition",
                replies: 15,
                likes: 23,
                timestamp: "2 hours ago",
                avatar: "👩"
            },
            {
                id: 2,
                title: "Cat won't stop scratching furniture",
                author: "Mike T.",
                content: "Help! My cat has destroyed three couches. What can I do?",
                category: "Behavior",
                replies: 28,
                likes: 45,
                timestamp: "5 hours ago",
                avatar: "👨"
            },
            {
                id: 3,
                title: "Introducing new puppy to older dog",
                author: "Lisa K.",
                content: "Tips for smooth introduction between new puppy and resident senior dog?",
                category: "Training",
                replies: 12,
                likes: 18,
                timestamp: "1 day ago",
                avatar: "👵"
            }
        ];

        // Initialize notifications
        this.notifications = [
            {
                id: 1,
                type: "reminder",
                title: "Vaccination Due",
                message: "Luna's rabies vaccination is due next week.",
                timestamp: "30 minutes ago",
                isRead: false
            },
            {
                id: 2,
                type: "update",
                title: "New Message",
                message: "Dr. Smith sent you Luna's test results.",
                timestamp: "2 hours ago",
                isRead: false
            },
            {
                id: 3,
                type: "adoption",
                title: "New Adoption Listing",
                message: "A new puppy is available for adoption near you!",
                timestamp: "1 day ago",
                isRead: true
            }
        ];
    }

    setupEventListeners() {
        // Navigation
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                this.navigateToPage(e.target.getAttribute('data-page'));
            }

            // Pet card interactions
            if (e.target.matches('.adopt-btn')) {
                const petId = e.target.getAttribute('data-pet-id');
                this.handleAdoption(petId);
            }

            if (e.target.matches('.view-pet-btn')) {
                const petId = e.target.getAttribute('data-pet-id');
                this.showPetDetails(petId);
            }

            // Shop interactions
            if (e.target.matches('.add-to-cart-btn')) {
                const productId = e.target.getAttribute('data-product-id');
                this.addToCart(productId);
            }

            // Modal close
            if (e.target.matches('.modal-close') || e.target.matches('.modal-overlay')) {
                this.closeModal();
            }

            // Notification interactions
            if (e.target.matches('.notification-item')) {
                const notificationId = e.target.getAttribute('data-notification-id');
                this.markNotificationAsRead(notificationId);
            }

            // Theme toggle
            if (e.target.matches('#theme-toggle')) {
                this.toggleTheme();
            }

            // Logout
            if (e.target.matches('#logout-btn')) {
                this.handleLogout();
            }
        });

        // Form submissions
        document.addEventListener('submit', async (e) => {
            if (e.target.matches('#appointment-form')) {
                e.preventDefault();
                await this.handleAppointmentBooking(e.target);
            }

            if (e.target.matches('#contact-form')) {
                e.preventDefault();
                await this.handleContactForm(e.target);
            }

            if (e.target.matches('#adoption-form')) {
                e.preventDefault();
                await this.handleAdoptionForm(e.target);
            }
        });

        // Search functionality
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    initializeAnimations() {
        // Initialize anime.js animations
        if (typeof anime !== 'undefined') {
            // Fade in elements on page load
            anime({
                targets: '.fade-in',
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 800,
                delay: anime.stagger(100),
                easing: 'easeOutQuart'
            });

            // Card hover animations
            document.querySelectorAll('.card-hover').forEach(card => {
                card.addEventListener('mouseenter', () => {
                    anime({
                        targets: card,
                        translateY: -8,
                        scale: 1.02,
                        duration: 300,
                        easing: 'easeOutQuart'
                    });
                });

                card.addEventListener('mouseleave', () => {
                    anime({
                        targets: card,
                        translateY: 0,
                        scale: 1,
                        duration: 300,
                        easing: 'easeOutQuart'
                    });
                });
            });

            // Button click animations
            document.querySelectorAll('.btn-animate').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const ripple = document.createElement('span');
                    const rect = btn.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;

                    ripple.style.cssText = `
                        position: absolute;
                        width: ${size}px;
                        height: ${size}px;
                        left: ${x}px;
                        top: ${y}px;
                        background: rgba(255, 255, 255, 0.3);
                        border-radius: 50%;
                        transform: scale(0);
                        pointer-events: none;
                    `;

                    btn.style.position = 'relative';
                    btn.style.overflow = 'hidden';
                    btn.appendChild(ripple);

                    anime({
                        targets: ripple,
                        scale: [0, 2],
                        opacity: [1, 0],
                        duration: 600,
                        easing: 'easeOutQuart',
                        complete: () => ripple.remove()
                    });
                });
            });
        }

        // Initialize Typed.js for hero text
        if (typeof Typed !== 'undefined') {
            const heroTyped = document.getElementById('hero-typed');
            if (heroTyped) {
                new Typed('#hero-typed', {
                    strings: [
                        'Comprehensive Pet Care',
                        'Health Management',
                        'Adoption Services',
                        'Community Support'
                    ],
                    typeSpeed: 50,
                    backSpeed: 30,
                    backDelay: 2000,
                    loop: true,
                    showCursor: true,
                    cursorChar: '|'
                });
            }
        }

        // Initialize Splide carousel
        if (typeof Splide !== 'undefined') {
            const heroCarousel = document.getElementById('hero-carousel');
            if (heroCarousel) {
                new Splide('#hero-carousel', {
                    type: 'loop',
                    autoplay: true,
                    interval: 4000,
                    pauseOnHover: true,
                    arrows: false,
                    pagination: true,
                    speed: 1000,
                    easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
                }).mount();
            }
        }
    }

    initializeKenyaTheme() {
        // Add Kenya-inspired styling enhancements
        document.documentElement.style.setProperty('--kenya-red', '#BB0000');
        document.documentElement.style.setProperty('--kenya-green', '#006600');
        document.documentElement.style.setProperty('--kenya-black', '#000000');
    }

    async loadUserData() {
        // Load current user from localStorage
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateUserInterface();
            
            // Load user's pets if they exist
            if (window.database) {
                try {
                    this.pets = await window.database.getPets(this.currentUser.id);
                } catch (error) {
                    console.error('Error loading pets:', error);
                }
            }
        } else {
            // No user logged in, redirect to login
            if (!window.location.pathname.includes('login.html')) {
                window.location.href = 'login.html';
            }
        }
    }

    updateUserInterface() {
        // Update user name and avatar in the interface
        const userNameElements = document.querySelectorAll('.user-name');
        const userAvatarElements = document.querySelectorAll('.user-avatar');

        userNameElements.forEach(el => {
            el.textContent = this.currentUser.name || 'User';
        });

        userAvatarElements.forEach(el => {
            el.textContent = this.currentUser.avatar || '👤';
        });
    }

    setupUserDropdown() {
        const userDropdownToggle = document.getElementById('user-dropdown-toggle');
        const userDropdown = document.getElementById('user-dropdown');
        const logoutBtn = document.getElementById('logout-btn');
        const themeToggle = document.getElementById('theme-toggle');

        if (userDropdownToggle && userDropdown) {
            userDropdownToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('hidden');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                userDropdown.classList.add('hidden');
            });

            // Prevent dropdown from closing when clicking inside
            userDropdown.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Setup logout button
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await this.handleLogout();
            });
        }

        // Setup theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleTheme();
            });
        }
    }

    initializeTheme() {
        // Load theme from localStorage
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.currentTheme = savedTheme;
        this.applyTheme(savedTheme);
    }

    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.currentTheme = newTheme;
        this.applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme button text
        const themeText = document.getElementById('theme-text');
        if (themeText) {
            themeText.textContent = newTheme === 'light' ? 'Dark Mode' : 'Light Mode';
        }
    }

    applyTheme(theme) {
        const root = document.documentElement;
        
        if (theme === 'dark') {
            root.classList.add('dark');
            // Update CSS variables for dark theme
            root.style.setProperty('--bg-primary', '#1F3A2E');
            root.style.setProperty('--bg-secondary', '#2D3748');
            root.style.setProperty('--text-primary', '#F7F5F3');
            root.style.setProperty('--text-secondary', '#8FA68E');
        } else {
            root.classList.remove('dark');
            // Update CSS variables for light theme
            root.style.setProperty('--bg-primary', '#F7F5F3');
            root.style.setProperty('--bg-secondary', '#ffffff');
            root.style.setProperty('--text-primary', '#1F3A2E');
            root.style.setProperty('--text-secondary', '#2D3748');
        }
    }

    navigateToPage(page) {
        // Handle navigation between pages
        const currentPage = window.location.pathname.split('/').pop() || 'home.html';
        
        if (page !== currentPage) {
            // Add page transition animation
            if (typeof anime !== 'undefined') {
                anime({
                    targets: 'main',
                    opacity: [1, 0],
                    duration: 300,
                    easing: 'easeInQuart',
                    complete: () => {
                        window.location.href = page;
                    }
                });
            } else {
                window.location.href = page;
            }
        }
    }

    handleAdoption(petId) {
        const pet = this.adoptionListings.find(p => p.id == petId);
        if (pet) {
            // Show adoption confirmation modal
            this.showAdoptionModal(pet);
        }
    }

    showAdoptionModal(pet) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="modal-content bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                <div class="text-center mb-6">
                    <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-sage/20 flex items-center justify-center">
                        <span class="text-4xl">🐾</span>
                    </div>
                    <h3 class="font-display text-2xl font-semibold text-forest mb-2">Adopt ${pet.name}</h3>
                    <p class="text-charcoal/70">You're about to start the adoption process for this wonderful pet!</p>
                </div>
                
                <div class="space-y-4 mb-6">
                    <div class="bg-cream/50 rounded-lg p-4">
                        <h4 class="font-semibold text-forest mb-2">Pet Details</h4>
                        <div class="space-y-1 text-sm text-charcoal/70">
                            <p><span class="font-medium">Name:</span> ${pet.name}</p>
                            <p><span class="font-medium">Breed:</span> ${pet.breed}</p>
                            <p><span class="font-medium">Age:</span> ${pet.age.years} years ${pet.age.months} months</p>
                            <p><span class="font-medium">Adoption Fee:</span> $${pet.adoptionFee}</p>
                        </div>
                    </div>
                    
                    <div class="bg-cream/50 rounded-lg p-4">
                        <h4 class="font-semibold text-forest mb-2">Next Steps</h4>
                        <ol class="text-sm text-charcoal/70 space-y-1 list-decimal list-inside">
                            <li>Complete adoption application</li>
                            <li>Schedule meet & greet</li>
                            <li>Home inspection</li>
                            <li>Finalize adoption</li>
                        </ol>
                    </div>
                </div>
                
                <div class="flex space-x-3">
                    <button class="modal-close flex-1 py-3 px-4 bg-sage/20 text-charcoal rounded-lg font-medium hover:bg-sage/30 transition-colors">
                        Cancel
                    </button>
                    <button class="flex-1 py-3 px-4 bg-kenya-green text-white rounded-lg font-medium hover:bg-kenya-red transition-colors" onclick="petCare.startAdoptionProcess('${pet.id}')">
                        Start Adoption
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate modal appearance
        if (typeof anime !== 'undefined') {
            anime({
                targets: modal,
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuart'
            });

            anime({
                targets: modal.querySelector('.modal-content'),
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 400,
                delay: 100,
                easing: 'easeOutQuart'
            });
        }
    }

    startAdoptionProcess(petId) {
        const pet = this.adoptionListings.find(p => p.id == petId);
        if (pet && this.currentUser) {
            // Show adoption form modal
            this.showAdoptionForm(pet);
        } else {
            this.showToast('Please log in to start the adoption process.', 'error');
        }
        this.closeModal();
    }

    showAdoptionForm(pet) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="modal-content bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-display text-2xl font-semibold text-forest">Adoption Application - ${pet.name}</h3>
                    <button class="modal-close text-charcoal/60 hover:text-charcoal">✕</button>
                </div>
                
                <form id="adoption-form" class="space-y-4">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-charcoal mb-2">First Name *</label>
                            <input type="text" name="firstName" required class="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-kenya-green focus:border-transparent outline-none">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-charcoal mb-2">Last Name *</label>
                            <input type="text" name="lastName" required class="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-kenya-green focus:border-transparent outline-none">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-charcoal mb-2">Email Address *</label>
                        <input type="email" name="email" value="${this.currentUser.email}" required class="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-kenya-green focus:border-transparent outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-charcoal mb-2">Phone Number *</label>
                        <input type="tel" name="phone" required class="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-kenya-green focus:border-transparent outline-none">
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-charcoal mb-2">Address *</label>
                        <textarea name="address" required rows="3" class="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-kenya-green focus:border-transparent outline-none" placeholder="Your complete address"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-charcoal mb-2">Housing Type *</label>
                        <select name="housingType" required class="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-kenya-green focus:border-transparent outline-none">
                            <option value="">Select housing type</option>
                            <option value="house-with-yard">House with yard</option>
                            <option value="house-no-yard">House without yard</option>
                            <option value="apartment">Apartment</option>
                            <option value="condo">Condo</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-charcoal mb-2">Do you have other pets? *</label>
                        <div class="flex space-x-4">
                            <label class="flex items-center">
                                <input type="radio" name="hasOtherPets" value="yes" required class="mr-2">
                                <span>Yes</span>
                            </label>
                            <label class="flex items-center">
                                <input type="radio" name="hasOtherPets" value="no" required class="mr-2">
                                <span>No</span>
                            </label>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-charcoal mb-2">Experience with pets *</label>
                        <select name="petExperience" required class="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-kenya-green focus:border-transparent outline-none">
                            <option value="">Select experience level</option>
                            <option value="first-time">First time pet owner</option>
                            <option value="some-experience">Some experience</option>
                            <option value="very-experienced">Very experienced</option>
                            <option value="professional">Professional/Veterinarian</option>
                        </select>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-charcoal mb-2">Why do you want to adopt this pet? *</label>
                        <textarea name="reason" required rows="4" class="w-full px-4 py-2 border border-sage/30 rounded-lg focus:ring-2 focus:ring-kenya-green focus:border-transparent outline-none" placeholder="Tell us why you'd be a great pet parent..."></textarea>
                    </div>
                    
                    <div class="bg-sage/10 rounded-lg p-4">
                        <h4 class="font-semibold text-forest mb-2">Agreement</h4>
                        <div class="space-y-2 text-sm text-charcoal/70">
                            <label class="flex items-start">
                                <input type="checkbox" name="agreement1" required class="mt-1 mr-2">
                                <span>I agree to provide proper care, nutrition, and medical attention for this pet.</span>
                            </label>
                            <label class="flex items-start">
                                <input type="checkbox" name="agreement2" required class="mt-1 mr-2">
                                <span>I understand that this pet may require training and patience.</span>
                            </label>
                            <label class="flex items-start">
                                <input type="checkbox" name="agreement3" required class="mt-1 mr-2">
                                <span>I agree to allow follow-up visits from the shelter.</span>
                            </label>
                        </div>
                    </div>
                    
                    <div class="flex space-x-3 pt-4">
                        <button type="button" class="modal-close flex-1 py-3 px-4 bg-sage/20 text-charcoal rounded-lg font-medium hover:bg-sage/30 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" class="flex-1 py-3 px-4 bg-kenya-green text-white rounded-lg font-medium hover:bg-kenya-red transition-colors">
                            Submit Application
                        </button>
                    </div>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate modal appearance
        if (typeof anime !== 'undefined') {
            anime({
                targets: modal,
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuart'
            });

            anime({
                targets: modal.querySelector('.modal-content'),
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 400,
                delay: 100,
                easing: 'easeOutQuart'
            });
        }
    }

    async handleAdoptionForm(form) {
        const formData = new FormData(form);
        const applicationData = {
            petName: formData.get('petName') || 'Unspecified',
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            housingType: formData.get('housingType'),
            hasOtherPets: formData.get('hasOtherPets'),
            petExperience: formData.get('petExperience'),
            reason: formData.get('reason')
        };

        // Save adoption application
        if (window.database && this.currentUser) {
            try {
                await window.database.submitAdoptionApplication(applicationData, this.currentUser.id);
                this.showToast('Adoption application submitted successfully!', 'success');
            } catch (error) {
                this.showToast('Error submitting application. Please try again.', 'error');
            }
        } else {
            this.showToast('Adoption application submitted! (Demo mode)', 'success');
        }

        this.closeModal();
    }

    showPetDetails(petId) {
        const pet = this.adoptionListings.find(p => p.id == petId);
        if (pet) {
            // Create and show pet details modal
            this.showPetDetailsModal(pet);
        }
    }

    showPetDetailsModal(pet) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay fixed inset-0 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="modal-content bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div class="relative">
                    <img src="${pet.photos[0]}" alt="${pet.name}" class="w-full h-64 object-cover rounded-t-2xl">
                    <button class="modal-close absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                        ✕
                    </button>
                </div>
                
                <div class="p-6">
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="font-display text-2xl font-semibold text-forest mb-1">${pet.name}</h3>
                            <p class="text-charcoal/70">${pet.breed} • ${pet.age.years}y ${pet.age.months}m • ${pet.gender}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-2xl font-bold text-kenya-green">$${pet.adoptionFee}</p>
                            <p class="text-sm text-charcoal/70">Adoption Fee</p>
                        </div>
                    </div>
                    
                    <div class="space-y-4 mb-6">
                        <div>
                            <h4 class="font-semibold text-forest mb-2">About ${pet.name}</h4>
                            <p class="text-charcoal/70 leading-relaxed">${pet.description}</p>
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-cream/50 rounded-lg p-3">
                                <p class="text-sm text-charcoal/70 mb-1">Spayed/Neutered</p>
                                <p class="font-semibold text-forest">${pet.isSpayedNeutered ? 'Yes' : 'No'}</p>
                            </div>
                            <div class="bg-cream/50 rounded-lg p-3">
                                <p class="text-sm text-charcoal/70 mb-1">Vaccinated</p>
                                <p class="font-semibold text-forest">${pet.isVaccinated ? 'Yes' : 'No'}</p>
                            </div>
                        </div>
                        
                        <div class="bg-cream/50 rounded-lg p-4">
                            <h4 class="font-semibold text-forest mb-2">Shelter Information</h4>
                            <p class="text-charcoal/70">${pet.shelter}</p>
                            <p class="text-sm text-charcoal/70 mt-1">Contact for more information and to schedule a visit.</p>
                        </div>
                    </div>
                    
                    <button class="w-full py-3 px-4 bg-kenya-green text-white rounded-lg font-medium hover:bg-kenya-red transition-colors" onclick="petCare.handleAdoption('${pet.id}')">
                        Adopt ${pet.name}
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Animate modal appearance
        if (typeof anime !== 'undefined') {
            anime({
                targets: modal,
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuart'
            });

            anime({
                targets: modal.querySelector('.modal-content'),
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 400,
                delay: 100,
                easing: 'easeOutQuart'
            });
        }
    }

    async addToCart(productId) {
        const product = this.shopProducts.find(p => p.id == productId);
        if (product && this.currentUser) {
            // Add to cart using database
            if (window.database) {
                try {
                    await window.database.addToCart(this.currentUser.id, productId);
                    this.updateCartCounter();
                    this.showToast(`${product.name} added to cart!`, 'success');
                } catch (error) {
                    this.showToast('Error adding to cart. Please try again.', 'error');
                }
            }
        } else if (!this.currentUser) {
            this.showToast('Please log in to add items to cart.', 'error');
        }
    }

    async updateCartCounter() {
        if (this.currentUser && window.database) {
            try {
                const cart = await window.database.getCart(this.currentUser.id);
                const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
                
                const counter = document.getElementById('cart-counter');
                if (counter) {
                    counter.textContent = totalItems;
                    counter.style.display = totalItems > 0 ? 'block' : 'none';
                }
            } catch (error) {
                console.error('Error updating cart counter:', error);
            }
        }
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            if (typeof anime !== 'undefined') {
                anime({
                    targets: modal,
                    opacity: [1, 0],
                    duration: 300,
                    easing: 'easeInQuart',
                    complete: () => modal.remove()
                });
            } else {
                modal.remove();
            }
        }
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
        
        toast.className = `fixed top-4 right-4 z-50 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg transform translate-x-full transition-transform duration-300`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.classList.remove('translate-x-full');
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            toast.classList.add('translate-x-full');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    async handleLogout() {
        // Clear user data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        
        // Show logout message
        this.showToast('Logged out successfully!', 'success');
        
        // Redirect to login page
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
    }

    startNotificationSystem() {
        // Simulate receiving new notifications
        setInterval(() => {
            if (Math.random() < 0.1) { // 10% chance every interval
                this.addRandomNotification();
            }
        }, 30000); // Check every 30 seconds
    }

    addRandomNotification() {
        const notificationTypes = [
            { type: 'reminder', title: 'Appointment Reminder', message: 'Don\'t forget your pet\'s appointment tomorrow!' },
            { type: 'update', title: 'New Feature', message: 'Check out our new pet tracking feature!' },
            { type: 'community', title: 'New Forum Post', message: 'Someone replied to your forum post.' }
        ];
        
        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
        this.addNotification({
            ...randomNotification,
            isRead: false,
            timestamp: 'Just now'
        });
    }

    addNotification(notification) {
        const newNotification = {
            id: Date.now(),
            ...notification
        };
        
        this.notifications.unshift(newNotification);
        this.updateNotificationBadge();
        
        // Show toast for new notification
        this.showToast(notification.title, 'info');
    }

    updateNotificationBadge() {
        const unreadCount = this.notifications.filter(n => !n.isRead).length;
        const badge = document.getElementById('notification-badge');
        
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }

    markNotificationAsRead(notificationId) {
        const notification = this.notifications.find(n => n.id == notificationId);
        if (notification) {
            notification.isRead = true;
            this.updateNotificationBadge();
        }
    }

    handleSearch(query) {
        // Implement search functionality
        console.log('Searching for:', query);
        // This would typically filter content based on the search query
    }

    async handleAppointmentBooking(form) {
        // Handle appointment booking
        const formData = new FormData(form);
        const appointment = {
            id: Date.now(),
            petName: formData.get('pet-name'),
            service: formData.get('service'),
            date: formData.get('date'),
            time: formData.get('time'),
            veterinarian: formData.get('veterinarian'),
            notes: formData.get('notes')
        };
        
        this.appointments.push(appointment);
        
        if (window.database) {
            try {
                await window.database.bookAppointment(appointment);
                this.showToast('Appointment booked successfully!', 'success');
            } catch (error) {
                this.showToast('Error booking appointment. Please try again.', 'error');
            }
        }
        
        form.reset();
    }

    async handleContactForm(form) {
        // Handle contact form submission
        if (window.database) {
            try {
                // This would send to API
                this.showToast('Message sent successfully!', 'success');
            } catch (error) {
                this.showToast('Error sending message. Please try again.', 'error');
            }
        }
        form.reset();
    }

    showAddPetForm() {
        const modal = document.getElementById('add-pet-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Animate modal appearance
            anime({
                targets: modal,
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutQuart'
            });

            anime({
                targets: modal.querySelector('.modal-content'),
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 400,
                delay: 100,
                easing: 'easeOutQuart'
            });
        }
    }

    hideAddPetForm() {
        const modal = document.getElementById('add-pet-modal');
        if (modal) {
            anime({
                targets: modal,
                opacity: [1, 0],
                duration: 200,
                easing: 'easeInQuart',
                complete: () => {
                    modal.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    }

    async handleAddPetForm(form) {
        // Validate required fields
        const requiredFields = ['pet-name', 'pet-species', 'pet-location'];
        let isValid = true;
        
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                field.classList.add('border-red-500');
                isValid = false;
            } else {
                field.classList.remove('border-red-500');
            }
        });

        if (!isValid) {
            this.showToast('Please fill in all required fields', 'error');
            return;
        }

        // Create pet object from form data
        const newPet = {
            id: this.generateId(),
            userId: this.currentUser ? this.currentUser.id : 'demo-user',
            name: document.getElementById('pet-name').value,
            species: document.getElementById('pet-species').value,
            breed: document.getElementById('pet-breed').value || 'Mixed Breed',
            gender: document.getElementById('pet-gender').value || 'Unknown',
            age: {
                years: parseInt(document.getElementById('pet-age-years').value) || 0,
                months: parseInt(document.getElementById('pet-age-months').value) || 0
            },
            weight: parseFloat(document.getElementById('pet-weight').value) || 0,
            color: document.getElementById('pet-color').value || 'Not specified',
            location: document.getElementById('pet-location').value,
            phone: document.getElementById('pet-phone').value,
            vaccinationStatus: document.getElementById('pet-vaccinated').value,
            spayedNeutered: document.getElementById('pet-spayed').value,
            medicalNotes: document.getElementById('pet-medical-notes').value,
            additionalNotes: document.getElementById('pet-notes').value,
            profilePicture: this.getDefaultPetImage(document.getElementById('pet-species').value),
            healthRecords: [],
            nextAppointment: null,
            createdAt: new Date().toISOString()
        };

        // Add to pets array
        this.pets.push(newPet);
        
        // Save to database if available
        if (window.database) {
            try {
                await window.database.addPet(newPet);
                this.showToast(`${newPet.name} has been added to your pets!`, 'success');
            } catch (error) {
                this.showToast('Error adding pet. Please try again.', 'error');
            }
        }
        
        // Close modal and reset form
        this.hideAddPetForm();
        form.reset();
    }

    generateId() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    }

    getDefaultPetImage(species) {
        const defaultImages = {
            'Dog': 'https://kimi-web-img.moonshot.cn/img/d3544la1u8djza.cloudfront.net/acea66805b4b70839102add1ea6f98453f5afaa3.jpg',
            'Cat': 'https://kimi-web-img.moonshot.cn/img/www.dailypaws.com/b68bc9902f47dc70f3ce7e9b91177189f2a29a36.jpg',
            'Bird': 'https://kimi-web-img.moonshot.cn/img/www.petdhw.com/7f1c4ebcb73a85fc746c858824666fa7a2cf6d56.png',
            'Rabbit': 'https://kimi-web-img.moonshot.cn/img/example.com/rabbit-placeholder.jpg',
            'Fish': 'https://kimi-web-img.moonshot.cn/img/example.com/fish-placeholder.jpg',
            'Reptile': 'https://kimi-web-img.moonshot.cn/img/example.com/reptile-placeholder.jpg'
        };
        return defaultImages[species] || defaultImages['Dog'];
    }
}

// ==================== INITIALIZATION ====================

// Initialize the platform when DOM is loaded
// ==================== INITIALIZATION ====================

// Initialize the platform when DOM is loaded
let petCare;
window.database = new Database(); // Initialize database immediately

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the main platform logic
    petCare = new PetCarePlatform();
    
    // EXPORT TO WINDOW: This makes 'petCare' available to your HTML buttons
    window.petCare = petCare;

    // Optional: Add specific event listeners for forms that might not exist on all pages
    const addPetForm = document.getElementById('add-pet-form');
    if (addPetForm) {
        addPetForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            await petCare.handleAddPetForm(addPetForm);
        });
    }
});