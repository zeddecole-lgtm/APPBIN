const UNLOCK = "digi-mirror-unlocked";
const CUSTOM = "digi-mirror-custom-hash";

/** SHA-256 of the original secret answer. The plain password is never stored in the code. */
const DEFAULT_HASH = "43e42bd731aec26c62d1fa2cfdb94ea7bd114bf42b43892d5b900d7cc8b9a459";

export async function sha(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const isUnlocked = () => sessionStorage.getItem(UNLOCK) === "1";
export const setUnlocked = (v: boolean) => (v ? sessionStorage.setItem(UNLOCK, "1") : sessionStorage.removeItem(UNLOCK));
export const getCustomHash = () => localStorage.getItem(CUSTOM);
export const setCustomHash = (h: string | null) => (h ? localStorage.setItem(CUSTOM, h) : localStorage.removeItem(CUSTOM));

/** Checks the secret answer on the device — no server, no API. */
export async function checkSecret(answer: string) {
  return (await sha(answer)) === (getCustomHash() ?? DEFAULT_HASH);
}

/** The trick question's "normal" answer opens the decoy game. */
export const isDecoyAnswer = (a: string) => a.trim() === "2";
