// client/src/pages/ContactPage.jsx
import React, { useState } from 'react';
import './StaticPage.css';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState(''); // 'success', 'error', 'submitting'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');
        // In a real application, you would send this data to a backend endpoint
        // or a third-party service (e.g., Formspree, Netlify Forms).
        // For now, we'll simulate a successful submission.
        console.log('Contact form submitted:', formData);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Simulate success
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' }); // Clear form
        } catch (error) {
            setStatus('error');
            console.error("Failed to send contact message:", error);
        }
    };

    return (
        <div className="static-page container">
            <h1>Contact Us</h1>
            <div className="static-content card">
                <p>Have questions, feedback, or need assistance? We're here to help! Please fill out the form below, and we'll get back to you as soon as possible.</p>
                <p>You can also reach us directly:</p>
                <ul>
                        <li>Email: <a href="rishabhsankhla10@gmail.com">support@myelectroo.in</a></li> 
                        <li>Phone: +91 99876 54321</li>
                        <li>Address: Mandor, Jodhpur, Rajasthan. 342304</li>
                    </ul>

                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Your Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={status === 'submitting'}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Your Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={status === 'submitting'}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                            disabled={status === 'submitting'}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Your Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="6"
                            required
                            disabled={status === 'submitting'}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
                        {status === 'submitting' ? 'Sending...' : 'Send Message'}
                    </button>
                    {status === 'success' && <p className="success-message" style={{marginTop: '15px'}}>Your message has been sent successfully!</p>}
                    {status === 'error' && <p className="error-message" style={{marginTop: '15px'}}>Failed to send message. Please try again later.</p>}
                </form>
            </div>
        </div>
    );
};

export default ContactPage;