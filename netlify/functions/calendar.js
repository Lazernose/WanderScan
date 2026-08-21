// Proxies Travelpayouts' day-by-day calendar endpoint, for an estimated
// price on the exact date someone searches (rather than just a whole
// month average). Called at:
// /.netlify/functions/calendar?origin=X&destination=Y&depart_date=YYYY-MM

const TOKEN = "8b616346cd9e4befc3a8a9d7482bb0c3";

exports.handler = async (event) => {
  const { origin, destination, depart_date } = event.queryStringParameters || {};

  if (!origin || !destination || !depart_date) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, error: "Missing origin, destination, or depart_date" })
    };
  }

  try {
    const url = `https://api.travelpayouts.com/v1/prices/calendar?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&depart_date=${encodeURIComponent(depart_date)}&calendar_type=departure_date&currency=usd&token=${TOKEN}`;
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
