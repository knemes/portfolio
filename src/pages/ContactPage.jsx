import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import { useOutletContext } from 'react-router-dom';
import { emailjsConfig } from '../fbconfig'; 

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [social, setSocial] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);

    const sitekey = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY
    console.log(sitekey)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!recaptchaToken) {
            alert("Please complete the reCAPTCHA.");
            return;
        }

        const templateParams = {
            from_name: name,
            from_email: email,
            message: message,
            social_media: social,
        };

        try {
            const response = await emailjs.send(
                emailjsConfig.serviceID,
                emailjsConfig.templateID, 
                templateParams,
                emailjsConfig.userID, 
                { 'g-recaptcha-response': recaptchaToken }
            );
            console.log('Email sent successfully:', response);
            setIsSubmitted(true);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    const handleRecaptchaChange = (token) => {
        setRecaptchaToken(token);
    };

    return (
        <div className="page-content layout-main">
            <h1>Contact</h1>
            <p>Reach out to talk</p>

            {isSubmitted ? (
                <p>Thank you for your message! I will be in touch soon.</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="message">Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="social">Social Media Links (Optional):</label>
                        <input
                            type="text"
                            id="social"
                            name="social"
                            value={social}
                            onChange={(e) => setSocial(e.target.value)}
                        />
                        </div>
                        <ReCAPTCHA
                            sitekey={ sitekey }
                            onChange={handleRecaptchaChange}
                        />
                    <button type="submit">Send Message</button>
                </form>
            )}

        </div>
    );
}

export default Contact;