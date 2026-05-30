// client/src/pages/PrivacyPolicyPage.jsx
import React from 'react';
import './StaticPage.css';

const PrivacyPolicyPage = () => {
    return (
        <div className="static-page container">
            <h1>Privacy Policy</h1>
            <div className="static-content card">
                <p>This Privacy Policy describes how My Electroo ("we," "us," or "our") collects, uses, and discloses your personal information when you visit or make a purchase from myelectroo.com (the "Site").</p>

                <h2>1. Information We Collect</h2>
                <p>We collect various types of information in connection with the services we provide, including:</p>
                <ul>
                    <li><strong>Personal Information:</strong> Name, email address, shipping address, billing address, phone number, and payment information.</li>
                    <li><strong>Order Information:</strong> Details of products purchased, transaction history.</li>
                    <li><strong>Usage Data:</strong> IP address, browser type, operating system, referring URLs, pages visited, and dates/times of access.</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <p>We use the information we collect for various purposes, including to:</p>
                <ul>
                    <li>Process and fulfill your orders.</li>
                    <li>Communicate with you about your orders, products, services, and promotional offers.</li>
                    <li>Improve our Site, products, and services.</li>
                    <li>Detect and prevent fraud and other illegal activities.</li>
                    <li>Comply with legal obligations.</li>
                </ul>

                <h2>3. Sharing Your Information</h2>
                <p>We may share your personal information with third parties in the following circumstances:</p>
                <ul>
                    <li>With service providers who perform services on our behalf (e.g., payment processing, shipping, data analysis).</li>
                    <li>To comply with legal obligations, such as responding to subpoenas or court orders.</li>
                    <li>In connection with a merger, acquisition, or sale of assets.</li>
                </ul>

                <h2>4. Your Rights</h2>
                <p>Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete your data. Please contact us to exercise these rights.</p>

                <h2>5. Data Security</h2>
                <p>We implement reasonable security measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>

                <h2>6. Changes to This Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>

                <h2>7. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@myelectroo.in">privacy@myelectroo.in</a>.</p>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;