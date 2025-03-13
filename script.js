// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const dashboardModal = document.getElementById('dashboardModal');
    const loginBtn = document.querySelector('.login-btn');
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const closeBtns = document.querySelectorAll('.close');

    // Function to show modal
    function showModal(modal) {
        if (modal) {
            modal.style.display = 'block';
        }
    }

    // Function to hide modal
    function hideModal(modal) {
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Login button click
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const user = auth.currentUser;
            if (user) {
                // User is logged in, show dashboard
                const dashboardModal = document.getElementById('dashboardModal');
                if (dashboardModal) {
                    showModal(dashboardModal);
                    // Force refresh dashboard info
                    updateDashboardInfo(user);
                }
            } else {
                // User is not logged in, show login modal
            showModal(loginModal);
            }
        });
    }

    // Show register modal
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal(loginModal);
            showModal(registerModal);
        });
    }

    // Show login modal
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideModal(registerModal);
            showModal(loginModal);
        });
    }

    // Close button functionality
    closeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            hideModal(loginModal);
            hideModal(registerModal);
            hideModal(dashboardModal);
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            hideModal(loginModal);
        }
        if (e.target === registerModal) {
            hideModal(registerModal);
        }
        if (e.target === dashboardModal) {
            hideModal(dashboardModal);
        }
    });

    // Handle login form submission
    const loginForm = document.querySelector('.login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = loginForm.querySelector('input[type="email"]').value;
            const password = loginForm.querySelector('input[type="password"]').value;
            
            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                console.log('Login successful:', userCredential.user.email);
                
                // Hide login modal
                hideModal(loginModal);

                // Record login activity
                await database.ref('activities/' + userCredential.user.uid).push({
                    type: 'login',
                    description: 'User logged in',
                    icon: 'fa-sign-in-alt',
                    timestamp: new Date().toISOString()
                });

                // Update last login time
                await database.ref('users/' + userCredential.user.uid).update({
                    lastLogin: new Date().toISOString()
                });

                // Direct user to appropriate dashboard
                if (email.toLowerCase() === 'bryandzumbira@gmail.com') {
                    showAdminDashboard(userCredential.user);
                } else {
                    showUserDashboard(userCredential.user);
                }
                
            } catch (error) {
                console.error('Login error:', error);
                alert('Login failed: ' + error.message);
            }
        });
    }
});

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

