import { createFileRoute } from "@tanstack/react-router";
import { NeighbourVouchingFlow } from "#/features/application/components/neighbour-vouching";

export const Route = createFileRoute("/app/vouch")({
  head: () => ({
    meta: [
      { title: "Neighbour Vouching — Rezzident" },
      { name: "description", content: "Get verified by your neighbours on Rezzident" },
    ],
  }),
  component: NeighbourVouchingFlow,
});
