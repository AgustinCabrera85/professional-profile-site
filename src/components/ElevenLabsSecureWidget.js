const TRUSTED_URLS = {
  githubProfile: "https://github.com/AgustinCabrera85",
  linkedInProfile: "https://www.linkedin.com/in/gerardo-agustin-cabrera-a0a38b58",
};

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

const LANGUAGE_VALUES = {
  en: "en",
  es: "es",
};

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const openTrustedUrl = (url, label) => {
  const openedWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (!openedWindow) {
    return {
      success: false,
      message: `The browser blocked the new tab for ${label}. Please allow popups for this site.`,
      url,
    };
  }

  return {
    success: true,
    message: `Opened ${label} in a new tab.`,
    url,
  };
};

const scrollToElementById = (targetId) => {
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
    message: `Scrolled to section "${targetId}".`,
  };
};

const flashElement = (element) => {
  element.classList.add("cv-assistant-highlight");

  window.setTimeout(() => {
    element.classList.remove("cv-assistant-highlight");
  }, 2200);
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
        existingScript.addEventListener(
          "error",
          () => reject(new Error("Failed to load ElevenLabs script")),
          { once: true }
        );
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
    widget.addEventListener("elevenlabs-convai:call", (event) => {
      console.log("[ElevenLabs] Call event received. Registering client tools.");

      event.detail.config.clientTools = {
        openProject: ({ projectId }) => {
          console.log("[ElevenLabs Tool] openProject called:", { projectId });

          const normalizedProjectId = normalizeValue(projectId);
          const url = PROJECT_URLS[normalizedProjectId];

          if (!url) {
            return {
              success: false,
              message: `Unknown projectId: ${projectId}`,
              allowedProjectIds: Object.keys(PROJECT_URLS),
            };
          }

          return openTrustedUrl(url, `project "${normalizedProjectId}"`);
        },

        scrollToSection: ({ sectionId }) => {
          console.log("[ElevenLabs Tool] scrollToSection called:", { sectionId });

          const normalizedSectionId = normalizeValue(sectionId);
          const targetId = SECTION_IDS[normalizedSectionId];

          if (!targetId) {
            return {
              success: false,
              message: `Unknown sectionId: ${sectionId}`,
              allowedSectionIds: Object.keys(SECTION_IDS),
            };
          }

          return scrollToElementById(targetId);
        },

        openGitHub: () => {
          console.log("[ElevenLabs Tool] openGitHub called");
          return openTrustedUrl(TRUSTED_URLS.githubProfile, "GitHub profile");
        },

        openLinkedIn: () => {
          console.log("[ElevenLabs Tool] openLinkedIn called");
          return openTrustedUrl(TRUSTED_URLS.linkedInProfile, "LinkedIn profile");
        },

        downloadCV: () => {
          console.log("[ElevenLabs Tool] downloadCV called");

          const exportButton = document.querySelector("[data-resume-export]");

          if (!exportButton) {
            return {
              success: false,
              message: "The CV export button was not found on the page.",
            };
          }

          exportButton.click();

          return {
            success: true,
            message: "Triggered CV export.",
          };
        },

        switchLanguage: ({ language }) => {
          console.log("[ElevenLabs Tool] switchLanguage called:", { language });

          const normalizedLanguage = normalizeValue(language);
          const targetLanguage = LANGUAGE_VALUES[normalizedLanguage];

          if (!targetLanguage) {
            return {
              success: false,
              message: `Unsupported language: ${language}`,
              allowedLanguages: Object.keys(LANGUAGE_VALUES),
            };
          }

          const currentLanguage = document.documentElement.lang;

          if (currentLanguage === targetLanguage) {
            return {
              success: true,
              message: `The website is already using language "${targetLanguage}".`,
            };
          }

          localStorage.setItem("profile-site-language", targetLanguage);
          document.documentElement.lang = targetLanguage;

          window.dispatchEvent(
            new CustomEvent("languagechange", {
              detail: { language: targetLanguage },
            })
          );

          return {
            success: true,
            message: `Switched website language to "${targetLanguage}".`,
          };
        },

        showContactOptions: () => {
          console.log("[ElevenLabs Tool] showContactOptions called");
          return scrollToElementById("about");
        },

        highlightSkill: ({ skill }) => {
          console.log("[ElevenLabs Tool] highlightSkill called:", { skill });

          const normalizedSkill = normalizeValue(skill);

          if (!normalizedSkill) {
            return {
              success: false,
              message: "Missing skill value.",
            };
          }

          const candidates = Array.from(
            document.querySelectorAll(".tag, .tag-list span, .skill-pill, li, span")
          );

          const matchedElement = candidates.find((element) => {
            return normalizeValue(element.textContent).includes(normalizedSkill);
          });

          if (!matchedElement) {
            return {
              success: false,
              message: `Skill "${skill}" was not found on the visible page.`,
            };
          }

          matchedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });

          flashElement(matchedElement);

          return {
            success: true,
            message: `Highlighted skill "${skill}".`,
          };
        },
      };
    });
  }

  registerManualDebugTools() {
    window.cvAssistantTools = {
      openProject: (projectId) => {
        const normalizedProjectId = normalizeValue(projectId);
        const url = PROJECT_URLS[normalizedProjectId];

        if (!url) {
          console.warn("[Manual Test] Unknown projectId:", projectId);
          return;
        }

        return openTrustedUrl(url, `project "${normalizedProjectId}"`);
      },

      scrollToSection: (sectionId) => {
        const normalizedSectionId = normalizeValue(sectionId);
        const targetId = SECTION_IDS[normalizedSectionId];

        if (!targetId) {
          console.warn("[Manual Test] Unknown sectionId:", sectionId);
          return;
        }

        return scrollToElementById(targetId);
      },

      openGitHub: () => openTrustedUrl(TRUSTED_URLS.githubProfile, "GitHub profile"),

      openLinkedIn: () => openTrustedUrl(TRUSTED_URLS.linkedInProfile, "LinkedIn profile"),

      downloadCV: () => {
        const exportButton = document.querySelector("[data-resume-export]");

        if (!exportButton) {
          console.warn("[Manual Test] CV export button not found");
          return;
        }

        exportButton.click();
      },

      switchLanguage: (language) => {
        const targetLanguage = LANGUAGE_VALUES[normalizeValue(language)];

        if (!targetLanguage) {
          console.warn("[Manual Test] Unsupported language:", language);
          return;
        }

        localStorage.setItem("profile-site-language", targetLanguage);
        document.documentElement.lang = targetLanguage;

        window.dispatchEvent(
          new CustomEvent("languagechange", {
            detail: { language: targetLanguage },
          })
        );
      },

      showContactOptions: () => scrollToElementById("about"),

      highlightSkill: (skill) => {
        const normalizedSkill = normalizeValue(skill);

        const candidates = Array.from(
          document.querySelectorAll(".tag, .tag-list span, .skill-pill, li, span")
        );

        const matchedElement = candidates.find((element) => {
          return normalizeValue(element.textContent).includes(normalizedSkill);
        });

        if (!matchedElement) {
          console.warn("[Manual Test] Skill not found:", skill);
          return;
        }

        matchedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        flashElement(matchedElement);
      },
    };

    console.log("[ElevenLabs] Manual debug tools available at window.cvAssistantTools");
  }
}

customElements.define("elevenlabs-secure-widget", ElevenLabsSecureWidget);