// Firebase auth state change listener
auth.onAuthStateChanged((user) => {
    if (user) {
        // User is signed in
        console.log('User is signed in:', user.email);
        
        // Update UI elements
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'My Account';
        }
        
        // Update subscription buttons
        const subscribeButtons = document.querySelectorAll('.subscribe-btn');
        subscribeButtons.forEach(btn => {
            btn.textContent = 'Subscribe Now';
        });

        // Handle "My Account" button click
        if (loginBtn) {
            loginBtn.onclick = (e) => {
                e.preventDefault();
                if (user.email.toLowerCase() === 'bryandzumbira@gmail.com') {
                    showAdminDashboard(user);
                } else {
                    showUserDashboard(user);
                }
            };
        }
    } else {
        // User is signed out
        console.log('User is signed out');
        updateUIForLoggedOutUser();
        
        // Hide all dashboards
        const dashboardModal = document.getElementById('dashboardModal');
        const adminDashboardModal = document.getElementById('adminDashboardModal');
        if (dashboardModal) hideModal(dashboardModal);
        if (adminDashboardModal) adminDashboardModal.remove();
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
        const user = auth.currentUser;
        if (user) {
            // User is logged in, show dashboard
            const dashboardModal = document.getElementById('dashboardModal');
            if (dashboardModal) {
                showModal(dashboardModal);
                // Force refresh dashboard info
                updateDashboardInfo(user);
            }
        } else {
            // User is not logged in, show login modal
        showModal(loginModal);
        }
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

// Handle logout
logoutBtn.addEventListener('click', async () => {
    try {
        await auth.signOut();
        // Hide all possible dashboard modals
        const dashboardModal = document.getElementById('dashboardModal');
        const adminDashboardModal = document.getElementById('adminDashboardModal');
        if (dashboardModal) hideModal(dashboardModal);
        if (adminDashboardModal) adminDashboardModal.remove();
        
        // Update UI for logged out state without showing login modal
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            loginBtn.textContent = 'Login';
        }
        
        // Update subscription buttons
        const subscribeButtons = document.querySelectorAll('.subscribe-btn');
        subscribeButtons.forEach(btn => {
            btn.textContent = 'Login to Subscribe';
        });

        console.log('User signed out successfully');
    } catch (error) {
        console.error('Logout error:', error);
        alert('Logout failed: ' + error.message);
    }
});

// Handle subscription renewal
if (renewBtn) {
    renewBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) {
            alert('Please login to renew your subscription');
            showModal(loginModal);
            return;
        }

        try {
            // Get current subscription data
            const userRef = database.ref('users/' + user.uid);
            const snapshot = await userRef.once('value');
            const userData = snapshot.val();
            
            if (!userData || !userData.subscription || !userData.subscription.plan) {
                alert('No active subscription found. Please subscribe to a plan first.');
                return;
            }

            // Show payment form with current plan details
            const paymentForm = document.getElementById('payment-form');
            if (paymentForm) {
                // Get current plan details
                const currentPlan = userData.subscription.plan.toLowerCase().split(' ')[0]; // Extract 'basic', 'standard', or 'premium'
                const planButton = document.querySelector(`.subscribe-btn[data-plan="${currentPlan}"]`);
                
                if (planButton) {
                    handleSubscribeButtonClick(planButton);
                } else {
                    alert('Error loading plan details. Please try again.');
                }
            }
        } catch (error) {
            console.error('Error renewing subscription:', error);
            alert('Failed to process renewal: ' + error.message);
        }
    });
}

