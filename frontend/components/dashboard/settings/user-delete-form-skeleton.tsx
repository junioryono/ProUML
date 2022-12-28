import { Card } from "@/ui/card";

export function UserDeleteFormSkeleton() {
  return (
    <Card>
      <Card.Header className="animate-pulse">
        <Card.Title className="h-2 mt-3 mb-2 bg-slate-700 rounded max-w-sm" />
        <Card.Description className="h-2 mt-2 mb-1 bg-slate-700 rounded max-w-xs" />
      </Card.Header>
      <Card.Footer className="animate-pulse">
        <button
          className="relative w-20 bg-red-600 inline-flex h-9 items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none"
          type="button"
          disabled={true}
        >
          <span />
        </button>
      </Card.Footer>
    </Card>
  );
}
