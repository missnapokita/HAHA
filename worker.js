export default {
  async fetch(request, env) {
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" }
      });
    }

    const auth = request.headers.get("authorization");

    if (!auth || auth !== env.SECRET_TOKEN) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    try {
      const body = await request.json();

      const response = await fetch("https://xapiverse.com/api/terabox", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xAPIverse-Key": env.XAPIVERSE_KEY
        },
        body: JSON.stringify(body)
      });

      return new Response(await response.text(), {
        status: response.status,
        headers: { "Content-Type": "application/json" }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: e.toString() }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
