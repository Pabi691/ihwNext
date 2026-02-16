import { useEffect } from "react";

const SeoHeadContent = ({ headContent }) => {
  useEffect(() => {
    if (!headContent) return;

    const container = document.createElement("div");
    container.innerHTML = headContent;

    const sourceRoot = container.querySelector("head") || container;
    const head = document.head;
    const addedNodes = [];

    Array.from(sourceRoot.children).forEach((node) => {
      if (node.tagName?.toLowerCase() === "script") {
        const script = document.createElement("script");
        Array.from(node.attributes || []).forEach((attr) => {
          script.setAttribute(attr.name, attr.value);
        });
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

    return () => {
      addedNodes.forEach((node) => {
        if (node.parentNode === head) {
          head.removeChild(node);
        }
      });
    };
  }, [headContent]);

  return null;
};

export default SeoHeadContent;
