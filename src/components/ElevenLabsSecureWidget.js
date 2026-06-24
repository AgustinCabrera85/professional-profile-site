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
    console.log("[ElevenLabs] Secure widget mounting...");

    try {
      const response = await fetch("/api/elevenlabs-signed-url");

      if (!response.ok) {
        console.error("[ElevenLabs] Could not get signed URL", await response.text());
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

      if (customElements?.whenDefined) {
        await customElements.whenDefined("elevenlabs-convai");
      }

      const widget = this.querySelector("elevenlabs-convai");

      if (!widget) {
        console.error("[ElevenLabs] Widget element was not found");
        return;
      }

      this.registerClientTools(widget);
      this.registerManualDebugTools();

      console.log("[ElevenLabs] Widget ready. Client tools registered.");
    } catch (error) {
      console.error("[ElevenLabs] Failed to initialize widget", error);
    }
  }

  loadElevenLabsWidgetScript() {
    return new Promise((resolve, reject) => {
      const existingScript = document.querySelector(
        'script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]'
      );

      if (existingScript?.dataset.loaded === "true") {
        resolve();
        return;
      }

      if (existingScript) {
        existingScript.addEventListener("load", () => resolve(), { once: true });
        existingScript.addEventListener("error", () => reject(new Error("Failed to load ElevenLabs script")), { once: true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;
      script.type = "text/javascript";

      script.onload = () => {
        script.dataset.loaded = "true";
        resolve();
      };

      script.onerror = () => reject(new Error("Failed to load ElevenLabs widget script"));

      document.body.appendChild(script);
    });
  }

  registerClientTools(widget) {
    console.log("[ElevenLabs] Waiting for elevenlabs-convai:call event...");

    widget.addEventListener("elevenlabs-convai:call", (event) => {
      console.log("[ElevenLabs] Call event received. Registering tools in event config.");

      event.detail.config.clientTools = {
        openProject: ({ projectId }) => {
          console.log("[ElevenLabs Tool] openProject called with:", { projectId });

          const normalizedProjectId = String(projectId || "").trim().toLowerCase();
          const url = PROJECT_URLS[normalizedProjectId];

          if (!url) {
            console.warn("[ElevenLabs Tool] Unknown projectId:", projectId);

            return {
              success: false,
              message: `Unknown projectId: ${projectId}`,
              allowedProjectIds: Object.keys(PROJECT_URLS),
            };
          }

          const openedWindow = window.open(url, "_blank", "noopener,noreferrer");

          if (!openedWindow) {
            console.warn("[ElevenLabs Tool] Browser blocked the popup/new tab.");

            return {
              success: false,
              message: "The browser blocked the new tab. Please allow popups for this site or use the visible project link.",
              url,
            };
          }

          return {
            success: true,
            message: `Opened project ${normalizedProjectId} in a new tab.`,
            url,
          };
        },

        scrollToSection: ({ sectionId }) => {
          console.log("[ElevenLabs Tool] scrollToSection called with:", { sectionId });

          const normalizedSectionId = String(sectionId || "").trim().toLowerCase();
          const targetId = SECTION_IDS[normalizedSectionId];

          if (!targetId) {
            console.warn("[ElevenLabs Tool] Unknown sectionId:", sectionId);

            return {
              success: false,
              message: `Unknown sectionId: ${sectionId}`,
              allowedSectionIds: Object.keys(SECTION_IDS),
            };
          }

          const targetElement = document.getElementById(targetId);

          if (!targetElement) {
            console.warn("[ElevenLabs Tool] Section not found in DOM:", targetId);

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

  registerManualDebugTools() {
    window.cvAssistantTools = {
      openProject: (projectId) => {
        const url = PROJECT_URLS[String(projectId || "").trim().toLowerCase()];

        if (!url) {
          console.warn("[Manual Test] Unknown projectId:", projectId);
          return;
        }

        window.open(url, "_blank", "noopener,noreferrer");
      },

      scrollToSection: (sectionId) => {
        const targetId = SECTION_IDS[String(sectionId || "").trim().toLowerCase()];
        const targetElement = targetId ? document.getElementById(targetId) : null;

        if (!targetElement) {
          console.warn("[Manual Test] Unknown or missing section:", sectionId);
          return;
        }

        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        window.history.replaceState(null, "", `#${targetId}`);
      },
    };

    console.log("[ElevenLabs] Manual debug tools available at window.cvAssistantTools");
  }
}

customElements.define("elevenlabs-secure-widget", ElevenLabsSecureWidget);