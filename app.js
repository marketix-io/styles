document.addEventListener('DOMContentLoaded', function() {
    // Function to extract query parameters from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Extracting the specific details from URL parameters
    const planName = getQueryParam('plan_name');
    const price = getQueryParam('price');
    const licenses = getQueryParam('licenses');

    // Object to hold the extracted details
    const customerDetails = {
        planName: planName,
        price: price,
        licenses: licenses
    };

    // Function to safely update element text
    const safelyUpdateElementText = (id, text) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        } else {
            console.error(`Error: Element with id '${id}' not found.`);
        }
    };

    // Update elements based on extracted details
    Object.entries(customerDetails).forEach(([key, value]) => {
        if (value) {
            safelyUpdateElementText(`customer-${key}`, value);
        } else {
            console.error(`Error: No data found for '${key}'`);
        }
    });

    // Extract the customer_id from the URL
    const customerID = getQueryParam('customer_id');

    // Handle click event for the "Manage Subscription" button
    document.getElementById('manage-subscription-btn').addEventListener('click', function() {
        if (!customerID) {
            alert("No customer ID provided.");
            return;
        }

        fetch(`/api/create-stripe-session?customer=${customerID}`)
            .then(response => response.json())
            .then(data => {
                if (data && data.url) {
                    window.location.href = data.url; // Redirect to Stripe's customer portal
                } else {
                    console.error('No URL returned from the server to redirect to.');
                    alert('Failed to redirect to the subscription management page.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An error occurred while trying to manage the subscription.');
            });
    });
});
