export function hasErrorCode(e: unknown): e is { code: number } {
  return (
    typeof e === "object" &&
    e !== null &&
    "code" in e &&
    typeof (e as { code: unknown }).code === "number"
  );
}