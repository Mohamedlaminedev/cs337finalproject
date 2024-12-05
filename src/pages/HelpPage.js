import React from 'react';
import '../styles/HelpPage.css';

function HelpPage() {
    const faqs = [
        {
            question: "How do I add a transaction?",
            answer: "Go to the Transaction page and fill out the form with the amount and category."
        },
        {
            question: "How is my savings calculated?",
            answer: "Savings are calculated based on your income minus expenses over time."
        }
    ];

    return (
        <div className="help-page">
            <h2>Frequently Asked Questions</h2>
            <div className="faq-list">
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HelpPage;
