import SmplrProvider from "@/features/floor-plan/provider/SmplrProvider";

export default function FloorPlanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SmplrProvider>{children}</SmplrProvider>;
}
