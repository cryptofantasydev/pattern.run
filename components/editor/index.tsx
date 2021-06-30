/* eslint-disable @typescript-eslint/unbound-method */

import * as React from "react";

import Link from "~components/link";
import { useEditorStore } from "~store/editor";
import monacoTheme from "~theme/monaco";
import prismTheme from "~theme/prism";

import Decrement from "./decrement";
import Increment from "./increment";
import LiveEditor from "./live";
import MonacoEditor from "./monaco";
import Renderer, { transformer } from "./renderer";
import SizeIndicator from "./size-indicator";

import { toClipboard } from "copee";
import { LiveError, LivePreview, LiveProvider } from "react-live";

function createGitHubLink(name: string) {
  return `https://github.com/grikomsn/console-patterns/blob/main/patterns/${name}`;
}

const Editor: React.FC = () => {
  const editor = useEditorStore((store) => store);

  return (
    <LiveProvider
      code={editor.source}
      scope={{ Renderer }}
      theme={prismTheme}
      transformCode={transformer}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="flex flex-col px-8 py-4 bg-gray-900 rounded shadow lg:col-span-3">
          <div className="text-center">
            <h6 className="mt-0">{editor.title}</h6>
            <p className="mb-2 text-sm text-gray-600">
              You can click or tap the snippet below and edit the code which
              generates the pattern
            </p>
          </div>

          <div className="flex flex-col flex-grow pb-4 md:flex-row overflow-hidden">
            {editor.useMonaco ? (
              <MonacoEditor
                beforeMount={(monaco) =>
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
                  monaco.editor.defineTheme("night-owl", monacoTheme)
                }
                className="min-h-[400px]"
                language="javascript"
                onChange={editor.updateSource}
                options={{
                  fontFamily: "Cousine",
                  fontSize: 14,
                  lineNumbers: "off",
                  minimap: {
                    enabled: false,
                  },
                }}
                theme="night-owl"
                value={editor.source}
              />
            ) : (
              <div className="overflow-x-auto min-h-[400px] px-4 text-sm">
                <LiveEditor onChange={editor.updateSource} />
                <LiveError />
              </div>
            )}
          </div>

          <div className="flex flex-row text-sm gap-x-2">
            <input
              checked={editor.useMonaco}
              id="use-monaco"
              name="use-monaco"
              onChange={() => editor.toggleMonaco()}
              type="checkbox"
            />
            <label htmlFor="use-monaco">Use Monaco</label>
            <div className="flex-grow" />
            <button className="link" onClick={editor.reset} type="reset">
              Reset
            </button>
            <span>/</span>
            <button
              className="link"
              onClick={() => toClipboard(editor.source)}
              type="button"
            >
              Copy to clipboard
            </button>
            <span>/</span>
            <Link href={createGitHubLink(`${editor.title}.pattern.js`)}>
              View on GitHub
            </Link>
          </div>
        </div>

        <div className="flex flex-col justify-between p-8 bg-gray-900 rounded shadow lg:col-span-2">
          <div className="text-center">
            <Decrement />
            <SizeIndicator />
            <Increment />
          </div>
          <pre className="flex-grow py-8 overflow-x-auto">
            <LivePreview />
          </pre>
          <div className="text-center">
            <Decrement />
            <SizeIndicator />
            <Increment />
          </div>
        </div>
      </div>
    </LiveProvider>
  );
};

export default Editor;
