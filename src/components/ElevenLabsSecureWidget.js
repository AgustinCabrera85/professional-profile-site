const PROJECT_URLS = {
  "bosque-babylon": "https://github.com/AgustinCabrera85/bosque-babylon",
  "app-status-board": "https://github.com/AgustinCabrera85/app-status-board",
  "probar-tool": "https://github.com/AgustinCabrera85/probar-tool",
  "automation-best-practices": "https://github.com/AgustinCabrera85/automation-best-practices",
};

const SECTION_IDS = {
  top: "top",
  about: "about",
  focus: "focus",
  experience: "experience",
  projects: "projects",
  "additional-aptitudes": "additional-aptitudes",
  skills: "skills",
  education: "education",
};

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

      await this.loadElevenLabsWidgetScript();

      const widget = this.querySelector("elevenlabs-convai");

      if (!widget) {
        console.error("ElevenLabs widget element was not found");
        return;
      }

      this.registerClientTools(widget);
    } catch (error) {
      console.error("Failed to initialize ElevenLabs widget", error);
    }
  }

  loadElevenLabsWidgetScript() {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        'script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]'
      );

      if (existingScript) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";

      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Failed to load ElevenLabs widget script"));

      document.body.appendChild(script);
    });
  }

  registerClientTools(widget) {
    widget.addEventListener("elevenlabs-convai:call", (event) => {
      event.detail.config.clientTools = {
        openProject: ({ projectId }) => {
          const normalizedProjectId = String(projectId || "").trim().toLowerCase();
          const url = PROJECT_URLS[normalizedProjectId];

          if (!url) {
            return {
              success: false,
              message: `Unknown projectId: ${projectId}`,
              allowedProjectIds: Object.keys(PROJECT_URLS),
            };
          }

          window.open(url, "_blank", "noopener,noreferrer");

          return {
            success: true,
            message: `Opened project ${normalizedProjectId} in a new tab.`,
            url,
          };
        },

        scrollToSection: ({ sectionId }) => {
          const normalizedSectionId = String(sectionId || "").trim().toLowerCase();
          const targetId = SECTION_IDS[normalizedSectionId];

          if (!targetId) {
            return {
              success: false,
              message: `Unknown sectionId: ${sectionId}`,
              allowedSectionIds: Object.keys(SECTION_IDS),
            };
          }

          const targetElement = document.getElementById(targetId);

          if (!targetElement) {
            return {
              success: false,
              message: `Section "${targetId}" was not found on the page.`,
            };
          }

          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });

          window.history.replaceState(null, "", `#${targetId}`);

          return {
            success: true,
            message: `Scrolled to section ${targetId}.`,
          };
        },
      };
    });
  }
}

customElements.define("elevenlabs-secure-widget", ElevenLabsSecureWidget);