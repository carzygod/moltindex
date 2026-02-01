export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(iso),
  );

export const relativeDateLabel = (iso: string) => {
  const target = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - target.getTime();
  const day = 24 * 60 * 60 * 1000;
  if (diff < day) return "Today";
  if (diff < day * 2) return "Yesterday";
  return target.toLocaleDateString();
};
