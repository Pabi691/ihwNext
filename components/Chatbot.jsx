"use client";

import { useState, useEffect } from "react";
import { faqs } from "@/lib/faq";
import { getFakeAIResponse } from "@/lib/fakeAI";

export default function Chatbot({ phone }) {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    // Auto open after 4 sec
    useEffect(() => {
        const timer = setTimeout(() => setOpen(true), 4000);
        return () => clearTimeout(timer);
    }, []);

    const sendMessage = (msg) => {
        if (!msg) return;

        const userMsg = { role: "user", content: msg };
        setMessages((prev) => [...prev, userMsg]);

        const lowerMsg = msg.toLowerCase();

        // ✅ STEP 1: Check FAQ
        const matchedFAQ = faqs.find((f) =>
            f.keywords.some((k) => lowerMsg.includes(k))
        );

        if (matchedFAQ) {
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: matchedFAQ.answer },
            ]);
            return;
        }

        // ✅ STEP 2: Fake AI
        const aiReply = getFakeAIResponse(msg);

        if (aiReply) {
            setMessages((prev) => [
                ...prev,
                { role: "bot", content: aiReply },
            ]);
            return;
        }

        // ✅ STEP 3: Fallback
        setMessages((prev) => [
            ...prev,
            {
                role: "bot",
                content:
                    "I couldn't find exact answer.\n\nGet instant help from our expert 👇",
            },
        ]);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-[135px] right-6 bg-green-600 text-white p-4 rounded-full shadow-xl z-50 hover:bg-green-700"
            >
                💬
            </button>

            {/* Chat Window */}
            {open && (
                <div className="fixed bottom-[195px] right-6 w-80 bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="bg-green-600 text-white p-3 font-semibold">
                        Indian Hair World Assistant
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-3 overflow-y-auto max-h-80 space-y-2">

                        {/* Default Questions */}
                        {messages.length === 0 && (
                            <div className="space-y-2">
                                <p className="text-sm text-gray-900">
                                    How can we help you today?
                                </p>

                                {[
                                    "💰 What is the price of hair patch?",
                                    "🤔 Will it look natural?",
                                    "⏱ How much time does it take?",
                                    "📅 Book appointment",
                                ].map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(q)}
                                        className="block w-full text-left text-sm bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Chat Messages */}
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`p-2 rounded-lg text-sm whitespace-pre-line ${m.role === "user"
                                    ? "bg-green-100 self-end"
                                    : "bg-gray-100"
                                    }`}
                            >
                                {m.content}

                                {/* CTA after bot reply */}
                                {m.role === "bot" && (
                                    <div className="mt-2 flex flex-col gap-2">
                                        <a
                                            href={`https://wa.me/${phone}?text=Hi%2C%20I%20need%20help`}
                                            target="_blank"
                                            className="bg-green-600 text-white px-3 py-1 rounded-full text-center text-xs"
                                        >
                                            WhatsApp Now
                                        </a>

                                        <a
                                            href={`tel:${phone}`}
                                            className="bg-black text-white px-3 py-1 rounded-full text-center text-xs"
                                        >
                                            Call Now
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Input */}
                    <div className="p-2 border-t flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask your question..."
                            className="flex-1 border rounded-full px-3 py-1 text-sm"
                        />

                        <button
                            onClick={() => sendMessage(input)}
                            className="bg-green-600 text-white px-3 rounded-full"
                        >
                            ➤
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}