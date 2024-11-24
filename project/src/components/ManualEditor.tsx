import React from 'react';
import { FileText, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ManualEditorProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => void;
}

export function ManualEditor({ content, onChange, onSave }: ManualEditorProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Documentation/Manual
      </h2>

      <div className="grid grid-cols-2 gap-4 h-[500px]">
        <div className="gradient-border p-[1px] rounded-lg">
          <div className="card h-full">
            <textarea
              value={content}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Write your documentation or manual here using Markdown..."
              className="w-full h-full bg-transparent resize-none focus:outline-none"
            />
          </div>
        </div>

        <div className="gradient-border p-[1px] rounded-lg">
          <div className="card h-full overflow-auto prose prose-invert max-w-none">
            <ReactMarkdown>{content || '*Preview will appear here*'}</ReactMarkdown>
          </div>
        </div>
      </div>

      <button
        onClick={onSave}
        className="btn-primary flex items-center gap-2"
      >
        <Save className="w-4 h-4" />
        Save Manual
      </button>
    </div>
  );
}