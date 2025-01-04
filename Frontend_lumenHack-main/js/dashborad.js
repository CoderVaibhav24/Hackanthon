// dashboard.js

// Check if user is logged in
function checkAuth() {
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'admin.html';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'admin.html';
}

// Load Products
async function loadProducts() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/products', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();
        
        // Display products in the mainContent div
        const mainContent = document.getElementById('mainContent');
        mainContent.innerHTML = `
            <h2>Products</h2>
            <table class="table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(product => `
                        <tr>
                            <td>${product.name}</td>
                            <td>${product.price}</td>
                            <td>${product.stock}</td>
                            <td>
                                <button class="btn btn-sm btn-primary">Edit</button>
                                <button class="btn btn-sm btn-danger">Delete</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load products');
    }
}

// Check authentication when page loads
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    // Load products by default
    loadProducts();
});