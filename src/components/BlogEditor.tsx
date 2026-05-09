import React, { useEffect, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Quote from '@editorjs/quote';
import InlineCode from '@editorjs/inline-code';

interface BlogEditorProps {
  data?: any;
  onChange: (data: any) => void;
  holder: string;
}

const BlogEditor = ({ data, onChange, holder }: BlogEditorProps) => {
  const ejInstance = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (!ejInstance.current) {
      const editor = new EditorJS({
        holder: holder,
        data: data ? (typeof data === 'string' ? JSON.parse(data) : data) : {},
        onReady: () => {
          ejInstance.current = editor;
        },
        onChange: async () => {
          const content = await editor.save();
          onChange(content);
        },
        tools: {
          header: {
            class: Header,
            config: {
              placeholder: 'Enter a header',
              levels: [2, 3, 4],
              defaultLevel: 2
            }
          },
          list: {
            class: List,
            inlineToolbar: true,
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: 'Enter a quote',
              captionPlaceholder: 'Author',
            },
          },
          inlineCode: {
            class: InlineCode,
          },
        },
      });
    }

    return () => {
      if (ejInstance.current && ejInstance.current.destroy) {
        ejInstance.current.destroy();
        ejInstance.current = null;
      }
    };
  }, []);

  return (
    <div className="bg-gray-50/50 border border-gray-100 rounded-[32px] p-6 min-h-[400px]">
      <div id={holder} className="editorjs-container prose max-w-none" />
      <style>{`
        .ce-block__content, .ce-toolbar__content {
          max-width: 100% !important;
        }
        .ce-toolbar__actions {
          right: 0 !important;
        }
        .codex-editor {
          color: #0A2E1F;
        }
        .ce-header {
          padding: 0.5em 0;
          margin: 0;
          font-weight: 900;
        }
        .ce-paragraph {
          font-weight: 500;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
};

export default BlogEditor;
