/**
 * Site configuration.
 *
 * Every value here is optional. Leave a string empty ("") and the UI element that
 * depends on it stays hidden — no dead links, no mailto fallbacks.
 *
 * Nested keys are addressed with dots in the markup, e.g.
 *   <a data-site-link="projects.basitCaseStudy">
 */
window.SITE_CONFIG = {
  /** Used by the contact form (mailto:) and every "Email" link */
  email: "abdulla.jouda@gmail.com",

  /**
   * Phone is intentionally empty by default: a number on a public page gets
   * scraped for spam within days. Paste "+970595921528" here to show the row.
   */
  phone: "",

  /** Social — each one hides itself while empty */
  github: "https://github.com/abdullajouda",
  linkedin: "",
  twitter: "",

  /**
   * Relative path (e.g. "resume.pdf") or a full URL.
   * Setting this reveals the Resume button in the nav, the mobile menu,
   * and the download button on the experience page.
   */
  resume: "",

  projects: {
    /** Add a public case study or demo URL when one exists */
    coinplusCaseStudy: "",
    mashaaPlayStore: "https://play.google.com/store/apps/details?id=com.mashaa.ngn",
    mashaaAppStore: "https://apps.apple.com/es/app/mashaa/id6737334856?l=en-GB",
    basitCaseStudy: "https://basit.app/",
    ocsCaseStudy: "https://www.omniya-kw.com/en",
    finestAppStore:
      "https://apps.apple.com/us/app/finest-%D9%81%D8%A7%D9%8A%D9%86%D8%B3%D8%AA/id1530031871",
  },
};
