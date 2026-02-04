import { useState } from "react";
import { useNavigate } from "@/components/compat/router";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");

    try {
      const res = await fetch("https://formspree.io/f/mvzkrwjd", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", phone: "", message: "" });
        navigate('/thank-you');
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status && <p className="text-green-600 text-sm">{status}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <input
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border p-3 text-sm"
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={form.email}
        onChange={handleChange}
        required
        className="w-full border p-3 text-sm"
      />

      <input
        type="tel"
        name="phone"
        placeholder="Your Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
        className="w-full border p-3 text-sm"
      />

      <textarea
        name="message"
        rows="4"
        placeholder="Your Message"
        value={form.message}
        onChange={handleChange}
        required
        className="w-full border p-3 text-sm"
      />

      <button className="bg-[#04A9FF] px-6 py-2 font-semibold">
        Send Message
      </button>
    </form>
  );
}

