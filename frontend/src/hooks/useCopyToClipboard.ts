import { useCallback } from 'react';

export const useCopyToClipboard = () => {
  const copyToClipboard = useCallback(async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackError) {
        console.error('Failed to copy to clipboard:', fallbackError);
        return false;
      }
    }
  }, []);

  return { copyToClipboard };
};