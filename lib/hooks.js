export function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsDataURL(blob);
    reader.onerror = () => {
      reject(new Error("Something went wrong"));
    };
  });
}
