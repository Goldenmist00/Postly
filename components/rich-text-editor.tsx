"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Bold, Italic, Underline, Link as LinkIcon, Image as ImageIcon, List, ListOrdered, Quote, Code } from "lucide-react";
import { ImageEditor } from "./image-editor";
import { LinkEditor } from "./link-editor";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [showLinkEditor, setShowLinkEditor] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const lastValueRef = useRef<string>("");
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  
  // Track active formatting states
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    code: false
  });

  // Convert HTML to markdown for storage
  const htmlToMarkdown = useCallback((html: string): string => {
    let markdown = html;
    
    // Handle ordered lists
    markdown = markdown.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/g, (match: string, content: string) => {
      const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
      return items.map((item: string, index: number) => {
        const text = item.replace(/<li[^>]*>([\s\S]*?)<\/li>/, '$1').replace(/<[^>]*>/g, '').trim();
        return `${index + 1}. ${text}`;
      }).join('\n');
    });
    
    // Handle unordered lists
    markdown = markdown.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/g, (match: string, content: string) => {
      const items = content.match(/<li[^>]*>([\s\S]*?)<\/li>/g) || [];
      return items.map((item: string) => {
        const text = item.replace(/<li[^>]*>([\s\S]*?)<\/li>/, '$1').replace(/<[^>]*>/g, '').trim();
        return `- ${text}`;
      }).join('\n');
    });
    
    // Handle other formatting
    return markdown
      .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/g, '![$2]($1)')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<b>(.*?)<\/b>/g, '**$1**')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<i>(.*?)<\/i>/g, '*$1*')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/<code>(.*?)<\/code>/g, '`$1`')
      .replace(/<blockquote>(.*?)<\/blockquote>/g, '> $1')
      .replace(/<h1>(.*?)<\/h1>/g, '# $1')
      .replace(/<h2>(.*?)<\/h2>/g, '## $1')
      .replace(/<h3>(.*?)<\/h3>/g, '### $1')
      .replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<div[^>]*>/g, '\n')
      .replace(/<\/div>/g, '')
      .replace(/<p[^>]*>/g, '')
      .replace(/<\/p>/g, '\n')
      .trim();
  }, []);

  // Convert markdown to HTML for display
  const markdownToHtml = useCallback((markdown: string): string => {
    let html = markdown;
    
    // Handle numbered lists (convert consecutive numbered items to proper ol/li)
    html = html.replace(/^(\d+\.\s+.+(?:\n\d+\.\s+.+)*)/gm, (match) => {
      const items = match.split('\n').map(line => {
        const text = line.replace(/^\d+\.\s+/, '').trim();
        return `<li style="margin-bottom: 4px;">${text}</li>`;
      }).join('');
      return `<ol style="margin-left: 20px; padding-left: 10px; margin-bottom: 16px;">${items}</ol>`;
    });
    
    // Handle bullet lists (convert consecutive bullet items to proper ul/li)
    html = html.replace(/^(-\s+.+(?:\n-\s+.+)*)/gm, (match) => {
      const items = match.split('\n').map(line => {
        const text = line.replace(/^-\s+/, '').trim();
        return `<li style="margin-bottom: 4px;">${text}</li>`;
      }).join('');
      return `<ul style="margin-left: 20px; padding-left: 10px; margin-bottom: 16px;">${items}</ul>`;
    });
    
    // Handle other formatting
    return html
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<div style="text-align: center; margin: 1rem 0;"><img src="$2" alt="$1" style="max-width: 100%; height: auto;" /></div>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/^> (.*$)/gm, '<blockquote style="border-left: 4px solid #e2e8f0; padding-left: 16px; margin: 16px 0; font-style: italic;">$1</blockquote>')
      .replace(/^### (.*$)/gm, '<h3 style="font-size: 1.25rem; font-weight: 600; margin: 16px 0 8px 0;">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="font-size: 1.5rem; font-weight: 600; margin: 20px 0 12px 0;">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 style="font-size: 2rem; font-weight: 700; margin: 24px 0 16px 0;">$1</h1>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color: #3b82f6; text-decoration: underline;">$1</a>')
      .replace(/\n/g, '<br>');
  }, []);

  // Save cursor position
  const saveCursorPosition = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && editorRef.current) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(editorRef.current);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      return preCaretRange.toString().length;
    }
    return 0;
  }, []);

  // Restore cursor position
  const restoreCursorPosition = useCallback((position: number) => {
    if (!editorRef.current) return;
    
    const selection = window.getSelection();
    if (!selection) return;

    let charIndex = 0;
    const walker = document.createTreeWalker(
      editorRef.current,
      NodeFilter.SHOW_TEXT,
      null
    );

    let node;
    while (node = walker.nextNode()) {
      const nextCharIndex = charIndex + (node.textContent?.length || 0);
      if (position <= nextCharIndex) {
        const range = document.createRange();
        range.setStart(node, position - charIndex);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
        break;
      }
      charIndex = nextCharIndex;
    }
  }, []);

  // Auto-expanding functionality
  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current;
      
      // Function to adjust height based on content
      const adjustHeight = () => {
        const minHeight = Math.max(400, window.innerHeight - 400);
        const scrollHeight = editor.scrollHeight;
        const currentHeight = editor.offsetHeight;
        
        // If content exceeds current height, expand the editor
        if (scrollHeight > currentHeight) {
          editor.style.minHeight = `${Math.max(minHeight, scrollHeight + 50)}px`;
        } else if (scrollHeight < currentHeight - 100 && currentHeight > minHeight) {
          // Shrink if content is much smaller, but not below minimum
          editor.style.minHeight = `${Math.max(minHeight, scrollHeight + 50)}px`;
        }
      };

      // Set up ResizeObserver to watch for content changes
      if (window.ResizeObserver) {
        resizeObserverRef.current = new ResizeObserver(() => {
          adjustHeight();
        });
        resizeObserverRef.current.observe(editor);
      }

      // Also adjust on input events
      const handleResize = () => {
        setTimeout(adjustHeight, 0);
      };

      editor.addEventListener('input', handleResize);
      editor.addEventListener('paste', handleResize);
      
      // Initial height adjustment
      adjustHeight();

      return () => {
        if (resizeObserverRef.current) {
          resizeObserverRef.current.disconnect();
        }
        editor.removeEventListener('input', handleResize);
        editor.removeEventListener('paste', handleResize);
      };
    }
  }, []);

  // Initialize editor content only once or when value changes from outside (not from user input)
  useEffect(() => {
    if (editorRef.current && (!initialized || (value !== lastValueRef.current && !isUpdating))) {
      const cursorPosition = initialized ? saveCursorPosition() : 0;
      const htmlContent = markdownToHtml(value);
      editorRef.current.innerHTML = htmlContent;
      lastValueRef.current = value;
      
      if (initialized && cursorPosition > 0) {
        setTimeout(() => restoreCursorPosition(cursorPosition), 0);
      }
      
      if (!initialized) {
        setInitialized(true);
      }
    }
  }, [value, markdownToHtml, isUpdating, initialized, saveCursorPosition, restoreCursorPosition]);

  // Debounced input handler to prevent cursor jumping
  const debouncedHandleInput = useRef<NodeJS.Timeout | null>(null);

  // Check what formatting is active at current cursor position
  const updateActiveFormats = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let node: Node | null = range.startContainer;
    
    // If we're in a text node, get its parent element
    if (node.nodeType === Node.TEXT_NODE) {
      node = node.parentNode;
    }

    const formats = {
      bold: false,
      italic: false,
      underline: false,
      code: false
    };

    // Walk up the DOM tree to check for formatting elements
    while (node && node !== editorRef.current) {
      if (node instanceof Element) {
        const tagName = node.tagName.toLowerCase();
        if (tagName === 'strong' || tagName === 'b') formats.bold = true;
        if (tagName === 'em' || tagName === 'i') formats.italic = true;
        if (tagName === 'u') formats.underline = true;
        if (tagName === 'code') formats.code = true;
      }
      node = node.parentNode;
    }

    setActiveFormats(formats);
  }, []);
  
  const handleInput = useCallback(() => {
    if (editorRef.current && !isUpdating) {
      // Clear previous timeout
      if (debouncedHandleInput.current) {
        clearTimeout(debouncedHandleInput.current);
      }
      
      // Debounce the update
      debouncedHandleInput.current = setTimeout(() => {
        if (editorRef.current) {
          const htmlContent = editorRef.current.innerHTML;
          const markdownContent = htmlToMarkdown(htmlContent);
          
          // Only update if content actually changed
          if (markdownContent !== lastValueRef.current) {
            setIsUpdating(true);
            lastValueRef.current = markdownContent;
            onChange(markdownContent);
            
            setTimeout(() => setIsUpdating(false), 100);
          }
        }
      }, 150); // 150ms debounce
    }
    
    // Update active formats after input
    setTimeout(updateActiveFormats, 0);
  }, [htmlToMarkdown, onChange, isUpdating, updateActiveFormats]);

  // Handle cursor movement and selection changes
  const handleSelectionChange = useCallback(() => {
    updateActiveFormats();
  }, [updateActiveFormats]);

  // Toggle formatting function
  const toggleFormatting = useCallback((tagName: string, isActive: boolean) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (selectedText) {
      // If text is selected, apply/remove formatting to/from selected text only
      if (isActive) {
        // Remove formatting from selected text
        let node: Node | null = range.startContainer;
        if (node.nodeType === Node.TEXT_NODE) {
          node = node.parentNode;
        }

        // Find the formatting element to remove
        while (node && node !== editorRef.current) {
          if (node instanceof Element && node.tagName.toLowerCase() === tagName.toLowerCase()) {
            // Only unwrap if the entire element is selected
            const elementText = node.textContent || '';
            if (selectedText === elementText) {
              const parent = node.parentNode;
              if (parent) {
                while (node.firstChild) {
                  parent.insertBefore(node.firstChild, node);
                }
                parent.removeChild(node);
              }
            } else {
              // If only part is selected, split the element
              const textNode = document.createTextNode(selectedText);
              range.deleteContents();
              range.insertNode(textNode);
            }
            break;
          }
          node = node.parentNode;
        }
      } else {
        // Add formatting to selected text
        const element = document.createElement(tagName);
        element.textContent = selectedText;
        
        try {
          range.deleteContents();
          range.insertNode(element);
          
          // Keep the element selected
          range.selectNodeContents(element);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          console.error('Error applying formatting:', error);
        }
      }
    } else {
      // No text selected - handle cursor position for future typing
      if (isActive) {
        // Turn off formatting for future typing - move cursor outside formatting element
        let node: Node | null = range.startContainer;
        if (node.nodeType === Node.TEXT_NODE) {
          node = node.parentNode;
        }

        // Find the formatting element and move cursor outside it
        while (node && node !== editorRef.current) {
          if (node instanceof Element && node.tagName.toLowerCase() === tagName.toLowerCase()) {
            // Create a space after the formatting element for continued typing
            const space = document.createTextNode('\u00A0');
            if (node.parentNode) {
              node.parentNode.insertBefore(space, node.nextSibling);
              
              // Move cursor to the space
              range.setStart(space, 1);
              range.setEnd(space, 1);
              selection.removeAllRanges();
              selection.addRange(range);
            }
            break;
          }
          node = node.parentNode;
        }
      } else {
        // Turn on formatting for future typing - create empty formatted element
        const element = document.createElement(tagName);
        element.textContent = '\u00A0'; // Non-breaking space to make it visible
        
        try {
          range.insertNode(element);
          
          // Place cursor inside the element
          range.selectNodeContents(element);
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (error) {
          console.error('Error applying formatting:', error);
        }
      }
    }
    
    handleInput();
    setTimeout(updateActiveFormats, 0);
  }, [handleInput, updateActiveFormats]);

  const insertText = useCallback((text: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const textNode = document.createTextNode(text);
    
    try {
      range.deleteContents();
      range.insertNode(textNode);
      
      // Move cursor to end of inserted text
      range.setStartAfter(textNode);
      range.setEndAfter(textNode);
      selection.removeAllRanges();
      selection.addRange(range);
      
      handleInput();
    } catch (error) {
      console.error('Error inserting text:', error);
    }
  }, [handleInput]);

  // Create proper numbered list
  const createNumberedList = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // Create ordered list structure
    const ol = document.createElement('ol');
    ol.style.marginLeft = '20px';
    ol.style.paddingLeft = '10px';
    
    const li = document.createElement('li');
    li.style.marginBottom = '4px';
    li.textContent = 'List item';
    
    ol.appendChild(li);
    
    try {
      // Insert line break before list
      const beforeBr = document.createElement('br');
      range.insertNode(beforeBr);
      
      // Insert the list
      range.insertNode(ol);
      
      // Insert line break after list
      const afterBr = document.createElement('br');
      range.insertNode(afterBr);
      
      // Place cursor inside the list item
      range.selectNodeContents(li);
      selection.removeAllRanges();
      selection.addRange(range);
      
      handleInput();
    } catch (error) {
      console.error('Error creating numbered list:', error);
    }
  }, [handleInput]);

  // Create proper bullet list
  const createBulletList = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // Create unordered list structure
    const ul = document.createElement('ul');
    ul.style.marginLeft = '20px';
    ul.style.paddingLeft = '10px';
    
    const li = document.createElement('li');
    li.style.marginBottom = '4px';
    li.textContent = 'List item';
    
    ul.appendChild(li);
    
    try {
      // Insert line break before list
      const beforeBr = document.createElement('br');
      range.insertNode(beforeBr);
      
      // Insert the list
      range.insertNode(ul);
      
      // Insert line break after list
      const afterBr = document.createElement('br');
      range.insertNode(afterBr);
      
      // Place cursor inside the list item
      range.selectNodeContents(li);
      selection.removeAllRanges();
      selection.addRange(range);
      
      handleInput();
    } catch (error) {
      console.error('Error creating bullet list:', error);
    }
  }, [handleInput]);

  const applyBold = useCallback(() => {
    toggleFormatting('strong', activeFormats.bold);
  }, [toggleFormatting, activeFormats.bold]);

  const applyItalic = useCallback(() => {
    toggleFormatting('em', activeFormats.italic);
  }, [toggleFormatting, activeFormats.italic]);

  const applyUnderline = useCallback(() => {
    toggleFormatting('u', activeFormats.underline);
  }, [toggleFormatting, activeFormats.underline]);

  const applyCode = useCallback(() => {
    toggleFormatting('code', activeFormats.code);
  }, [toggleFormatting, activeFormats.code]);

  const handleImageInsert = useCallback((imageData: {
    url: string;
    alt: string;
    width?: number;
    height?: number;
    alignment: 'left' | 'center' | 'right';
    caption?: string;
  }) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    
    // Create image container
    const container = document.createElement('div');
    container.style.textAlign = imageData.alignment;
    container.style.margin = '1rem 0';
    
    // Create image element
    const img = document.createElement('img');
    img.src = imageData.url;
    img.alt = imageData.alt;
    img.style.maxWidth = '100%';
    img.style.height = 'auto';
    
    if (imageData.width) {
      img.style.width = `${imageData.width}px`;
    }
    if (imageData.height) {
      img.style.height = `${imageData.height}px`;
    }
    
    container.appendChild(img);
    
    // Add caption if provided
    if (imageData.caption) {
      const caption = document.createElement('p');
      caption.style.fontStyle = 'italic';
      caption.style.textAlign = imageData.alignment;
      caption.style.margin = '0.5rem 0 0 0';
      caption.style.fontSize = '0.9em';
      caption.style.color = '#666';
      caption.textContent = imageData.caption;
      container.appendChild(caption);
    }
    
    try {
      // Insert line breaks before and after
      const beforeBr = document.createElement('br');
      const afterBr = document.createElement('br');
      
      range.insertNode(afterBr);
      range.insertNode(container);
      range.insertNode(beforeBr);
      
      // Move cursor after the image
      range.setStartAfter(afterBr);
      range.setEndAfter(afterBr);
      selection.removeAllRanges();
      selection.addRange(range);
      
      handleInput();
    } catch (error) {
      console.error('Error inserting image:', error);
    }
  }, [handleInput]);

  const handleLinkInsert = useCallback((url: string, linkText?: string) => {
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    
    const text = linkText || selectedText || url;
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.textContent = text;
      
      try {
        range.deleteContents();
        range.insertNode(linkElement);
        
        // Move cursor after link
        range.setStartAfter(linkElement);
        range.setEndAfter(linkElement);
        selection.removeAllRanges();
        selection.addRange(range);
        
        handleInput();
      } catch (error) {
        console.error('Error inserting link:', error);
      }
    }
  }, [handleInput]);

  const openLinkEditor = useCallback(() => {
    const selection = window.getSelection();
    const selected = selection?.toString() || '';
    setSelectedText(selected);
    setShowLinkEditor(true);
  }, []);

  // Handle Enter key in lists
  const handleEnterInList = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return false;

    const range = selection.getRangeAt(0);
    let node = range.startContainer;
    
    // Find if we're inside a list item
    while (node && node !== editorRef.current) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.tagName === 'LI') {
          e.preventDefault();
          
          // Create new list item
          const newLi = document.createElement('li');
          newLi.style.marginBottom = '4px';
          newLi.textContent = '';
          
          // Insert after current list item
          if (element.parentNode) {
            element.parentNode.insertBefore(newLi, element.nextSibling);
            
            // Place cursor in new list item
            range.selectNodeContents(newLi);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
            
            handleInput();
            return true;
          }
        }
      }
      node = node.parentNode as Node;
    }
    return false;
  }, [handleInput]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    // Handle Enter key in lists
    if (e.key === 'Enter' && !e.shiftKey) {
      if (handleEnterInList(e)) {
        return;
      }
    }
    
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b':
          e.preventDefault();
          applyBold();
          break;
        case 'i':
          e.preventDefault();
          applyItalic();
          break;
        case 'u':
          e.preventDefault();
          applyUnderline();
          break;
        case 'k':
          e.preventDefault();
          openLinkEditor();
          break;
        case 'e':
          e.preventDefault();
          applyCode();
          break;
      }
    }
    
    if ((e.ctrlKey || e.metaKey) && e.shiftKey) {
      switch (e.key) {
        case 'I':
          e.preventDefault();
          setShowImageEditor(true);
          break;
        case '8':
          e.preventDefault();
          createBulletList();
          break;
        case '7':
          e.preventDefault();
          createNumberedList();
          break;
      }
    }
  }, [applyBold, applyItalic, applyUnderline, applyCode, openLinkEditor, createBulletList, createNumberedList, handleEnterInList]);

  const toolbarButtons = [
    {
      icon: Bold,
      label: "Bold",
      action: applyBold,
      shortcut: "Ctrl+B",
      isActive: activeFormats.bold
    },
    {
      icon: Italic,
      label: "Italic", 
      action: applyItalic,
      shortcut: "Ctrl+I",
      isActive: activeFormats.italic
    },
    {
      icon: Underline,
      label: "Underline",
      action: applyUnderline,
      shortcut: "Ctrl+U",
      isActive: activeFormats.underline
    },
    {
      icon: LinkIcon,
      label: "Link",
      action: openLinkEditor,
      shortcut: "Ctrl+K",
      isActive: false
    },
    {
      icon: ImageIcon,
      label: "Image",
      action: () => setShowImageEditor(true),
      shortcut: "Ctrl+Shift+I",
      isActive: false
    },
    {
      icon: List,
      label: "Bullet List",
      action: createBulletList,
      shortcut: "Ctrl+Shift+8",
      isActive: false
    },
    {
      icon: ListOrdered,
      label: "Numbered List", 
      action: createNumberedList,
      shortcut: "Ctrl+Shift+7",
      isActive: false
    },
    {
      icon: Quote,
      label: "Quote",
      action: () => insertText('\n> '),
      shortcut: "Ctrl+Shift+.",
      isActive: false
    },
    {
      icon: Code,
      label: "Code",
      action: applyCode,
      shortcut: "Ctrl+E",
      isActive: activeFormats.code
    }
  ];

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 auto-expand-editor editor-container">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        {toolbarButtons.map((button, index) => (
          <button
            key={index}
            onClick={button.action}
            title={`${button.label} (${button.shortcut})`}
            className={`p-2 rounded transition-colors ${
              button.isActive
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <button.icon className="w-4 h-4" />
          </button>
        ))}
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        
        {/* Quick formatting help */}
        <div className="ml-auto text-xs text-gray-500 dark:text-gray-400 hidden md:block">
          Markdown supported
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onMouseUp={handleSelectionChange}
        onKeyUp={handleSelectionChange}
        onFocus={handleSelectionChange}
        className={`w-full min-h-[400px] max-h-none p-6 border-none outline-none bg-transparent text-gray-900 dark:text-gray-100 overflow-y-auto writing-content ${className}`}
        style={{ 
          fontFamily: 'Georgia, serif',
          lineHeight: '1.8',
          fontSize: '20px',
          minHeight: 'calc(100vh - 400px)', // Dynamic height based on viewport
          maxHeight: 'none', // Allow unlimited growth
          resize: 'none'
        }}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />

      {/* Image Editor Modal */}
      <ImageEditor
        isOpen={showImageEditor}
        onClose={() => setShowImageEditor(false)}
        onInsert={handleImageInsert}
      />

      {/* Link Editor Modal */}
      <LinkEditor
        isOpen={showLinkEditor}
        onClose={() => setShowLinkEditor(false)}
        onInsert={handleLinkInsert}
        selectedText={selectedText}
      />
    </div>
  );
}