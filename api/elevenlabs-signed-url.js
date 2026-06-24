export default {
  async fetch(request) {
    if (request.method !== "GET") {
      return Response.json(
        { error: "Method not allowed" },
        { status: 405 }
      );
    }

    const agentId = process.env.ELEVENLABS_AGENT_ID;
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!agentId || !apiKey) {
      return Response.json(
        { error: "Missing ElevenLabs environment variables" },
        { status: 500 }
      );
    }

    try {
      const url = new URL(
        "https://api.elevenlabs.io/v1/convai/conversation/get-signed-url"
      );

      url.searchParams.set("agent_id", agentId);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "xi-api-key": apiKey,
        },
      });

      if (!response.ok) {
        const detail = await response.text();

        return Response.json(
          {
            error: "Failed to create ElevenLabs signed URL",
            detail,
          },
          { status: response.status }
        );
      }

      const data = await response.json();

      return Response.json({
        signedUrl: data.signed_url,
      });
    } catch (error) {
      return Response.json(
        { error: "Unexpected server error" },
        { status: 500 }
      );
    }
  },
};