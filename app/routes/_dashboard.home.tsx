import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "Page Title" },
    { name: "description", content: "Description of the page" },
  ];
};

export default function Home() {
  return (
    <div>
      <h1>New Page</h1>
      <p>This is the content of the new page.</p>
    </div>
  );
}
