import { useEffect } from "react";

const SeoHeadContent = ({ headContent }) => {
  useEffect(() => {
    if (!headContent) return;
    // console.log("Injecting head content:", headContent);
    // Create a temporary container
    const container = document.createElement("div");
    container.innerHTML = headContent;

    // Append each child to <head>
    const head = document.head;
    const addedNodes = [];

    Array.from(container.children).forEach((node) => {
      if (node.tagName?.toLowerCase() === "script") {
        const script = document.createElement("script");
        // Copy attributes
        Array.from(node.attributes || []).forEach((attr) => {
          script.setAttribute(attr.name, attr.value);
        });
        // Inline script content
        if (node.textContent) {
          script.textContent = node.textContent;
        }
        head.appendChild(script);
        addedNodes.push(script);
      } else {
        head.appendChild(node);
        addedNodes.push(node);
      }
    });

    // Cleanup on unmount
    return () => {
      addedNodes.forEach((node) => {
        if (node.parentNode === head) {
          head.removeChild(node);
        }
      });
    };
  }, [headContent]);

  return null; // no UI
};

export default SeoHeadContent;
