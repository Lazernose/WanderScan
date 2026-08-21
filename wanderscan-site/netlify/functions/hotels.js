// Same idea as monthly.js — this proxies the Hotellook hotel-search
// call through Netlify's server so the browser never has to make the
// cross-origin request itself.
// Called at /.netlify/functions/hotels?location=X&checkIn=Y&checkOut=Z

const TOKEN = "8b616346cd9e4befc3a8a9d7482bb0c3";

exports.handler = async (event) => {
  const { location, checkIn, checkOut } = event.queryStringParameters || {};

  if (!location || !checkIn || !checkOut) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ success: false, error: "Missing location, checkIn, or checkOut" })
    };
  }

  try {
    const url = `https://engine.hotellook.com/api/v2/cache.json?location=${encodeURIComponent(location)}&checkIn=${checkIn}&checkOut=${checkOut}&currency=usd&limit=20&token=${TOKEN}`;
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
