"use client";

import dynamic from "next/dynamic";

import { optimizeImageFile } from "@/lib/optimize-image-client";

import { FieldLabel } from "./field-label";

type RichTextEditorProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
};

const EditorClient = dynamic(
  async () => {
    const [{ CKEditor }, ClassicEditor] = await Promise.all([
      import("@ckeditor/ckeditor5-react"),
      import("@ckeditor/ckeditor5-build-classic")
    ]);

    class BackendUploadAdapter {
      loader: { file: Promise<File> };

      xhr?: XMLHttpRequest;

      constructor(loader: { file: Promise<File> }) {
        this.loader = loader;
      }

      async upload() {
        const file = await this.loader.file;
        const optimizedFile = await optimizeImageFile(file);

        return new Promise<{ default: string }>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          this.xhr = xhr;

          xhr.open("POST", "/api/admin/media/upload?folder=editor", true);
          xhr.withCredentials = true;
          xhr.responseType = "json";

          xhr.addEventListener("error", () => {
            reject(new Error("Không thể upload ảnh lên server."));
          });

          xhr.addEventListener("abort", () => {
            reject(new Error("Upload ảnh đã bị hủy."));
          });

          xhr.addEventListener("load", () => {
            const response = xhr.response as { url?: string; message?: string } | null;

            if (xhr.status < 200 || xhr.status >= 300 || !response?.url) {
              reject(new Error(response?.message || "Upload ảnh thất bại."));
              return;
            }

            resolve({
              default: response.url
            });
          });

          const data = new FormData();
          data.append("file", optimizedFile);
          xhr.send(data);
        });
      }

      abort() {
        this.xhr?.abort();
      }
    }

    function uploadAdapterPlugin(editor: {
      plugins: {
        get: (name: string) => {
          createUploadAdapter?: (loader: { file: Promise<File> }) => BackendUploadAdapter;
        };
      };
    }) {
      const repository = editor.plugins.get("FileRepository");
      repository.createUploadAdapter = (loader) => new BackendUploadAdapter(loader);
    }

    return function Editor({
      value,
      onChange,
      placeholder
    }: Omit<RichTextEditorProps, "label">) {
      return (
        <CKEditor
          editor={ClassicEditor.default as never}
          data={value}
          config={{
            placeholder,
            extraPlugins: [uploadAdapterPlugin],
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "link",
              "bulletedList",
              "numberedList",
              "|",
              "imageUpload",
              "blockQuote",
              "undo",
              "redo"
            ]
          }}
          onChange={(_, editor) => {
            onChange((editor as { getData: () => string }).getData());
          }}
        />
      );
    };
  },
  {
    ssr: false,
    loading: () => (
      <div className="min-h-40 rounded-[24px] border border-line bg-white px-5 py-4 text-sm text-steel">
        Đang tải trình soạn thảo...
      </div>
    )
  }
);

export function RichTextEditor({ label, value, onChange, placeholder, required = false }: RichTextEditorProps) {
  return (
    <div className="grid gap-2">
      <FieldLabel label={label} required={required} />
      <div className="admin-ck-editor rounded-[24px] border border-line bg-white">
        <EditorClient value={value} onChange={onChange} placeholder={placeholder} />
      </div>
    </div>
  );
}
