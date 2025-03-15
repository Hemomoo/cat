"use client"
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Edit } from "lucide-react"

interface MarkdownEditorProps {
  initialContent?: string;
  onSave: (title: string, content: string) => void;
  type: 'tour' | 'news';
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ initialContent = '', onSave, type }) => {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState(false);

  const handleSave = () => {
    if (!title.trim()) {
      alert('请输入标题');
      return;
    }
    onSave(title, content);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-4">
      <Input 
        placeholder={`请输入${type === 'tour' ? '巡演' : '新闻'}标题`}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />
      
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={() => setPreview(!preview)}
        >
          {preview ? (
            <>
              <Edit className="mr-2 h-4 w-4" />
              编辑
            </>
          ) : (
            <>
              <Eye className="mr-2 h-4 w-4" />
              预览
            </>
          )}
        </Button>
        <Button onClick={handleSave}>
          保存
        </Button>
      </div>

      {preview ? (
        <div className="prose dark:prose-invert max-w-none p-4 border rounded-md bg-muted">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          className="w-full min-h-[500px] p-4 rounded-md border resize-y font-mono"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="请输入 Markdown 内容..."
        />
      )}
    </div>
  );
};

export default MarkdownEditor;