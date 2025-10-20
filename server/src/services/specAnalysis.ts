export function startSpecAnalysis(uploadId: string) {
  setTimeout(() => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] Mock analysis completed for uploadId=${uploadId}`);
  }, 1000);
}

