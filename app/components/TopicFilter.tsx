import Link from "next/link";

type Topic = {
  name: string;
  value: string;
};

type Props = {
  currentTopic?: string;
  topics: Topic[];
};

export default function TopicFilter({
  currentTopic,
  topics,
}: Props) {
  return (
    <div className="flex gap-3 flex-wrap">
      {topics.map((topic) => {
        const isActive =
          currentTopic === topic.value ||
          (!currentTopic && topic.value === "");
          return (
          <Link
            key={topic.name}
            href={topic.value ? `/articles?topic=${topic.value}` : "/articles"}
            className={`
              px-4 py-2 rounded-full border text-sm transition-colors
              ${
                isActive
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-100"
              }
            `}
          >
            {topic.name}
          </Link>
        );
      })}
    </div>
  );
}
