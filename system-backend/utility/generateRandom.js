function generateQRNumber() {
  const min = 1000000; // Minimum six-digit number
  const max = 9999999; // Maximum seven-digit number
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Example usage:
export default generateQRNumber;
