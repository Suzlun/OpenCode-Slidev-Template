import fs from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

const ROOT = process.cwd()
const DECKS_DIR = path.join(ROOT, 'decks')
const TEMPLATES_DIR = path.join(ROOT, 'templates')
const DOCS_DIR = path.join(ROOT, 'docs')

const COMMANDS = new Set([
  'list',
  'template-list',
  'new',
  'dev',
  'build',
  'export-pdf',
  'export-pptx',
  'validate',
  'template-validate',
])

const args = process.argv.slice(2)
const command = args[0]

if (!COMMANDS.has(command)) {
  printUsage()
  process.exit(1)
}

switch (command) {
  case 'list':
    listDirs(DECKS_DIR)
    break
  case 'template-list':
    listDirs(TEMPLATES_DIR)
    break
  case 'new':
    createDeck(args[1], args[2])
    break
  case 'dev':
    runDev(args[1])
    break
  case 'build':
    runBuild(args[1])
    break
  case 'export-pdf':
    runExportPdf(args[1])
    break
  case 'export-pptx':
    runExportPptx(args[1])
    break
  case 'validate':
    validateDecks()
    break
  case 'template-validate':
    validateTemplates()
    break
  default:
    printUsage()
    process.exit(1)
}

function listDirs(baseDir) {
  ensureDir(baseDir)
  const entries = fs.readdirSync(baseDir, { withFileTypes: true })
  const names = entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
  if (names.length === 0) {
    console.log('No entries found.')
    return
  }
  names.sort().forEach((name) => console.log(name))
}

function createDeck(deckName, templateName) {
  if (!deckName || !templateName) {
    console.error('Usage: pnpm deck:new <deck> <template>')
    process.exit(1)
  }

  const safeDeck = sanitizeName(deckName)
  const deckPath = path.join(DECKS_DIR, safeDeck)
  const templatePath = path.join(TEMPLATES_DIR, templateName)

  if (!fs.existsSync(templatePath)) {
    console.error(`Template not found: ${templateName}`)
    process.exit(1)
  }

  if (fs.existsSync(deckPath)) {
    console.error(`Deck already exists: ${safeDeck}`)
    process.exit(1)
  }

  ensureDir(DECKS_DIR)
  fs.cpSync(templatePath, deckPath, { recursive: true })

  const title = formatTitle(safeDeck)
  const deckConfigPath = path.join(deckPath, 'deck.yml')
  if (fs.existsSync(deckConfigPath)) {
    const updated = updateDeckYaml(fs.readFileSync(deckConfigPath, 'utf-8'), {
      name: safeDeck,
      title,
      template: templateName,
    })
    fs.writeFileSync(deckConfigPath, updated)
  }

  const slidesPath = path.join(deckPath, 'slides.md')
  if (fs.existsSync(slidesPath)) {
    const updated = updateSlidesTitle(fs.readFileSync(slidesPath, 'utf-8'), title)
    fs.writeFileSync(slidesPath, updated)
  }

  console.log(`Created deck: ${safeDeck}`)
}

function runDev(deckName) {
  const deckPath = resolveDeck(deckName)
  const entry = path.join(deckPath, 'slides.md')
  runSlidev(['exec', 'slidev', entry, '--port', '3030'])
}

function runBuild(deckName) {
  const deckPath = resolveDeck(deckName)
  const entry = path.join(deckPath, 'slides.md')
  const outDir = path.join(DOCS_DIR, 'build', deckName)
  ensureDir(outDir)
  runSlidev(['exec', 'slidev', 'build', entry, '--out', outDir])
}

function runExportPdf(deckName) {
  const deckPath = resolveDeck(deckName)
  const entry = path.join(deckPath, 'slides.md')
  const outputs = getDeckOutputs(deckPath)
  const outputPath = outputs.pdf || path.join(deckPath, 'out', 'slides.pdf')
  ensureDir(path.dirname(outputPath))
  runSlidev(['exec', 'slidev', 'export', entry, '--format', 'pdf', '--output', outputPath])
}

