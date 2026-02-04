import React, { useState } from "react";
import { FaWhatsapp, FaPhoneAlt, FaTimes } from "react-icons/fa";
import { BRANCHES } from "../config/branches";

const FloatingContact = () => {
  const [open, setOpen] = useState(false);
  const message = "Hi, I’m interested in your products";

  return (
    <>
      {/* Floating Trigger */}
      <div className="floating-contact">
        <button
          className="floating-btn main"
          onClick={() => setOpen(true)}
          aria-label="Contact Us"
        >
          <FaPhoneAlt />
        </button>
      </div>

      {/* Branch Modal */}
      {open && (
        <div className="branch-modal-overlay" onClick={() => setOpen(false)}>
          <div
            className="branch-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="branch-modal-header">
              <h4>Select Branch</h4>
              <button onClick={() => setOpen(false)}>
                <FaTimes />
              </button>
            </div>

            {BRANCHES.map((branch) => (
              <div key={branch.id} className="branch-item">
                <span>{branch.name}</span>

                <div className="branch-actions">
                  <a
                    href={`tel:${branch.phone}`}
                    className="call"
                    aria-label={`Call ${branch.name}`}
                  >
                    <FaPhoneAlt />
                  </a>

                  <a
                    href={`https://wa.me/${branch.whatsapp}?text=${encodeURIComponent(
                      message
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whatsapp"
                    aria-label={`WhatsApp ${branch.name}`}
                  >
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingContact;
