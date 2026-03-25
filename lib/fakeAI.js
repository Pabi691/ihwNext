export const getFakeAIResponse = (message) => {
    const msg = message.toLowerCase();

    if (msg.includes("bald") || msg.includes("hair fall")) {
        return `Hair loss is very common and we understand this problem.

We provide non-surgical solutions that give instant results.`;
    }

    return null;
};