import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import ReCAPTCHA from 'react-google-recaptcha';
import { useOutletContext } from 'react-router-dom';
import { emailjsConfig } from '../fbconfig'; 
import './ContactPage.css';

function Contact() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [subject, setSubject] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [recaptchaToken, setRecaptchaToken] = useState(null);
    const [characterCount, setCharacterCount] = useState(0);
    const characterLimit = 712;

    const sitekey = import.meta.env.VITE_APP_RECAPTCHA_SITE_KEY

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
            from_subject: subject
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

    const handleInputChange = (event) => {
        const newMessage = event.target.value;
        if (newMessage.length <= characterLimit) {
            setMessage(newMessage);
            setCharacterCount(newMessage.length);
        } else {
            setMessage(newMessage.slice(0, characterLimit));
            setCharacterCount(characterLimit);
        }
    };

    return (
        <div className="page-content layout-main">
            <div className="contact-form">
                {isSubmitted ? (
                    <p>Thank you for your message! I will be in touch soon.</p>
                ) : (
                        <form onSubmit={handleSubmit}>
                            <h1>Get In Touch!</h1>
                            <p>Use the form below to jot down your details. Look forward to connecting with you!</p>
                            <div className="input-wrapper">
                                <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                    required
                                
                                />
                                <label htmlFor="name">Name:</label>
                            </div>
                            <div className="input-wrapper">                                
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                        required
                                />
                                <label htmlFor="email">Email:</label>
                            </div>
                            <div className="input-wrapper">                                
                                <input
                                    type="subject"
                                    id="subject"
                                    name="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    required
                                />
                                <label htmlFor="subject">Subject:</label>
                            </div>
                            <div className="input-wrapper">
                                <textarea 
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={message}
                                        onChange={(e) => {
                                            setMessage(e.target.value)
                                            handleInputChange(e);
                                        }}
                                        required
                                />
                                <label htmlFor="message">Message:</label>
                            </div>
                            <ReCAPTCHA className="g-recaptcha"
                                sitekey={ sitekey }
                                onChange={handleRecaptchaChange}
                            />
                            <button type="submit">Submit</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Contact;