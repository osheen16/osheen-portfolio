/* ------------------------------------------------------------------
   Contact note box -> email.

   The site is static files, so there is no server of ours to post to.
   The form hands the message to FormSubmit, which forwards it as mail
   to SITE.email. Nothing to sign up for: the very first submission
   makes FormSubmit send a one-time activation link to that inbox, and
   once it is clicked every later message arrives directly.

   The subject line is built here rather than being a fixed hidden
   field, so it can carry the sender's name:

       Message from you website <name> — <their subject>

   Swapping providers later (Web3Forms, EmailJS, your own endpoint)
   means changing ENDPOINT and the body of buildPayload() — nothing
   else in the page knows how the mail is sent.
------------------------------------------------------------------- */

(function () {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const TARGET_EMAIL = (window.SITE && SITE.email) || "osheenbhardwaj9@gmail.com";
  const ENDPOINT = "https://formsubmit.co/ajax/" + TARGET_EMAIL;
  const SUBJECT_PREFIX = "Message from you website";

  const statusEl = document.getElementById("cf-status");
  const submitBtn = document.getElementById("cf-submit");
  const fields = {
    name: document.getElementById("cf-name"),
    email: document.getElementById("cf-email"),
    subject: document.getElementById("cf-subject"),
    message: document.getElementById("cf-message"),
  };
  const honey = document.getElementById("cf-company");

  /* ---------------- validation ---------------- */
  const RULES = {
    name: (v) => (v.length < 2 ? "Please tell me your name." : ""),
    email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "That email address doesn't look right."),
    subject: (v) => (v.length < 3 ? "A few words on what this is about?" : ""),
    message: (v) => (v.length < 10 ? "A little more detail, please." : ""),
  };

  function showError(key, msg) {
    const input = fields[key];
    const slot = form.querySelector('[data-error-for="' + input.id + '"]');
    if (slot) slot.textContent = msg;
    input.classList.toggle("invalid", !!msg);
    input.setAttribute("aria-invalid", msg ? "true" : "false");
  }

  function validate() {
    let firstBad = null;
    Object.keys(RULES).forEach((key) => {
      const msg = RULES[key](fields[key].value.trim());
      showError(key, msg);
      if (msg && !firstBad) firstBad = fields[key];
    });
    if (firstBad) firstBad.focus();
    return !firstBad;
  }

  // clear an error as soon as the visitor fixes it
  Object.keys(fields).forEach((key) => {
    fields[key].addEventListener("input", () => {
      if (fields[key].classList.contains("invalid")) {
        showError(key, RULES[key](fields[key].value.trim()));
      }
    });
  });

  /* ---------------- sending ---------------- */
  function buildPayload() {
    const name = fields.name.value.trim();
    const subject = fields.subject.value.trim();
    return {
      name: name,
      email: fields.email.value.trim(),
      subject: subject,
      message: fields.message.value.trim(),
      _subject: SUBJECT_PREFIX + " " + name + " — " + subject,
      _template: "table",
      _captcha: "false",
    };
  }

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.className = "note-status" + (kind ? " " + kind : "");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (honey && honey.value) return; // a bot filled the hidden field
    if (!validate()) {
      setStatus("Please fix the highlighted fields.", "err");
      return;
    }

    submitBtn.disabled = true;
    setStatus("Sending…", "");

    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(buildPayload()),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && String(data.success) !== "false") {
        form.classList.add("sent");
        setStatus("Sent — thanks, I'll get back to you.", "ok");
        form.reset();
      } else {
        // FormSubmit answers the very first submission with an
        // activation notice rather than delivering the mail
        setStatus(data.message || "That didn't go through. Try again in a moment?", "err");
      }
    } catch (err) {
      setStatus(
        "Couldn't reach the mail service. You can email me directly at " + TARGET_EMAIL + ".",
        "err"
      );
    } finally {
      submitBtn.disabled = false;
    }
  });
})();
