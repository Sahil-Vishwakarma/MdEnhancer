export function downloadAsMarkdown(content: string, filename: string = 'document.md') {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  downloadBlob(blob, filename);
}

export function downloadAsText(content: string, filename: string = 'document.txt') {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, filename);
}

export async function downloadAsPDF(previewElement: HTMLElement, filename: string = 'document.pdf') {
  // Dynamically import html2pdf to avoid SSR issues
  const html2pdf = (await import('html2pdf.js')).default;
  
  const options = {
    margin: [10, 10, 10, 10],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    },
  };

  await html2pdf().set(options).from(previewElement).save();
}

export async function downloadAsDocx(content: string, filename: string = 'document.docx') {
  // Dynamically import docx to avoid SSR issues
  const { Document, Packer, Paragraph, TextRun, HeadingLevel } = await import('docx');

  // Helper function to parse inline markdown formatting
  function parseInlineFormatting(text: string): TextRun[] {
    const runs: TextRun[] = [];
    
    // Simple approach: split by markdown patterns and build runs
    // This is a simplified parser - for production, consider using a proper markdown parser
    
    // Process patterns in order of specificity (most specific first)
    const patterns: Array<{ regex: RegExp; handler: (match: RegExpMatchArray) => TextRun }> = [
      // Bold italic (***text***)
      {
        regex: /\*\*\*(.+?)\*\*\*/,
        handler: (match) => new TextRun({ text: match[1], bold: true, italics: true }),
      },
      // Bold (**text**)
      {
        regex: /\*\*(.+?)\*\*/,
        handler: (match) => new TextRun({ text: match[1], bold: true }),
      },
      // Italic (*text*) - processed after bold, so won't match **text**
      {
        regex: /\*([^*]+?)\*/,
        handler: (match) => new TextRun({ text: match[1], italics: true }),
      },
      // Inline code (`code`)
      {
        regex: /`(.+?)`/,
        handler: (match) => new TextRun({ text: match[1], font: 'Courier New' }),
      },
      // Links ([text](url))
      {
        regex: /\[(.+?)\]\((.+?)\)/,
        handler: (match) => new TextRun({ text: match[1], link: match[2] }),
      },
    ];

    // Simple tokenization approach
    const tokens: Array<{ type: 'text' | 'formatted'; content: string; run?: TextRun }> = [];
    let pos = 0;

    while (pos < text.length) {
      let matched = false;
      
      for (const pattern of patterns) {
        const match = text.substring(pos).match(pattern.regex);
        if (match && match.index === 0) {
          tokens.push({
            type: 'formatted',
            content: match[0],
            run: pattern.handler(match),
          });
          pos += match[0].length;
          matched = true;
          break;
        }
      }
      
      if (!matched) {
        // Find the next pattern match
        let nextMatchPos = text.length;
        for (const pattern of patterns) {
          const match = text.substring(pos + 1).match(pattern.regex);
          if (match) {
            nextMatchPos = Math.min(nextMatchPos, pos + 1 + match.index!);
          }
        }
        
        const plainText = text.substring(pos, nextMatchPos);
        if (plainText) {
          tokens.push({ type: 'text', content: plainText });
        }
        pos = nextMatchPos;
      }
    }

    // Convert tokens to TextRuns
    for (const token of tokens) {
      if (token.type === 'formatted' && token.run) {
        runs.push(token.run);
      } else {
        runs.push(new TextRun(token.content));
      }
    }

    // If no formatting found, return single run
    if (runs.length === 0) {
      runs.push(new TextRun(text));
    }

    return runs;
  }

  // Parse markdown content and convert to DOCX elements
  const lines = content.split('\n');
  const children: (Paragraph)[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();

    // Skip empty lines
    if (!trimmedLine) {
      children.push(new Paragraph({ text: '' }));
      continue;
    }

    // Headers
    if (trimmedLine.startsWith('# ')) {
      children.push(new Paragraph({
        text: trimmedLine.substring(2),
        heading: HeadingLevel.HEADING_1,
      }));
    } else if (trimmedLine.startsWith('## ')) {
      children.push(new Paragraph({
        text: trimmedLine.substring(3),
        heading: HeadingLevel.HEADING_2,
      }));
    } else if (trimmedLine.startsWith('### ')) {
      children.push(new Paragraph({
        text: trimmedLine.substring(4),
        heading: HeadingLevel.HEADING_3,
      }));
    } else if (trimmedLine.startsWith('#### ')) {
      children.push(new Paragraph({
        text: trimmedLine.substring(5),
        heading: HeadingLevel.HEADING_4,
      }));
    } else if (trimmedLine.startsWith('##### ')) {
      children.push(new Paragraph({
        text: trimmedLine.substring(6),
        heading: HeadingLevel.HEADING_5,
      }));
    } else if (trimmedLine.startsWith('###### ')) {
      children.push(new Paragraph({
        text: trimmedLine.substring(7),
        heading: HeadingLevel.HEADING_6,
      }));
    }
    // Blockquotes
    else if (trimmedLine.startsWith('> ')) {
      children.push(new Paragraph({
        text: trimmedLine.substring(2),
        indent: { left: 720 }, // 0.5 inch
        spacing: { after: 200 },
      }));
    }
    // Unordered lists
    else if (trimmedLine.match(/^[-*+]\s/)) {
      const listText = trimmedLine.replace(/^[-*+]\s/, '');
      children.push(new Paragraph({
        text: listText,
        bullet: { level: 0 },
      }));
    }
    // Ordered lists
    else if (trimmedLine.match(/^\d+\.\s/)) {
      // Keep the number in the text for simplicity
      children.push(new Paragraph({
        text: trimmedLine,
        spacing: { after: 100 },
      }));
    }
    // Horizontal rule
    else if (trimmedLine.match(/^[-*_]{3,}$/)) {
      children.push(new Paragraph({
        text: '',
        border: {
          bottom: {
            color: 'auto',
            space: 1,
            value: 'single',
            size: 6,
          },
        },
      }));
    }
    // Code blocks (simple detection - starts with ```)
    else if (trimmedLine.startsWith('```')) {
      // Skip code block start/end markers
      continue;
    }
    // Regular paragraphs
    else {
      // Parse inline formatting (bold, italic, links, code)
      const runs = parseInlineFormatting(line);
      children.push(new Paragraph({
        children: runs,
        spacing: { after: 200 },
      }));
    }
  }

  // Create the document
  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  // Generate and download the file
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, filename);
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

