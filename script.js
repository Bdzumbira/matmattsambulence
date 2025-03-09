// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyA-PeH-6MpagKf1hzSanIuHE4RBvSv057U",
    authDomain: "matmats-686b8.firebaseapp.com",
    databaseURL: "https://matmats-686b8-default-rtdb.firebaseio.com",
    projectId: "matmats-686b8",
    storageBucket: "matmats-686b8.firebasestorage.app",
    messagingSenderId: "368439172534",
    appId: "1:368439172534:web:ac6a1c94dae5a411f2b517",
    measurementId: "G-HGXQ0PPE7H"
};

// Initialize Firebase
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log('Firebase initialized successfully');
    } else {
        console.log('Firebase already initialized');
    }
} catch (error) {
    console.error('Firebase initialization error:', error);
}

const database = firebase.database();
const auth = firebase.auth();

// Check if Firebase is initialized
if (!firebase.apps.length) {
    console.error('Firebase is not initialized');
} else {
    console.log('Firebase is initialized');
}

// Check authentication state
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        updateUIForLoggedInUser(user);
    } else {
        // User is signed out
        updateUIForLoggedOutUser();
    }
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

mobileMenuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        navLinks.classList.remove('active');
    }
});

// Get modal elements
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const dashboardModal = document.getElementById('dashboardModal');
const closeButtons = document.querySelectorAll('.close');

// Get buttons
const loginBtn = document.querySelector('.login-btn');
const showRegisterBtn = document.getElementById('showRegister');
const showLoginBtn = document.getElementById('showLogin');
const logoutBtn = document.querySelector('.logout-btn');
const renewBtn = document.querySelector('.renew-btn');

// Show modal function
function showModal(modal) {
    modal.style.display = 'block';
}

// Hide modal function
function hideModal(modal) {
    modal.style.display = 'none';
}

// Close modals when clicking the X button
closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        hideModal(loginModal);
        hideModal(registerModal);
        hideModal(dashboardModal);
    });
});

// Close modals when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === loginModal) hideModal(loginModal);
    if (e.target === registerModal) hideModal(registerModal);
    if (e.target === dashboardModal) hideModal(dashboardModal);
});

// Show login modal when clicking login button
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showModal(loginModal);
});

// Switch between login and register modals
showRegisterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal(loginModal);
    showModal(registerModal);
});

showLoginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    hideModal(registerModal);
    showModal(loginModal);
});

// Handle login form submission
document.querySelector('.login-form').addEventListener('submit', (e) => {
    e.preventDefault();
    // Here you would typically handle authentication
    // For demo purposes, we'll just show the dashboard
    hideModal(loginModal);
    showModal(dashboardModal);
    updateDashboardInfo();
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    hideModal(dashboardModal);
    // Here you would typically handle logout logic
});

// Handle subscription renewal
renewBtn.addEventListener('click', () => {
    // Here you would typically handle renewal logic
    alert('Redirecting to renewal payment...');
});

// Update dashboard information
function updateDashboardInfo() {
    // Get elements
    const nextBillingDate = document.getElementById('nextBillingDate');
    const memberSince = document.getElementById('memberSince');

    // Calculate next billing date (one month from now)
    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);
    nextBillingDate.textContent = nextBilling.toLocaleDateString();

    // Set member since date (current date for demo)
    const membershipDate = new Date();
    memberSince.textContent = membershipDate.toLocaleDateString();
}

// Initialize map
function initMap() {
    // Create map centered on Chiredzi
    const map = L.map('map').setView([-21.033333, 31.666667], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker for MatMats Ambulance location
    L.marker([-21.033333, 31.666667])
        .addTo(map)
        .bindPopup('MatMats Ambulance Services<br>3634 Lion Drive, Chiredzi')
        .openPopup();
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
});