function runExportPptx(deckName) {
  console.log('PPTX export is an exception path. Use only when needed.')
  const deckPath = resolveDeck(deckName)
  const entry = path.join(deckPath, 'slides.md')
  const outputs = getDeckOutputs(deckPath)
  const outputPath = outputs.pptx || path.join(deckPath, 'out', 'slides.pptx')
  ensureDir(path.dirname(outputPath))
  const result = runSlidev(
    ['exec', 'slidev', 'export', entry, '--format', 'pptx', '--output', outputPath],
    { exitOnFail: false }
  )

  if (result.status !== 0) {
    console.error('PPTX export failed with file output. Try exporting to the output directory:')
    console.error(`pnpm exec slidev export ${entry} --format pptx --output ${path.dirname(outputPath)}`)
    process.exit(result.status ?? 1)
  }
}

function validateDecks() {
  ensureDir(DECKS_DIR)
  const decks = listDirectories(DECKS_DIR)
  if (decks.length === 0) {
    console.log('No decks found.')
    return
  }

  const errors = []
  const gitignore = readGitignore()

  for (const deck of decks) {
    const deckPath = path.join(DECKS_DIR, deck)
    const slidesPath = path.join(deckPath, 'slides.md')
    const deckConfigPath = path.join(deckPath, 'deck.yml')

    if (!fs.existsSync(slidesPath)) {
      errors.push(`${deck}: slides.md is missing`)
      continue
    }

    const slidesContent = fs.readFileSync(slidesPath, 'utf-8')
    const headmatter = extractHeadmatter(slidesContent)
    const themeMatch = headmatter.match(/^theme:\s*(.+)$/m)
    if (!headmatter || !themeMatch) {
      errors.push(`${deck}: frontmatter theme is missing`)
    } else {
      const themePath = themeMatch[1].trim()
      if (themePath.startsWith('.')) {
        const resolvedTheme = path.resolve(deckPath, themePath)
        if (!fs.existsSync(resolvedTheme)) {
          errors.push(`${deck}: theme not found ${themePath}`)
        }
      }
    }

    const addons = extractAddons(headmatter)
    for (const addon of addons) {
      if (addon.startsWith('.')) {
        const addonPath = path.resolve(deckPath, addon)
        if (!fs.existsSync(addonPath)) {
          errors.push(`${deck}: addon not found ${addon}`)
        }
      }
    }

    if (!fs.existsSync(deckConfigPath)) {
      errors.push(`${deck}: deck.yml is missing`)
    }

    if (!gitignore.includes('**/out')) {
      errors.push(`${deck}: .gitignore must include **/out`)
    }
  }

  if (errors.length > 0) {
    console.error('Validation failed:')
    errors.forEach((err) => console.error(`- ${err}`))
    process.exit(1)
  }

  console.log('All decks validated successfully.')
}

function validateTemplates() {
  ensureDir(TEMPLATES_DIR)
  const templates = listDirectories(TEMPLATES_DIR)
  if (templates.length === 0) {
    console.log('No templates found.')
    return
  }

  const errors = []
  for (const template of templates) {
    const templatePath = path.join(TEMPLATES_DIR, template)
    const slidesPath = path.join(templatePath, 'slides.md')
    const deckConfigPath = path.join(templatePath, 'deck.yml')

    if (!fs.existsSync(slidesPath)) {
      errors.push(`${template}: slides.md is missing`)
    }

    if (!fs.existsSync(deckConfigPath)) {
      errors.push(`${template}: deck.yml is missing`)
    }
  }

  if (errors.length > 0) {
    console.error('Template validation failed:')
    errors.forEach((err) => console.error(`- ${err}`))
    process.exit(1)
  }

  console.log('All templates validated successfully.')
}

