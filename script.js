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
    if (modal) {
        modal.style.display = 'block';
    }
}

// Hide modal function
function hideModal(modal) {
    if (modal) {
        modal.style.display = 'none';
    }
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

// Initialize login button
if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showModal(loginModal);
    });
}

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
document.addEventListener('DOMContentLoaded', () => {
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
                    // Update UI for logged in user
                    updateUIForLoggedInUser(userCredential.user);
                    // Check if user is admin
                    return database.ref('admins').child(userCredential.user.uid).once('value')
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
});

// Handle logout
logoutBtn.addEventListener('click', () => {
    auth.signOut().then(() => {
        hideModal(dashboardModal);
        updateUIForLoggedOutUser();
    });
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
    // Create map centered on Tshovani, Chiredzi
    const map = L.map('map').setView([-21.0297, 31.6615], 15); // Tshovani coordinates with closer zoom

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add marker for MatMats Ambulance location
    L.marker([-21.0297, 31.6615])
        .addTo(map)
        .bindPopup('MatMats Ambulance Services<br>3634 Lion Drive, Tshovani<br>Chiredzi, Zimbabwe')
        .openPopup();
}

// Initialize map when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initMap();
});

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
function handleSubscribeButtonClick(btn) {
    const user = auth.currentUser;
    const plan = btn.getAttribute('data-plan');
    const price = btn.getAttribute('data-price');
    
    if (!user) {
        showModal(loginModal);
        return;
    }

    const paymentForm = document.getElementById('payment-form');
    
    // Show payment form if not already visible
    if (paymentForm.style.display === 'none' || !paymentForm.style.display) {
        // Determine coverage area based on plan and selected tab
        let coverage;
        const selectedTab = document.querySelector('.tab-btn.active').getAttribute('data-tab');
        
        if (selectedTab === 'local') {
            switch(plan.toLowerCase()) {
                case 'basic':
                    coverage = 'Local (Within Chiredzi)';
                    break;
                case 'standard':
                    coverage = 'Regional (Chiredzi and Surrounding Areas)';
                    break;
                case 'premium':
                    coverage = 'National (Anywhere in Zimbabwe)';
                    break;
                default:
                    coverage = 'Local Area';
            }
        } else {
            switch(plan.toLowerCase()) {
                case 'basic':
                    coverage = 'Outside Chiredzi (15KM+ Radius)';
                    break;
                case 'standard':
                    coverage = 'Regional (Outside Chiredzi and Surrounding Areas)';
                    break;
                case 'premium':
                    coverage = 'National (Anywhere in Zimbabwe)';
                    break;
                default:
                    coverage = 'Outside Local Area';
            }
        }

        // Update summary details
        document.getElementById('summary-plan').textContent = plan.charAt(0).toUpperCase() + plan.slice(1) + ' Package';
        document.getElementById('summary-amount').textContent = price;
        document.getElementById('summary-coverage').textContent = coverage;
        
        // Update payment amount in instructions
        const paymentAmount = document.querySelector('.payment-amount');
        if (paymentAmount) {
            paymentAmount.textContent = price;
        }

        // Make EcoCash code clickable
        makeEcoCashCodeClickable();

        paymentForm.style.display = 'block';
        paymentForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Handle payment submission
function handlePaymentSubmission(event) {
    event.preventDefault();
    const user = auth.currentUser;
    if (!user) return;

    const referenceNumber = document.getElementById('ecocash-reference').value;
    const paymentScreenshot = document.getElementById('payment-screenshot').files[0];
    const submitBtn = document.querySelector('.submit-payment-btn');

    if (!referenceNumber || !paymentScreenshot) {
        alert('Please provide both the transaction ID and payment screenshot');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';

    // Upload screenshot to Firebase Storage
    const storageRef = firebase.storage().ref();
    const screenshotRef = storageRef.child(`payment_proofs/${user.uid}/${Date.now()}_${paymentScreenshot.name}`);
    
    screenshotRef.put(paymentScreenshot)
        .then(() => screenshotRef.getDownloadURL())
        .then(screenshotUrl => {
            // Save subscription data
            const subscriptionData = {
                userId: user.uid,
                userEmail: user.email,
                plan: document.getElementById('summary-plan').textContent,
                amount: parseFloat(document.getElementById('summary-amount').textContent),
                coverage: document.getElementById('summary-coverage').textContent,
                paymentMethod: 'EcoCash',
                referenceNumber: referenceNumber,
                paymentProof: screenshotUrl,
                status: 'pending',
                submittedAt: new Date().toISOString()
            };

            return database.ref('subscriptions').push(subscriptionData);
        })
        .then(() => {
            // Show success message
            const statusMsg = document.querySelector('.submission-status');
            statusMsg.style.display = 'block';
            
            // Hide payment form after 3 seconds
            setTimeout(() => {
                document.getElementById('payment-form').style.display = 'none';
            }, 3000);

            alert('Thank you for subscribing! Your payment will be verified shortly.');
        })
        .catch(error => {
            console.error('Error processing subscription:', error);
            alert('There was an error processing your subscription. Please try again.');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit for Approval';
        });
}

// Make EcoCash code clickable
function makeEcoCashCodeClickable() {
    const ecocashCode = document.querySelector('.ecocash-code');
    if (ecocashCode) {
        ecocashCode.innerHTML = `
            <a href="tel:*151*1*0776378872*${document.getElementById('summary-amount').textContent}%23" class="ecocash-link">
                *151*1*0776378872*${document.getElementById('summary-amount').textContent}#
            </a>
            <button class="copy-code-btn" onclick="copyEcoCashCode()">
                <i class="fas fa-copy"></i> Copy Code
            </button>
        `;
    }
}

// Copy EcoCash code to clipboard
function copyEcoCashCode() {
    const amount = document.getElementById('summary-amount').textContent;
    const code = `*151*1*0776378872*${amount}#`;
    
    navigator.clipboard.writeText(code).then(() => {
        const copyBtn = document.querySelector('.copy-code-btn');
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            copyBtn.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code:', err);
        alert('Failed to copy code. Please try manually copying.');
    });
}

// Add click event listeners to all subscribe buttons and payment submission
document.addEventListener('DOMContentLoaded', () => {
    const subscribeButtons = document.querySelectorAll('.subscribe-btn');
    subscribeButtons.forEach(btn => {
        btn.addEventListener('click', () => handleSubscribeButtonClick(btn));
    });

    const submitPaymentBtn = document.querySelector('.submit-payment-btn');
    if (submitPaymentBtn) {
        submitPaymentBtn.addEventListener('click', handlePaymentSubmission);
    }
});

// Show User Dashboard Function
function showUserDashboard(user) {
    const dashboardHtml = `
        <div class="user-dashboard">
            <h2>Welcome, ${user.displayName || user.email}</h2>
            <div class="dashboard-content">
                <div class="subscription-info">
                    <h3>Subscription Details</h3>
                    <p>Member since: <span id="memberSince"></span></p>
                    <p>Next billing date: <span id="nextBillingDate"></span></p>
                </div>
                <div class="dashboard-actions">
                    <button class="renew-btn">Renew Subscription</button>
                    <button class="logout-btn">Logout</button>
                </div>
            </div>
        </div>
    `;

    // Create and show user dashboard modal
    const userModal = document.createElement('div');
    userModal.className = 'modal';
    userModal.id = 'dashboardModal';
    userModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            ${dashboardHtml}
        </div>
    `;
    document.body.appendChild(userModal);
    userModal.style.display = 'block';

    // Close dashboard modal
    const closeBtn = userModal.querySelector('.close');
    closeBtn.onclick = () => {
        userModal.remove();
    };

    // Handle logout
    const logoutBtn = userModal.querySelector('.logout-btn');
    logoutBtn.onclick = () => {
        auth.signOut().then(() => {
            userModal.remove();
            updateUIForLoggedOutUser();
        });
    };

    // Update dashboard information
    updateDashboardInfo();

    // Handle renew subscription
    const renewBtn = userModal.querySelector('.renew-btn');
    renewBtn.onclick = () => {
        userModal.remove();
        const subscribeButtons = document.querySelectorAll('.subscribe-btn');
        if (subscribeButtons.length > 0) {
            subscribeButtons[0].scrollIntoView({ behavior: 'smooth' });
        }
    };
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = 'My Account';
        loginBtn.onclick = (e) => {
            e.preventDefault();
            showUserDashboard(user);
        };
    }

    // Update all subscribe buttons
    const subscribeButtons = document.querySelectorAll('.subscribe-btn');
    subscribeButtons.forEach(btn => {
        if (btn.textContent === 'Login to Subscribe') {
            btn.textContent = 'Subscribe Now';
        }
    });
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    // Reset login button
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = (e) => {
            e.preventDefault();
            showModal(loginModal);
        };
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

// Quotation Form Handling
function showQuotationForm() {
    const quotationHtml = `
        <div class="modal" id="quotationModal">
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Get a Quotation</h2>
                <form id="quotation-form" class="quotation-form">
                    <div class="form-group">
                        <label for="pickup-location">Pickup Location:</label>
                        <input type="text" id="pickup-location" required placeholder="Enter pickup location">
                    </div>
                    <div class="form-group">
                        <label for="destination">Destination:</label>
                        <input type="text" id="destination" required placeholder="Enter destination">
                    </div>
                    <div class="form-group">
                        <label for="service-type">Service Type:</label>
                        <select id="service-type" required>
                            <option value="">Select service type</option>
                            <option value="emergency">Emergency Transport</option>
                            <option value="non-emergency">Non-Emergency Transport</option>
                            <option value="transfer">Hospital Transfer</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="contact-number">Contact Number:</label>
                        <input type="tel" id="contact-number" required placeholder="Enter your phone number">
                    </div>
                    <button type="submit" class="submit-btn">Get Quote</button>
                </form>
                <div id="quotation-result" class="quotation-result" style="display: none;">
                    <h3>Estimated Quote</h3>
                    <div class="quote-details"></div>
                    <button class="subscribe-btn" onclick="handleQuotationSubscribe()">Subscribe Now</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', quotationHtml);
    
    const quotationModal = document.getElementById('quotationModal');
    const closeBtn = quotationModal.querySelector('.close');
    const quotationForm = document.getElementById('quotation-form');

    // Show modal
    quotationModal.style.display = 'block';

    // Close modal when clicking X
    closeBtn.onclick = () => {
        quotationModal.remove();
    };

    // Close modal when clicking outside
    window.onclick = (e) => {
        if (e.target === quotationModal) {
            quotationModal.remove();
        }
    };

    // Handle form submission
    quotationForm.addEventListener('submit', handleQuotationSubmit);
}

// Handle quotation form submission
function handleQuotationSubmit(e) {
    e.preventDefault();
    
    const pickup = document.getElementById('pickup-location').value;
    const destination = document.getElementById('destination').value;
    const serviceType = document.getElementById('service-type').value;
    const contactNumber = document.getElementById('contact-number').value;

    // Calculate base price based on service type
    let basePrice;
    switch(serviceType) {
        case 'emergency':
            basePrice = 50;
            break;
        case 'non-emergency':
            basePrice = 30;
            break;
        case 'transfer':
            basePrice = 40;
            break;
        default:
            basePrice = 30;
    }

    // Save quotation to database
    const quotationData = {
        pickup: pickup,
        destination: destination,
        serviceType: serviceType,
        contactNumber: contactNumber,
        basePrice: basePrice,
        createdAt: new Date().toISOString()
    };

    database.ref('quotations').push(quotationData)
        .then(() => {
            // Show quotation result
            const resultDiv = document.getElementById('quotation-result');
            const detailsDiv = resultDiv.querySelector('.quote-details');
            
            detailsDiv.innerHTML = `
                <p><strong>Service Type:</strong> ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}</p>
                <p><strong>From:</strong> ${pickup}</p>
                <p><strong>To:</strong> ${destination}</p>
                <p><strong>Estimated Base Price:</strong> $${basePrice}</p>
                <p class="note">* Final price may vary based on distance and additional services required</p>
            `;
            
            // Hide form and show result
            document.getElementById('quotation-form').style.display = 'none';
            resultDiv.style.display = 'block';
        })
        .catch(error => {
            console.error('Error saving quotation:', error);
            alert('Error generating quotation. Please try again.');
        });
}

// Handle subscription from quotation
function handleQuotationSubscribe() {
    const quotationModal = document.getElementById('quotationModal');
    if (quotationModal) {
        quotationModal.remove();
    }
    
    // Scroll to subscription plans
    const subscriptionSection = document.querySelector('.subscription-plans');
    if (subscriptionSection) {
        subscriptionSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Add quotation button event listener
document.addEventListener('DOMContentLoaded', () => {
    const getQuoteBtn = document.querySelector('.get-quote-btn');
    if (getQuoteBtn) {
        getQuoteBtn.addEventListener('click', showQuotationForm);
    }
});

// Add tab switching functionality
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const pricingPlans = document.querySelectorAll('.pricing-plans');
    const paymentForm = document.getElementById('payment-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and plans
            tabButtons.forEach(btn => btn.classList.remove('active'));
            pricingPlans.forEach(plan => plan.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Show corresponding plans
            const tabId = button.getAttribute('data-tab');
            const activePlans = document.getElementById(`${tabId}-plans`);
            if (activePlans) {
                activePlans.classList.add('active');
            }

            // Hide payment form when switching tabs
            if (paymentForm) {
                paymentForm.style.display = 'none';
            }

            // Reinitialize subscription buttons for the newly displayed plans
            const subscribeButtons = activePlans.querySelectorAll('.subscribe-btn');
            subscribeButtons.forEach(btn => {
                btn.removeEventListener('click', handleSubscribeButtonClick);
                btn.addEventListener('click', () => handleSubscribeButtonClick(btn));
            });
        });
    });
});
