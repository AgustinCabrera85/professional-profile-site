class ElevenLabsSecureWidget extends HTMLElement {
  async connectedCallback() {
    try {
      const response = await fetch("/api/elevenlabs-signed-url");

      if (!response.ok) {
        console.error("Could not get ElevenLabs signed URL");
        return;
      }

      const { signedUrl } = await response.json();

      this.innerHTML = `
        <elevenlabs-convai
          signed-url="${signedUrl}"
          action-text="Ask my AI CV"
          start-call-text="Start conversation"
          end-call-text="End conversation"
          expand-text="Ask my CV"
          listening-text="Listening..."
          speaking-text="Agustín's assistant is speaking..."
          variant="expanded"
          dismissible="true">
        </elevenlabs-convai>
      `;

      if (!document.querySelector('script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]')) {
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
        script.async = true;
        script.type = "text/javascript";
        document.body.appendChild(script);
      }
    } catch (error) {
      console.error("Failed to initialize ElevenLabs widget", error);
    }
  }
}

customElements.define("elevenlabs-secure-widget", ElevenLabsSecureWidget);