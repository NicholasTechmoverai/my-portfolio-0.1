import { marked } from 'marked'
import hljs from 'highlight.js'

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
})

// -----------------------------
// Helpers
// -----------------------------

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function escapeForAttribute(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '&quot;')
    .replace(/`/g, '&#96;')
    .replace(/\n/g, '&#10;')
}

// -----------------------------
// Custom Renderer
// -----------------------------

const renderer = new marked.Renderer()

renderer.code = ({ text, lang }: any) => {
  const language = lang || 'plaintext'

  let highlighted = ''

  try {
    highlighted = hljs.getLanguage(language)
      ? hljs.highlight(text, {
          language,
          ignoreIllegals: true,
        }).value
      : hljs.highlightAuto(text).value
  } catch {
    highlighted = escapeHtml(text)
  }

  const escapedCode = escapeForAttribute(text)

  return `
    <div class="msg-code-block">
      <div class="msg-code-header">
        <span class="msg-code-lang">
          ${language}
        </span>

        <button
          class="msg-copy-btn"
          data-code="${escapedCode}"
          type="button"
        >
          <svg
            class="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <rect
              x="9"
              y="9"
              width="13"
              height="13"
              rx="2"
              ry="2"
            />
            <path
              d="M5 15H4a2 2 0 0 1-2-2V4
                 a2 2 0 0 1 2-2h9
                 a2 2 0 0 1 2 2v1"
            />
          </svg>

          <span>Copy</span>
        </button>
      </div>

      <pre class="msg-code-content">
        <code class="hljs language-${language}">
${highlighted}
        </code>
      </pre>
    </div>
  `
}

// -----------------------------
// Badge Syntax
// Example:
// ::green[text]::
// -----------------------------

function parseBadges(html: string): string {
  return html
    .replace(
      /::green\[(.+?)\]::/g,
      '<span class="msg-badge msg-badge--green">$1</span>'
    )
    .replace(
      /::blue\[(.+?)\]::/g,
      '<span class="msg-badge msg-badge--blue">$1</span>'
    )
    .replace(
      /::amber\[(.+?)\]::/g,
      '<span class="msg-badge msg-badge--amber">$1</span>'
    )
    .replace(
      /::red\[(.+?)\]::/g,
      '<span class="msg-badge msg-badge--red">$1</span>'
    )
    .replace(
      /::purple\[(.+?)\]::/g,
      '<span class="msg-badge msg-badge--purple">$1</span>'
    )
}

// -----------------------------
// Main Render Function
// -----------------------------

export function renderMessage(content: unknown): string {
  if (typeof content !== 'string') {
    return '<p>Invalid message</p>'
  }

  try {
    const html = marked(content, {
      renderer,
    }) as string

    return parseBadges(html)
  } catch (error) {
    console.error('Markdown render error:', error)

    return `
      <p>
        Failed to render message.
      </p>
    `
  }
}

// -----------------------------
// Copy Button Handler
// Since v-html can't use @click
// -----------------------------

if (typeof window !== 'undefined') {
  document.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement

    const button = target.closest(
      '.msg-copy-btn'
    ) as HTMLButtonElement | null

    if (!button) return

    const code =
      button.getAttribute('data-code')

    if (!code) return

    try {
      await navigator.clipboard.writeText(code)

      const label =
        button.querySelector('span')

      if (!label) return

      const original = label.textContent

      label.textContent = 'Copied!'

      setTimeout(() => {
        label.textContent =
          original || 'Copy'
      }, 1500)
    } catch (err) {
      console.error(
        'Failed to copy code:',
        err
      )
    }
  })
}