// Handle plan upgrade
const upgradeBtn = document.querySelector('.upgrade-btn');
if (upgradeBtn) {
    upgradeBtn.addEventListener('click', async () => {
        const user = auth.currentUser;
        if (!user) {
            alert('Please login to upgrade your subscription');
            showModal(loginModal);
            return;
        }

        try {
            // Get current subscription data
            const userRef = database.ref('users/' + user.uid);
            const snapshot = await userRef.once('value');
            const userData = snapshot.val();
            
            if (!userData || !userData.subscription || !userData.subscription.plan) {
                alert('No active subscription found. Please subscribe to a plan first.');
                return;
            }

            // Get current plan level
            const currentPlan = userData.subscription.plan.toLowerCase().split(' ')[0]; // Extract 'basic', 'standard', or 'premium'
            
            // Determine next plan level
            let nextPlan;
            switch(currentPlan) {
                case 'basic':
                    nextPlan = 'standard';
                    break;
                case 'standard':
                    nextPlan = 'premium';
                    break;
                case 'premium':
                    alert('You are already on our highest plan tier.');
                    return;
                default:
                    nextPlan = 'basic';
            }

            // Find and click the button for the next plan
            const nextPlanButton = document.querySelector(`.subscribe-btn[data-plan="${nextPlan}"]`);
            if (nextPlanButton) {
                // Ensure subscription section is visible
                const subscriptionSection = document.querySelector('.subscription-section');
                if (subscriptionSection) {
                    subscriptionSection.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Show the appropriate tab (local/outoftown) based on current subscription
                const isOutOfTown = userData.subscription.coverage.toLowerCase().includes('outside');
                const tabToClick = document.querySelector(`.tab-btn[data-tab="${isOutOfTown ? 'outoftown' : 'local'}"]`);
                if (tabToClick && !tabToClick.classList.contains('active')) {
                    tabToClick.click();
                }

                // Trigger subscription process for the new plan
                handleSubscribeButtonClick(nextPlanButton);
            } else {
                alert('Error loading upgrade options. Please try again.');
            }
        } catch (error) {
            console.error('Error upgrading plan:', error);
            alert('Failed to process upgrade: ' + error.message);
        }
    });
}

// Update dashboard information
function updateDashboardInfo(user) {
    if (!user) {
        console.error('No user provided to updateDashboardInfo');
        return;
    }

    // Get user data from Firebase
    database.ref('users/' + user.uid).once('value')
        .then(snapshot => {
            const userData = snapshot.val() || {};
            const healthData = userData.health || {};
            const subscriptionData = userData.subscription || {
                plan: 'No active plan',
                status: 'inactive'
            };
            
            // Helper function to safely update element text content
            const safelyUpdateElement = (id, value, defaultValue = 'Not set') => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = value || defaultValue;
                } else {
                    console.warn(`Element with id '${id}' not found`);
                }
            };

            // Update Personal Information
            safelyUpdateElement('user-name', userData.name || user.displayName);
            safelyUpdateElement('user-email', userData.email || user.email);
            safelyUpdateElement('user-phone', userData.phoneNumber);
            safelyUpdateElement('user-address', userData.address);
            
            // Set member since date
            const memberSinceDate = userData.createdAt ? new Date(userData.createdAt) : new Date();
            safelyUpdateElement('member-since', memberSinceDate.toLocaleDateString());

            // Update subscription status fields
            safelyUpdateElement('current-plan', subscriptionData.plan);
            safelyUpdateElement('monthly-fee', subscriptionData.fee ? `$${subscriptionData.fee}` : '$0.00');
            safelyUpdateElement('coverage-area', subscriptionData.coverage, 'None');
            safelyUpdateElement('next-payment', 
                subscriptionData.nextPaymentDate ? 
                new Date(subscriptionData.nextPaymentDate).toLocaleDateString() : 'N/A'
            );
            safelyUpdateElement('auto-renewal', subscriptionData.autoRenewal ? 'Enabled' : 'Disabled');

            // Update health information fields
            safelyUpdateElement('blood-type', healthData.bloodType);
            safelyUpdateElement('allergies', healthData.allergies, 'None specified');
            safelyUpdateElement('medical-conditions', healthData.conditions, 'None specified');
            safelyUpdateElement('emergency-contact', healthData.emergencyContact);

            // Update subscription status visual indicators
            const subscriptionStatus = document.querySelector('.subscription-status');
            if (subscriptionStatus) {
                if (subscriptionData.status === 'active') {
                    subscriptionStatus.classList.add('active');
                    subscriptionStatus.classList.remove('inactive');
                } else {
                    subscriptionStatus.classList.add('inactive');
                    subscriptionStatus.classList.remove('active');
                }
            }

            // Get recent activities
            return database.ref('activities/' + user.uid)
                .orderByChild('timestamp')
                .limitToLast(3)
                .once('value');
        })
        .then(activitiesSnapshot => {
            const recentActivities = document.getElementById('recent-activities');
            if (recentActivities) {
                let activitiesHtml = '';
                
                if (!activitiesSnapshot.exists()) {
                    // Show account creation as first activity if no other activities
                    activitiesHtml = `
                        <div class="activity-item">
                            <i class="fas fa-user-plus"></i>
                            <div class="activity-info">
                                <p>Account Created</p>
                                <span class="activity-date">${new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    `;
                } else {
                    // Add all activities
                    const activities = [];
                    activitiesSnapshot.forEach(child => {
                        activities.push({
                            ...child.val(),
                            id: child.key
                        });
                    });
                    
                    // Sort activities by timestamp in descending order
                    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                    
                    activitiesHtml = activities.map(activity => `
                        <div class="activity-item">
                            <i class="fas ${activity.icon || getActivityIcon(activity.type)}"></i>
                            <div class="activity-info">
                                <p>${activity.description}</p>
                                <span class="activity-date">${new Date(activity.timestamp).toLocaleDateString()}</span>
                            </div>
                        </div>
                    `).join('');
                }
                
                recentActivities.innerHTML = activitiesHtml;
            }

            // Update benefits list based on subscription plan
            const benefitsList = document.getElementById('plan-benefits');
            if (benefitsList) {
                const currentPlan = document.getElementById('current-plan')?.textContent || '';
                let benefits = [];
                
                switch(currentPlan.toLowerCase()) {
                    case 'premium package':
                    case 'premium plan':
                        benefits = [
                            '24/7 Emergency Response',
                            'Priority Dispatch',
                            'Medical Equipment Coverage',
                            'Hospital Transfer Service',
                            'Health Advisory Services',
                            'Family Coverage Options',
                            'International Coverage',
                            'VIP Service'
                        ];
                        break;
                    case 'standard package':
                    case 'standard plan':
                        benefits = [
                            '24/7 Emergency Response',
                            'Priority Dispatch',
                            'Medical Equipment Coverage',
                            'Hospital Transfer Service',
                            'Health Advisory Services',
                            'Family Coverage Options'
                        ];
                        break;
                    case 'basic package':
                    case 'basic plan':
                        benefits = [
                            '24/7 Emergency Response',
                            'Medical Equipment Coverage',
                            'Hospital Transfer Service',
                            'Health Advisory Services'
                        ];
                        break;
                    default:
                        benefits = [
                            '24/7 Emergency Response',
                            'Medical Equipment Coverage',
                            'Hospital Transfer Service'
                        ];
                }

                benefitsList.innerHTML = benefits.map(benefit => `
                    <li><i class="fas fa-check-circle"></i> ${benefit}</li>
                `).join('');
            }
        })
        .catch(error => {
            console.error('Error updating dashboard:', error);
            alert('Error loading dashboard information. Please try refreshing the page.');
        });
}