// Login Form Handling
const loginForm = document.querySelector('.login-form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.textContent = 'Logging in...';
        submitBtn.disabled = true;

        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                hideModal(loginModal);
                // Check if user is admin
                database.ref('admins').child(userCredential.user.uid).once('value')
                    .then(snapshot => {
                        if (snapshot.exists()) {
                            showAdminDashboard(userCredential.user);
                        } else {
                            showUserDashboard(userCredential.user);
                        }
                    });
            })
            .catch((error) => {
                alert('Login failed: ' + error.message);
            })
            .finally(() => {
                submitBtn.textContent = 'Login';
                submitBtn.disabled = false;
            });
    });
}

// Forgot Password Handling
const forgotPassword = document.querySelector('.forgot-password');
if (forgotPassword) {
    forgotPassword.addEventListener('click', () => {
        const email = prompt('Please enter your email address:');
        if (email) {
            auth.sendPasswordResetEmail(email)
                .then(() => {
                    alert('Password reset email sent! Please check your inbox.');
                })
                .catch((error) => {
                    alert('Error sending password reset email: ' + error.message);
                });
        }
    });
}

// Subscription Form Handling
const subscribeBtn = document.querySelector('.subscribe-btn');
if (subscribeBtn) {
    subscribeBtn.addEventListener('click', async () => {
        console.log('Subscribe button clicked'); // Debug log

        const user = auth.currentUser;
        if (!user) {
            alert('Please log in to subscribe');
            showModal(loginModal);
            return;
        }

        const paymentForm = document.getElementById('payment-form');
        
        // Show payment form if not already visible
        if (paymentForm.style.display === 'none' || !paymentForm.style.display) {
            console.log('Showing payment form'); // Debug log
            paymentForm.style.display = 'block';
            subscribeBtn.textContent = 'Confirm Payment';
            return;
        }

        // Get EcoCash reference number
        const referenceNumber = document.getElementById('ecocash-reference').value;
        if (!referenceNumber) {
            alert('Please enter the EcoCash reference number');
            return;
        }

        // Disable the submit button to prevent multiple clicks
        subscribeBtn.disabled = true;
        subscribeBtn.textContent = 'Processing...';

        try {
            console.log('Processing subscription with reference:', referenceNumber); // Debug log

            // Save subscription data to Firebase
            const subscriptionData = {
                userId: user.uid,
                userEmail: user.email,
                paymentMethod: 'EcoCash',
                referenceNumber: referenceNumber,
                amount: 1, // $1
                status: 'pending',
                startDate: new Date().toISOString(),
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
                createdAt: new Date().toISOString()
            };

            // Save to Firebase
            await database.ref('subscriptions').push(subscriptionData);
            console.log('Subscription saved to Firebase'); // Debug log

            // Hide payment form
            paymentForm.style.display = 'none';
            
            // Reset button
            subscribeBtn.textContent = 'Subscribe Now';
            subscribeBtn.disabled = false;
            
            // Show success message and update dashboard
            alert('Thank you for subscribing! Your payment will be verified shortly.');
            showUserDashboard(user);

        } catch (error) {
            console.error('Error processing subscription:', error);
            alert('There was an error processing your subscription. Please try again later.');
            subscribeBtn.disabled = false;
            subscribeBtn.textContent = 'Confirm Payment';
        }
    });
} else {
    console.error('Subscribe button not found'); // Debug log
}

// Emergency Alerts Opt-in
const optInBtn = document.querySelector('.opt-in-btn');
if (optInBtn) {
    optInBtn.addEventListener('click', () => {
        const user = auth.currentUser;
        if (!user) {
            alert('Please log in to opt-in for alerts');
            showModal(loginModal);
            return;
        }

        const alertData = {
            userId: user.uid,
            timestamp: new Date().toISOString(),
            preferences: {
                roadClosures: true,
                trafficIncidents: true,
                weatherConditions: true,
                responseTimes: true
            }
        };

        database.ref('alertPreferences').push(alertData)
            .then(() => {
                alert('Alert preferences saved successfully!');
            })
            .catch(error => {
                console.error('Error saving alert preferences:', error);
                alert('There was an error saving your preferences. Please try again later.');
            });
    });
}

