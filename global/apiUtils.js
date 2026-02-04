// import API_BASE_URL from "./apiConfig";


export const fetchData = async (endpoint, options, token = {}) => { 

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/${endpoint}`;
  
  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    ...options.headers, // Merge additional headers if needed
  };

  try {
    const response = await fetch(url, {
      ...options, // Spread any other options like method, body, etc.
      headers,
    });

    if (!response.ok) {
      // throw new Error(`HTTP error! status: ${response.status}`);
      // console.log('HTTP error!')
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    // throw error; // Re-throw the error for the component to handle
  }
};

