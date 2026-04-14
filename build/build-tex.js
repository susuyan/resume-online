const fs = require('fs');
const path = require('path');

function normalizeDate(str) {
  return str.replace(/[\s]*[～~][\s]*/g, ' -- ').trim();
}

function escapeTex(str) {
  return str
    .replace(/\\/g, '\\textbackslash{}')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde{}')
    .replace(/\^/g, '\\textasciicircum{}');
}

function parseResumeMarkdown(md) {
  const lines = md.split('\n');
  const result = {
    header: { name: '', title: '', contact: '', summary: '' },
    sections: []
  };

  let i = 0;

  // Parse header: first 3 lines are name, title, contact
  while (i < lines.length && !result.header.name) {
    const line = lines[i].trim();
    if (line.startsWith('# ')) {
      result.header.name = line.slice(2).trim();
    }
    i++;
  }

  if (i < lines.length) {
    result.header.title = lines[i].trim();
    i++;
  }

  while (i < lines.length && !result.header.contact) {
    const line = lines[i].trim();
    if (line !== '') {
      result.header.contact = line;
    }
    i++;
  }

  // Parse summary until ---
  while (i < lines.length) {
    const line = lines[i].trim();
    if (line === '---') {
      i++;
      break;
    }
    if (line !== '') {
      result.header.summary += (result.header.summary ? ' ' : '') + line;
    }
    i++;
  }

  // Parse sections
  while (i < lines.length) {
    const line = lines[i]?.trim() || '';

    if (line.startsWith('## ')) {
      const sectionTitle = line.slice(3).trim();
      const section = { title: sectionTitle, type: 'default', items: [] };
      i++;

      if (sectionTitle === 'PROJECT') section.type = 'project';
      else if (sectionTitle === 'EXPERIENCE') section.type = 'experience';
      else if (sectionTitle === '技能') section.type = 'skills';
      else if (sectionTitle === '教育背景') section.type = 'education';

      if (section.type === 'skills') {
        let content = '';
        while (i < lines.length && !lines[i].trim().startsWith('## ')) {
          const l = lines[i].trim();
          if (l === '---') {
            i++;
            continue;
          }
          if (l !== '') {
            content += (content ? ' ' : '') + l;
          }
          i++;
        }
        section.content = content;
      } else if (section.type === 'education') {
        while (i < lines.length && !lines[i].trim().startsWith('## ')) {
          const eduLine = lines[i].trim();
          if (eduLine.startsWith('**')) {
            const parts = eduLine.split(/\s*\|\s*/).map(s => s.trim());
            const name = parts[0].replace(/\*\*/g, '').trim();
            const detail = parts[1] || '';
            section.items.push({ name, detail });
          }
          i++;
        }
      } else {
        let currentItem = null;
        while (i < lines.length && !lines[i].trim().startsWith('## ')) {
          const itemLine = lines[i].trim();
          if (itemLine === '---') {
            i++;
            continue;
          }
          if (itemLine.startsWith('### ')) {
            if (currentItem) section.items.push(currentItem);
            currentItem = { name: itemLine.slice(4).trim(), role: '', tags: '', period: '', bullets: [] };
          } else if (currentItem && itemLine.startsWith('- ')) {
            currentItem.bullets.push(itemLine.slice(2).trim());
          } else if (currentItem && itemLine.startsWith('**')) {
            const match = itemLine.match(/^\*\*(.*?)\*\*\s*[\u00b7\u2022\u22c5]\s*(.+)$/);
            if (match) {
              currentItem.role = match[1].trim();
              currentItem.period = normalizeDate(match[2].trim());
            } else {
              const roleMatch = itemLine.match(/^\*\*(.*?)\*\*$/);
              if (roleMatch) currentItem.role = roleMatch[1].trim();
            }
          } else if (currentItem && itemLine !== '') {
            if (/\d{4}\.\d{2}/.test(itemLine)) {
              currentItem.period = normalizeDate(itemLine);
            } else {
              currentItem.tags = itemLine;
            }
          }
          i++;
        }
        if (currentItem) section.items.push(currentItem);
      }

      result.sections.push(section);
      continue;
    }
    i++;
  }

  return result;
}

