import React, { useState } from "react"
//import TeamSection from "../components/about/TeamSection";

const reasons = [
  {
    title: "AI-Driven Insights",
    description: "Our advanced AI provides highly accurate soil and seed analysis using real agricultural datasets.",
  },
  {
    title: "Consult Expert Farmers",
    description: "We connect you directly with agricultural consultants who can guide you toward the best practices.",
  },
  {
    title: "Marketplace Integration",
    description: "Buy seeds or sell your harvest right within the platform. It’s your one-stop agricultural hub.",
  },
  {
    title: "User-Friendly Design",
    description: "Designed with simplicity in mind, AgroGenius is intuitive and easy to use for all users.",
  },
];

const faqs = [
  {
    question: "What is AgroGenius?",
    answer: "AgroGenius is an AI-powered platform that helps farmers and agricultural consultants analyze soil & seed quality, get expert advice, and connect to a digital marketplace.",
  },
  {
    question: "Do I need to sign up to use the platform?",
    answer: "You can try core features like soil and seed analysis twice without signing up. After that, registration is required.",
  },
  {
    question: "Who can use AgroGenius?",
    answer: "Anyone in the agriculture domain – from farmers and students to consultants and researchers.",
  },
  {
    question: "Can I connect with other farmers?",
    answer: "Yes! Through the platform’s expert counselling feature, you can also interact with experienced professionals and users.",
  },
  {
    question: "How secure is my data?",
    answer: "We take data privacy seriously. Your analysis history and profile are stored securely and never shared without consent.",
  },
];

const FAQItem = ({ faq, isOpen, onClick }) => (
  <div className="border-b border-gray-200 py-4">
    <button
      onClick={onClick}
      className="w-full text-left text-lg font-semibold text-green-800 hover:text-green-600 transition"
    >
      {faq.question}
    </button>
    {isOpen && (
      <p className="mt-2 text-gray-700 text-base">{faq.answer}</p>
    )}
  </div>
);

const About = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
        <br />
        <br />
      <h1 className="text-4xl font-bold text-green-700 text-center mb-10">About AgroGenius</h1>

      
      

      {/* Why AgroGenius */}
      <div className="my-16">
        <h2 className="text-3xl font-semibold text-center text-green-800 mb-8">Why Choose AgroGenius?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((reason, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <h3 className="text-xl font-bold text-green-700 mb-2">{reason.title}</h3>
              <p className="text-gray-700 text-sm">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-gray-100 p-8 mt-10 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-800">Frequently Asked Questions</h2>
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            faq={faq}
            isOpen={openIndex === index}
            onClick={() => toggleFAQ(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default About;