// Helper function to get activity icons
function getActivityIcon(activityType) {
    const icons = {
        'subscription': 'fa-credit-card',
        'profile_update': 'fa-user-edit',
        'login': 'fa-sign-in-alt',
        'payment': 'fa-dollar-sign',
        'emergency': 'fa-ambulance',
        'default': 'fa-circle'
    };
    return icons[activityType] || icons.default;
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
    if (!btn) {
        console.error('Subscribe button not provided');
        return;
    }

    const user = auth.currentUser;
    const plan = btn.getAttribute('data-plan');
    const basePrice = parseFloat(btn.getAttribute('data-price'));
    
    if (!user) {
        showModal(loginModal);
        return;
    }

    if (!plan || isNaN(basePrice)) {
        console.error('Invalid plan or price data', { plan, basePrice });
        return;
    }

    const paymentForm = document.getElementById('payment-form');
    if (!paymentForm) {
        console.error('Payment form not found');
        return;
    }
    
    // Show payment form if not already visible
    if (paymentForm.style.display === 'none' || !paymentForm.style.display) {
        // Get the active tab
        const activeTab = document.querySelector('.tab-btn.active');
        const isOutOfTown = activeTab ? activeTab.getAttribute('data-tab') === 'outoftown' : false;
        console.log('Active tab:', activeTab?.getAttribute('data-tab'), 'Is out of town:', isOutOfTown);
        
        // Calculate final price (no multiplier needed)
        let finalPrice = basePrice;
        console.log('Final price:', finalPrice);

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
        document.getElementById('summary-amount').textContent = finalPrice;
        document.getElementById('summary-coverage').textContent = coverage;
        
        // Update payment amount in instructions
        const paymentAmount = document.querySelector('.payment-amount');
        if (paymentAmount) {
            paymentAmount.textContent = finalPrice;
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
    const ecocashNumber = document.querySelector('.ecocash-number span');
    if (ecocashNumber) {
        ecocashNumber.style.cursor = 'pointer';
        ecocashNumber.addEventListener('click', function() {
            const number = this.textContent;
            navigator.clipboard.writeText(number)
                .then(() => {
                    alert('EcoCash number copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy:', err);
                });
        });
    }
}

// Handle payment form submission
const paymentForm = document.getElementById('payment-form');
if (paymentForm) {
    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const user = auth.currentUser;
        if (!user) {
            alert('Please login to complete your subscription');
            showModal(loginModal);
            return;
        }

        const referenceNumber = document.getElementById('reference-number').value;
        if (!referenceNumber) {
            alert('Please enter the EcoCash reference number');
            return;
        }

        const submitBtn = paymentForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';

        try {
            // Get subscription details
            const plan = document.getElementById('summary-plan').textContent;
            const amount = document.getElementById('summary-amount').textContent;
            const coverage = document.getElementById('summary-coverage').textContent;

            // Save payment details to Firebase
            const paymentRef = database.ref('payments').push();
            await paymentRef.set({
                userId: user.uid,
                userEmail: user.email,
                plan: plan,
                amount: amount,
                coverage: coverage,
                referenceNumber: referenceNumber,
                status: 'pending',
                createdAt: new Date().toISOString()
            });

            // Show success message
            const submissionStatus = document.querySelector('.submission-status');
            if (submissionStatus) {
                submissionStatus.style.display = 'block';
                submissionStatus.textContent = 'Your payment is pending approval. We will notify you once it\'s confirmed.';
            }

            // Clear form
            document.getElementById('reference-number').value = '';
            
            // Hide payment form after 3 seconds
            setTimeout(() => {
                paymentForm.style.display = 'none';
            }, 3000);

        } catch (error) {
            console.error('Payment submission error:', error);
            alert('Failed to submit payment: ' + error.message);
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = 'My Account';
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // For admin user
            if (user.email.toLowerCase() === 'bryandzumbira@gmail.com') {
                showAdminDashboard(user);
                return;
            }
            
            // For regular users
            const dashboardModal = document.getElementById('dashboardModal');
            if (dashboardModal) {
                showModal(dashboardModal);
                updateDashboardInfo(user);
            }
        });
    }
    
    // Update subscription buttons
    const subscribeButtons = document.querySelectorAll('.subscribe-btn');
    subscribeButtons.forEach(btn => {
        btn.textContent = 'Subscribe Now';
    });
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.textContent = 'Login';
        // Remove any existing click event listeners
        loginBtn.replaceWith(loginBtn.cloneNode(true));
        // Add new click event listener
        document.querySelector('.login-btn').addEventListener('click', (e) => {
            e.preventDefault();
            showModal(loginModal);
        });
    }

    // Update subscription buttons
    const subscribeButtons = document.querySelectorAll('.subscribe-btn');
    subscribeButtons.forEach(btn => {
        btn.textContent = 'Login to Subscribe';
    });
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
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = registerForm.querySelector('input[type="email"]').value;
        const password = registerForm.querySelector('input[type="password"]').value;
        const confirmPassword = registerForm.querySelector('input[type="password"][placeholder="Confirm Password"]').value;
        const fullName = registerForm.querySelector('input[type="text"]').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            
            // Create user data object
            const userData = {
                name: fullName,
                email: email,
                createdAt: new Date().toISOString(),
                health: {
                    bloodType: '',
                    allergies: 'None',
                    conditions: 'None',
                    emergencyContact: ''
                },
                subscription: {
                    plan: '',
                    status: 'inactive'
                }
            };

            // Save user data to Firebase
            await database.ref('users/' + userCredential.user.uid).set(userData);

            // Add account creation activity
            await database.ref('activities/' + userCredential.user.uid).push({
                type: 'account_creation',
                description: 'Account created',
                icon: 'fa-user-plus',
                timestamp: new Date().toISOString()
            });

            console.log('Registration successful:', userCredential.user.email);
            hideModal(registerModal);
            
            // Show and update dashboard
            const dashboardModal = document.getElementById('dashboardModal');
            if (dashboardModal) {
                showModal(dashboardModal);
                updateDashboardInfo(userCredential.user);
            } else {
                console.error('Dashboard modal not found');
            }
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed: ' + error.message);
        }
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
    if (!user || user.email.toLowerCase() !== 'bryandzumbira@gmail.com') {
        console.error('Unauthorized access attempt to admin dashboard');
        return;
    }

    // Remove existing admin dashboard if it exists
    const existingAdminDashboard = document.getElementById('adminDashboardModal');
    if (existingAdminDashboard) {
        existingAdminDashboard.remove();
    }

    // Create and show new admin dashboard
    const adminDashboardHtml = `
        <div class="modal" id="adminDashboardModal">
            <div class="modal-content admin-modal">
                <span class="close">&times;</span>
                <div class="admin-dashboard">
                    <h2>Admin Dashboard</h2>
                    <div class="admin-info">
                        <p>Welcome, Admin (${user.email})</p>
                        <p>Last login: ${new Date().toLocaleString()}</p>
                    </div>
                    <div class="admin-sections">
                        <div class="transactions-section">
                            <h3>Subscription Management</h3>
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
                        <div class="users-section">
                            <h3>User Management</h3>
                            <div id="usersList" class="users-list">
                                Loading users...
                            </div>
                        </div>
                    </div>
                    <button class="admin-logout-btn" onclick="handleAdminLogout()">Logout</button>
                </div>
            </div>
        </div>
    `;

    // Add modal to body and show it
    document.body.insertAdjacentHTML('beforeend', adminDashboardHtml);
    const adminModal = document.getElementById('adminDashboardModal');
    const closeBtn = adminModal.querySelector('.close');

    // Show modal
    adminModal.style.display = 'block';

    // Close modal functionality
    closeBtn.onclick = () => {
        adminModal.remove();
    };

    window.onclick = (e) => {
        if (e.target === adminModal) {
            adminModal.remove();
        }
    };

    // Load initial data
    loadTransactions();
    loadUsers();

    // Add status filter functionality
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => {
            loadTransactions(statusFilter.value);
        });
    }
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

