import { useEffect } from "react";

const SeoBodyContent = ({ bodyContent }) => {
  useEffect(() => {
    if (!bodyContent) return;

    const container = document.createElement("div");
    container.innerHTML = bodyContent;

    const body = document.body;
    const addedNodes = [];

    Array.from(container.children).forEach((node) => {
      if (node.tagName?.toLowerCase() === "script") {
        const script = document.createElement("script");
        Array.from(node.attributes || []).forEach((attr) => {
          script.setAttribute(attr.name, attr.value);
        });
        if (node.textContent) {
          script.textContent = node.textContent;
        }
        body.appendChild(script);
        addedNodes.push(script);
      } else {
        body.appendChild(node);
        addedNodes.push(node);
      }
    });

    return () => {
      addedNodes.forEach((node) => {
        if (node.parentNode === body) {
          body.removeChild(node);
        }
      });
    };
  }, [bodyContent]);

  return null;
};

export default SeoBodyContent;
