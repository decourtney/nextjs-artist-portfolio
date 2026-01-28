type Payload = {
  id: string;
  name: string;
  artworkIds: string[];
};

export async function createIllustration(payload: Payload) {
  const res = await fetch(`/api/illustration`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message ?? "Failed to save Illustration");
  }

  return res.json();
}
export async function updateIllustration(payload: Payload) {
  const res = await fetch(`/api/illustration/${payload.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message ?? "Failed to save Illustration");
  }

  return res.json();
}
export async function deleteIllustration(id: string) {
  const res = await fetch(`/api/illustration/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message ?? "Failed to delete Illustration");
  }

  return res.json();
}
