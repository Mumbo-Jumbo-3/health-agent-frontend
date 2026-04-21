import type { Message } from "@/lib/agent-types";
import { cn } from "@/lib/utils";
import { getContentString } from "../utils";
import { MultimodalPreview } from "@/components/thread/MultimodalPreview";
import { isBase64ContentBlock } from "@/lib/multimodal-utils";

export function HumanMessage({ message }: { message: Message; isLoading: boolean }) {
  const contentString = getContentString(message.content);

  return (
    <div className={cn("group ml-auto flex items-center gap-2")}>
      <div className="flex flex-col gap-2">
        {Array.isArray(message.content) && message.content.length > 0 && (
          <div className="flex flex-wrap items-end justify-end gap-2">
            {message.content.reduce<React.ReactNode[]>((acc, block, idx) => {
              if (isBase64ContentBlock(block)) {
                acc.push(
                  <MultimodalPreview
                    key={idx}
                    block={block}
                    size="md"
                  />,
                );
              }
              return acc;
            }, [])}
          </div>
        )}
        {contentString ? (
          <p className="bg-muted ml-auto w-fit rounded-3xl px-4 py-2 text-right whitespace-pre-wrap">
            {contentString}
          </p>
        ) : null}
      </div>
    </div>
  );
}