// Add function to load users
function loadUsers() {
    const usersList = document.getElementById('usersList');
    if (!usersList) return;

    database.ref('users').once('value')
        .then(snapshot => {
            if (!snapshot.exists()) {
                usersList.innerHTML = '<p>No users found</p>';
                return;
            }

            let usersHtml = '';
            snapshot.forEach(childSnapshot => {
                const userData = childSnapshot.val();
                const userId = childSnapshot.key;
                
                usersHtml += `
                    <div class="user-item">
                        <div class="user-info">
                            <p><strong>Name:</strong> ${userData.name || 'N/A'}</p>
                            <p><strong>Email:</strong> ${userData.email || 'N/A'}</p>
                            <p><strong>Subscription:</strong> ${userData.subscription?.plan || 'No active plan'}</p>
                            <p><strong>Status:</strong> ${userData.subscription?.status || 'inactive'}</p>
                        </div>
                        <div class="user-actions">
                            <button onclick="viewUserDetails('${userId}')" class="view-btn">View Details</button>
                        </div>
                    </div>
                `;
            });

            usersList.innerHTML = usersHtml || '<p>No users found</p>';
        })
        .catch(error => {
            console.error('Error loading users:', error);
            usersList.innerHTML = '<p>Error loading users. Please try again later.</p>';
        });
}

