const fs = require('fs')
const path = require('path')

/**
 * Parse content.md and generate content.ts
 * Run this script after modifying content.md
 * 
 * Usage: node scripts/parse-content.js
 */

function parseContentFile() {
  const contentPath = path.join(__dirname, '..', 'content.md')
  
  if (!fs.existsSync(contentPath)) {
    console.error('❌ content.md not found!')
    console.log('Please create content.md file first.')
    process.exit(1)
  }
  
  const content = fs.readFileSync(contentPath, 'utf8')
  const lines = content.split('\n')
  
  const result = {
    site: {},
    nav: {},
    home: {},
    services: {},
    pricing: {},
    contact: {},
    diagnosis: {},
    footer: {},
    modules: {},
    cases: {},
    options: {}
  }
  
  let currentSection = null
  let currentSubsection = null
  let currentModule = null
  let currentCase = null
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    
    // Skip empty lines and comments
    if (!line || line.startsWith('>')) continue
    
    // Parse sections
    if (line.startsWith('## ')) {
      const sectionName = line.replace('## ', '').trim()
      if (sectionName.includes('全局配置')) currentSection = 'site'
      else if (sectionName.includes('导航')) currentSection = 'nav'
      else if (sectionName.includes('首页')) currentSection = 'home'
      else if (sectionName.includes('服务页')) currentSection = 'services'
      else if (sectionName.includes('定价页')) currentSection = 'pricing'
      else if (sectionName.includes('联系页')) currentSection = 'contact'
      else if (sectionName.includes('诊断')) currentSection = 'diagnosis'
      else if (sectionName.includes('页脚')) currentSection = 'footer'
      else if (sectionName.includes('服务模块')) currentSection = 'modules'
      else if (sectionName.includes('成功案例')) currentSection = 'cases'
      else if (sectionName.includes('下拉选项')) currentSection = 'options'
      continue
    }
    
    // Parse subsections
    if (line.startsWith('### ')) {
      currentSubsection = line.replace('### ', '').trim()
      continue
    }
    
    // Parse module details (####)
    if (line.startsWith('#### ')) {
      const moduleName = line.replace('#### ', '').trim()
      if (currentSection === 'modules') {
        if (!result.modules[moduleName]) {
          result.modules[moduleName] = {}
        }
        currentModule = moduleName
      }
      continue
    }
    
    // Parse case details (####)
    if (line.startsWith('### 案例') && currentSection === 'cases') {
      const caseMatch = line.match(/案例\d+：(.+)/)
      if (caseMatch) {
        const caseName = caseMatch[1]
        if (!result.cases[caseName]) {
          result.cases[caseName] = {}
        }
        currentCase = caseName
      }
      continue
    }
    
    // Parse key-value pairs
    const match = line.match(/^- \*\*(.+?)\*\*:\s*(.+)$/)
    if (match) {
      const key = match[1].trim()
      const value = match[2].trim()
      
      if (currentSection === 'site') {
        if (!result.site[currentSubsection]) result.site[currentSubsection] = {}
        result.site[currentSubsection][key] = value
      } else if (currentSection === 'nav') {
        result.nav[key] = value
      } else if (currentSection === 'home') {
        if (!result.home[currentSubsection]) result.home[currentSubsection] = {}
        result.home[currentSubsection][key] = value
      } else if (currentSection === 'services') {
        if (!result.services[currentSubsection]) result.services[currentSubsection] = {}
        result.services[currentSubsection][key] = value
      } else if (currentSection === 'pricing') {
        if (!result.pricing[currentSubsection]) result.pricing[currentSubsection] = {}
        result.pricing[currentSubsection][key] = value
      } else if (currentSection === 'contact') {
        if (!result.contact[currentSubsection]) result.contact[currentSubsection] = {}
        result.contact[currentSubsection][key] = value
      } else if (currentSection === 'diagnosis') {
        if (!result.diagnosis[currentSubsection]) result.diagnosis[currentSubsection] = {}
        result.diagnosis[currentSubsection][key] = value
      } else if (currentSection === 'footer') {
        if (!result.footer[currentSubsection]) result.footer[currentSubsection] = {}
        result.footer[currentSubsection][key] = value
      } else if (currentSection === 'modules' && currentModule) {
        result.modules[currentModule][key] = value
      } else if (currentSection === 'cases' && currentCase) {
        result.cases[currentCase][key] = value
      } else if (currentSection === 'options') {
        if (!result.options[currentSubsection]) result.options[currentSubsection] = []
        result.options[currentSubsection].push(value)
      }
    }
    
    // Parse list items for features
    if (line.startsWith('  - ') || line.startsWith('- ')) {
      const item = line.replace(/^[\s-]+/, '').trim()
      if (currentSection === 'modules' && currentModule) {
        if (!result.modules[currentModule].features) {
          result.modules[currentModule].features = []
        }
        if (!item.includes('功能列表') && item !== '功能') {
          result.modules[currentModule].features.push(item)
        }
      }
    }
  }
  
  // Generate TypeScript file
  const tsContent = generateTypeScriptContent(result)
  
  const outputPath = path.join(__dirname, '..', 'src', 'lib', 'content.ts')
  fs.writeFileSync(outputPath, tsContent, 'utf8')
  
  console.log('✅ Content parsed successfully!')
  console.log(`📄 Generated: src/lib/content.ts`)
  console.log(`\nSections found:`)
  Object.keys(result).forEach(key => {
    const count = Object.keys(result[key]).length
    if (count > 0) {
      console.log(`  - ${key}: ${count} items`)
    }
  })
}

function generateTypeScriptContent(data) {
  return `/**
 * Auto-generated content file
 * Generated from content.md
 * Do not edit this file directly - edit content.md instead
 * Run: node scripts/parse-content.js
 */

export const siteContent = ${JSON.stringify(data.site, null, 2)}

export const navContent = ${JSON.stringify(data.nav, null, 2)}

export const homeContent = ${JSON.stringify(data.home, null, 2)}

export const servicesContent = ${JSON.stringify(data.services, null, 2)}

export const pricingContent = ${JSON.stringify(data.pricing, null, 2)}

export const contactContent = ${JSON.stringify(data.contact, null, 2)}

export const diagnosisContent = ${JSON.stringify(data.diagnosis, null, 2)}

export const footerContent = ${JSON.stringify(data.footer, null, 2)}

export const modulesContent = ${JSON.stringify(data.modules, null, 2)}

export const casesContent = ${JSON.stringify(data.cases, null, 2)}

export const optionsContent = ${JSON.stringify(data.options, null, 2)}

// Helper function to get content with fallback
export function getContent<T>(content: T, key: string, fallback: string): string {
  const keys = key.split('.')
  let result: any = content
  
  for (const k of keys) {
    if (result && typeof result === 'object' && k in result) {
      result = result[k]
    } else {
      return fallback
    }
  }
  
  return typeof result === 'string' ? result : fallback
}
`
}

parseContentFile()
