const dec2hex = (dec: number) => dec.toString(16).padStart(2, "0");

export const generateId = (len: number) => {
  const arr = new Uint8Array((len || 30) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
};