function runSlidev(argsList, options = {}) {
  const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm'
  const result = spawnSync(command, argsList, { stdio: 'inherit' })
  if (options.exitOnFail === false) {
    return result
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
  return result
}

function resolveDeck(deckName) {
  if (!deckName) {
    console.error('Deck name is required.')
    process.exit(1)
  }
  if (deckName.includes('/') || deckName.includes('..')) {
    console.error('Deck name must not include path separators.')
    process.exit(1)
  }
  const deckPath = path.join(DECKS_DIR, deckName)
  if (!fs.existsSync(deckPath)) {
    console.error(`Deck not found: ${deckName}`)
    process.exit(1)
  }
  return deckPath
}

function listDirectories(baseDir) {
  return fs
    .readdirSync(baseDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

function sanitizeName(name) {
  if (name.includes('/') || name.includes('..')) {
    console.error('Deck name must not include path separators.')
    process.exit(1)
  }
  return name.trim()
}

function formatTitle(name) {
  return name
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function updateDeckYaml(content, updates) {
  let next = content
  next = replaceYamlValue(next, 'name', updates.name)
  next = replaceYamlValue(next, 'title', updates.title)
  next = replaceYamlValue(next, 'template', updates.template)
  return next
}

function replaceYamlValue(content, key, value) {
  const pattern = new RegExp(`^${key}:.*$`, 'm')
  if (pattern.test(content)) {
    return content.replace(pattern, `${key}: ${value}`)
  }
  return `${key}: ${value}\n${content}`
}

function updateSlidesTitle(content, title) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) {
    return `---\ntitle: ${title}\n---\n\n${content}`
  }
  const headmatter = match[1]
  let updated = headmatter
  if (/^title:\s*.+/m.test(headmatter)) {
    updated = headmatter.replace(/^title:\s*.+/m, `title: ${title}`)
  } else {
    updated = `title: ${title}\n${headmatter}`
  }
  return content.replace(headmatter, updated)
}

function extractHeadmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  return match ? match[1] : ''
}

function extractAddons(headmatter) {
  if (!headmatter) return []
  const lines = headmatter.split(/\r?\n/)
  const addons = []
  let inAddons = false
  for (const line of lines) {
    if (/^addons:\s*$/.test(line.trim())) {
      inAddons = true
      continue
    }
    if (inAddons) {
      if (/^\s*-\s+/.test(line)) {
        addons.push(line.trim().replace(/^-\s+/, ''))
        continue
      }
      if (/^\S/.test(line)) {
        inAddons = false
      }
    }
  }
  return addons
}

function parseYaml(content) {
  const result = {}
  const lines = content.split(/\r?\n/)
  let currentKey = null

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const indent = line.match(/^\s*/)[0].length
    if (indent === 0) {
      const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
      if (!match) continue
      const [, key, rawValue] = match
      if (rawValue === '') {
        currentKey = key
        if (!(key in result)) result[key] = {}
        continue
      }
      result[key] = rawValue
      currentKey = null
    } else if (currentKey) {
      const trimmed = line.trim()
      if (trimmed.startsWith('- ')) {
        if (!Array.isArray(result[currentKey])) result[currentKey] = []
        result[currentKey].push(trimmed.slice(2))
      } else {
        const match = trimmed.match(/^([A-Za-z0-9_-]+):\s*(.*)$/)
        if (match) {
          if (Array.isArray(result[currentKey]) || typeof result[currentKey] !== 'object') {
            result[currentKey] = {}
          }
          result[currentKey][match[1]] = match[2]
        }
      }
    }
  }

  return result
}

function getDeckOutputs(deckPath) {
  const deckConfigPath = path.join(deckPath, 'deck.yml')
  if (!fs.existsSync(deckConfigPath)) return {}
  const config = parseYaml(fs.readFileSync(deckConfigPath, 'utf-8'))
  const outputs = config.outputs || {}
  return {
    pdf: resolveOutputPath(deckPath, outputs.pdf),
    pptx: resolveOutputPath(deckPath, outputs.pptx),
  }
}

function resolveOutputPath(deckPath, outputPath) {
  if (!outputPath) return undefined
  return path.isAbsolute(outputPath) ? outputPath : path.resolve(deckPath, outputPath)
}

function readGitignore() {
  const gitignorePath = path.join(ROOT, '.gitignore')
  if (!fs.existsSync(gitignorePath)) return ''
  return fs.readFileSync(gitignorePath, 'utf-8')
}

function printUsage() {
  console.log('Usage: node scripts/deck.mjs <command> [args]')
  console.log('Commands:')
  console.log('  list')
  console.log('  template-list')
  console.log('  new <deck> <template>')
  console.log('  dev <deck>')
  console.log('  build <deck>')
  console.log('  export-pdf <deck>')
  console.log('  export-pptx <deck>')
  console.log('  validate')
  console.log('  template-validate')
}
