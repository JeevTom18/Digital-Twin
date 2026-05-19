import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Textarea from '../../components/ui/Textarea';
import Button from '../../components/ui/Button';

const FeedbackPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, this would send data to a server.
        console.log({ name, email, message });
        setSubmitted(true);
    };

    return (
        <div>
            <PageHeader
                title="Public Feedback"
                subtitle="Share your thoughts, suggestions, or questions with us."
            />

            <Card>
                {submitted ? (
                    <div className="text-center p-12">
                        <h2 className="text-2xl font-bold text-green-600">Thank You!</h2>
                        <p className="mt-2 text-slate-600">Your feedback has been received. We appreciate your input.</p>
                        <Button onClick={() => setSubmitted(false)} className="mt-6">Submit another response</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4">
                        <h2 className="text-xl font-bold text-slate-800 mb-6">Feedback Form</h2>
                        <div className="space-y-6">
                            <Input
                                label="Full Name"
                                name="name"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                placeholder="Your Name"
                            />
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your.email@example.com"
                            />
                            <Textarea
                                label="Your Message"
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                required
                                placeholder="Please type your feedback here..."
                                rows={6}
                            />
                        </div>
                        <div className="mt-8 text-right">
                            <Button type="submit">Submit Feedback</Button>
                        </div>
                    </form>
                )}
            </Card>
        </div>
    );
};

export default FeedbackPage;