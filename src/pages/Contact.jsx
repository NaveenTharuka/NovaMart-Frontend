import { useState } from "react";

function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("Thank you for your message!");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">Contact Us</h1>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Contact Form */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-700 mb-2">Message</label>
                                    <textarea
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows="4"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg"
                                >
                                    Send Message
                                </button>
                            </form>
                        </div>

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                            <div className="space-y-6">
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                                    <p className="text-gray-600">123 Shopping Street<br />E-City, EC 12345</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                                    <p className="text-gray-600">+1 (555) 123-4567</p>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                                    <p className="text-gray-600">support@novamart.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Contact;