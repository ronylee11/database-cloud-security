//alert("hello world");

const backendPort = 3001;
const backendUrl = `http://localhost:${backendPort}`;

// test backend api
// @param {string} backendUrl
// @returns JSON object { status: 'UP' } or { status: 'DOWN' }
async function checkHealth(backendUrl) {
  let healthStatus;
  try {
    const response = await fetch(`${backendUrl}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
    healthStatus = await response.json();
    console.log(healthStatus);
  } catch (error) {
    healthStatus = { status: "DOWN" };
    console.log(error);
  }
  return healthStatus;
}

//alert(checkHealth(backendUrl));
checkHealth(backendUrl).then((healthStatus) => {
  alert(healthStatus.status);
});