// Add function to handle admin logout
function handleAdminLogout() {
    auth.signOut()
        .then(() => {
            const adminModal = document.getElementById('adminDashboardModal');
            if (adminModal) {
                adminModal.remove();
            }
            console.log('Admin logged out successfully');
        })
        .catch(error => {
            console.error('Logout error:', error);
            alert('Logout failed: ' + error.message);
        });
}

// Add function to view user details
function viewUserDetails(userId) {
    database.ref('users/' + userId).once('value')
        .then(snapshot => {
            const userData = snapshot.val();
            if (!userData) {
                alert('User data not found');
                return;
            }

            const userDetailsHtml = `
                <div class="modal" id="userDetailsModal">
                    <div class="modal-content">
                        <span class="close">&times;</span>
                        <h3>User Details</h3>
                        <div class="user-details">
                            <h4>Personal Information</h4>
                            <p><strong>Name:</strong> ${userData.name || 'N/A'}</p>
                            <p><strong>Email:</strong> ${userData.email || 'N/A'}</p>
                            <p><strong>Phone:</strong> ${userData.phoneNumber || 'N/A'}</p>
                            <p><strong>Address:</strong> ${userData.address || 'N/A'}</p>
                            
                            <h4>Health Information</h4>
                            <p><strong>Blood Type:</strong> ${userData.health?.bloodType || 'N/A'}</p>
                            <p><strong>Allergies:</strong> ${userData.health?.allergies || 'None'}</p>
                            <p><strong>Medical Conditions:</strong> ${userData.health?.conditions || 'None'}</p>
                            <p><strong>Emergency Contact:</strong> ${userData.health?.emergencyContact || 'N/A'}</p>
                            
                            <h4>Subscription Details</h4>
                            <p><strong>Plan:</strong> ${userData.subscription?.plan || 'No active plan'}</p>
                            <p><strong>Status:</strong> ${userData.subscription?.status || 'inactive'}</p>
                            <p><strong>Start Date:</strong> ${userData.subscription?.startDate ? new Date(userData.subscription.startDate).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>End Date:</strong> ${userData.subscription?.endDate ? new Date(userData.subscription.endDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', userDetailsHtml);
            
            const detailsModal = document.getElementById('userDetailsModal');
            const closeBtn = detailsModal.querySelector('.close');
            
            detailsModal.style.display = 'block';

            closeBtn.onclick = () => {
                detailsModal.remove();
            };

            window.onclick = (e) => {
                if (e.target === detailsModal) {
                    detailsModal.remove();
                }
            };
        })
        .catch(error => {
            console.error('Error loading user details:', error);
            alert('Error loading user details. Please try again.');
        });
}

// Function to show user dashboard
function showUserDashboard(user) {
    if (!user) return;
    
    const dashboardModal = document.getElementById('dashboardModal');
    if (dashboardModal) {
        showModal(dashboardModal);
        updateDashboardInfo(user);
    } else {
        console.error('User dashboard modal not found');
    }
}

// Update the logout handler to handle both dashboards
function handleLogout() {
    auth.signOut()
        .then(() => {
            // Hide all possible dashboard modals
            const dashboardModal = document.getElementById('dashboardModal');
            const adminDashboardModal = document.getElementById('adminDashboardModal');
            const dualRoleDashboardModal = document.getElementById('dualRoleDashboardModal');
            
            if (dashboardModal) hideModal(dashboardModal);
            if (adminDashboardModal) adminDashboardModal.remove();
            if (dualRoleDashboardModal) dualRoleDashboardModal.remove();
            
            console.log('User signed out successfully');
        })
        .catch(error => {
            console.error('Logout error:', error);
            alert('Logout failed: ' + error.message);
        });
}

// Add tab switching functionality for pricing plans
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const localPlans = document.getElementById('local-plans');
    const outoftownPlans = document.getElementById('outoftown-plans');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and plans
            tabBtns.forEach(b => b.classList.remove('active'));
            localPlans.classList.remove('active');
            outoftownPlans.classList.remove('active');

            // Add active class to clicked button and corresponding plans
            btn.classList.add('active');
            const selectedTab = btn.getAttribute('data-tab');
            if (selectedTab === 'local') {
                localPlans.classList.add('active');
            } else if (selectedTab === 'outoftown') {
                outoftownPlans.classList.add('active');
            }
        });
    });
});

