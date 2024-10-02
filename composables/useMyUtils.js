export const useMyUtils = () => {
  const useCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return {
    useCopyToClipboard,
  };
};
