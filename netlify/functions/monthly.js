// This runs on Netlify's server, not in the visitor's browser — so it
// isn't affected by the cross-origin (CORS) blocking that stopped the
// website's own JavaScript from reaching Travelpayouts directly.
// Your website calls this at /.netlify/functions/monthly?origin=X&destination=Y
// and this quietly does the real API call on your behalf.

const TOKEN = "8b616346cd9e4befc3a8a9d7482bb0c3";

exports.handler = async (event) => {
  const { origin, destination } = event.queryStringParameters || {};

  if (!origin || !destination) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, error: "Missing origin or destination" })
    };
  }

  try {
    const url = `https://api.travelpayouts.com/v1/prices/monthly?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&currency=usd&token=${TOKEN}`;
    const res = await fetch(url);
    const data = await res.json();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, error: String(err) })
    };
  }
};