// User Dashboard
function showUserDashboard(user) {
    const dashboardHtml = `
        <div class="dashboard">
            <h2>Welcome, ${user.email}</h2>
            <div class="subscription-info">
                <h3>Your Subscription</h3>
                <div id="subscriptionStatus"></div>
            </div>
            <button class="logout-btn">Logout</button>
        </div>
    `;

    // Create and show dashboard modal
    const dashboardModal = document.createElement('div');
    dashboardModal.className = 'modal';
    dashboardModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            ${dashboardHtml}
        </div>
    `;
    document.body.appendChild(dashboardModal);
    dashboardModal.style.display = 'block';

    // Close dashboard modal
    const closeBtn = dashboardModal.querySelector('.close');
    closeBtn.onclick = () => {
        dashboardModal.remove();
    };

    // Logout button
    const logoutBtn = dashboardModal.querySelector('.logout-btn');
    logoutBtn.onclick = () => {
        auth.signOut();
        dashboardModal.remove();
    };

    // Load subscription status
    loadSubscriptionStatus(user.uid);
}

// Load subscription status
function loadSubscriptionStatus(userId) {
    database.ref('subscriptions').orderByChild('userId').equalTo(userId).once('value')
        .then(snapshot => {
            const subscriptionStatus = document.getElementById('subscriptionStatus');
            if (snapshot.exists()) {
                const subscription = Object.values(snapshot.val())[0];
                const endDate = new Date(subscription.endDate);
                const today = new Date();
                const daysLeft = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

                if (daysLeft > 0) {
                    subscriptionStatus.innerHTML = `
                        <p>Status: Active</p>
                        <p>Days remaining: ${daysLeft}</p>
                        <button class="renew-btn">Renew Subscription</button>
                    `;

                    // Renew subscription button
                    const renewBtn = subscriptionStatus.querySelector('.renew-btn');
                    renewBtn.onclick = () => {
                        const newSubscriptionData = {
                            userId: userId,
                            startDate: new Date().toISOString(),
                            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                            status: 'active'
                        };

                        database.ref('subscriptions').push(newSubscriptionData)
                            .then(() => {
                                alert('Subscription renewed successfully!');
                                loadSubscriptionStatus(userId);
                            })
                            .catch(error => {
                                console.error('Error renewing subscription:', error);
                                alert('There was an error renewing your subscription. Please try again later.');
                            });
                    };
                } else {
                    subscriptionStatus.innerHTML = `
                        <p>Status: Expired</p>
                        <button class="renew-btn">Renew Subscription</button>
                    `;
                }
            } else {
                subscriptionStatus.innerHTML = `
                    <p>No active subscription</p>
                    <button class="subscribe-btn">Subscribe Now</button>
                `;
            }
        });
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = 'My Account';
    }
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = 'Login';
    }
}

// Statistics Counter Animation
const counters = document.querySelectorAll('.counter');

const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const count = parseInt(counter.innerText);
    const increment = target / 100;

    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => animateCounter(counter), 10);
    } else {
        counter.innerText = target;
    }
};

const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            animateCounter(counter);
            observer.unobserve(counter);
        }
    });
};

const counterObserver = new IntersectionObserver(observerCallback, {
    threshold: 0.5
});

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile menu after clicking
        navLinks.classList.remove('active');
    });
});

// Add scroll event listener for header
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        header.style.backgroundColor = '#fff';
        header.style.boxShadow = 'none';
    }
});

// Add animation to service cards on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    observer.observe(card);
});

// Registration Form Handling
const registerForm = document.querySelector('.register-form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Registration form submitted'); // Debug log
        
        const submitBtn = this.querySelector('.submit-btn');
        submitBtn.textContent = 'Registering...';
        submitBtn.disabled = true;

        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        const confirmPassword = this.querySelector('input[type="password"]:last-of-type').value;
        const name = this.querySelector('input[type="text"]').value;

        console.log('Registration attempt with email:', email); // Debug log

        // Validate inputs
        if (!email || !password || !confirmPassword || !name) {
            alert('Please fill in all fields');
            submitBtn.textContent = 'Register';
            submitBtn.disabled = false;
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            submitBtn.textContent = 'Register';
            submitBtn.disabled = false;
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long!');
            submitBtn.textContent = 'Register';
            submitBtn.disabled = false;
            return;
        }

        // Create user account
        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log('User created successfully:', userCredential.user.uid);
                // Update user profile
                return userCredential.user.updateProfile({
                    displayName: name
                });
            })
            .then(() => {
                console.log('Profile updated successfully');
                // Save user data to database
                return database.ref('users/' + auth.currentUser.uid).set({
                    name: name,
                    email: email,
                    createdAt: new Date().toISOString()
                });
            })
            .then(() => {
                console.log('User data saved to database successfully');
                hideModal(registerModal);
                showModal(dashboardModal);
                updateDashboardInfo();
            })
            .catch((error) => {
                console.error('Registration error details:', {
                    code: error.code,
                    message: error.message,
                    stack: error.stack
                });
                
                let errorMessage = 'Registration failed. ';
                
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        errorMessage = 'This email is already registered. Please use a different email or login.';
                        break;
                    case 'auth/invalid-email':
                        errorMessage = 'Please enter a valid email address.';
                        break;
                    case 'auth/operation-not-allowed':
                        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
                        break;
                    case 'auth/weak-password':
                        errorMessage = 'Please choose a stronger password (at least 6 characters).';
                        break;
                    case 'auth/network-request-failed':
                        errorMessage = 'Network error. Please check your internet connection.';
                        break;
                    default:
                        errorMessage = 'Registration failed: ' + error.message;
                }
                
                alert(errorMessage);
            })
            .finally(() => {
                submitBtn.textContent = 'Register';
                submitBtn.disabled = false;
            });
    });
} else {
    console.error('Register form not found');
}

// FAQ Accordion Functionality
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    console.log('Found FAQ items:', faqItems.length); // Debug log

    faqItems.forEach((item, index) => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        
        // Set initial state
        answer.style.display = 'none';
        
        question.addEventListener('click', () => {
            console.log('FAQ clicked:', index); // Debug log
            
            // Close all other FAQs
            faqItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.display = 'none';
                    otherItem.querySelector('.faq-question i').style.transform = 'rotate(0deg)';
                }
            });
            
            // Toggle current FAQ
            const isActive = item.classList.contains('active');
            
            if (isActive) {
                item.classList.remove('active');
                answer.style.display = 'none';
                question.querySelector('i').style.transform = 'rotate(0deg)';
            } else {
                item.classList.add('active');
                answer.style.display = 'block';
                question.querySelector('i').style.transform = 'rotate(180deg)';
            }
        });
    });
});

// EcoCash Transaction ID handling
document.addEventListener('DOMContentLoaded', function() {
    const transactionInput = document.getElementById('ecocash-reference');
    if (transactionInput) {
        // Auto-format input
        transactionInput.addEventListener('input', function(e) {
            let value = e.target.value;
            // Remove any non-alphanumeric characters
            value = value.replace(/[^A-Z0-9]/gi, '');
            // Convert to uppercase
            value = value.toUpperCase();
            // Limit to 12 characters
            value = value.substring(0, 12);
            e.target.value = value;
        });

        // Handle paste event
        transactionInput.addEventListener('paste', function(e) {
            e.preventDefault();
            // Get pasted content
            let paste = (e.clipboardData || window.clipboardData).getData('text');
            // Clean up pasted content
            paste = paste.replace(/[^A-Z0-9]/gi, '').toUpperCase().substring(0, 12);
            // Insert at cursor position
            this.value = paste;
        });

        // Validate format
        transactionInput.addEventListener('change', function() {
            const isValid = /^[A-Z0-9]{12}$/.test(this.value);
            if (!isValid && this.value) {
                this.setCustomValidity('Please enter a valid 12-character Transaction ID');
            } else {
                this.setCustomValidity('');
            }
        });
    }
});

// Admin Dashboard Functionality
function showAdminDashboard(user) {
    // Check if user is admin
    database.ref('admins').child(user.uid).once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                const dashboardHtml = `
                    <div class="admin-dashboard">
                        <h2>Admin Dashboard</h2>
                        <div class="transactions-section">
                            <h3>EcoCash Transactions</h3>
                            <div class="transaction-filters">
                                <select id="statusFilter">
                                    <option value="all">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                            </div>
                            <div id="transactionsList" class="transactions-list">
                                Loading transactions...
                            </div>
                        </div>
                        <button class="logout-btn">Logout</button>
                    </div>
                `;

                // Create and show admin dashboard modal
                const adminModal = document.createElement('div');
                adminModal.className = 'modal';
                adminModal.innerHTML = `
                    <div class="modal-content admin-modal">
                        <span class="close">&times;</span>
                        ${dashboardHtml}
                    </div>
                `;
                document.body.appendChild(adminModal);
                adminModal.style.display = 'block';

                // Close dashboard modal
                const closeBtn = adminModal.querySelector('.close');
                closeBtn.onclick = () => {
                    adminModal.remove();
                };

                // Load transactions
                loadTransactions();

                // Add status filter functionality
                const statusFilter = document.getElementById('statusFilter');
                statusFilter.addEventListener('change', () => {
                    loadTransactions(statusFilter.value);
                });

                // Logout button
                const logoutBtn = adminModal.querySelector('.logout-btn');
                logoutBtn.onclick = () => {
                    auth.signOut();
                    adminModal.remove();
                };
            }
        });
}

// Load and display transactions
function loadTransactions(statusFilter = 'all') {
    const transactionsList = document.getElementById('transactionsList');
    
    database.ref('subscriptions').orderByChild('createdAt').once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                transactionsList.innerHTML = '<p>No transactions found</p>';
                return;
            }

            let transactions = [];
            snapshot.forEach(childSnapshot => {
                const transaction = childSnapshot.val();
                transaction.id = childSnapshot.key;
                transactions.push(transaction);
            });

            // Sort transactions by date (newest first)
            transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            // Filter transactions if needed
            if (statusFilter !== 'all') {
                transactions = transactions.filter(t => t.status === statusFilter);
            }

            // Create transactions HTML
            const transactionsHtml = transactions.map(transaction => `
                <div class="transaction-item ${transaction.status}">
                    <div class="transaction-info">
                        <p><strong>User:</strong> ${transaction.userEmail}</p>
                        <p><strong>Reference:</strong> ${transaction.referenceNumber}</p>
                        <p><strong>Amount:</strong> $${transaction.amount}</p>
                        <p><strong>Date:</strong> ${new Date(transaction.createdAt).toLocaleString()}</p>
                        <p><strong>Status:</strong> ${transaction.status}</p>
                    </div>
                    ${transaction.status === 'pending' ? `
                        <div class="transaction-actions">
                            <button onclick="updateTransactionStatus('${transaction.id}', 'approved')" class="approve-btn">
                                Approve
                            </button>
                            <button onclick="updateTransactionStatus('${transaction.id}', 'rejected')" class="reject-btn">
                                Reject
                            </button>
                        </div>
                    ` : ''}
                </div>
            `).join('');

            transactionsList.innerHTML = transactionsHtml || '<p>No transactions found</p>';
        })
        .catch(error => {
            console.error('Error loading transactions:', error);
            transactionsList.innerHTML = '<p>Error loading transactions. Please try again later.</p>';
        });
}

// Update transaction status
function updateTransactionStatus(transactionId, newStatus) {
    database.ref(`subscriptions/${transactionId}`).update({
        status: newStatus,
        updatedAt: new Date().toISOString()
    })
    .then(() => {
        // Reload transactions after status update
        loadTransactions(document.getElementById('statusFilter').value);
        
        // If approved, update user's subscription status
        if (newStatus === 'approved') {
            database.ref(`subscriptions/${transactionId}`).once('value')
                .then(snapshot => {
                    const subscription = snapshot.val();
                    // Update user's subscription status
                    database.ref(`users/${subscription.userId}/subscription`).update({
                        status: 'active',
                        endDate: subscription.endDate
                    });
                });
        }
    })
    .catch(error => {
        console.error('Error updating transaction:', error);
        alert('Error updating transaction status. Please try again.');
    });
} 