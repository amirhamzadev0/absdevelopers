import Image from "next/image";
import type { ContentBlock } from "@/models/content";

interface RichTextProps {
  blocks: ContentBlock[];
  lead?: boolean;
}

export function RichText({ blocks, lead = false }: RichTextProps) {
  return (
    <div className={`rich-text${lead ? " rich-text--lead" : ""}`}>
      {blocks.map((block, index) => {
        switch (block.type) {
          case "heading":
            return block.level === 2 ? (
              <h2 key={index}>{block.text}</h2>
            ) : (
              <h3 key={index}>{block.text}</h3>
            );
          case "paragraph":
            return <p key={index}>{block.text}</p>;
          case "list":
            return (
              <ul key={index}>
                {block.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            );
          case "image":
            return (
              <figure key={index}>
                <Image
                  src={block.src}
                  alt={block.alt}
                  width={1200}
                  height={675}
                  sizes="(max-width: 800px) 100vw, 760px"
                />
              </figure>
            );
        }
      })}
    </div>
  );
}