function renderHeaderTex(header) {
  const name = escapeTex(header.name);
  const title = escapeTex(header.title);
  const contact = escapeTex(header.contact)
    .replace(/github\.com\/([^\s]+)/, '\\href{https://github.com/$1}{github.com/$1}')
    .replace(/susuyan@163\.com/, '\\href{mailto:susuyan@163.com}{susuyan@163.com}');
  const summary = escapeTex(header.summary);

  return `\\Header\n  {${name}}
  {${title}}
  {${contact}}
  {${summary}}`;
}

function renderItem(section, item) {
  let tex = `\\subsection*{${escapeTex(item.name)}}\n`;

  const hasRole = item.role && item.role.trim() !== '';
  const hasTags = item.tags && item.tags.trim() !== '';
  const hasPeriod = item.period && item.period.trim() !== '';

  if (hasRole || hasTags) {
    tex += `\\RoleLine{${escapeTex(item.role)}}{${escapeTex(item.tags)}}{${escapeTex(item.period)}}\n`;
  } else if (hasPeriod) {
    tex += `{\\small\\color{textmuted}\\hfill ${escapeTex(item.period)}}\\par\n`;
  }

  if (item.bullets.length > 0) {
    tex += `\\begin{itemize}\n`;
    for (const bullet of item.bullets) {
      tex += `  \\item ${escapeTex(bullet)}\n`;
    }
    tex += `\\end{itemize}\n`;
  }

  return tex;
}

function renderProjectSection(section) {
  let tex = `\\section*{${section.title}}\n`;
  for (const item of section.items) {
    tex += renderItem(section, item);
  }
  return tex;
}

function renderExperienceSection(section) {
  let tex = `\\section*{${section.title}}\n`;
  for (const item of section.items) {
    tex += renderItem(section, item);
  }
  return tex;
}

function renderSkillsSection(section) {
  // Replace center dots with spaced LaTeX bullets for cleaner visual
  const formatted = escapeTex(section.content).replace(/\s*·\s*/g, ' \\;\\textperiodcentered\\; ');
  return `\\section*{${section.title}}\n\\SkillBlock{${formatted}}\n`;
}

function renderEducationSection(section) {
  let tex = `\\section*{${section.title}}\n`;
  for (const item of section.items) {
    tex += `\\EduLine{${escapeTex(item.name)}}{${escapeTex(item.detail)}}\n`;
  }
  return tex;
}

function generateResumeTex(data) {
  const templatePath = path.join(__dirname, 'resume.template.tex');
  const template = fs.readFileSync(templatePath, 'utf-8');

  const headerTex = renderHeaderTex(data.header);

  let sectionsTex = '';
  for (const section of data.sections) {
    if (section.type === 'project') {
      sectionsTex += renderProjectSection(section) + '\n';
    } else if (section.type === 'experience') {
      sectionsTex += renderExperienceSection(section) + '\n';
    } else if (section.type === 'skills') {
      sectionsTex += renderSkillsSection(section) + '\n';
    } else if (section.type === 'education') {
      sectionsTex += renderEducationSection(section) + '\n';
    }
  }

  return template
    .replace('{{HEADER}}', headerTex)
    .replace('{{SECTIONS}}', sectionsTex.trim());
}

function main() {
  const mdPath = path.join(__dirname, '..', 'resume.md');
  const outPath = path.join(__dirname, '..', 'resume.tex');

  if (!fs.existsSync(mdPath)) {
    console.error('resume.md not found');
    process.exit(1);
  }

  const md = fs.readFileSync(mdPath, 'utf-8');
  const data = parseResumeMarkdown(md);
  const tex = generateResumeTex(data);

  fs.writeFileSync(outPath, tex);
  console.log('Generated resume.tex successfully.');
}

main();
